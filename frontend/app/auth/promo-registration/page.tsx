"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import Button from "@/components/formElements/Button";
import Input from "@/components/formElements/Input";
import LogoContainer from "@/components/ui/ObsLogo";
import CountdownTimer from "@/components/utils/CountdownTimer";
import { promoCodeRegistrationService } from "@/services/promoCodeRegistration";
import {
  PromoCodeRegistrationFormValidation,
  PromoCodeVerificationFormValidation,
} from "@/validation/promoCodeRegistration";

const PromoCodeRegistration = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [registrationStep, setRegistrationStep] = useState(0); // 0: Enter details, 1: Verify OTP, 2: Success
  const [isTimerComplete, setIsTimerComplete] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [registrationData, setRegistrationData] = useState<{
    phoneNumber: string;
    promoCode: string;
  } | null>(null);
  const [successData, setSuccessData] = useState<any>(null);

  const registrationForm = useForm<
    z.infer<typeof PromoCodeRegistrationFormValidation>
  >({
    resolver: zodResolver(PromoCodeRegistrationFormValidation),
    defaultValues: {
      phoneNumber: "",
      promoCode: "",
    },
  });

  const verificationForm = useForm<
    z.infer<typeof PromoCodeVerificationFormValidation>
  >({
    resolver: zodResolver(PromoCodeVerificationFormValidation),
    defaultValues: {
      phoneNumber: "",
      promoCode: "",
      otpCode: "",
    },
  });

  const sendPromoRegistrationOTP = async (data: {
    phoneNumber: string;
    promoCode: string;
  }) => {
    try {
      console.log("📱 Promo Registration OTP Request - Starting...", { data });
      setLoading(true);

      const res =
        await promoCodeRegistrationService.sendOtpForPromoRegistration({
          phoneNumber: data.phoneNumber,
          promoCode: data.promoCode,
        });

      console.log("✅ Promo Registration OTP Request - Success:", res);

      if (res) {
        setRegistrationData({
          phoneNumber: data.phoneNumber,
          promoCode: data.promoCode,
        });
        verificationForm.setValue("phoneNumber", data.phoneNumber);
        verificationForm.setValue("promoCode", data.promoCode);
        setRegistrationStep(1);
        setIsTimerComplete(false);
        toast.success(res.message || "کد تایید ارسال شد");
      }
    } catch (error) {
      console.error("❌ Promo Registration OTP Request - Error:", error);
      toast.error(error instanceof Error ? error.message : "خطا در ارسال کد");
    } finally {
      setLoading(false);
    }
  };

  const verifyPromoRegistrationOTP = async (data: { otpCode: string }) => {
    try {
      console.log("🔍 Promo Registration OTP Verification - Starting...", {
        data,
        registrationData,
      });
      setLoading(true);

      if (!registrationData) {
        throw new Error("اطلاعات ثبت نام یافت نشد");
      }

      const res = await promoCodeRegistrationService.verifyPromoRegistration({
        phoneNumber: registrationData.phoneNumber,
        promoCode: registrationData.promoCode,
        otpCode: data.otpCode,
      });

      console.log("✅ Promo Registration OTP Verification - Success:", res);

      if (res) {
        setSuccessData(res);
        setRegistrationStep(2);
        toast.success(res.message || "تبریک! شما با موفقیت ثبت نام کردید");
      }
    } catch (error) {
      console.error("❌ Promo Registration OTP Verification - Error:", error);
      toast.error(error instanceof Error ? error.message : "خطا در تایید کد");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setLoading(true);
      if (!registrationData) {
        throw new Error("اطلاعات ثبت نام یافت نشد");
      }

      const response =
        await promoCodeRegistrationService.sendOtpForPromoRegistration({
          phoneNumber: registrationData.phoneNumber,
          promoCode: registrationData.promoCode,
        });

      if (response) {
        resetTimer();
        toast.success("کد مجددا برای شما ارسال شد");
      }
    } catch (error) {
      console.log("error", error);
      toast.error("خطا در ارسال مجدد کد");
    } finally {
      setLoading(false);
    }
  };

  const resetTimer = () => {
    setTimerKey((prevKey) => prevKey + 1);
    setIsTimerComplete(false);
  };

  const handleBackToStart = () => {
    setRegistrationStep(0);
    setRegistrationData(null);
    setSuccessData(null);
    registrationForm.reset();
    verificationForm.reset();
  };

  const handleGoToDashboard = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col w-full">
      {registrationStep === 0 && (
        <>
          <p>ثبت نام با کد پروموشن 🎉</p>
          <p>لطفا تلفن همراه و کد پروموشن خود را وارد کنید</p>
        </>
      )}

      {registrationStep === 1 && (
        <>
          <p>
            کد تایید برای تلفن همراه {registrationData?.phoneNumber} پیامک شد.
          </p>
          <p className="text-sm text-text-light-25 mt-2">
            کد پروموشن: {registrationData?.promoCode}
          </p>
        </>
      )}

      {registrationStep === 2 && successData && (
        <>
          <div className="text-center">
            <div className="text-4xl mb-4">🎉</div>
            <p className="text-green-600 font-semibold">
              {successData.message}
            </p>
          </div>
        </>
      )}

      {registrationStep === 0 && (
        <FormProvider {...registrationForm}>
          <form
            key="promoRegistration"
            className="mt-4"
            onSubmit={registrationForm.handleSubmit(sendPromoRegistrationOTP)}
          >
            <Input
              generalType="input"
              inputType="tel"
              name="phoneNumber"
              placeholder="09123456789"
              label="تلفن همراه"
            />
            <Input
              className="py-4"
              generalType="input"
              inputType="text"
              name="promoCode"
              placeholder="T123456"
              label="کد پروموشن"
            />
            <Button fullWidth isLoading={loading} type="submit">
              <p>ارسال کد تایید</p>
            </Button>
          </form>
        </FormProvider>
      )}

      {registrationStep === 1 && (
        <FormProvider {...verificationForm}>
          <form
            key="promoVerification"
            className="mt-4"
            onSubmit={verificationForm.handleSubmit(verifyPromoRegistrationOTP)}
          >
            <Input
              autoFocus
              className="mt-6 mb-6 items-center"
              generalType="otp"
              inputType="text"
              name="otpCode"
              label="کد تایید"
            />

            <Button fullWidth isLoading={loading} type="submit">
              <p>تایید و ثبت نام</p>
            </Button>
          </form>
        </FormProvider>
      )}

      {registrationStep === 2 && successData && (
        <div className="mt-6 space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">اطلاعات فروشگاه</h3>
            <p className="text-sm">
              <strong>نام:</strong> {successData.store.name}
            </p>
            <p className="text-sm">
              <strong>آدرس:</strong> {successData.store.address.fullAddress}
            </p>
            {successData.store.description && (
              <p className="text-sm">
                <strong>توضیحات:</strong> {successData.store.description}
              </p>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">اطلاعات پیشنهاد</h3>
            <p className="text-sm">
              <strong>عنوان:</strong> {successData.promotion.title}
            </p>
            <p className="text-sm">
              <strong>قیمت:</strong>{" "}
              {successData.promotion.price.toLocaleString()} تومان
            </p>
            <p className="text-sm">
              <strong>امتیاز:</strong> {successData.promotion.points} امتیاز
            </p>
            {successData.promotion.description && (
              <p className="text-sm">
                <strong>توضیحات:</strong> {successData.promotion.description}
              </p>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">کد پروموشن شما</h3>
            <p className="text-sm">
              <strong>کد:</strong> {successData.promoCode.code}
            </p>
            <p className="text-sm">
              <strong>وضعیت:</strong>{" "}
              {successData.promoCode.status === "unused"
                ? "آماده استفاده"
                : successData.promoCode.status}
            </p>
          </div>

          <Button fullWidth onClick={handleGoToDashboard}>
            <p>برو به داشبورد</p>
          </Button>
        </div>
      )}

      {registrationStep === 1 && (
        <div className="text-sm text-text-light-25 mx-auto">
          {isTimerComplete ? (
            <Button
              color="secondary"
              variant="light"
              onClick={handleResendCode}
            >
              ارسال مجدد کد
            </Button>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div>
                زمان باقی مانده تا دریافت مجدد کد :{" "}
                <CountdownTimer
                  key={timerKey}
                  time={300000} // 5 minutes
                  onComplete={() => setIsTimerComplete(true)}
                />
              </div>
              <Button variant="light" onClick={handleBackToStart}>
                تغییر اطلاعات
              </Button>
            </div>
          )}
        </div>
      )}

      {registrationStep === 2 && (
        <div className="text-sm text-text-light-25 mx-auto mt-4">
          <Button variant="light" onClick={handleBackToStart}>
            ثبت نام جدید
          </Button>
        </div>
      )}
    </div>
  );
};

export default PromoCodeRegistration;
