import { z } from 'zod'

// Promotion validation schemas
export const CreatePromotionValidation = z.object({
  storeId: z.string().min(1, 'شناسه فروشگاه الزامی است'),
  type: z.enum([
    'coupon', 'cashback', 'referral', 'conditional', 'percentage', 
    'fixed', 'flashSale', 'freeShipping', 'loyaltyPoints', 'behavioral', 'stackable'
  ]).refine((val) => val !== undefined, { message: 'نوع تبلیغ الزامی است' }),
  title: z.string().min(2, 'عنوان تبلیغ حداقل باید ۲ کاراکتر باشد').max(100, 'عنوان تبلیغ حداکثر ۱۰۰ کاراکتر باشد'),
  description: z.string().max(500, 'توضیحات حداکثر ۵۰۰ کاراکتر باشد').optional(),
  value: z.number().min(0, 'مقدار باید مثبت باشد').optional(),
  minPurchaseAmount: z.number().min(0, 'حداقل مبلغ خرید باید مثبت باشد').optional(),
  maxDiscountAmount: z.number().min(0, 'حداکثر مبلغ تخفیف باید مثبت باشد').optional(),
  code: z.string().regex(/^[A-Z0-9]{3,20}$/, 'کد تبلیغ باید ۳ تا ۲۰ کاراکتر و شامل حروف بزرگ و اعداد باشد').optional(),
  points: z.number().min(0, 'امتیاز باید مثبت باشد').optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  usageLimit: z.number().min(1, 'حد مجاز استفاده باید حداقل ۱ باشد').optional(),
  applicableEvents: z.array(z.string()).optional(),
  maxUsagePerCustomer: z.number().min(0, 'حد مجاز استفاده برای هر مشتری باید مثبت باشد').optional(),
  isStackable: z.boolean().optional(),
  stackableWith: z.array(z.string()).optional(),
  termsAndConditions: z.string().optional(),
  requiresApproval: z.boolean().optional()
}).refine((data) => {
  // Type-specific validations
  if (data.type === 'coupon' && !data.code) {
    return false
  }
  if (data.type === 'loyaltyPoints' && !data.points) {
    return false
  }
  if (['percentage', 'fixed', 'conditional', 'cashback', 'referral', 'flashSale', 'behavioral', 'stackable'].includes(data.type) && !data.value) {
    return false
  }
  if (data.type === 'conditional' && !data.minPurchaseAmount) {
    return false
  }
  if (data.type === 'flashSale' && (!data.startDate || !data.endDate)) {
    return false
  }
  if (data.type === 'behavioral' && (!data.applicableEvents || data.applicableEvents.length === 0)) {
    return false
  }
  if (data.type === 'stackable' && (!data.isStackable || !data.stackableWith || data.stackableWith.length === 0)) {
    return false
  }
  return true
}, {
  message: 'فیلدهای مورد نیاز برای این نوع تبلیغ را پر کنید',
  path: ['type']
})

export const UpdatePromotionValidation = z.object({
  title: z.string().min(2, 'عنوان تبلیغ حداقل باید ۲ کاراکتر باشد').max(100, 'عنوان تبلیغ حداکثر ۱۰۰ کاراکتر باشد').optional(),
  description: z.string().max(500, 'توضیحات حداکثر ۵۰۰ کاراکتر باشد').optional(),
  value: z.number().min(0, 'مقدار باید مثبت باشد').optional(),
  minPurchaseAmount: z.number().min(0, 'حداقل مبلغ خرید باید مثبت باشد').optional(),
  maxDiscountAmount: z.number().min(0, 'حداکثر مبلغ تخفیف باید مثبت باشد').optional(),
  usageLimit: z.number().min(1, 'حد مجاز استفاده باید حداقل ۱ باشد').optional(),
  maxUsagePerCustomer: z.number().min(0, 'حد مجاز استفاده برای هر مشتری باید مثبت باشد').optional(),
  isStackable: z.boolean().optional(),
  stackableWith: z.array(z.string()).optional(),
  termsAndConditions: z.string().optional(),
  requiresApproval: z.boolean().optional(),
  applicableEvents: z.array(z.string()).optional()
})

export const ChangePromotionStatusValidation = z.object({
  status: z.enum(['active', 'inactive', 'deleted', 'expired']).refine((val) => val !== undefined, { message: 'وضعیت تبلیغ الزامی است' })
})

// Type definitions
export type CreatePromotionData = z.infer<typeof CreatePromotionValidation>
export type UpdatePromotionData = z.infer<typeof UpdatePromotionValidation>
export type ChangePromotionStatusData = z.infer<typeof ChangePromotionStatusValidation>
