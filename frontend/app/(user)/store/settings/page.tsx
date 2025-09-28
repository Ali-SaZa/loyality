"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import Input from "@/components/formElements/Input";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import {
  StoreSelfUpdateValidation,
  StoreSelfUpdateData,
} from "@/validation/storeSelfUpdate";
import { getCurrentStore, updateCurrentStore, Store } from "@/services/stores";
import useLoading from "@/hooks/useLoading";
import SettingIcon from "@/components/icons/SettingIcon";
import { toast } from "react-hot-toast";

const StoreInformationPage = () => {
  const router = useRouter();
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
          name: storeData.name || "",
          phoneNumber: storeData.phoneNumber || "",
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
        toast.error("خطا در بارگذاری اطلاعات فروشگاه");
      } finally {
        setLoading(false);
      }
    };

    loadStore();
  }, [reset, setLoading]);

  const onSubmit = async (data: StoreSelfUpdateData) => {
    try {
      setLoading(true);

      // Clean up empty strings and remove display-only fields
      const cleanedData = {
        address: data.address,
        logoUrl: data.logoUrl || undefined,
        name: data.name || undefined,
        phoneNumber: data.phoneNumber || undefined,
        description: data.description,
        socialLinks: data.socialLinks
          ? {
              website: data.socialLinks.website || undefined,
              instagram: data.socialLinks.instagram || undefined,
              telegram: data.socialLinks.telegram || undefined,
            }
          : undefined,
        workingHours: data.workingHours,
      };

      const updatedStore = await updateCurrentStore(cleanedData);
      setStore(updatedStore);

      toast.success("اطلاعات فروشگاه با موفقیت به‌روزرسانی شد");
    } catch (error) {
      toast.error("خطا در به‌روزرسانی اطلاعات فروشگاه");
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <SettingIcon className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              اطلاعات فروشگاه
            </h1>
          </div>
        </div>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Store Basic Information */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">اطلاعات اصلی فروشگاه</h3>
            </CardHeader>
            <CardBody className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                generalType="input"
                name="name"
                label="نام فروشگاه"
                placeholder="برادران حسن زاده"
                required={true}
              />

              <Input
                generalType="input"
                name="phoneNumber"
                label="شماره تلفن"
                placeholder="09123456789"
                required={true}
              />

              <Input
                generalType="textarea"
                name="description"
                label="توضیحات"
                placeholder="توضیحات فروشگاه..."
              />

              {/* Logo URL */}
              {/* <Input
                generalType="input"
                name="logoUrl"
                label="آدرس لوگو"
                placeholder="https://example.com/logo.jpg"
              /> */}
            </CardBody>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">اطلاعات آدرس </h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Province */}
                <Input
                  generalType="input"
                  name="address.province"
                  label="استان"
                  placeholder="تهران"
                  required={true}
                />

                {/* City */}
                <Input
                  generalType="input"
                  name="address.city"
                  label="شهر"
                  placeholder="تهران"
                  required={true}
                />

                {/* <Input
                  generalType="input"
                  name="workingHours.open"
                  label="ساعت بازگشایی"
                  placeholder="09:00"
                /> */}

                {/* Closing Time */}
                {/* <Input
                  generalType="input"
                  name="workingHours.close"
                  label="ساعت بسته شدن"
                  placeholder="21:00"
                /> */}

                <Input
                  generalType="textarea"
                  name="address.fullAddress"
                  label="آدرس کامل"
                  placeholder="آدرس کامل فروشگاه..."
                  required={true}
                />
              </div>

            
            
            </CardBody>
          </Card>

          {/* Social Links */}
          {/* <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">
                لینک‌های شبکه‌های اجتماعی
              </h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  generalType="input"
                  name="socialLinks.website"
                  label="وب‌سایت"
                  placeholder="https://example.com"
                />

                <Input
                  generalType="input"
                  name="socialLinks.instagram"
                  label="اینستاگرام"
                  placeholder="@username"
                />

                <Input
                  generalType="input"
                  name="socialLinks.telegram"
                  label="تلگرام"
                  placeholder="@username"
                />
              </div>
            </CardBody>
          </Card> */}
          <div className="flex justify-end gap-4">
            <Button type="submit" color="primary" className="px-6">
              ذخیره تغییرات
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default StoreInformationPage;
