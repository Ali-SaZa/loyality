import { z } from "zod";

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

// Store self-update validation (restricted fields only)
export const StoreSelfUpdateValidation = z.object({
  storeNameDisplay: z.string().optional(),
  phoneNumberDisplay: z.string().optional(),
  address: StoreAddressValidation.optional(),
  logoUrl: z.string().url("آدرس لوگو معتبر نیست").optional().or(z.literal("")),
  description: z
    .string()
    .max(500, "توضیحات حداکثر ۵۰۰ کاراکتر باشد.")
    .optional(),
  socialLinks: SocialLinksValidation,
  workingHours: WorkingHoursValidation,
});

// Type definitions
export type StoreSelfUpdateData = z.infer<typeof StoreSelfUpdateValidation>;
