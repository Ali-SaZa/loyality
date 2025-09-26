"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";

import Modal from "./Modal";
import StoreIcon from "@/components/icons/ChartTreeIcon";
import EditIcon from "@/components/icons/EditIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import { getStoreById, deleteStore, Store } from "@/services/stores";
import useLoading from "@/hooks/useLoading";
import { getStoreStatusConfig } from "@/types/enums";
import { formatDateToPersianJalali, formatPhoneNumber } from "@/helpers";

interface StoreViewModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onEdit?: (storeId: string) => void;
  onDelete?: (storeId: string) => void;
  onSuccess?: () => void;
  storeId?: string;
}

const StoreViewModal = ({
  isOpen,
  onOpenChange,
  onEdit,
  onDelete,
  onSuccess,
  storeId,
}: StoreViewModalProps) => {
  const { setLoading } = useLoading();
  const [store, setStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && storeId) {
      fetchStore();
    }
  }, [isOpen, storeId]);

  const fetchStore = async () => {
    if (!storeId) return;

    try {
      setIsLoading(true);
      const storeData = await getStoreById(storeId);
      setStore(storeData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "خطا در بارگذاری اطلاعات فروشگاه";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    if (storeId && onEdit) {
      onOpenChange(false);
      onEdit(storeId);
    }
  };

  const handleDelete = async () => {
    if (!storeId) return;

    if (confirm("آیا از حذف این فروشگاه اطمینان دارید؟")) {
      try {
        setLoading(true);
        await deleteStore(storeId);
        onOpenChange(false);
        onSuccess?.();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "خطا در حذف فروشگاه";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setStore(null);
  };

  const formatDate = (dateString: string | Date) => {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    return formatDateToPersianJalali(date);
  };

  const getStatusColor = (status: string) => {
    return getStoreStatusConfig(status).color;
  };

  const getStatusText = (status: string) => {
    return getStoreStatusConfig(status).text;
  };

  const getAddressText = (address: Store["address"]) => {
    const parts = [];
    if (address.city) parts.push(address.city);
    if (address.province) parts.push(address.province);
    return parts.join("، ") || "آدرس ثبت نشده";
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={handleClose}
      title="مشاهده اطلاعات فروشگاه"
      size="xl"
      hideFooter={true}
    >
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-text-light">در حال بارگذاری...</p>
          </div>
        ) : store ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center">
                  <StoreIcon className="size-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text-dark">
                    {store.name}
                  </h2>
                  <p className="text-text-light">مشاهده اطلاعات فروشگاه</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  color="primary"
                  startContent={<EditIcon className="size-5" />}
                  onClick={handleEdit}
                >
                  ویرایش
                </Button>
                <Button
                  color="danger"
                  variant="light"
                  startContent={<TrashIcon className="size-5" />}
                  onClick={handleDelete}
                >
                  حذف
                </Button>
              </div>
            </div>

            {/* Store Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold text-text-dark">
                    اطلاعات فروشگاه
                  </h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div>
                    <label className="text-sm text-text-light">
                      نام فروشگاه
                    </label>
                    <p className="font-medium">{store.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-text-light">
                      شماره تلفن
                    </label>
                    <p className="font-medium">
                      {formatPhoneNumber(store.phoneNumber)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-text-light">وضعیت</label>
                    <div className="mt-1">
                      <Chip
                        color={getStatusColor(store.status)}
                        size="sm"
                        variant="flat"
                      >
                        {getStatusText(store.status)}
                      </Chip>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-text-light">
                      تعداد پروموشن‌ها
                    </label>
                    <p className="font-medium">
                      {store.promotions?.length || 0} پروموشن فعال
                    </p>
                  </div>
                  {store.description && (
                    <div>
                      <label className="text-sm text-text-light">توضیحات</label>
                      <p className="font-medium">{store.description}</p>
                    </div>
                  )}
                </CardBody>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold text-text-dark">
                    آدرس و اطلاعات تماس
                  </h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div>
                    <label className="text-sm text-text-light">
                      شهر و استان
                    </label>
                    <p className="font-medium">
                      {getAddressText(store.address)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-text-light">آدرس کامل</label>
                    <p className="font-medium">{store.address.fullAddress}</p>
                  </div>
                  {store.workingHours && (
                    <div>
                      <label className="text-sm text-text-light">
                        ساعات کاری
                      </label>
                      <p className="font-medium">
                        {store.workingHours.open} - {store.workingHours.close}
                      </p>
                    </div>
                  )}
                  {store.socialLinks && (
                    <div>
                      <label className="text-sm text-text-light">
                        شبکه‌های اجتماعی
                      </label>
                      <div className="space-y-1">
                        {store.socialLinks.website && (
                          <p className="text-sm">
                            وب‌سایت: {store.socialLinks.website}
                          </p>
                        )}
                        {store.socialLinks.instagram && (
                          <p className="text-sm">
                            اینستاگرام: {store.socialLinks.instagram}
                          </p>
                        )}
                        {store.socialLinks.telegram && (
                          <p className="text-sm">
                            تلگرام: {store.socialLinks.telegram}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>

            {/* Additional Info */}
            <Card>
              <CardHeader className="pb-3">
                <h3 className="text-lg font-semibold text-text-dark">
                  اطلاعات سیستم
                </h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-text-light">
                      تاریخ عضویت
                    </label>
                    <p className="font-medium">{formatDate(store.createdAt)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-text-light">
                      آخرین بروزرسانی
                    </label>
                    <p className="font-medium">
                      {formatDateToPersianJalali(store.updatedAt)}
                    </p>
                  </div>
                  {store.planExpiryDate && (
                    <div>
                      <label className="text-sm text-text-light">
                        تاریخ انقضای طرح
                      </label>
                      <p className="font-medium">
                        {formatDate(store.planExpiryDate)}
                      </p>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-text-light">فروشگاه یافت نشد</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default StoreViewModal;
