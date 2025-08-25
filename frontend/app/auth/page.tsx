'use client'
import { zodResolver } from '@hookform/resolvers/zod'

import { useRouter } from 'next/navigation'
import React, { Suspense, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

import Button from '@/components/formElements/Button'
import Input from '@/components/formElements/Input'
import Loading from '@/components/layouts/Loading'
import ObsLogo from '@/components/ui/ObsLogo'
import CountdownTimer from '@/components/utils/CountdownTimer'
import useAuth from '@/hooks/useAuth'
import { authService } from '@/services/auth'
import { CheckOtpFormValidation, SendOtpFormValidation } from '@/validation/auth'
import axiosInstance from '@/config/axios'

const CheckOtpDefaultValues = {
  code: '',
}



const Auth = () => {
  const { saveUser, updateUserFromOutside } = useAuth()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [loginOtpStep, setLoginOtpStep] = useState(0)
  const [isTimerComplete, setIsTimerComplete] = useState(false)
  const [timerKey, setTimerKey] = useState(0)

  const sendOtpForm = useForm<z.infer<typeof SendOtpFormValidation>>({
    resolver: zodResolver(SendOtpFormValidation),
    defaultValues: {
      mobile: '',
    },
  })

  const checkOtpForm = useForm<z.infer<typeof CheckOtpFormValidation>>({
    resolver: zodResolver(CheckOtpFormValidation),
    defaultValues: {
      ...CheckOtpDefaultValues,
    },
  })







  const routerBackWithRefresh = () => {
    router.back()
    setTimeout(() => {
      router.refresh() // رفرش صفحه مقصد
    }, 100)
  }

  const sendLoginOTP = async (data: { mobile: string }) => {
    try {
      console.log('📱 OTP Request - Starting...', { data })
      setLoading(true)
      
      const res = await authService.requestOtp({
        phoneNumber: data.mobile,
      })

      console.log('✅ OTP Request - Success:', res)

      if (res) {
        setLoginOtpStep(1)
        setIsTimerComplete(false)
        // Show success message from backend
        toast.success(res.message || 'کد تایید ارسال شد')
      }
    } catch (error) {
      console.error('❌ OTP Request - Error:', error)
      toast.error(error instanceof Error ? error.message : 'خطا در ارسال کد')
    } finally {
      setLoading(false)
    }
  }

  const checkLoginOTP = async (data: typeof CheckOtpDefaultValues) => {
    try {
      console.log('🔍 OTP Verification - Starting...', { data, phoneNumber: sendOtpForm.getValues('mobile') })
      setLoading(true)
      
      const res = await authService.verifyOtp({
        phoneNumber: sendOtpForm.getValues('mobile'),
        code: data.code,
      })

      console.log('✅ OTP Verification - Success:', res)

      if (res) {
        // Store the token in both localStorage and cookies for middleware access
        localStorage.setItem('authToken', res.accessToken)
        localStorage.setItem('user', JSON.stringify(res.user))
        
        // Set cookie for middleware authentication check
        document.cookie = `authToken=${res.accessToken}; path=/; max-age=${7 * 24 * 60 * 60}` // 7 days
        
        await saveUser({
          accessToken: res.accessToken,
          refreshToken: res.accessToken // Using accessToken as refreshToken for now
        })

        routerBackWithRefresh()
      }
    } catch (error) {
      console.error('❌ OTP Verification - Error:', error)
      toast.error(error instanceof Error ? error.message : 'خطا در تایید کد')
    } finally {
      setLoading(false)
    }
  }







  const handleResendCode = async () => {
    try {
      setLoading(true)
      const response = await authService.requestOtp({
        phoneNumber: sendOtpForm.getValues('mobile')
      })

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

        <div className="w-full justify-center mt-10">
          <div className="flex flex-col md:w-fit mx-auto min-w-[282px]">
            <div className="flex flex-col md:w-fit mx-auto min-w-[282px]">
              {loginOtpStep === 0 ? (
                <>
                  <p className="mt-4">سلام! 👋</p>
                  <p>لطفا شماره موبایل خود را وارد کنید</p>
                </>
              ) : (
                <>
                  <p className="mt-4">کد تایید برای شماره {sendOtpForm.getValues('mobile')} پیامک شد.</p>
                </>
              )}
              {loginOtpStep === 0 ? (
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
                    onSubmit={(e) => {
                      console.log('🚀 Form Submit - OTP Form submitted')
                      console.log('📋 Form Data:', checkOtpForm.getValues())
                      console.log('🔍 Form Errors:', checkOtpForm.formState.errors)
                      checkOtpForm.handleSubmit(checkLoginOTP)(e)
                    }}
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
            </div>
          </div>
        </div>
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
