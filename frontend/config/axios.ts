import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { jwtDecode } from 'jwt-decode'
import Router from 'next/router'
import Cookies from 'js-cookie'

import { SERVER_URL } from './env'

let isRefreshing = false
let failedQueue: {
  resolve: (value: InternalAxiosRequestConfig<any> | PromiseLike<InternalAxiosRequestConfig<any>>) => void
  reject: (reason?: any) => void
}[] = []

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token as unknown as InternalAxiosRequestConfig<any>)
    }
  })
  failedQueue = []
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// بررسی سمت کلاینت
const isClient = typeof window !== 'undefined'

// تابعی برای بررسی انقضای توکن
const isTokenExpired = (expireTime: number) => {
  return Date.now() >= expireTime
}

const refreshAccessToken = async () => {
  if (!isClient) return null
  const user = localStorage.getItem('user')

  if (!user) return null
  const { refreshToken } = await JSON.parse(user)

  try {
    const url = new URL('/token', SERVER_URL)
    const { data }: AxiosResponse<{ accessToken: string }> = await axios.post(url.href, { refreshToken })
    const decodedAccessToken: { exp: number; u_id: string } = await jwtDecode(data.accessToken)
    const decodedRefreshToken: { exp: number; u_id: string } = await jwtDecode(refreshToken)
    const storageData = {
      accessToken: data.accessToken,
      refreshToken,
      userId: decodedAccessToken.u_id,
      AccessTokenExpireTime: decodedAccessToken.exp * 1000, // ذخیره زمان انقضای توکن
      refreshTokenExpireTime: decodedRefreshToken.exp * 1000,
    }

    localStorage.setItem('user', JSON.stringify(storageData))

    // محاسبه زمان انقضای کوکی (تبدیل به ثانیه)
    const expireInSeconds = Math.floor((decodedRefreshToken.exp * 1000 - Date.now()) / 1000)

    Cookies.set('accessToken', JSON.stringify(data.accessToken), { expires: expireInSeconds / 86400 })

    return data.accessToken
  } catch (error) {
    if (isClient) {
      localStorage.removeItem('user')
      Cookies.remove('accessToken')
      // window.location.href = '/auth'
      Router.replace('/auth')
      // window.next.router.replace('/auth')
    }

    return Promise.reject(error)
  }
}

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (isClient) {
      const user = localStorage.getItem('user')

      if (user) {
        const { accessToken, AccessTokenExpireTime, refreshTokenExpireTime } = await JSON.parse(user)

        // بررسی اینکه آیا توکن منقضی شده است
        if (isTokenExpired(AccessTokenExpireTime)) {
          // اگر توکن دسترسی منقضی شده و نیاز به رفرش دارد
          if (isTokenExpired(refreshTokenExpireTime)) {
            localStorage.removeItem('user')
            Cookies.remove('accessToken')
            // اگر رفرش توکن هم منقضی شده باشد، کاربر را به صفحه لاگین هدایت می‌کنیم
            Router.push('/auth')

            return Promise.reject(new AxiosError('Refresh token expired'))
          }

          if (!isRefreshing) {
            isRefreshing = true
            const newToken = await refreshAccessToken()

            if (newToken) {
              axiosInstance.defaults.headers['Authorization'] = `Bearer ${newToken}`
              config.headers['Authorization'] = `Bearer ${newToken}`
              processQueue(null, newToken) // صف درخواست‌ها را پردازش می‌کنیم
            } else {
              processQueue(new AxiosError('Token refresh failed'), null)
            }

            isRefreshing = false
          } else {
            // اگر رفرش در حال انجام است، درخواست فعلی را به صف اضافه می‌کنیم
            return new Promise<InternalAxiosRequestConfig>((resolve, reject) => {
              failedQueue.push({
                resolve,
                reject,
              })
            })
          }
        } else {
          // اگر توکن معتبر است، آن را به درخواست اضافه می‌کنیم
          if (accessToken && config.headers) {
            config.headers['Authorization'] = `Bearer ${accessToken}`
          } else {
            const accessTokenCookie = Cookies.get('accessToken')

            if (accessTokenCookie) {
              const accessTokenCookieParsed = await JSON.parse(accessTokenCookie).accessToken

              config.headers['Authorization'] = `Bearer ${accessTokenCookieParsed}`
            }
          }
        }
      }
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user')
      Cookies.remove('accessToken')
      window.location.href = '/auth'

      return Promise.reject(error)
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
