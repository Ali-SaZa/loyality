import { z } from 'zod'

import { convertPersianToEnglish } from '@/helpers'

// Base validation schema without userId
const StoreBaseValidation = z.object({
  name: z.string().min(2, 'نام فروشگاه حداقل باید ۲ کاراکتر باشد.'),
  ownerName: z.string().min(2, 'نام صاحب فروشگاه حداقل باید ۲ کاراکتر باشد.'),
  phoneNumber: z.string().refine((val) => {
    const convertedValue = convertPersianToEnglish(val)
    return /^09\d{9}$/.test(convertedValue)
  }, 'شماره تلفن معتبر نیست'),
  address: z.object({
    city: z.string().min(2, 'شهر حداقل باید ۲ کاراکتر باشد.'),
    street: z.string().optional(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number()
    }).optional()
  }),
  loyaltySettings: z.object({
    tiers: z.array(z.object({
      minAmount: z.number(),
      rewardType: z.enum(['cashback', 'discount', 'lottery']),
      value: z.number(),
      description: z.string().optional()
    })),
    lotteryFrequency: z.enum(['none', 'weekly', 'monthly']),
    defaultCashbackRate: z.number().min(0).max(100)
  }),
  plan: z.object({
    type: z.enum(['free', 'premium']),
    startDate: z.string(),
    endDate: z.string()
  })
})

// User information validation (same as user registration)
const UserInfoValidation = z.object({
  firstName: z.string().min(2, 'نام حداقل باید ۲ کاراکتر باشد.'),
  lastName: z.string().min(2, 'نام خانوادگی حداقل باید ۲ کاراکتر باشد.'),
  password: z.string().min(6, 'رمز عبور باید حداقل 6 کاراکتر باشد.'),
  confirmPassword: z.string().min(6, 'تکرار رمز عبور باید حداقل 6 کاراکتر باشد.')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'رمز عبور و تکرار آن باید یکسان باشند.',
  path: ['confirmPassword']
})

// Create validation with userId (for new stores)
export const StoreFormValidation = StoreBaseValidation.extend({
  userId: z.string().min(1, 'شناسه کاربر الزامی است')
})

// Create validation without userId (for updates)
export const StoreUpdateValidation = StoreBaseValidation

// Create validation for store with user information
export const StoreWithUserValidation = z.object({
  user: UserInfoValidation,
  store: StoreBaseValidation
})

// Type definitions
export type StoreFormData = z.infer<typeof StoreFormValidation>
export type StoreUpdateData = z.infer<typeof StoreUpdateValidation>
export type StoreWithUserData = z.infer<typeof StoreWithUserValidation>
