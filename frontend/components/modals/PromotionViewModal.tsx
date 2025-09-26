"use client";
import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";

import Modal from "./Modal";
import PromotionIcon from "@/components/icons/PromotionIcon";
import EditIcon from "@/components/icons/EditIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import {
  getPromotionById,
  deletePromotion,
  Promotion,
} from "@/services/promotions";
import { Store } from "@/services/stores";
import useLoading from "@/hooks/useLoading";
import { getPromotionStatusConfig } from "@/types/enums";
import { formatDateToPersianJalali } from "@/helpers";

interface PromotionViewModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onEdit?: (promotionId: string) => void;
  onDelete?: (promotionId: string) => void;
  onSuccess?: () => void;
  promotionId?: string;
  stores: Store[];
}

const PromotionViewModal = ({
  isOpen,
  onOpenChange,
  onEdit,
  onDelete,
  onSuccess,
  promotionId,
  stores,
}: PromotionViewModalProps) => {
  const { setLoading } = useLoading();
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && promotionId) {
      fetchPromotion();
    }
  }, [isOpen, promotionId]);

  const fetchPromotion = async () => {
    if (!promotionId) return;

    try {
      setIsLoading(true);
      setError(null);
      const promotionData = await getPromotionById(promotionId);
      setPromotion(promotionData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "خطا در بارگذاری اطلاعات پروموشن",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    if (promotionId && onEdit) {
      onOpenChange(false);
      onEdit(promotionId);
    }
  };

  const handleDelete = async () => {
    if (!promotionId) return;

    if (confirm("آیا از حذف این پروموشن اطمینان دارید؟")) {
      try {
        setLoading(true);
        await deletePromotion(promotionId);
        onOpenChange(false);
        onSuccess?.();
      } catch (err) {
        setError(err instanceof Error ? err.message : "خطا در حذف پروموشن");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setError(null);
    setPromotion(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fa-IR");
  };

  const getStatusColor = (status: string) => {
    return getPromotionStatusConfig(status).color;
  };

  const getStatusText = (status: string) => {
    return getPromotionStatusConfig(status).text;
  };

  const getStoreName = (storeId: string) => {
    const store = stores.find((s) => s.id === storeId);
    return store ? store.name : "نامشخص";
  };

  const formatValue = (promotion: Promotion) => {
    return `${promotion.price.toLocaleString()} تومان → ${promotion.points} امتیاز`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={handleClose}
      title="مشاهده اطلاعات پروموشن"
      size="2xl"
      hideFooter={true}
    >
      <div className="space-y-6">
        {error && (
          <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
            <p className="text-danger text-sm">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-text-light">در حال بارگذاری...</p>
          </div>
        ) : promotion ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <PromotionIcon className="size-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-text-dark">
                      {promotion.title}
                    </h2>
                    {promotion.status === "deleted" && (
                      <Chip size="sm" color="danger" variant="flat">
                        حذف شده
                      </Chip>
                    )}
                  </div>
                  <p className="text-text-light">مشاهده اطلاعات پروموشن</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {promotion.status !== "deleted" && (
                  <>
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
                  </>
                )}
              </div>
            </div>

            {/* Promotion Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold text-text-dark">
                    اطلاعات پایه
                  </h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div>
                    <label className="text-sm text-text-light">عنوان</label>
                    <p className="font-medium">{promotion.title}</p>
                  </div>
                  {promotion.description && (
                    <div>
                      <label className="text-sm text-text-light">توضیحات</label>
                      <p className="font-medium">{promotion.description}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm text-text-light">فروشگاه</label>
                    <p className="font-medium">
                      {getStoreName(promotion.storeId)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-text-light">وضعیت</label>
                    <div className="mt-1">
                      <Chip
                        color={getStatusColor(promotion.status)}
                        size="sm"
                        variant="flat"
                      >
                        {getStatusText(promotion.status)}
                      </Chip>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-text-light">مقدار</label>
                    <p className="font-medium">{formatValue(promotion)}</p>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold text-text-dark">
                    جزئیات
                  </h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div>
                    <label className="text-sm text-text-light">مبلغ خرید</label>
                    <p className="font-medium">
                      {promotion.price.toLocaleString()} تومان
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-text-light">
                      امتیاز اعطایی
                    </label>
                    <p className="font-medium">{promotion.points} امتیاز</p>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold text-text-dark">
                    زمان‌بندی
                  </h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div>
                    <label className="text-sm text-text-light">
                      تاریخ ایجاد
                    </label>
                    <p className="font-medium">
                      {formatDateToPersianJalali(promotion.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-text-light">
                      آخرین بروزرسانی
                    </label>
                    <p className="font-medium">
                      {formatDateToPersianJalali(promotion.updatedAt)}
                    </p>
                  </div>
                </CardBody>
              </Card>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-text-light">پروموشن یافت نشد</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PromotionViewModal;
