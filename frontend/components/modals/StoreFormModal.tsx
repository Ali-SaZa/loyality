"use client";
import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Modal from "./Modal";
import Input from "@/components/formElements/Input";
import useLoading from "@/hooks/useLoading";
import {
  StoreFormValidation,
  StoreUpdateValidation,
  StoreFormData,
  StoreUpdateData,
} from "@/validation/store";
import { StoreStatus } from "@/types/enums";
import {
  Store,
  getStoreById,
  createStore,
  updateStore,
} from "@/services/stores";

interface StoreFormModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess?: () => void;
  storeId?: string; // If provided, it's edit mode
}

const StoreFormModal = ({
  isOpen,
  onOpenChange,
  onSuccess,
  storeId,
}: StoreFormModalProps) => {
  const { setLoading } = useLoading();
  const [store, setStore] = useState<Store | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!storeId;

  const methods = useForm<StoreFormData | StoreUpdateData>({
    resolver: zodResolver(
      isEditMode ? StoreUpdateValidation : StoreFormValidation
    ),
    defaultValues: {
      name: "",
      phoneNumber: "",
      userId: "",
      address: {
        province: "",
        city: "",
        fullAddress: "",
      },
      promotions: [],
      planExpiryDate: "",
      status: "active" as const,
      logoUrl: "",
      description: "",
      socialLinks: {
        website: "",
        instagram: "",
        telegram: "",
      },
      workingHours: {
        open: "09:00",
        close: "21:00",
      },
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && storeId) {
        fetchStore(storeId);
      } else {
        // Reset form for create mode
        methods.reset({
          name: "",
          phoneNumber: "",
          userId: "",
          address: {
            province: "",
            city: "",
            fullAddress: "",
          },
          promotions: [],
          planExpiryDate: "",
          status: "active" as const,
          logoUrl: "",
          description: "",
          socialLinks: {
            website: "",
            instagram: "",
            telegram: "",
          },
          workingHours: {
            open: "09:00",
            close: "21:00",
          },
        });
        setError(null);
      }
    }
  }, [isOpen, isEditMode, storeId]);

  const fetchStore = async (storeId: string) => {
    try {
      setLoading(true);
      setError(null);

      const storeData = await getStoreById(storeId);
      setStore(storeData);

      methods.reset({
        name: storeData.name,
        phoneNumber: storeData.phoneNumber,
        userId: storeData.userId,
        address: storeData.address,
        promotions: storeData.promotions || [],
        planExpiryDate: storeData.planExpiryDate || "",
        status: storeData.status,
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
      } as any);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "خطا در بارگذاری اطلاعات فروشگاه"
      );
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: StoreFormData | StoreUpdateData) => {
    try {
      setLoading(true);
      setError(null);

      if (isEditMode && storeId) {
        // Update existing store
        await updateStore(storeId, data as StoreUpdateData);
      } else {
        // Create new store
        await createStore(data as StoreFormData);
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isEditMode
            ? "خطا در بروزرسانی فروشگاه"
            : "خطا در ایجاد فروشگاه"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setError(null);
  };

  const statusOptions = [
    { code: StoreStatus.ACTIVE, name: "فعال" },
    { code: StoreStatus.PENDING, name: "در انتظار" },
    { code: StoreStatus.SUSPENDED, name: "معلق" },
    { code: StoreStatus.DELETED, name: "حذف شده" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={handleClose}
      onAccept={methods.handleSubmit(onSubmit)}
      onReject={handleClose}
      title={isEditMode ? "ویرایش فروشگاه" : "افزودن فروشگاه جدید"}
      acceptBtnText={isEditMode ? "بروزرسانی فروشگاه" : "ایجاد فروشگاه"}
      rejectBtnText="انصراف"
      acceptBtnColor="success"
      size="xl"
    >
      <div className="space-y-6">
        {error && (
          <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
            <p className="text-danger text-sm">{error}</p>
          </div>
        )}

        <FormProvider {...methods}>
          <div className="space-y-6">
            {/* User ID (only for create mode) */}
            {!isEditMode && (
              <Input
                generalType="input"
                name="userId"
                label="شناسه کاربر"
                placeholder="شناسه کاربر مدیر فروشگاه"
                inputType="text"
                required={true}
              />
            )}

            {/* Store Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                generalType="input"
                name="name"
                label="نام فروشگاه"
                placeholder="نام فروشگاه"
                inputType="text"
                required={true}
              />

              <Input
                generalType="input"
                name="phoneNumber"
                label="شماره تلفن"
                placeholder="09123456789"
                inputType="tel"
                required={true}
              />
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                اطلاعات آدرس
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  generalType="input"
                  name="address.province"
                  label="استان"
                  placeholder="تهران"
                  inputType="text"
                  required={true}
                />

                <Input
                  generalType="input"
                  name="address.city"
                  label="شهر"
                  placeholder="تهران"
                  inputType="text"
                  required={true}
                />
              </div>

              <Input
                generalType="textarea"
                name="address.fullAddress"
                label="آدرس کامل"
                placeholder="آدرس کامل فروشگاه"
                required={true}
              />
            </div>

            {/* Store Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                جزئیات فروشگاه
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  generalType="input"
                  name="logoUrl"
                  label="آدرس لوگو"
                  placeholder="https://example.com/logo.png"
                  inputType="text"
                />

                <Input
                  generalType="select"
                  name="status"
                  label="وضعیت"
                  selectOptions={statusOptions}
                  selectKey="code"
                  selectValue="name"
                  required={true}
                />
              </div>

              <Input
                generalType="datePickerPro"
                name="planExpiryDate"
                label="تاریخ انقضای پلن"
              />

              <Input
                generalType="textarea"
                name="description"
                label="توضیحات"
                placeholder="توضیحات فروشگاه"
              />
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                لینک‌های شبکه‌های اجتماعی
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  generalType="input"
                  name="socialLinks.website"
                  label="وب‌سایت"
                  placeholder="https://example.com"
                  inputType="text"
                />

                <Input
                  generalType="input"
                  name="socialLinks.instagram"
                  label="اینستاگرام"
                  placeholder="@username"
                  inputType="text"
                />

                <Input
                  generalType="input"
                  name="socialLinks.telegram"
                  label="تلگرام"
                  placeholder="@username"
                  inputType="text"
                />
              </div>
            </div>

            {/* Working Hours */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                ساعات کاری
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  generalType="input"
                  name="workingHours.open"
                  label="ساعت بازگشایی"
                  placeholder="09:00"
                  inputType="text"
                />

                <Input
                  generalType="input"
                  name="workingHours.close"
                  label="ساعت بسته شدن"
                  placeholder="21:00"
                  inputType="text"
                />
              </div>
            </div>
          </div>
        </FormProvider>
      </div>
    </Modal>
  );
};

export default StoreFormModal;
