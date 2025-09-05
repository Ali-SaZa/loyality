"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import Button from "@/components/formElements/Button";
import Input from "@/components/formElements/Input";
import CountdownTimer from "@/components/utils/CountdownTimer";
import useAuth from "@/hooks/useAuth";
import { authService } from "@/services/auth";
import {
  CheckOtpFormValidation,
  SendOtpFormValidation,
} from "@/validation/auth";

const CheckOtpDefaultValues = {
  code: "",
};

const Auth = () => {
  const { saveUser, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  // Check if user is already authenticated and redirect
  useEffect(() => {
    if (user) {
      console.log("✅ User already authenticated, redirecting to:", redirectTo);
      router.replace(redirectTo);
    }
  }, [user, redirectTo, router]);

  const [loading, setLoading] = useState(false);
  const [loginOtpStep, setLoginOtpStep] = useState(0);
  const [isTimerComplete, setIsTimerComplete] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [isAutoVerifying, setIsAutoVerifying] = useState(false);

  const sendOtpForm = useForm<z.infer<typeof SendOtpFormValidation>>({
    resolver: zodResolver(SendOtpFormValidation),
    defaultValues: {
      mobile: "",
    },
  });

  const checkOtpForm = useForm<z.infer<typeof CheckOtpFormValidation>>({
    resolver: zodResolver(CheckOtpFormValidation),
    defaultValues: {
      ...CheckOtpDefaultValues,
    },
  });

  const redirectToDashboard = () => {
    router.replace(redirectTo);
  };

  const sendLoginOTP = async (data: { mobile: string }) => {
    try {
      console.log("📱 OTP Request - Starting...", { data });
      setLoading(true);

      const res = await authService.requestOtp({
        phoneNumber: data.mobile,
      });

      console.log("✅ OTP Request - Success:", res);

      if (res) {
        setLoginOtpStep(1);
        setIsTimerComplete(false);
        toast.success(res.message || "کد تایید ارسال شد");
      }
    } catch (error) {
      console.error("❌ OTP Request - Error:", error);
      toast.error(error instanceof Error ? error.message : "خطا در ارسال کد");
    } finally {
      setLoading(false);
    }
  };

  const checkLoginOTP = async (data: typeof CheckOtpDefaultValues) => {
    try {
      console.log("🔍 OTP Verification - Starting...", {
        data,
        phoneNumber: sendOtpForm.getValues("mobile"),
      });
      setLoading(true);
      setIsAutoVerifying(true);

      const res = await authService.verifyOtp({
        phoneNumber: sendOtpForm.getValues("mobile"),
        code: data.code,
      });

      console.log("✅ OTP Verification - Success:", res);

      if (res) {
        // Store the token in localStorage and set cookie for middleware
        localStorage.setItem("authToken", res.accessToken);
        localStorage.setItem("user", JSON.stringify(res.user));

        // Set cookie for middleware authentication
        document.cookie = `app_token=${res.accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;

        await saveUser({
          accessToken: res.accessToken,
          refreshToken: res.accessToken, // Using accessToken as refreshToken for now
          user: {
            _id: res.user._id,
            phoneNumber: res.user.phoneNumber,
            firstName: res.user.firstName,
            lastName: res.user.lastName,
            role: res.user.role as any, // Type assertion to match UserRole enum
          },
        });

        redirectToDashboard();
      }
    } catch (error) {
      console.error("❌ OTP Verification - Error:", error);
      toast.error(error instanceof Error ? error.message : "خطا در تایید کد");
    } finally {
      setLoading(false);
      setIsAutoVerifying(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setLoading(true);
      const response = await authService.requestOtp({
        phoneNumber: sendOtpForm.getValues("mobile"),
      });

      if (response) {
        resetTimer();
        toast.success("کد مجددا برای شما ارسال شد");
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  const resetTimer = () => {
    setTimerKey((prevKey) => prevKey + 1);
    setIsTimerComplete(false);
  };

  // Don't render if user is already authenticated
  if (user) {
    return null;
  }

  return (
    <div className="flex flex-col w-full">
      {loginOtpStep === 0 ? (
        <>
          <p>سلام! 👋</p>
          <p>لطفا تلفن همراه خود را وارد کنید</p>
        </>
      ) : (
        <>
          <p>
            کد تایید برای شماره {sendOtpForm.getValues("mobile")} پیامک شد.
          </p>
        </>
      )}
      {loginOtpStep === 0 ? (
        <FormProvider {...sendOtpForm}>
          <form
            key="sendLoginOtp"
            className="mt-4"
            onSubmit={sendOtpForm.handleSubmit(sendLoginOTP)}
          >
            <Input
              className="pb-6"
              generalType="input"
              inputType="tel"
              name="mobile"
              placeholder="09123456789"
              label="تلفن همراه"
            />
            <Button fullWidth isLoading={loading} type="submit">
              <p>ارسال کد فعالسازی</p>
            </Button>
          </form>
        </FormProvider>
      ) : (
        <FormProvider {...checkOtpForm}>
          <form
            key="checkLoginOtp"
            onSubmit={(e) => {
              checkOtpForm.handleSubmit(checkLoginOTP)(e);
            }}
          >
            <Input
              autoFocus
              className="pb-4 items-center"
              generalType="otp"
              inputType="text"
              name="code"
              label="کد تایید"
            />

            {/* Auto-verification indicator */}
            {isAutoVerifying && (
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 text-sm text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>در حال تایید خودکار...</span>
                </div>
              </div>
            )}

            <Button fullWidth isLoading={loading} type="submit">
              <p>تایید</p>
            </Button>
          </form>
        </FormProvider>
      )}

      {loginOtpStep === 1 && (
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
                  time={120000}
                  onComplete={() => setIsTimerComplete(true)}
                />
              </div>
              <Button variant="light" onClick={() => setLoginOtpStep(0)}>
                تغییر شماره تلفن
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Auth;
