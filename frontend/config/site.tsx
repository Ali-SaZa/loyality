import { Metadata, Viewport } from "next";

import BrainstorminIcon from "@/components/icons/BrainstormingIcon";
import ChartTreeIcon from "@/components/icons/ChartTreeIcon";
import CommentAltIcon from "@/components/icons/CommentAltIcon";
import CommentIcon from "@/components/icons/CommentIcon";
import JobIcon from "@/components/icons/JobIcon";
import DashboardIcon from "@/components/icons/DashboardIcon";
import UserIcon from "@/components/icons/UserIcon";
import StoreIcon from "@/components/icons/ChartTreeIcon";
import PromotionIcon from "@/components/icons/PromotionIcon";
import PromoCodeIcon from "@/components/icons/PromoCodeIcon";
import MailIcon from "@/components/icons/MailIcon";
import SettingIcon from "@/components/icons/SettingIcon";

export const siteConfig = {
  name: "مانا",
  description: "سیستم مدیریت وفاداری مشتریان",
  viewport: "width=device-width, initial-scale=1, user-scalable=yes",

  // Role-based menu configurations
  roleMenus: {
    admin: [
      {
        title: "داشبورد ادمین",
        icon: (className: string = "size-6") => (
          <DashboardIcon className={className} />
        ),
        link: "/admin",
        isShortAccess: true,
        children: [],
      },
      {
        title: "مدیریت کاربران",
        icon: (className: string = "size-6") => (
          <UserIcon className={className} />
        ),
        link: "/admin/users",
        isShortAccess: true,
        children: [],
      },
      {
        title: "مدیریت فروشگاه‌ها",
        icon: (className: string = "size-6") => (
          <StoreIcon className={className} />
        ),
        link: "/admin/stores",
        isShortAccess: true,
        children: [],
      },
      {
        title: "مدیریت پروموشن‌ها",
        icon: (className: string = "size-6") => (
          <PromotionIcon className={className} />
        ),
        link: "/admin/promotions",
        isShortAccess: true,
        children: [],
      },
      {
        title: "مدیریت کدهای پروموشن",
        icon: (className: string = "size-6") => (
          <PromoCodeIcon className={className} />
        ),
        link: "/admin/promo-codes",
        isShortAccess: true,
        children: [],
      },
    ],
    store: [
      {
        title: "داشبورد فروشگاه",
        icon: (className: string = "size-6") => (
          <DashboardIcon className={className} />
        ),
        link: "/store",
        isShortAccess: true,
        children: [],
      },
      {
        title: "پروموشن‌ها",
        icon: (className: string = "size-6") => (
          <PromotionIcon className={className} />
        ),
        link: "/store/promotions",
        isShortAccess: true,
        children: [],
      },
      {
        title: "کدهای پروموشن",
        icon: (className: string = "size-6") => (
          <PromoCodeIcon className={className} />
        ),
        link: "/store/promo-codes",
        isShortAccess: true,
        children: [],
      },
      {
        title: "اعمال کد تخفیف",
        icon: (className: string = "size-6") => (
          <PromoCodeIcon className={className} />
        ),
        link: "/store/apply-promo-code",
        isShortAccess: true,
        children: [],
      },
      {
        title: "مشتریان",
        icon: (className: string = "size-6") => (
          <UserIcon className={className} />
        ),
        link: "/store/users",
        isShortAccess: true,
        children: [],
      },
      {
        title: "پیامک‌های ارسالی",
        icon: (className: string = "size-6") => (
          <MailIcon className={className} />
        ),
        link: "/store/sent-messages",
        isShortAccess: true,
        children: [],
      },
      {
        title: "تنظیمات فروشگاه",
        icon: (className: string = "size-6") => (
          <SettingIcon className={className} />
        ),
        link: "/store/settings",
        isShortAccess: true,
        children: [],
      },
    ],
    customer: [
      {
        title: "استفاده از کد تخفیف",
        icon: (className: string = "size-6") => (
          <PromoCodeIcon className={className} />
        ),
        link: "/customer/use-promotion",
        isShortAccess: true,
        children: [],
      },
      {
        title: "کدهای پروموشن من",
        icon: (className: string = "size-6") => (
          <PromoCodeIcon className={className} />
        ),
        link: "/customer/promo-codes",
        isShortAccess: true,
        children: [],
      },
    ],
  },

  // Legacy userSidebar (keeping for backward compatibility)
  userSidebar: [
    {
      title: "بلاگ ها",
      icon: (className: string = "size-6") => (
        <CommentAltIcon className={className} />
      ),
      link: "https://lms.obs.ir/blog-list",
      isShortAccess: false,
      target: "_blank",
      children: [],
    },

    {
      title: "کسب و کار ها",
      icon: (className: string = "size-6") => (
        <ChartTreeIcon className={className} />
      ),
      link: "/user/businesses",
      isShortAccess: false,
      disable: true,
      children: [],
    },
    {
      title: "شغل ها",
      icon: (className: string = "size-6") => <JobIcon className={className} />,
      link: "/user/jobs",
      isShortAccess: false,
      disable: true,
      children: [],
    },
    {
      title: "مهارت ها",
      icon: (className: string = "size-6") => (
        <BrainstorminIcon className={className} />
      ),
      link: "/user/skills",
      isShortAccess: false,
      disable: true,
      children: [],
    },
    {
      title: "نظرات",
      icon: (className: string = "size-6") => (
        <CommentIcon className={className} />
      ),
      link: "/user/comments",
      isShortAccess: false,
      disable: true,
      children: [],
    },
  ],
  landingNavbar: [
    {
      type: "button",
      title: "خانه",
      link: "/",
    },
    {
      type: "button",
      title: "سوالات متداول",
      link: "/questions",
    },
    {
      type: "button",
      title: "بلاگ",
      link: "/blog",
    },
    {
      type: "button",
      title: "درباره ما",
      link: "/about-us",
    },
    {
      type: "button",
      title: "ارتباط با ما",
      link: "/contact-us",
    },
  ],
};

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: true,
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "white" }],
};
