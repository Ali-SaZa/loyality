import { z } from "zod";

import { convertPersianToEnglish } from "@/helpers";

// Customer creation validation schema
export const CreateCustomerValidation = z.object({
  phoneNumber: z.string().refine((val) => {
    const convertedValue = convertPersianToEnglish(val);
    return /^09\d{9}$/.test(convertedValue);
  }, "شماره تلفن معتبر نیست"),
  firstName: z.string().min(2, "نام حداقل باید ۲ کاراکتر باشد.").optional(),
  lastName: z
    .string()
    .min(2, "نام خانوادگی حداقل باید ۲ کاراکتر باشد.")
    .optional(),
});

// Type definitions
export type CreateCustomerData = z.infer<typeof CreateCustomerValidation>;
