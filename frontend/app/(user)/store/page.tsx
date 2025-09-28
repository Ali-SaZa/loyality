"use client";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import DashboardIcon from "@/components/icons/DashboardIcon";
import PromotionIcon from "@/components/icons/PromotionIcon";
import PromoCodeIcon from "@/components/icons/PromoCodeIcon";
import UserIcon from "@/components/icons/UserIcon";
import MailIcon from "@/components/icons/MailIcon";
import { getStoreStatistics, StoreStatistics } from "@/services/stores";
import { toast } from "react-hot-toast";

const StoreDashboard = () => {
  const router = useRouter();
  const [statistics, setStatistics] = useState<StoreStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const data = await getStoreStatistics();
        setStatistics(data);
      } catch (error) {
        toast.error("خطا در بارگذاری آمار فروشگاه");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const stats = statistics ? [
    {
      title: "پروموشن‌های فعال",
      value: statistics.activeCampaigns.toString(),
      icon: <PromotionIcon className="size-8 text-primary" />,
      change: "",
      changeType: "neutral" as const,
    },
    {
      title: "کل کدهای پروموشن",
      value: statistics.totalPromoCodes.toString(),
      icon: <PromoCodeIcon className="size-8 text-success" />,
      change: "",
      changeType: "neutral" as const,
    },
    {
      title: "مشتریان امروز",
      value: statistics.customersRegisteredToday.toString(),
      icon: <UserIcon className="size-8 text-warning" />,
      change: "",
      changeType: "neutral" as const,
    },
    {
      title: "پیام‌های ارسال شده",
      value: statistics.totalMessagesSent.toString(),
      icon: <MailIcon className="size-8 text-danger" />,
      change: "",
      changeType: "neutral" as const,
    },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <DashboardIcon className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">داشبورد فروشگاه</h1>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardBody className="text-center">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                </div>
              </CardBody>
            </Card>
          ))
        ) : (
          stats.map((stat, index) => (
            <Card key={index}>
              <CardBody className="text-center flex flex-row items-center justify-center gap-2">
                <div>
                  {stat.icon}
                </div>
                <div className="text-sm text-gray-600">{stat.title}</div>
                {stat.change && stat.changeType !== "neutral" && (
                  <Chip
                    color={
                      stat.changeType === "positive" ? "success" : "danger"
                    }
                    size="sm"
                    variant="flat"
                    className="mt-2"
                  >
                    {stat.change}
                  </Chip>
                )}
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
              </CardBody>
            </Card>
          ))
        )}
      </div>

      {/* Additional Statistics */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardBody className="text-center flex flex-row items-center justify-center gap-2">
              <div className="flex justify-center">
                <UserIcon className="size-8 text-primary" />
              </div>
              <div className="text-sm text-gray-600">مشتریان این ماه</div>
              <div className="text-2xl font-bold text-gray-900">
                {statistics.customersRegisteredThisMonth}
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="flex flex-row items-center justify-center gap-2">
              <div className="flex justify-center">
                <UserIcon className="size-8 text-success" />
              </div>
              <div className="text-sm text-gray-600">کل مشتریان</div>
              <div className="text-2xl font-bold text-gray-900">
                {statistics.totalCustomers}
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">عملیات سریع</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              color="primary"
              variant="flat"
              startContent={<PromotionIcon className="size-5" />}
              className="justify-start h-12"
              onPress={() => router.push("/store/promotions")}
            >
              مدیریت پروموشن‌ها
            </Button>
            <Button
              color="success"
              variant="flat"
              startContent={<PromoCodeIcon className="size-5" />}
              className="justify-start h-12"
              onPress={() => router.push("/store/promo-codes")}
            >
              مدیریت کدهای پروموشن
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default StoreDashboard;
