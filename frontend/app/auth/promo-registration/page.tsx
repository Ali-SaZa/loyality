'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

import Button from '@/components/formElements/Button'
import Input from '@/components/formElements/Input'
import LogoContainer from '@/components/ui/ObsLogo'
import CountdownTimer from '@/components/utils/CountdownTimer'
import { promoCodeRegistrationService } from '@/services/promoCodeRegistration'
import { 
  PromoCodeRegistrationFormValidation, 
  PromoCodeVerificationFormValidation 
} from '@/validation/promoCodeRegistration'

const PromoCodeRegistration = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [registrationStep, setRegistrationStep] = useState(0) // 0: Enter details, 1: Verify OTP, 2: Success
  const [isTimerComplete, setIsTimerComplete] = useState(false)
  const [timerKey, setTimerKey] = useState(0)
  const [registrationData, setRegistrationData] = useState<{
    phoneNumber: string
    promoCode: string
  } | null>(null)
  const [successData, setSuccessData] = useState<any>(null)

  const registrationForm = useForm<z.infer<typeof PromoCodeRegistrationFormValidation>>({
    resolver: zodResolver(PromoCodeRegistrationFormValidation),
    defaultValues: {
      phoneNumber: '',
      promoCode: '',
    },
  })

  const verificationForm = useForm<z.infer<typeof PromoCodeVerificationFormValidation>>({
    resolver: zodResolver(PromoCodeVerificationFormValidation),
    defaultValues: {
      phoneNumber: '',
      promoCode: '',
      otpCode: '',
    },
  })

  const sendPromoRegistrationOTP = async (data: { phoneNumber: string; promoCode: string }) => {
    try {
      console.log('📱 Promo Registration OTP Request - Starting...', { data })
      setLoading(true)
      
      const res = await promoCodeRegistrationService.sendOtpForPromoRegistration({
        phoneNumber: data.phoneNumber,
        promoCode: data.promoCode,
      })

      console.log('✅ Promo Registration OTP Request - Success:', res)

      if (res) {
        setRegistrationData({ phoneNumber: data.phoneNumber, promoCode: data.promoCode })
        verificationForm.setValue('phoneNumber', data.phoneNumber)
        verificationForm.setValue('promoCode', data.promoCode)
        setRegistrationStep(1)
        setIsTimerComplete(false)
        toast.success(res.message || 'کد تایید ارسال شد')
      }
    } catch (error) {
      console.error('❌ Promo Registration OTP Request - Error:', error)
      toast.error(error instanceof Error ? error.message : 'خطا در ارسال کد')
    } finally {
      setLoading(false)
    }
  }

  const verifyPromoRegistrationOTP = async (data: { otpCode: string }) => {
    try {
      console.log('🔍 Promo Registration OTP Verification - Starting...', { data, registrationData })
      setLoading(true)
      
      if (!registrationData) {
        throw new Error('اطلاعات ثبت نام یافت نشد')
      }

      const res = await promoCodeRegistrationService.verifyPromoRegistration({
        phoneNumber: registrationData.phoneNumber,
        promoCode: registrationData.promoCode,
        otpCode: data.otpCode,
      })

      console.log('✅ Promo Registration OTP Verification - Success:', res)

      if (res) {
        setSuccessData(res)
        setRegistrationStep(2)
        toast.success(res.message || 'تبریک! شما با موفقیت ثبت نام کردید')
      }
    } catch (error) {
      console.error('❌ Promo Registration OTP Verification - Error:', error)
      toast.error(error instanceof Error ? error.message : 'خطا در تایید کد')
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    try {
      setLoading(true)
      if (!registrationData) {
        throw new Error('اطلاعات ثبت نام یافت نشد')
      }

      const response = await promoCodeRegistrationService.sendOtpForPromoRegistration({
        phoneNumber: registrationData.phoneNumber,
        promoCode: registrationData.promoCode,
      })

      if (response) {
        resetTimer()
        toast.success('کد مجددا برای شما ارسال شد')
      }
    } catch (error) {
      console.log('error', error)
      toast.error('خطا در ارسال مجدد کد')
    } finally {
      setLoading(false)
    }
  }

  const resetTimer = () => {
    setTimerKey((prevKey) => prevKey + 1)
    setIsTimerComplete(false)
  }

  const handleBackToStart = () => {
    setRegistrationStep(0)
    setRegistrationData(null)
    setSuccessData(null)
    registrationForm.reset()
    verificationForm.reset()
  }

  const handleGoToDashboard = () => {
    router.push('/')
  }

  return (
    <div className="h-full flex flex-col md:flex-row gap-8">
      <div className="flex-1">
        <LogoContainer />

        <div className="w-full justify-center mt-10">
          <div className="flex flex-col md:w-fit mx-auto min-w-[282px]">
            <div className="flex flex-col md:w-fit mx-auto min-w-[282px]">
              {registrationStep === 0 && (
                <>
                  <p className="mt-4">ثبت نام با کد تخفیف 🎉</p>
                  <p>لطفا شماره موبایل و کد تخفیف خود را وارد کنید</p>
                </>
              )}
              
              {registrationStep === 1 && (
                <>
                  <p className="mt-4">کد تایید برای شماره {registrationData?.phoneNumber} پیامک شد.</p>
                  <p className="text-sm text-text-light-25">کد تخفیف: {registrationData?.promoCode}</p>
                </>
              )}

              {registrationStep === 2 && successData && (
                <>
                  <div className="mt-4 text-center">
                    <div className="text-4xl mb-4">🎉</div>
                    <p className="text-green-600 font-semibold">{successData.message}</p>
                  </div>
                </>
              )}

              {registrationStep === 0 && (
                <FormProvider {...registrationForm}>
                  <form
                    key="promoRegistration"
                    onSubmit={registrationForm.handleSubmit(sendPromoRegistrationOTP)}
                  >
                    <Input
                      className="mt-8 mb-4"
                      generalType="input"
                      inputType="tel"
                      name="phoneNumber"
                      placeholder="تلفن همراه"
                    />
                    <Input
                      className="mb-6"
                      generalType="input"
                      inputType="text"
                      name="promoCode"
                      placeholder="کد تخفیف"
                    />
                    <Button
                      fullWidth
                      isLoading={loading}
                      type="submit"
                    >
                      <p>ارسال کد تایید</p>
                    </Button>
                  </form>
                </FormProvider>
              )}

              {registrationStep === 1 && (
                <FormProvider {...verificationForm}>
                  <form
                    key="promoVerification"
                    onSubmit={verificationForm.handleSubmit(verifyPromoRegistrationOTP)}
                  >
                    <Input
                      autoFocus
                      className="mt-6 mb-6 items-center"
                      generalType="otp"
                      inputType="text"
                      name="otpCode"
                      placeholder="کد تایید"
                    />
                    
                    <Button
                      fullWidth
                      isLoading={loading}
                      type="submit"
                    >
                      <p>تایید و ثبت نام</p>
                    </Button>
                  </form>
                </FormProvider>
              )}

              {registrationStep === 2 && successData && (
                <div className="mt-6 space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">اطلاعات فروشگاه</h3>
                    <p className="text-sm"><strong>نام:</strong> {successData.store.name}</p>
                    <p className="text-sm"><strong>آدرس:</strong> {successData.store.address.fullAddress}</p>
                    {successData.store.description && (
                      <p className="text-sm"><strong>توضیحات:</strong> {successData.store.description}</p>
                    )}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">اطلاعات پیشنهاد</h3>
                    <p className="text-sm"><strong>عنوان:</strong> {successData.promotion.title}</p>
                    <p className="text-sm"><strong>قیمت:</strong> {successData.promotion.price.toLocaleString()} تومان</p>
                    <p className="text-sm"><strong>امتیاز:</strong> {successData.promotion.points} امتیاز</p>
                    {successData.promotion.description && (
                      <p className="text-sm"><strong>توضیحات:</strong> {successData.promotion.description}</p>
                    )}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">کد تخفیف شما</h3>
                    <p className="text-sm"><strong>کد:</strong> {successData.promoCode.code}</p>
                    <p className="text-sm"><strong>وضعیت:</strong> {successData.promoCode.status === 'unused' ? 'آماده استفاده' : successData.promoCode.status}</p>
                  </div>

                  <Button
                    fullWidth
                    onClick={handleGoToDashboard}
                  >
                    <p>برو به داشبورد</p>
                  </Button>
                </div>
              )}

              {registrationStep === 1 && (
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
                          key={timerKey}
                          time={300000} // 5 minutes
                          onComplete={() => setIsTimerComplete(true)}
                        />
                      </div>
                      <Button
                        variant="light"
                        onClick={handleBackToStart}
                      >
                        تغییر اطلاعات
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {registrationStep === 2 && (
                <div className="text-sm text-text-light-25 mx-auto mt-4">
                  <Button
                    variant="light"
                    onClick={handleBackToStart}
                  >
                    ثبت نام جدید
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 pb-8 md:pb-0">
        <img
          alt="promo registration side"
          className="w-full max-h-full"
          src="/images/auth.jpg"
        />
      </div>
    </div>
  )
}

export default PromoCodeRegistration
