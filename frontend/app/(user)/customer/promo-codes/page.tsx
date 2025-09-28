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
import { getPromoCodeStatusConfig } from "@/types/enums";

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

  const getStatusText = (status: string) => {
    return getPromoCodeStatusConfig(status).text;
  };

  const getStatusColor = (status: string) => {
    return getPromoCodeStatusConfig(status).color;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">کدهای پروموشن من</h1>
      </div>

      {/* Filter Buttons */}
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
      {/* Promo Codes Table */}
      <Card>
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
                {promoCodes.length > 0 ? (
                  promoCodes.map((promoCode) => (
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
                          color={getStatusColor(promoCode.status)}
                          variant="flat"
                          size="sm"
                        >
                          {getStatusText(promoCode.status)}
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-gray-500">
                        کد پروموشنی یافت نشد.
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default CustomerPromoCodes;
