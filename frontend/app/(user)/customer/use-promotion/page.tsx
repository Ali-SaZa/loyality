"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import Button from "@/components/formElements/Button";
import Input from "@/components/formElements/Input";
import useAuth from "@/hooks/useAuth";
import { promoCodeRegistrationService } from "@/services/promoCodeRegistration";
import { UsePromotionFormValidation } from "@/validation/usePromotion";

const UsePromotion = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof UsePromotionFormValidation>>({
    resolver: zodResolver(UsePromotionFormValidation),
    defaultValues: {
      promoCode: "",
    },
  });

  const handleUsePromotion = async (data: { promoCode: string }) => {
    try {
      console.log("🎟️ Use Promotion - Starting...", {
        data,
        phoneNumber: user?.phoneNumber,
      });
      setLoading(true);

      if (!user?.phoneNumber) {
        throw new Error("شماره تلفن کاربر یافت نشد");
      }

      const res = await promoCodeRegistrationService.registerPromoCode({
        code: data.promoCode,
        phoneNumber: user.phoneNumber,
      });

      console.log("✅ Use Promotion - Success:", res);
      toast.success(res.message || "کد پروموشن با موفقیت ثبت شد!");

      // Reset form after success
      form.reset();
    } catch (error) {
      console.error("❌ Use Promotion - Error:", error);
      toast.error(
        error instanceof Error ? error.message : "خطا در ثبت کد پروموشن"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-text-dark mb-2">
          استفاده از کد پروموشن 🎟️
        </h1>
        <p className="text-text-light-25">
          کد پروموشن خود را وارد کنید تا از آن استفاده کنید
        </p>
      </div>

      <FormProvider {...form}>
        <form
          className="space-y-6"
          onSubmit={form.handleSubmit(handleUsePromotion)}
        >
          <Input
            generalType="input"
            inputType="text"
            name="promoCode"
            placeholder="T123456"
            label="کد پروموشن"
            required
            autoFocus
          />

          <Button fullWidth isLoading={loading} type="submit" size="lg">
            <p>تایید و ثبت کد پروموشن</p>
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default UsePromotion;
