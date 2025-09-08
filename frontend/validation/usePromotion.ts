'use client'
import { z } from 'zod'

export const UsePromotionFormValidation = z.object({
  promoCode: z.string()
    .min(6, 'کد تخفیف باید حداقل ۶ کاراکتر باشد')
    .max(12, 'کد تخفیف باید حداکثر ۱۲ کاراکتر باشد')
    .regex(/^[A-Z0-9]+$/, 'کد تخفیف باید شامل حروف بزرگ انگلیسی و اعداد باشد'),
})

export type UsePromotionFormData = z.infer<typeof UsePromotionFormValidation>
