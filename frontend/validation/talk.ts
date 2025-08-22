import { z } from 'zod'

export const TalkFormValidation = z.object({
  message: z.string().min(1, 'نوشتن سوال الزامی است.'),
})
