"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@/components/formElements/Input";
import { Textarea } from "@/components/formElements/Textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { StoreSelfUpdateValidation, StoreSelfUpdateData } from "@/validation/store";
import { getCurrentStore, updateCurrentStore, Store } from "@/services/stores";
import { useAlertModal } from "@/hooks/useAlertModal";
import { useLoading } from "@/hooks/useLoading";
import SecurityIcon from "@/components/icons/SecurityIcon";

const StoreInformationPage = () => {
  const router = useRouter();
  const { showAlert } = useAlertModal();
  const { setLoading } = useLoading();
  const [store, setStore] = useState<Store | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<StoreSelfUpdateData>({
    resolver: zodResolver(StoreSelfUpdateValidation),
  });

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
        showAlert({
          title: "خطا",
          message: "خطا در بارگذاری اطلاعات فروشگاه",
          type: "error",
        });
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
      
      showAlert({
        title: "موفق",
        message: "اطلاعات فروشگاه با موفقیت به‌روزرسانی شد",
        type: "success",
      });
    } catch (error) {
      showAlert({
        title: "خطا",
        message: "خطا در به‌روزرسانی اطلاعات فروشگاه",
        type: "error",
      });
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
              <Input
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
              <Input
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
            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">
                آدرس لوگو
              </label>
              <Input
                {...register("logoUrl")}
                placeholder="https://example.com/logo.jpg"
                errorMessage={errors.logoUrl?.message}
                isInvalid={!!errors.logoUrl}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">
                توضیحات فروشگاه
              </label>
              <Textarea
                {...register("description")}
                placeholder="توضیحات فروشگاه..."
                maxLength={500}
                errorMessage={errors.description?.message}
                isInvalid={!!errors.description}
              />
              <p className="text-xs text-text-light mt-1">
                حداکثر ۵۰۰ کاراکتر
              </p>
            </div>
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
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">
                  استان
                </label>
                <Input
                  {...register("address.province")}
                  placeholder="تهران"
                  errorMessage={errors.address?.province?.message}
                  isInvalid={!!errors.address?.province}
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">
                  شهر
                </label>
                <Input
                  {...register("address.city")}
                  placeholder="تهران"
                  errorMessage={errors.address?.city?.message}
                  isInvalid={!!errors.address?.city}
                />
              </div>
            </div>

            {/* Full Address */}
            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">
                آدرس کامل
              </label>
              <Textarea
                {...register("address.fullAddress")}
                placeholder="آدرس کامل فروشگاه..."
                errorMessage={errors.address?.fullAddress?.message}
                isInvalid={!!errors.address?.fullAddress}
              />
            </div>
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
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">
                  وب‌سایت
                </label>
                <Input
                  {...register("socialLinks.website")}
                  placeholder="https://example.com"
                  errorMessage={errors.socialLinks?.website?.message}
                  isInvalid={!!errors.socialLinks?.website}
                />
              </div>

              {/* Instagram */}
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">
                  اینستاگرام
                </label>
                <Input
                  {...register("socialLinks.instagram")}
                  placeholder="@username"
                  errorMessage={errors.socialLinks?.instagram?.message}
                  isInvalid={!!errors.socialLinks?.instagram}
                />
              </div>

              {/* Telegram */}
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">
                  تلگرام
                </label>
                <Input
                  {...register("socialLinks.telegram")}
                  placeholder="@username"
                  errorMessage={errors.socialLinks?.telegram?.message}
                  isInvalid={!!errors.socialLinks?.telegram}
                />
              </div>
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
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">
                  ساعت بازگشایی
                </label>
                <Input
                  {...register("workingHours.open")}
                  placeholder="09:00"
                  errorMessage={errors.workingHours?.open?.message}
                  isInvalid={!!errors.workingHours?.open}
                />
              </div>

              {/* Closing Time */}
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">
                  ساعت بسته شدن
                </label>
                <Input
                  {...register("workingHours.close")}
                  placeholder="21:00"
                  errorMessage={errors.workingHours?.close?.message}
                  isInvalid={!!errors.workingHours?.close}
                />
              </div>
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
    </div>
  );
};

export default StoreInformationPage;
