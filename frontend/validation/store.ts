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

// Create validation with userId (for new stores)
export const StoreFormValidation = StoreBaseValidation.extend({
  userId: z.string().min(1, 'شناسه کاربر الزامی است')
})

// Create validation without userId (for updates)
export const StoreUpdateValidation = StoreBaseValidation

// Type for the base store data
export type StoreBaseData = z.infer<typeof StoreBaseValidation>

// Type for store creation data
export type StoreFormData = z.infer<typeof StoreFormValidation>

// Type for store update data
export type StoreUpdateData = z.infer<typeof StoreUpdateValidation>
