"use client";
import { z } from "zod";

import { isEmptyObject } from "@/helpers";

const user =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("user") || "null")
    : null;

export const personalInformationFormValidation = z
  .object({
    firstName: z.string().min(2, "نام حداقل باید ۲ کاراکتر باشد."),
    lastName: z.string().min(2, "نام خانوادگی حداقل باید ۲ کاراکتر باشد."),
    password: z
      .string()
      .min(6, "رمز عبور باید حداقل 6 کاراکتر باشد.")
      // .regex(/[a-z]/, 'رمز عبور باید حداقل یک حرف کوچک داشته باشد.')
      // .regex(/[A-Z]/, 'رمز عبور باید حداقل یک حرف بزرگ داشته باشد.')
      // .regex(/\d/, 'رمز عبور باید حداقل یک عدد داشته باشد.')
      .optional(),
    confirmPassword: z
      .string()
      .min(6, "تکرار رمز عبور باید حداقل 6 کاراکتر باشد.")
      // .regex(/[a-z]/, 'تکرار رمز عبور باید حداقل یک حرف کوچک داشته باشد.')
      // .regex(/[A-Z]/, 'تکرار رمز عبور باید حداقل یک حرف بزرگ داشته باشد.')
      // .regex(/\d/, 'تکرار رمز عبور باید حداقل یک عدد داشته باشد.')
      .optional(),
    birthdate: z
      .string({ message: "تاریخ تولد نمی‌تواند مقدار نامعتبر داشته باشد." })
      .optional(),
    sex: z.enum(["S_Male", "S_Female", "S_Not_Specified"]).optional(),
    stateId: z
      .string({
        message: "انتخاب استان محل سکونت الزامی است.",
      })
      .min(1, "انتخاب استان محل سکونت الزامی است.")
      .refine((value) => value !== null, {
        message: "انتخاب استان محل سکونت الزامی است.",
      }),
    cityId: z
      .string({
        message: "انتخاب شهر محل سکونت الزامی است.",
      })
      .min(1, "انتخاب شهر محل سکونت الزامی است.")
      .refine((value) => value !== null, {
        message: "انتخاب شهر محل سکونت الزامی است.",
      }),
    nationalCode: z.string().min(10, "کد ملی معتبر نمیباشد."),
    howMeetUs: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!user || isEmptyObject(user) || !user.firstName) {
      if (!data.password || !data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "رمز عبور و تکرار آن الزامی است.",
          path: ["password"], // خطا در فیلد password نمایش داده می‌شود
        });
      } else if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "رمز عبور جدید و تکرار آن باید یکسان باشند.",
          path: ["confirmPassword"], // خطا در فیلد confirmPassword نمایش داده می‌شود
        });
      }
    }
  });

export const educationalInformationFormValidation = z.object({
  educationStatus: z.string().optional(),
  educationName: z.string().optional(),
  educationLevel: z
    .string({
      message: "انتخاب سطح تحصیلی الزامی است.",
    })
    .min(1, "انتخاب سطح تحصیلی الزامی است.")
    .refine((value) => value !== null, {
      message: "انتخاب سطح تحصیلی الزامی است.",
    }),
  majorId: z
    .string({
      message: "انتخاب رشته الزامی است.",
    })
    .min(1, "انتخاب رشته الزامی است.")
    .refine((value) => value !== null, {
      message: "انتخاب رشته الزامی است.",
    }),
  educationStartDate: z.string().optional(),
  educationEndDate: z.string().optional(),
  workHistory: z.string().optional(),
});
