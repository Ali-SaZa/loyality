"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input as NextUIInput } from "@heroui/input";
import Input from "@/components/formElements/Input";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { StoreSelfUpdateValidation, StoreSelfUpdateData } from "@/validation/storeSelfUpdate";
import { getCurrentStore, updateCurrentStore, Store } from "@/services/stores";
import useAlertModal from "@/hooks/useAlertModal";
import useLoading from "@/hooks/useLoading";
import SecurityIcon from "@/components/icons/SecurityIcon";

const StoreInformationPage = () => {
  const router = useRouter();
  const { showAlert } = useAlertModal();
  const { setLoading } = useLoading();
  const [store, setStore] = useState<Store | null>(null);

  const methods = useForm<StoreSelfUpdateData>({
    resolver: zodResolver(StoreSelfUpdateValidation),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = methods;

  // Load store information
  useEffect(() => {
    const loadStore = async () => {
      try {
        setLoading(true);
        const storeData = await getCurrentStore();
        setStore(storeData);
        
        // Set form values
        reset({
          address: storeData.address,
          logoUrl: storeData.logoUrl || "",
          description: storeData.description || "",
          socialLinks: storeData.socialLinks || {
            website: "",
            instagram: "",
            telegram: "",
          },
          workingHours: storeData.workingHours || {
            open: "09:00",
            close: "21:00",
          },
        });
      } catch (error) {
        showAlert("خطا در بارگذاری اطلاعات فروشگاه");
      } finally {
        setLoading(false);
      }
    };

    loadStore();
  }, [reset, showAlert, setLoading]);

  const onSubmit = async (data: StoreSelfUpdateData) => {
    try {
      setLoading(true);
      
      // Clean up empty strings
      const cleanedData = {
        ...data,
        logoUrl: data.logoUrl || undefined,
        description: data.description || undefined,
        socialLinks: data.socialLinks ? {
          website: data.socialLinks.website || undefined,
          instagram: data.socialLinks.instagram || undefined,
          telegram: data.socialLinks.telegram || undefined,
        } : undefined,
      };

      const updatedStore = await updateCurrentStore(cleanedData);
      setStore(updatedStore);
      
      showAlert("اطلاعات فروشگاه با موفقیت به‌روزرسانی شد");
    } catch (error) {
      showAlert("خطا در به‌روزرسانی اطلاعات فروشگاه");
    } finally {
      setLoading(false);
    }
  };

  if (!store) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-text-light">در حال بارگذاری...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <SecurityIcon className="size-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-text-dark">اطلاعات فروشگاه</h1>
          <p className="text-text-light">ویرایش اطلاعات فروشگاه</p>
        </div>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Store Basic Information */}
        <Card className="border-1">
          <CardHeader className="pb-3">
            <h3 className="text-lg font-semibold text-text-dark">
              اطلاعات اصلی فروشگاه
            </h3>
          </CardHeader>
          <CardBody className="space-y-4">
            {/* Store Name (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">
                نام فروشگاه
              </label>
              <NextUIInput
                value={store.name}
                disabled
                className="bg-background-100"
                placeholder="نام فروشگاه"
              />
              <p className="text-xs text-text-light mt-1">
                نام فروشگاه توسط مدیر سیستم قابل تغییر است
              </p>
            </div>

            {/* Phone Number (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">
                شماره تلفن
              </label>
              <NextUIInput
                value={store.phoneNumber}
                disabled
                className="bg-background-100"
                placeholder="شماره تلفن"
              />
              <p className="text-xs text-text-light mt-1">
                شماره تلفن توسط مدیر سیستم قابل تغییر است
              </p>
            </div>

            {/* Logo URL */}
            <Input
              generalType="input"
              name="logoUrl"
              label="آدرس لوگو"
              placeholder="https://example.com/logo.jpg"
            />

            {/* Description */}
            <Input
              generalType="textarea"
              name="description"
              label="توضیحات فروشگاه"
              placeholder="توضیحات فروشگاه..."
            />
          </CardBody>
        </Card>

        {/* Address Information */}
        <Card className="border-1">
          <CardHeader className="pb-3">
            <h3 className="text-lg font-semibold text-text-dark">
              اطلاعات آدرس
            </h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Province */}
              <Input
                generalType="input"
                name="address.province"
                label="استان"
                placeholder="تهران"
              />

              {/* City */}
              <Input
                generalType="input"
                name="address.city"
                label="شهر"
                placeholder="تهران"
              />
            </div>

            {/* Full Address */}
            <Input
              generalType="textarea"
              name="address.fullAddress"
              label="آدرس کامل"
              placeholder="آدرس کامل فروشگاه..."
            />
          </CardBody>
        </Card>

        {/* Social Links */}
        <Card className="border-1">
          <CardHeader className="pb-3">
            <h3 className="text-lg font-semibold text-text-dark">
              لینک‌های شبکه‌های اجتماعی
            </h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Website */}
              <Input
                generalType="input"
                name="socialLinks.website"
                label="وب‌سایت"
                placeholder="https://example.com"
              />

              {/* Instagram */}
              <Input
                generalType="input"
                name="socialLinks.instagram"
                label="اینستاگرام"
                placeholder="@username"
              />

              {/* Telegram */}
              <Input
                generalType="input"
                name="socialLinks.telegram"
                label="تلگرام"
                placeholder="@username"
              />
            </div>
          </CardBody>
        </Card>

        {/* Working Hours */}
        <Card className="border-1">
          <CardHeader className="pb-3">
            <h3 className="text-lg font-semibold text-text-dark">
              ساعات کاری
            </h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Opening Time */}
              <Input
                generalType="input"
                name="workingHours.open"
                label="ساعت بازگشایی"
                placeholder="09:00"
              />

              {/* Closing Time */}
              <Input
                generalType="input"
                name="workingHours.close"
                label="ساعت بسته شدن"
                placeholder="21:00"
              />
            </div>
          </CardBody>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            variant="light"
            onPress={() => router.back()}
            className="px-6"
          >
            انصراف
          </Button>
          <Button
            type="submit"
            color="primary"
            className="px-6"
          >
            ذخیره تغییرات
          </Button>
        </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default StoreInformationPage;
