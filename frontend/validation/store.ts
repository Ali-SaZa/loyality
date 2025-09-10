import { z } from "zod";

import { convertPersianToEnglish } from "@/helpers";

// Address validation schema
const StoreAddressValidation = z.object({
  province: z.string().min(2, "استان حداقل باید ۲ کاراکتر باشد."),
  city: z.string().min(2, "شهر حداقل باید ۲ کاراکتر باشد."),
  fullAddress: z.string().min(10, "آدرس کامل حداقل باید ۱۰ کاراکتر باشد."),
});

// Social links validation schema
const SocialLinksValidation = z
  .object({
    website: z
      .string()
      .url("آدرس وب‌سایت معتبر نیست")
      .optional()
      .or(z.literal("")),
    instagram: z.string().optional(),
    telegram: z.string().optional(),
  })
  .optional();

// Working hours validation schema
const WorkingHoursValidation = z
  .object({
    open: z
      .string()
      .regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "ساعت بازگشایی معتبر نیست (فرمت: HH:MM)",
      ),
    close: z
      .string()
      .regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "ساعت بسته شدن معتبر نیست (فرمت: HH:MM)",
      ),
  })
  .optional();

// Base validation schema without userId
const StoreBaseValidation = z.object({
  name: z
    .string()
    .min(2, "نام فروشگاه حداقل باید ۲ کاراکتر باشد.")
    .max(100, "نام فروشگاه حداکثر ۱۰۰ کاراکتر باشد."),
  phoneNumber: z.string().refine((val) => {
    const convertedValue = convertPersianToEnglish(val);
    return /^09\d{9}$/.test(convertedValue);
  }, "شماره تلفن معتبر نیست"),
  address: StoreAddressValidation,
  promotions: z.array(z.string()).optional(),
  planExpiryDate: z.string().optional(),
  status: z.enum(["active", "pending", "deleted", "suspended"]).optional(),
  logoUrl: z.string().url("آدرس لوگو معتبر نیست").optional().or(z.literal("")),
  description: z
    .string()
    .max(500, "توضیحات حداکثر ۵۰۰ کاراکتر باشد.")
    .optional(),
  socialLinks: SocialLinksValidation,
  workingHours: WorkingHoursValidation,
});

// User information validation (same as user registration)
const UserInfoValidation = z
  .object({
    firstName: z.string().min(2, "نام حداقل باید ۲ کاراکتر باشد."),
    lastName: z.string().min(2, "نام خانوادگی حداقل باید ۲ کاراکتر باشد."),
    password: z.string().min(6, "رمز عبور باید حداقل 6 کاراکتر باشد."),
    confirmPassword: z
      .string()
      .min(6, "تکرار رمز عبور باید حداقل 6 کاراکتر باشد."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تکرار آن باید یکسان باشند.",
    path: ["confirmPassword"],
  });

// Create validation with userId (for new stores)
export const StoreFormValidation = StoreBaseValidation.extend({
  userId: z.string().min(1, "شناسه کاربر الزامی است"),
});

// Create validation without userId (for updates)
export const StoreUpdateValidation = StoreBaseValidation;

// Create validation for store with user information
export const StoreWithUserValidation = z.object({
  user: UserInfoValidation,
  store: StoreBaseValidation,
});

// Type definitions
export type StoreFormData = z.infer<typeof StoreFormValidation>;
export type StoreUpdateData = z.infer<typeof StoreUpdateValidation>;
export type StoreWithUserData = z.infer<typeof StoreWithUserValidation>;
