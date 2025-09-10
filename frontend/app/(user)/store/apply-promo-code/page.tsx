"use client";
import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import PromoCodeIcon from "@/components/icons/PromoCodeIcon";
import UserIcon from "@/components/icons/UserIcon";
import CheckIcon from "@/components/icons/CheckIcon";
import Input from "@/components/formElements/Input";
import Button from "@/components/formElements/Button";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import { promoCodesService, PromoCode } from "@/services/promo-codes";
import { getCurrentStore } from "@/services/stores";
import { Store } from "@/services/stores";
import {
  ApplyPromoCodeValidation,
  ApplyPromoCodeData,
} from "@/validation/promoCode";
import useAuth from "@/hooks/useAuth";
import useLoading from "@/hooks/useLoading";
import toast from "react-hot-toast";

const ApplyPromoCodePage = () => {
  const { user } = useAuth();
  const { setLoading } = useLoading();

  const [customerPromoCodes, setCustomerPromoCodes] = useState<PromoCode[]>([]);
  const [selectedPromoCode, setSelectedPromoCode] = useState<PromoCode | null>(
    null,
  );
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState<string>("");
  const [isLoadingPromoCodes, setIsLoadingPromoCodes] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [currentStore, setCurrentStore] = useState<Store | null>(null);

  const form = useForm<ApplyPromoCodeData>({
    resolver: zodResolver(ApplyPromoCodeValidation),
    defaultValues: {
      phoneNumber: "",
    },
  });

  const watchedPhoneNumber = form.watch("phoneNumber");

  useEffect(() => {
    fetchCurrentStore();
  }, []);

  const fetchCurrentStore = async () => {
    try {
      if (user?.role === "store") {
        const store = await getCurrentStore();
        setCurrentStore(store);
      }
    } catch (err) {
      console.error("Error fetching current store:", err);
    }
  };

  const onSubmit = async (data: ApplyPromoCodeData) => {
    try {
      setIsLoadingPromoCodes(true);
      setCustomerPhoneNumber(data.phoneNumber);

      // Get customer's unused promo codes for this store
      const response = await promoCodesService.getUserPromoCodes({
        phoneNumber: data.phoneNumber,
        storeId: currentStore?.id,
      });

      // Filter only unused promo codes
      const unusedPromoCodes = response.data.filter(
        (code) => code.status === "unused",
      );
      setCustomerPromoCodes(unusedPromoCodes);

      // Show the message from the API
      if (response.message) {
        if (unusedPromoCodes.length === 0) {
          toast.error(response.message);
        } else {
          toast.success(response.message);
        }
      }
    } catch (error) {
      console.error("❌ Get Customer Promo Codes - Error:", error);

      // Handle specific error cases
      if (error instanceof Error) {
        if (error.message.includes("User not found")) {
          toast.error("مشتری با این شماره تلفن یافت نشد");
        } else if (error.message.includes("Forbidden")) {
          toast.error("شما مجوز دسترسی به این اطلاعات را ندارید");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("خطا در دریافت کدهای تخفیف مشتری");
      }
    } finally {
      setIsLoadingPromoCodes(false);
    }
  };

  const handleUsePromoCode = (promoCode: PromoCode) => {
    setSelectedPromoCode(promoCode);
    setIsConfirmModalOpen(true);
  };

  const confirmUsePromoCode = async () => {
    if (!selectedPromoCode) return;

    try {
      setLoading(true);

      await promoCodesService.changePromoCodeStatus(selectedPromoCode.id, {
        status: "used" as "used",
        userId: selectedPromoCode.userId,
      });

      toast.success(`کد تخفیف ${selectedPromoCode.code} با موفقیت استفاده شد`);

      // Refresh the promo codes list
      const response = await promoCodesService.getUserPromoCodes({
        phoneNumber: customerPhoneNumber,
        storeId: currentStore?.id,
      });

      const unusedPromoCodes = response.data.filter(
        (code) => code.status === "unused",
      );
      setCustomerPromoCodes(unusedPromoCodes);

      setIsConfirmModalOpen(false);
      setSelectedPromoCode(null);
    } catch (error) {
      console.error("❌ Use Promo Code - Error:", error);

      // Handle specific error cases
      if (error instanceof Error) {
        if (error.message.includes("already been used")) {
          toast.error("این کد تخفیف قبلاً استفاده شده است");
        } else if (error.message.includes("not registered")) {
          toast.error("این کد تخفیف به مشتری اختصاص نیافته است");
        } else if (error.message.includes("Transaction already exists")) {
          toast.error("تراکنش برای این کد تخفیف قبلاً ثبت شده است");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("خطا در استفاده از کد تخفیف");
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    form.reset();
    setCustomerPromoCodes([]);
    setCustomerPhoneNumber("");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <PromoCodeIcon className="size-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-text-dark">اعمال کد تخفیف</h1>
          <p className="text-text-light">
            جستجو و استفاده از کدهای تخفیف مشتریان
          </p>
        </div>
      </div>

      {/* Phone Number Input Form */}
      <Card className="border-1">
        <CardHeader className="pb-3">
          <h3 className="text-lg font-semibold text-text-dark">جستجوی مشتری</h3>
        </CardHeader>
        <CardBody>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Input
                    generalType="input"
                    name="phoneNumber"
                    label="شماره تلفن مشتری"
                    placeholder="09123456789"
                    inputType="tel"
                    iconStart={
                      <UserIcon className="size-5 text-text-light-25" />
                    }
                    description="شماره تلفن مشتری را وارد کنید تا کدهای تخفیف استفاده نشده او نمایش داده شود"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  color="primary"
                  isLoading={isLoadingPromoCodes}
                  disabled={
                    !watchedPhoneNumber || watchedPhoneNumber.length !== 11
                  }
                >
                  جستجو
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardBody>
      </Card>

      {/* Customer Promo Codes List */}
      {customerPromoCodes.length > 0 && (
        <Card className="border-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text-dark">
                کدهای تخفیف استفاده نشده مشتری
              </h3>
              <Chip color="success" variant="flat" size="sm">
                {customerPromoCodes.length} کد
              </Chip>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {customerPromoCodes.map((promoCode) => (
                <div
                  key={promoCode.id}
                  className="flex items-center justify-between p-4 bg-background-50 rounded-lg border border-divider"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Chip color="primary" variant="flat" size="sm">
                        {promoCode.code}
                      </Chip>
                      <span className="text-sm text-text-light">
                        {promoCode.promotion?.title}
                      </span>
                    </div>
                    <div className="text-sm text-text-light">
                      <p>
                        مبلغ: {promoCode.promotion?.price?.toLocaleString()}{" "}
                        تومان
                      </p>
                      <p>امتیاز: {promoCode.promotion?.points} امتیاز</p>
                      {promoCode.notes && <p>یادداشت: {promoCode.notes}</p>}
                    </div>
                  </div>
                  <Button
                    color="success"
                    variant="flat"
                    size="sm"
                    onClick={() => handleUsePromoCode(promoCode)}
                  >
                    استفاده
                  </Button>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Reset Button */}
      {customerPromoCodes.length > 0 && (
        <div className="flex justify-center">
          <Button color="default" variant="light" onClick={resetForm}>
            جستجوی مشتری جدید
          </Button>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onOpenChange={setIsConfirmModalOpen}
        onConfirm={confirmUsePromoCode}
        title="تأیید استفاده از کد تخفیف"
        message="آیا مطمئن هستید که می‌خواهید وضعیت این کد تخفیف را تغییر دهید؟"
        acceptBtnText="تأیید استفاده"
        rejectBtnText="انصراف"
        acceptBtnColor="success"
        icon={<CheckIcon />}
        iconBgColor="bg-success-50"
        iconTextColor="text-success"
      >
        {selectedPromoCode && (
          <div className="p-4 bg-background-50 rounded-lg border border-divider">
            <div className="flex items-center gap-2 mb-3">
              <Chip color="primary" variant="flat" size="sm">
                {selectedPromoCode.code}
              </Chip>
              <span className="font-medium text-text-dark">
                {selectedPromoCode.promotion?.title}
              </span>
            </div>
            <div className="text-sm text-text-light space-y-1">
              <p>
                مبلغ: {selectedPromoCode.promotion?.price?.toLocaleString()}{" "}
                تومان
              </p>
              <p>امتیاز: {selectedPromoCode.promotion?.points} امتیاز</p>
              {selectedPromoCode.notes && (
                <p>یادداشت: {selectedPromoCode.notes}</p>
              )}
            </div>
          </div>
        )}
      </ConfirmationModal>
    </div>
  );
};

export default ApplyPromoCodePage;
