"use client";
import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";

import Modal from "./Modal";
import PromotionIcon from "@/components/icons/PromotionIcon";
import {
  getPromotionByIdWithCodeCount,
  PromotionWithCodeCount,
} from "@/services/promotions";
import { PromoCode } from "@/services/promo-codes";
import { Store } from "@/services/stores";
import {
  getPromotionStatusConfig,
  getPromoCodeStatusConfig,
} from "@/types/enums";
import { formatDateToPersianJalali } from "@/helpers";
import LabelContent from "../formElements/LabelContent";

interface PromotionDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onEdit?: (promotionId: string) => void;
  onDelete?: (promotionId: string) => void;
  onSuccess?: () => void;
  promotionId?: string;
  stores: Store[];
}

const PromotionDetailsModal = ({
  isOpen,
  onOpenChange,
  promotionId,
  stores,
}: PromotionDetailsModalProps) => {
  const [promotion, setPromotion] = useState<PromotionWithCodeCount | null>(
    null
  );
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && promotionId) {
      fetchPromotionDetails();
    }
  }, [isOpen, promotionId]);

  const fetchPromotionDetails = async () => {
    if (!promotionId) return;

    try {
      setIsLoading(true);
      setError(null);

      // Fetch promotion with code count and promo codes list
      const promotionData = await getPromotionByIdWithCodeCount(promotionId);
      setPromotion(promotionData);
      setPromoCodes(promotionData.promoCodes || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "خطا در بارگذاری اطلاعات پروموشن"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setError(null);
    setPromotion(null);
    setPromoCodes([]);
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

  const getPromoCodeStatusColor = (status: string) => {
    return getPromoCodeStatusConfig(status).color;
  };

  const getPromoCodeStatusText = (status: string) => {
    return getPromoCodeStatusConfig(status).text;
  };

  const getStoreName = (storeId: string) => {
    const store = stores.find((s) => s.id === storeId);
    return store ? store.name : "نامشخص";
  };

  const formatValue = (promotion: PromotionWithCodeCount) => {
    return `${promotion.price.toLocaleString()} تومان → ${promotion.points} امتیاز`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={handleClose}
      title="جزئیات پروموشن و کدهای پروموشن"
      size="4xl"
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
                <h2 className="text-xl font-bold text-text-dark">
                  {promotion.title}
                </h2>
              </div>
            </div>

            {/* Promotion Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2 pb-2">
              <Card>
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold text-text-dark">
                    اطلاعات پایه
                  </h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <LabelContent label="توضیحات" value={promotion.description || ""} />
                  <LabelContent label="وضعیت" value={getStatusText(promotion.status)} />
                  <LabelContent label="مقدار" value={formatValue(promotion)} />
                  <LabelContent label="تعداد کدهای پروموشن" value={promotion.promoCodeCount.toString()} />
                </CardBody>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold text-text-dark">
                    جزئیات
                  </h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <LabelContent label="مبلغ خرید" value={`${promotion.price.toLocaleString()} تومان`} />
                  <LabelContent label="امتیاز اعطایی" value={`${promotion.points.toLocaleString()} امتیاز`} />
                  <LabelContent label="تاریخ ایجاد" value={formatDateToPersianJalali(promotion.createdAt)} />
                  <LabelContent label="آخرین بروزرسانی" value={formatDateToPersianJalali(promotion.updatedAt)} />
                </CardBody>
              </Card>
            </div>

            {/* Promo Codes Table */}
            <Card>
              <CardHeader className="pb-3">
                <h3 className="text-lg font-semibold text-text-dark">
                  کدهای پروموشن
                </h3>
              </CardHeader>
              <CardBody>
                {promoCodes && promoCodes.length > 0 ? (
                  <Table aria-label="Promo codes table">
                    <TableHeader>
                      <TableColumn>کد پروموشن</TableColumn>
                      <TableColumn>وضعیت</TableColumn>
                      <TableColumn>کاربر</TableColumn>
                      <TableColumn>تاریخ ایجاد</TableColumn>
                      <TableColumn>تاریخ ثبت</TableColumn>
                      <TableColumn>تاریخ استفاده</TableColumn>
                      <TableColumn>یادداشت</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {promoCodes.map((promoCode) => (
                        <TableRow key={promoCode.id}>
                          <TableCell>
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                              {promoCode.code}
                            </code>
                          </TableCell>
                          <TableCell>
                            <Chip
                              color={getPromoCodeStatusColor(promoCode.status)}
                              size="sm"
                              variant="flat"
                            >
                              {getPromoCodeStatusText(promoCode.status)}
                            </Chip>
                          </TableCell>
                          <TableCell>
                            {promoCode.userId ? "ثبت شده" : "ثبت نشده"}
                          </TableCell>
                          <TableCell>
                            {formatDateToPersianJalali(promoCode.createdAt)}
                          </TableCell>
                          <TableCell>
                            {promoCode.registeredAt
                              ? formatDateToPersianJalali(
                                  promoCode.registeredAt
                                )
                              : "-"}
                          </TableCell>
                          <TableCell>
                            {promoCode.usedAt
                              ? formatDateToPersianJalali(promoCode.usedAt)
                              : "-"}
                          </TableCell>
                          <TableCell>{promoCode.notes || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-text-light">
                      هیچ کد پروموشنی برای این پروموشن یافت نشد
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>
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

export default PromotionDetailsModal;
