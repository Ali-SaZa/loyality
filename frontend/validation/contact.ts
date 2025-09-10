import { z } from "zod";

export const ContactFormValidation = z.object({
  fullName: z.string().min(1, "نوشتن نام و نام خانوادگی الزامی است."),
  email: z
    .string()
    .min(1, "نوشتن ایمیل الزامی است.")
    .email("فرمت ایمیل نامعتبر است."),
  description: z.string().min(1, "نوشتن توضیحات الزامی است."),
});
