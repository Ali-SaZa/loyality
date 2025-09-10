"use client";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { useRouter } from "next/navigation";

import DashboardIcon from "@/components/icons/DashboardIcon";
import PromotionIcon from "@/components/icons/PromotionIcon";
import PromoCodeIcon from "@/components/icons/PromoCodeIcon";
import WalletIcon from "@/components/icons/WalletIcon";

const StoreDashboard = () => {
  const router = useRouter();

  const stats = [
    {
      title: "کل تبلیغات",
      value: "12",
      icon: <PromotionIcon className="size-8 text-primary" />,
      change: "+2",
      changeType: "positive" as const,
    },
    {
      title: "کدهای تخفیف فعال",
      value: "89",
      icon: <PromoCodeIcon className="size-8 text-success" />,
      change: "+15",
      changeType: "positive" as const,
    },
    {
      title: "کدهای استفاده شده",
      value: "234",
      icon: <PromoCodeIcon className="size-8 text-warning" />,
      change: "+23",
      changeType: "positive" as const,
    },
    {
      title: "درآمد کل",
      value: "8.5M",
      icon: <WalletIcon className="size-8 text-danger" />,
      change: "+12%",
      changeType: "positive" as const,
    },
  ];

  const recentActivities = [
    {
      action: "تبلیغ جدید ایجاد شد",
      details: "20% تخفیف برای خرید بالای 500 هزار تومان",
      time: "2 دقیقه پیش",
      type: "promotion" as const,
    },
    {
      action: "کد تخفیف جدید اضافه شد",
      details: "کد: SUMMER2024 - 15% تخفیف",
      time: "15 دقیقه پیش",
      type: "promo-code" as const,
    },
    {
      action: "کد تخفیف استفاده شد",
      details: "کد: WELCOME10 توسط مشتری",
      time: "1 ساعت پیش",
      type: "usage" as const,
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "promotion":
        return <PromotionIcon className="size-5 text-primary" />;
      case "promo-code":
        return <PromoCodeIcon className="size-5 text-success" />;
      case "usage":
        return <PromoCodeIcon className="size-5 text-warning" />;
      default:
        return <DashboardIcon className="size-5 text-default" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <DashboardIcon className="size-8 text-success" />
        <div>
          <h1 className="text-2xl font-bold text-text-dark">داشبورد فروشگاه</h1>
          <p className="text-text-light">مدیریت تبلیغات و کدهای تخفیف</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-1">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-light mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-text-dark">
                    {stat.value}
                  </p>
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
                </div>
                {stat.icon}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Recent Activities */}
      <Card className="border-1">
        <CardHeader className="pb-3">
          <h3 className="text-lg font-semibold text-text-dark">
            فعالیت‌های اخیر
          </h3>
        </CardHeader>
        <CardBody className="p-0">
          <div className="divide-y divide-divider">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="p-4 hover:bg-background-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-background-100">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-text-dark font-medium">
                      {activity.action}
                    </p>
                    <p className="text-xs text-text-light">
                      {activity.details}
                    </p>
                  </div>
                  <span className="text-xs text-text-light">
                    {activity.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Quick Actions */}
      <Card className="border-1">
        <CardHeader className="pb-3">
          <h3 className="text-lg font-semibold text-text-dark">عملیات سریع</h3>
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
              مدیریت تبلیغات
            </Button>
            <Button
              color="success"
              variant="flat"
              startContent={<PromoCodeIcon className="size-5" />}
              className="justify-start h-12"
              onPress={() => router.push("/store/promo-codes")}
            >
              مدیریت کدهای تخفیف
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default StoreDashboard;
