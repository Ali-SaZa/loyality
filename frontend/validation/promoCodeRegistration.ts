'use client'
import { z } from 'zod'

import { convertPersianToEnglish } from '@/helpers'

export const PromoCodeRegistrationFormValidation = z.object({
  phoneNumber: z.string().refine((val) => {
    const convertedValue = convertPersianToEnglish(val)
    return /^09\d{9}$/.test(convertedValue)
  }, 'تلفن همراه معتبر نیست'),
  promoCode: z.string()
    .min(6, 'کد تخفیف باید حداقل ۶ کاراکتر باشد')
    .max(12, 'کد تخفیف باید حداکثر ۱۲ کاراکتر باشد')
    .regex(/^[A-Z0-9]+$/, 'کد تخفیف باید شامل حروف بزرگ انگلیسی و اعداد باشد'),
})

export const PromoCodeVerificationFormValidation = z.object({
  phoneNumber: z.string().refine((val) => {
    const convertedValue = convertPersianToEnglish(val)
    return /^09\d{9}$/.test(convertedValue)
  }, 'تلفن همراه معتبر نیست'),
  promoCode: z.string()
    .min(6, 'کد تخفیف باید حداقل ۶ کاراکتر باشد')
    .max(12, 'کد تخفیف باید حداکثر ۱۲ کاراکتر باشد')
    .regex(/^[A-Z0-9]+$/, 'کد تخفیف باید شامل حروف بزرگ انگلیسی و اعداد باشد'),
  otpCode: z.string()
    .min(6, 'کد تایید باید ۶ رقم باشد')
    .max(6, 'کد تایید باید ۶ رقم باشد')
    .regex(/^\d{6}$/, 'کد تایید باید شامل ۶ رقم باشد'),
})
