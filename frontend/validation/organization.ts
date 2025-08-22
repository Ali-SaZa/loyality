import { z } from 'zod'

import { convertPersianToEnglish } from '@/helpers'

export const organizationFormValidation = z.object({
  fullName: z.string().min(1, 'نوشتن نام و نام خانوادگی الزامی است.'),
  jobTitle: z.string().min(1, 'نوشتن عنوان شغل الزامی است.'),
  organizationName: z.string().min(1, 'نوشتن نام شرکت الزامی است.'),
  email: z.union([
    z.string().email('فرمت ایمیل نامعتبر است.'), // ایمیل معتبر
    z.string().length(0), // رشته خالی
  ]),
  mobile: z.string().refine((val) => {
    const convertedValue = convertPersianToEnglish(val)

    return /^09\d{9}$/.test(convertedValue)
  }, 'شماره موبایل معتبر نیست'),
  howMeetUs: z.string().optional(),
  employeeCount: z.number().optional(),
  industryId: z
    .string({
      required_error: 'انتخاب تخصص الزامی است.',
      invalid_type_error: 'تخصص نمی‌تواند مقدار نامعتبر داشته باشد.',
    })
    .min(1, 'انتخاب تخصص الزامی است.')
    .refine((value) => value !== null, {
      message: 'انتخاب تخصص الزامی است.',
    }),
  description: z.string().optional(),
})
