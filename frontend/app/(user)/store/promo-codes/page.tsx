"use client";
import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
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
import { formatDateToPersianJalali } from "@/helpers";

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPromoCodes();
    fetchStats();
    fetchPromotions();
  }, []);

  const fetchPromoCodes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllPromoCodes({ page: 1, limit: 50 });
      setPromoCodes(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "خطا در بارگذاری کدهای تخفیف"
      );
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <PromoCodeIcon className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">کدهای تخفیف</h1>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardBody>
            <p className="text-red-600">{error}</p>
          </CardBody>
        </Card>
      )}

      {/* Promo Codes Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">لیست کدهای تخفیف</h3>
        </CardHeader>
        <CardBody>
          <Table aria-label="Promo codes table">
            <TableHeader>
              <TableColumn>کد</TableColumn>
              <TableColumn>تبلیغ</TableColumn>
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
        </CardBody>
      </Card>
    </div>
  );
};

export default StorePromoCodes;
