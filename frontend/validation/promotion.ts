import { z } from "zod";

// Basic promotion validation for step 1
export const BasicPromotionValidation = z.object({
  storeId: z.string().min(1, "شناسه فروشگاه الزامی است"),
  title: z
    .string()
    .min(2, "عنوان تبلیغ حداقل باید ۲ کاراکتر باشد")
    .max(100, "عنوان تبلیغ حداکثر ۱۰۰ کاراکتر باشد"),
  description: z
    .string()
    .max(500, "توضیحات حداکثر ۵۰۰ کاراکتر باشد")
    .optional(),
});

// Promotion validation schemas
export const CreatePromotionValidation = z.object({
  storeId: z.string().min(1, "شناسه فروشگاه الزامی است"),
  title: z
    .string()
    .min(2, "عنوان تبلیغ حداقل باید ۲ کاراکتر باشد")
    .max(100, "عنوان تبلیغ حداکثر ۱۰۰ کاراکتر باشد"),
  description: z
    .string()
    .max(500, "توضیحات حداکثر ۵۰۰ کاراکتر باشد")
    .optional(),
  price: z.number().min(1, "مبلغ خرید باید حداقل ۱ تومان باشد"),
  points: z.number().min(1, "امتیاز باید حداقل ۱ باشد"),
});

export const UpdatePromotionValidation = z.object({
  title: z
    .string()
    .min(2, "عنوان تبلیغ حداقل باید ۲ کاراکتر باشد")
    .max(100, "عنوان تبلیغ حداکثر ۱۰۰ کاراکتر باشد")
    .optional(),
  description: z
    .string()
    .max(500, "توضیحات حداکثر ۵۰۰ کاراکتر باشد")
    .optional(),
  price: z.number().min(1, "مبلغ خرید باید حداقل ۱ تومان باشد").optional(),
  points: z.number().min(1, "امتیاز باید حداقل ۱ باشد").optional(),
  status: z.enum(["active", "inactive", "deleted", "expired"]).optional(),
});

export const ChangePromotionStatusValidation = z.object({
  status: z
    .enum(["active", "inactive", "deleted", "expired"])
    .refine((val) => val !== undefined, { message: "وضعیت تبلیغ الزامی است" }),
});

// Type definitions
export type CreatePromotionData = z.infer<typeof CreatePromotionValidation>;
export type UpdatePromotionData = z.infer<typeof UpdatePromotionValidation>;
export type ChangePromotionStatusData = z.infer<
  typeof ChangePromotionStatusValidation
>;
