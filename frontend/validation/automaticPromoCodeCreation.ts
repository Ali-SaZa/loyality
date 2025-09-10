import { z } from "zod";

export const AutomaticPromoCodeCreationValidation = z.object({
  prefix: z
    .string()
    .min(1, "پیشوند الزامی است")
    .regex(
      /^[A-Za-z0-9]*$/,
      "پیشوند باید شامل حروف انگلیسی و اعداد باشد (بدون فاصله)",
    ),
  count: z
    .number()
    .min(1, "تعداد حداقل ۱ باشد")
    .max(1000, "تعداد حداکثر ۱۰۰۰ باشد"),
});

export type AutomaticPromoCodeCreationData = z.infer<
  typeof AutomaticPromoCodeCreationValidation
>;
