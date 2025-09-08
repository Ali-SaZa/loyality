'use client'
import { z } from 'zod'

import { convertPersianToEnglish } from '@/helpers'

export const SendOtpFormValidation = z.object({
  mobile: z.string().refine((val) => {
    const convertedValue = convertPersianToEnglish(val)

    return /^09\d{9}$/.test(convertedValue)
  }, 'تلفن همراه معتبر نیست'),
})

export const CheckOtpFormValidation = z.object({
  code: z.string().min(6, 'کد وارد شده صحیح نیست').max(6, 'کد وارد شده صحیح نیست'),
})

export const UserInfoFormValidation = z
  .object({
    firstName: z.string().min(2, 'نام حداقل باید ۲ کاراکتر باشد.'),
    lastName: z.string().min(2, 'نام خانوادگی حداقل باید ۲ کاراکتر باشد.'),
    password: z.string().min(6, 'رمز عبور باید حداقل 6 کاراکتر باشد.'),
    // .regex(/[a-z]/, 'رمز عبور باید حداقل یک حرف کوچک داشته باشد.')
    // .regex(/[A-Z]/, 'رمز عبور باید حداقل یک حرف بزرگ داشته باشد.')
    // .regex(/\d/, 'رمز عبور باید حداقل یک عدد داشته باشد.')
    confirmPassword: z.string().min(6, 'تکرار رمز عبور باید حداقل 6 کاراکتر باشد.'),
    // .regex(/[a-z]/, 'تکرار رمز عبور باید حداقل یک حرف کوچک داشته باشد.')
    // .regex(/[A-Z]/, 'تکرار رمز عبور باید حداقل یک حرف بزرگ داشته باشد.')
    // .regex(/\d/, 'تکرار رمز عبور باید حداقل یک عدد داشته باشد.')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'رمز عبور و تکرار آن باید یکسان باشند.',
    path: ['confirmPassword'], // ارور به تکرار رمز عبور مرتبط می‌شود.
  })

export const LoginFormValidation = z.object({
  mobile: z.string().refine((val) => {
    const convertedValue = convertPersianToEnglish(val)

    return /^09\d{9}$/.test(convertedValue)
  }, 'تلفن همراه معتبر نیست'),
  password: z.string().min(6, 'رمز عبور باید حداقل 6 کاراکتر باشد.'),
})
