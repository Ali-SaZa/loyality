"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Pagination } from "@heroui/pagination";
import { Button } from "@heroui/button";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";

import PromoCodeIcon from "@/components/icons/PromoCodeIcon";
import {
  getAllPromoCodes,
  getPromoCodeStats,
  PromoCode,
  PromoCodeStats,
} from "@/services/promo-codes";
import { getAllPromotions, Promotion } from "@/services/promotions";
import useLoading from "@/hooks/useLoading";
import { getPromoCodeStatusConfig } from "@/types/enums";
import { formatDateToPersianJalali, copyToClipboard } from "@/helpers";
import CopyIcon from "@/components/icons/CopyIcon";

const StorePromoCodes = () => {
  const { setLoading } = useLoading();

  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [stats, setStats] = useState<PromoCodeStats>({
    total: 0,
    unused: 0,
    used: 0,
    registered: 0,
    deleted: 0,
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  useEffect(() => {
    fetchPromoCodes();
    fetchStats();
    fetchPromotions();
  }, []);

  useEffect(() => {
    fetchPromoCodes();
  }, [currentPage]);

  const fetchPromoCodes = async () => {
    try {
      setLoading(true);
      const response = await getAllPromoCodes({ page: currentPage, limit: 50 });
      setPromoCodes(response.data);
      setTotalPages(response.totalPages);
      setTotalItems(response.total);
      setHasNextPage(response.hasNextPage);
      setHasPrevPage(response.hasPrevPage);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "خطا در بارگذاری کدهای پروموشن";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await getPromoCodeStats();
      setStats(statsData);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchPromotions = async () => {
    try {
      const response = await getAllPromotions({ page: 1, limit: 100 });
      setPromotions(response.data);
    } catch (err) {
      console.error("Error fetching promotions:", err);
    }
  };

  const getStatusColor = (status: string) => {
    return getPromoCodeStatusConfig(status).color;
  };

  const getStatusText = (status: string) => {
    return getPromoCodeStatusConfig(status).text;
  };

  const getPromotionTitle = (promoCode: PromoCode) => {
    // Use populated promotion data if available, otherwise fallback to lookup
    if (promoCode.promotion) {
      return promoCode.promotion.title;
    }
    const promotion = promotions.find((p) => p.id === promoCode.promotionId);
    return promotion?.title || "نامشخص";
  };

  const getUserInfo = (promoCode: PromoCode) => {
    if (promoCode.user) {
      const fullName = [promoCode.user.firstName, promoCode.user.lastName]
        .filter(Boolean)
        .join(" ");
      return {
        phoneNumber: promoCode.user.phoneNumber,
        fullName: fullName || "نامشخص",
      };
    }
    return {
      phoneNumber: promoCode.userId ? "نامشخص" : "ثبت نشده",
      fullName: "نامشخص",
    };
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCopyCode = (code: string) => {
    copyToClipboard(code, "کد پروموشن کپی شد", "خطا در کپی کردن کد");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <PromoCodeIcon className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">کدهای پروموشن</h1>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600">کل کدها</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.unused}
            </div>
            <div className="text-sm text-gray-600">استفاده نشده</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.registered}
            </div>
            <div className="text-sm text-gray-600">ثبت شده</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {stats.used}
            </div>
            <div className="text-sm text-gray-600">استفاده شده</div>
          </CardBody>
        </Card>
      </div>

      {/* Promo Codes Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <h3 className="text-lg font-semibold">لیست کدهای پروموشن</h3>
          <div className="text-sm text-gray-500">
            نمایش {(currentPage - 1) * 50 + 1} تا{" "}
            {Math.min(currentPage * 50, totalItems)} از {totalItems} کد
          </div>
        </CardHeader>
        <CardBody>
          <Table aria-label="Promo codes table">
            <TableHeader>
              <TableColumn>کد</TableColumn>
              <TableColumn>پروموشن</TableColumn>
              <TableColumn>وضعیت</TableColumn>
              <TableColumn>کاربر</TableColumn>
              <TableColumn>تاریخ ایجاد</TableColumn>
              <TableColumn>تاریخ ثبت</TableColumn>
              <TableColumn>تاریخ استفاده</TableColumn>
            </TableHeader>
            <TableBody>
              {promoCodes.map((promoCode) => (
                <TableRow key={promoCode.id}>
                  <TableCell>
                    <div className="font-mono font-bold text-lg text-primary">
                      {promoCode.code}
                      <Button
                        isIconOnly
                        size="sm"
                        className="p-2"
                        variant="light"
                        color="default"
                        aria-label="Copy code"
                        onClick={() => handleCopyCode(promoCode.code)}
                      >
                        <CopyIcon />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {getPromotionTitle(promoCode)}
                    </div>
                    {promoCode.promotion && (
                      <div className="text-xs text-gray-500">
                        {promoCode.promotion.price.toLocaleString()} تومان -{" "}
                        {promoCode.promotion.points} امتیاز
                      </div>
                    )}
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
                      {getUserInfo(promoCode).phoneNumber}
                    </div>
                    {getUserInfo(promoCode).fullName !== "نامشخص" && (
                      <div className="text-xs text-gray-500">
                        {getUserInfo(promoCode).fullName}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {formatDateToPersianJalali(promoCode.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {promoCode.registeredAt
                        ? formatDateToPersianJalali(promoCode.registeredAt)
                        : "-"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {promoCode.usedAt
                        ? formatDateToPersianJalali(promoCode.usedAt)
                        : "-"}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination
                total={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                showControls
                color="primary"
                variant="flat"
                size="md"
                classNames={{
                  item: "w-8 h-8 text-small rounded-none bg-transparent",
                  cursor:
                    "bg-gradient-to-b shadow-lg from-default-500 to-default-800 dark:from-default-500 dark:to-default-600 text-white font-bold",
                }}
              />
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default StorePromoCodes;
