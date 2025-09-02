import { z } from 'zod'

// Promo code validation schemas
export const CreatePromoCodeValidation = z.object({
  code: z.string()
    .min(6, 'کد تخفیف حداقل باید ۶ کاراکتر باشد')
    .max(12, 'کد تخفیف حداکثر ۱۲ کاراکتر باشد')
    .regex(/^[A-Z0-9]+$/, 'کد تخفیف باید شامل حروف بزرگ و اعداد باشد'),
  promotionId: z.string().min(1, 'شناسه تبلیغ الزامی است'),
  notes: z.string().max(200, 'یادداشت حداکثر ۲۰۰ کاراکتر باشد').optional()
})

export const UpdatePromoCodeValidation = z.object({
  notes: z.string().max(200, 'یادداشت حداکثر ۲۰۰ کاراکتر باشد').optional()
})

export const ChangePromoCodeStatusValidation = z.object({
  status: z.enum(['unused', 'used']).refine((val) => val !== undefined, { message: 'وضعیت کد تخفیف الزامی است' }),
  userId: z.string().optional()
})

export const ValidatePromoCodeValidation = z.object({
  code: z.string()
    .min(6, 'کد تخفیف حداقل باید ۶ کاراکتر باشد')
    .max(12, 'کد تخفیف حداکثر ۱۲ کاراکتر باشد')
    .regex(/^[A-Z0-9]+$/, 'کد تخفیف باید شامل حروف بزرگ و اعداد باشد'),
  storeId: z.string().min(1, 'شناسه فروشگاه الزامی است')
})

export const RegisterPromoCodeValidation = z.object({
  code: z.string()
    .min(6, 'کد تخفیف حداقل باید ۶ کاراکتر باشد')
    .max(12, 'کد تخفیف حداکثر ۱۲ کاراکتر باشد')
    .regex(/^[A-Z0-9]+$/, 'کد تخفیف باید شامل حروف بزرگ و اعداد باشد'),
  phoneNumber: z.string()
    .regex(/^09[0-9]{9}$/, 'شماره تلفن باید در فرمت 09xxxxxxxxx باشد')
})

export const GetUserPromoCodesValidation = z.object({
  phoneNumber: z.string()
    .regex(/^09[0-9]{9}$/, 'شماره تلفن باید در فرمت 09xxxxxxxxx باشد'),
  storeId: z.string().optional()
})

// Type definitions
export type CreatePromoCodeData = z.infer<typeof CreatePromoCodeValidation>
export type UpdatePromoCodeData = z.infer<typeof UpdatePromoCodeValidation>
export type ChangePromoCodeStatusData = z.infer<typeof ChangePromoCodeStatusValidation>
export type ValidatePromoCodeData = z.infer<typeof ValidatePromoCodeValidation>
export type RegisterPromoCodeData = z.infer<typeof RegisterPromoCodeValidation>
export type GetUserPromoCodesData = z.infer<typeof GetUserPromoCodesValidation>
