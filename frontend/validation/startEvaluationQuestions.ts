import { z } from 'zod'

export const jobCategoryIdFormValidation = z.object({
  jobCategoryId: z.string(),
})

export const educationEndDateFormValidation = z.object({
  educationEndDate: z.string().max(4, 'سال باید 4 رقمی باشد'),
})

export const countryIdFormValidation = z.object({
  countryId: z.string(),
})

export const skillIdFormValidation = z.object({
  skillId: z.string(),
})
