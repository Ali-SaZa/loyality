"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import Button from "@/components/formElements/Button";
import Input from "@/components/formElements/Input";
import useAuth from "@/hooks/useAuth";
import { promoCodeRegistrationService } from "@/services/promoCodeRegistration";
import { UsePromotionFormValidation } from "@/validation/usePromotion";
import { Card, CardBody } from "@heroui/card";
import LabelContent from "@/components/formElements/LabelContent";
import { useRouter } from "next/navigation";

const UsePromotion = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);

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

      // Set success data to show promotion details
      setSuccessData(res);

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

      {successData &&  (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Card className="col-span-1">
            <CardBody className="text-right">
              <h3 className="font-semibold mb-2">اطلاعات فروشگاه</h3>
              <LabelContent label="نام" value={successData.store.name} />
              <LabelContent
                label="آدرس"
                value={successData.store.address.fullAddress}
              />
              <LabelContent
                label="توضیحات"
                value={successData.store.description}
              />
            </CardBody>
          </Card>

          <Card className="col-span-1">
            <CardBody className="text-right">
              <h3 className="font-semibold mb-2">اطلاعات پروموشن</h3>
              <LabelContent label="عنوان" value={successData.promotion.title} />
              <LabelContent
                label="قیمت"
                value={successData.promotion.price.toLocaleString()}
              />
              <LabelContent
                label="امتیاز"
                value={successData.promotion.points.toLocaleString()}
              />
              <LabelContent
                label="یادداشت"
                value={successData.notes}
              />
            </CardBody>
          </Card>
          </div>
        </>
      )}

    </div>
  );
};

export default UsePromotion;
