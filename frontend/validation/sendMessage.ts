import { z } from 'zod'

export const SendMessageValidation = z.object({
  text: z
    .string()
    .min(1, 'نوشتن پیام الزامی است.')
    .max(280, 'پیام نمی‌تواند بیش از ۲۸۰ کاراکتر باشد')
})

// Type definitions
export type SendMessageData = z.infer<typeof SendMessageValidation>
