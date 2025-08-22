'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Tab, Tabs } from '@heroui/tabs'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'
import Cookies from 'js-cookie'

import Button from '@/components/formElements/Button'
import Input from '@/components/formElements/Input'
import Loading from '@/components/layouts/Loading'
import ObsLogo from '@/components/ui/ObsLogo'
import CountdownTimer from '@/components/utils/CountdownTimer'
import useAuth from '@/hooks/useAuth'
import { CHECK_LOGIN_OTP, CHECK_OTP, SEND_LOGIN_OTP, SEND_OTP, SEND_VERIFY_CODE_TO_MOBILE_AGAIN } from '@/services/auth'
import { CheckOtpFormValidation, LoginFormValidation, SendOtpFormValidation, UserInfoFormValidation } from '@/validation/auth'
import axiosInstance from '@/config/axios'
import { UPDATE_USER_PROFILE } from '@/services/user'

const SendOtpDefaultValues = {
  mobile: '',
}

const CheckOtpDefaultValues = {
  code: '',
}

const userInfoDefaultValues = {
  firstName: '',
  lastName: '',
  password: '',
}

const LoginDefaultValues = {
  mobile: '',
  password: '',
}

const Auth = () => {
  const { login, saveUser, updateUserFromOutside } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const [loading, setLoading] = useState(false)
  const [loginStep, setLoginStep] = useState(0)
  const [loginOtpStep, setLoginOtpStep] = useState(0)
  const [activeTab, setActiveTab] = useState<string | number | null>(searchParams.has('tab') ? searchParams.get('tab') : 'register')
  const [registerStep, setRegisterStep] = useState(0)
  const [isTimerComplete, setIsTimerComplete] = useState(false)
  const [timerKey, setTimerKey] = useState(0)

  const sendOtpForm = useForm<z.infer<typeof SendOtpFormValidation>>({
    resolver: zodResolver(SendOtpFormValidation),
    defaultValues: {
      ...SendOtpDefaultValues,
    },
  })

  const checkOtpForm = useForm<z.infer<typeof CheckOtpFormValidation>>({
    resolver: zodResolver(CheckOtpFormValidation),
    defaultValues: {
      ...CheckOtpDefaultValues,
    },
  })

  const userInfoForm = useForm<z.infer<typeof UserInfoFormValidation>>({
    resolver: zodResolver(UserInfoFormValidation),
    defaultValues: {
      ...userInfoDefaultValues,
    },
  })

  const loginForm = useForm<z.infer<typeof LoginFormValidation>>({
    resolver: zodResolver(LoginFormValidation),
    defaultValues: {
      ...LoginDefaultValues,
    },
  })

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    params.set('tab', activeTab as string)

    router.replace(`${pathname}?${params.toString()}`)
  }, [activeTab])

  const changeLoginStep = () => {
    if (loginStep === 0) {
      setLoginStep(1)
    } else {
      setLoginStep(0)
    }
  }

  const routerBackWithRefresh = () => {
    router.back()
    setTimeout(() => {
      router.refresh() // رفرش صفحه مقصد
    }, 100)
  }

  const sendLoginOTP = async (data: typeof SendOtpDefaultValues) => {
    try {
      setLoading(true)
      const res = await SEND_LOGIN_OTP({
        mobile: data.mobile,
      })

      if (res?.status === 200) {
        setLoginOtpStep(1)
        setIsTimerComplete(false)
      }
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  const checkLoginOTP = async (data: typeof CheckOtpDefaultValues) => {
    try {
      setLoading(true)
      const res = await CHECK_LOGIN_OTP({
        mobile: sendOtpForm.getValues('mobile'),
        otpCode: data.code,
      })

      if (res?.status === 200) {
        await saveUser(res?.data)

        routerBackWithRefresh()
      }
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  const sendOTP = async (data: typeof SendOtpDefaultValues) => {
    try {
      setLoading(true)
      const res = await SEND_OTP({
        mobile: data.mobile,
      })

      if (res?.status === 200) {
        setRegisterStep(1)
        setIsTimerComplete(false)
      }
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  const checkOTP = async (data: typeof CheckOtpDefaultValues) => {
    try {
      setLoading(true)
      const res = await CHECK_OTP({
        mobile: sendOtpForm.getValues('mobile'),
        verifyCode: data.code,
      })

      if (res?.status === 200) {
        axiosInstance.defaults.headers['Authorization'] = `Bearer ${res?.data?.accessToken}`
        Cookies.set('accessToken', JSON.stringify(res?.data?.accessToken))

        setRegisterStep(2)
      }
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  const sendUserInfoForm = async (data: typeof userInfoDefaultValues) => {
    try {
      setLoading(true)
      const response = await UPDATE_USER_PROFILE(data)

      if (response) {
        if (response?.data?.accessToken && response?.data?.refreshToken) {
          await saveUser({
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          })
        } else {
          updateUserFromOutside(data)
        }
        toast.success('ثبت نام شما با موفقیت تکمیل شد.')
        routerBackWithRefresh()
      }
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (data: typeof LoginDefaultValues) => {
    try {
      setLoading(true)

      await login({
        username: data.mobile,
        password: data.password,
      })

      routerBackWithRefresh()
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    try {
      setLoading(true)
      const response = await SEND_VERIFY_CODE_TO_MOBILE_AGAIN(sendOtpForm.getValues('mobile'))

      if (response) {
        resetTimer()
        toast.success('کد مجددا برای شما ارسال شد')
      }
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  const resetTimer = () => {
    setTimerKey((prevKey) => prevKey + 1) // تغییر کلید برای ریست
    setIsTimerComplete(false) // تنظیم مجدد وضعیت تایمر
  }

  return (
    <div className="h-full flex flex-col md:flex-row gap-8">
      <div className="flex-1">
        <ObsLogo />

        <Tabs
          aria-label="Options"
          className="w-full justify-center mt-10"
          classNames={{
            tabList: 'w-[200px]',
          }}
          color="primary"
          selectedKey={activeTab}
          size="lg"
          onSelectionChange={setActiveTab}
        >
          <Tab
            key="register"
            title="ثبت نام"
          >
            <div className="flex flex-col md:w-fit mx-auto min-w-[282px]">
              {registerStep === 0 ? (
                <>
                  <p className="mt-4">سلام! 👋</p>
                  <p>لطفا شماره موبایل خود را وارد کنید</p>
                </>
              ) : registerStep === 1 ? (
                <p className="mt-4">کد تایید برای شماره {sendOtpForm.getValues('mobile')} پیامک شد.</p>
              ) : (
                <p className="mt-4 mb-8">لطفا اطلاعات خود را وارد کنید</p>
              )}
              {registerStep === 0 ? (
                <FormProvider {...sendOtpForm}>
                  <form
                    key="sendOtp"
                    onSubmit={sendOtpForm.handleSubmit(sendOTP)}
                  >
                    <Input
                      className="mt-8 mb-6"
                      generalType="input"
                      inputType="tel"
                      name="mobile"
                      placeholder="تلفن همراه"
                    />
                    <Button
                      fullWidth
                      isLoading={loading}
                      type="submit"
                    >
                      <p>ارسال کد فعالسازی</p>
                    </Button>
                  </form>
                </FormProvider>
              ) : registerStep === 1 ? (
                <FormProvider {...checkOtpForm}>
                  <form
                    key="checkOtp"
                    onSubmit={checkOtpForm.handleSubmit(checkOTP)}
                  >
                    <Input
                      autoFocus
                      className="mt-6 mb-6 items-center"
                      generalType="otp"
                      inputType="text"
                      name="code"
                      placeholder="کد تایید"
                    />
                    <Button
                      fullWidth
                      isLoading={loading}
                      type="submit"
                    >
                      <p>تایید</p>
                    </Button>
                  </form>
                </FormProvider>
              ) : (
                <FormProvider {...userInfoForm}>
                  <form
                    key="userInfo"
                    className="flex flex-col gap-6"
                    onSubmit={userInfoForm.handleSubmit(sendUserInfoForm)}
                  >
                    <Input
                      required
                      generalType="input"
                      inputType="text"
                      label="نام"
                      name="firstName"
                      placeholder="نام"
                    />
                    <Input
                      required
                      generalType="input"
                      inputType="text"
                      label="نام خانوادگی"
                      name="lastName"
                      placeholder="نام خانوادگی"
                    />
                    <Input
                      required
                      description="رمز عبور باید حداقل 6 کاراکتر باشد."
                      generalType="input"
                      inputType="password"
                      label="رمز عبور"
                      name="password"
                      placeholder="رمز عبور"
                    />
                    <Input
                      required
                      description="تکرار رمز عبور باید حداقل 6 کاراکتر باشد."
                      generalType="input"
                      inputType="password"
                      label="تکرار رمز عبور"
                      name="confirmPassword"
                      placeholder="تکرار رمز عبور"
                    />
                    <Button
                      fullWidth
                      isLoading={loading}
                      type="submit"
                    >
                      <p>تایید</p>
                    </Button>
                  </form>
                </FormProvider>
              )}
              {registerStep === 0 ? (
                <>
                  {/* <div className="w-full h-[1px] bg-background-70 my-6"></div>
                   <Button
                   fullWidth
                   variant="bordered"
                   color="default"
                   iconStart={<GoogleIcon />}
                   className="border-1"
                   >
                   <p className="text-text-light-25">ثبت نام با گوگل</p>
                   </Button> */}
                </>
              ) : registerStep === 1 ? (
                <div className="text-sm text-text-light-25 mx-auto mt-6">
                  {isTimerComplete ? (
                    <Button
                      color="secondary"
                      variant="light"
                      onClick={handleResendCode}
                    >
                      ارسال مجدد کد
                    </Button>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div>
                        زمان باقی مانده تا دریافت مجدد کد :{' '}
                        <CountdownTimer
                          time={120000}
                          onComplete={() => setIsTimerComplete(true)}
                        />
                      </div>
                      <Button
                        variant="light"
                        onClick={() => {
                          setLoginStep(0)
                          setLoginOtpStep(0)
                        }}
                      >
                        تغییر شماره تلفن
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <p />
              )}
            </div>
          </Tab>
          <Tab
            key="login"
            title="ورود"
          >
            <div className="flex flex-col md:w-fit mx-auto min-w-[282px]">
              {loginStep === 0 ? (
                <>
                  <p className="mt-4">سلام! 👋</p>
                  <p>لطفا شماره موبایل و رمز عبور خود را وارد کنید</p>
                </>
              ) : loginStep === 1 && loginOtpStep === 0 ? (
                <>
                  <p className="mt-4">سلام! 👋</p>
                  <p>لطفا شماره موبایل خود را وارد کنید</p>
                </>
              ) : (
                <>
                  <p className="mt-4">کد تایید برای شماره {sendOtpForm.getValues('mobile')} پیامک شد.</p>
                </>
              )}
              {loginStep === 0 ? (
                <FormProvider {...loginForm}>
                  <form
                    key="login"
                    className="mt-8"
                    onSubmit={loginForm.handleSubmit(handleLogin)}
                  >
                    <Input
                      className="mb-12"
                      generalType="input"
                      inputType="tel"
                      label="نام کاربری (شماره تلفن)"
                      name="mobile"
                      placeholder="نام کاربری"
                    />
                    <Input
                      generalType="input"
                      inputType="password"
                      label="رمز عبور"
                      name="password"
                      placeholder="رمز عبور"
                    />
                    <Button
                      fullWidth
                      className="mt-6"
                      isLoading={loading}
                      type="submit"
                    >
                      <p>ورود</p>
                    </Button>
                  </form>
                </FormProvider>
              ) : loginOtpStep === 0 ? (
                <FormProvider {...sendOtpForm}>
                  <form
                    key="sendLoginOtp"
                    onSubmit={sendOtpForm.handleSubmit(sendLoginOTP)}
                  >
                    <Input
                      className="mt-8 mb-6"
                      generalType="input"
                      inputType="tel"
                      name="mobile"
                      placeholder="تلفن همراه"
                    />
                    <Button
                      fullWidth
                      isLoading={loading}
                      type="submit"
                    >
                      <p>ارسال کد فعالسازی</p>
                    </Button>
                  </form>
                </FormProvider>
              ) : (
                <FormProvider {...checkOtpForm}>
                  <form
                    key="checkLoginOtp"
                    onSubmit={checkOtpForm.handleSubmit(checkLoginOTP)}
                  >
                    <Input
                      autoFocus
                      className="mt-6 mb-6 items-center"
                      generalType="otp"
                      inputType="text"
                      name="code"
                      placeholder="کد تایید"
                    />
                    <Button
                      fullWidth
                      isLoading={loading}
                      type="submit"
                    >
                      <p>تایید</p>
                    </Button>
                  </form>
                </FormProvider>
              )}
              <Button
                className="mt-2"
                color="secondary"
                variant="light"
                onClick={changeLoginStep}
              >
                {loginStep === 0 ? <p>ورود با ارسال کد فعالسازی</p> : <p>ورود با نام کاربری</p>}
              </Button>
              {loginOtpStep === 1 && (
                <div className="text-sm text-text-light-25 mx-auto">
                  {isTimerComplete ? (
                    <Button
                      color="secondary"
                      variant="light"
                      onClick={handleResendCode}
                    >
                      ارسال مجدد کد
                    </Button>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div>
                        زمان باقی مانده تا دریافت مجدد کد :{' '}
                        <CountdownTimer
                          time={120000}
                          onComplete={() => setIsTimerComplete(true)}
                        />
                      </div>
                      <Button
                        variant="light"
                        onClick={() => setLoginOtpStep(0)}
                      >
                        تغییر شماره تلفن
                      </Button>
                    </div>
                  )}
                </div>
              )}
              {/* <div className="w-full h-[1px] bg-background-70 my-6"></div>
               <Button
               fullWidth
               variant="bordered"
               color="default"
               iconStart={<GoogleIcon />}
               className="border-1"
               >
               <p className="text-text-light-25">ورود با گوگل</p>
               </Button> */}
            </div>
          </Tab>
        </Tabs>
      </div>
      <div className="flex-1 pb-8 md:pb-0">
        <img
          alt="auth side"
          className="w-full max-h-full "
          src="/images/auth.jpg"
        />
      </div>
    </div>
  )
}

const AuthWrapper = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Auth />
    </Suspense>
  )
}

export default AuthWrapper
