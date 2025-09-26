"use client";
import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import Button from "@/components/formElements/Button";
import { Chip } from "@heroui/chip";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";

import { promoCodesService, PromoCode } from "@/services/promo-codes";
import useLoading from "@/hooks/useLoading";
import { formatDateToPersianJalali, formatPhoneNumber } from "@/helpers";

const CustomerPromoCodes = () => {
  const { setLoading } = useLoading();
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [filterStatus, setFilterStatus] = useState<"used" | "unused" | "all">(
    "unused"
  );
  const [message, setMessage] = useState<string>("");

  const loadPromoCodes = async (status?: "used" | "unused") => {
    try {
      setLoading(true);
      const response =
        await promoCodesService.getMyPromoCodesWithStoreInfo(status);
      setPromoCodes(response.data);
      setMessage(response.message);
    } catch (error) {
      console.error("Error loading promo codes:", error);
      setMessage("خطا در بارگذاری کدهای پروموشن");
      setPromoCodes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const status = filterStatus === "all" ? undefined : filterStatus;
    loadPromoCodes(status);
  }, [filterStatus]);

  const handleFilterChange = (status: "used" | "unused" | "all") => {
    setFilterStatus(status);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "used":
        return {
          text: "استفاده شده",
          color: "success" as const,
        };
      case "unused":
        return {
          text: "استفاده نشده",
          color: "warning" as const,
        };
      default:
        return {
          text: "نامشخص",
          color: "default" as const,
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">کدهای پروموشن من</h1>
          <p className="text-gray-600 mt-1">
            مشاهده و مدیریت کدهای پروموشن شما
          </p>
        </div>
      </div>

      {/* Filter Buttons */}
      <Card className="border-1">
        <CardBody>
          <div className="flex flex-wrap gap-3">
            <Button
              color={filterStatus === "unused" ? "primary" : "default"}
              variant={filterStatus === "unused" ? "solid" : "bordered"}
              onClick={() => handleFilterChange("unused")}
              className="min-w-[100px]"
            >
              استفاده نشده
            </Button>
            <Button
              color={filterStatus === "used" ? "primary" : "default"}
              variant={filterStatus === "used" ? "solid" : "bordered"}
              onClick={() => handleFilterChange("used")}
              className="min-w-[100px]"
            >
              استفاده شده
            </Button>
            <Button
              color={filterStatus === "all" ? "primary" : "default"}
              variant={filterStatus === "all" ? "solid" : "bordered"}
              onClick={() => handleFilterChange("all")}
              className="min-w-[100px]"
            >
              همه
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Message */}
      {message && (
        <Card className="border-1">
          <CardBody>
            <p className="text-center text-gray-600">{message}</p>
          </CardBody>
        </Card>
      )}

      {/* Promo Codes Table */}
      {promoCodes.length > 0 && (
        <Card className="border-1">
          <CardHeader>
            <h2 className="text-lg font-semibold">لیست کدهای پروموشن</h2>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto">
              <Table aria-label="Promo codes table">
                <TableHeader>
                  <TableColumn>نام فروشگاه</TableColumn>
                  <TableColumn>امتیاز</TableColumn>
                  <TableColumn>قیمت</TableColumn>
                  <TableColumn>آدرس فروشگاه</TableColumn>
                  <TableColumn>شماره تماس</TableColumn>
                  <TableColumn>وضعیت</TableColumn>
                  <TableColumn>تاریخ ثبت</TableColumn>
                </TableHeader>
                <TableBody>
                  {promoCodes.map((promoCode) => {
                    const statusConfig = getStatusConfig(promoCode.status);
                    return (
                      <TableRow key={promoCode.id}>
                        <TableCell>
                          <div className="font-medium">
                            {promoCode.promotion?.store?.name || "نامشخص"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-primary">
                            {promoCode.promotion?.points || 0} امتیاز
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {promoCode.promotion?.price
                              ? `${promoCode.promotion.price.toLocaleString()} تومان`
                              : "نامشخص"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600 max-w-[200px] truncate">
                            {promoCode.promotion?.store?.address?.fullAddress ||
                              "نامشخص"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {promoCode.promotion?.store?.phoneNumber
                              ? formatPhoneNumber(
                                  promoCode.promotion.store.phoneNumber
                                )
                              : "نامشخص"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Chip
                            color={statusConfig.color}
                            variant="flat"
                            size="sm"
                          >
                            {statusConfig.text}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600">
                            {promoCode.registeredAt
                              ? formatDateToPersianJalali(
                                  promoCode.registeredAt
                                )
                              : "نامشخص"}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Empty State */}
      {promoCodes.length === 0 && !message && (
        <Card className="border-1">
          <CardBody>
            <div className="text-center py-8">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                کد پروموشنی یافت نشد
              </h3>
              <p className="text-gray-600">
                در حال حاضر کد پروموشنی برای نمایش وجود ندارد.
              </p>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default CustomerPromoCodes;
