import { Metadata, Viewport } from 'next'

import BrainstorminIcon from '@/components/icons/BrainstormingIcon'
import ChartTreeIcon from '@/components/icons/ChartTreeIcon'
import CommentAltIcon from '@/components/icons/CommentAltIcon'
import CommentIcon from '@/components/icons/CommentIcon'
import JobIcon from '@/components/icons/JobIcon'
import DashboardIcon from '@/components/icons/DashboardIcon'
import UserIcon from '@/components/icons/UserIcon'
import StoreIcon from '@/components/icons/ChartTreeIcon'
import ListIcon from '@/components/icons/ListIcon'
import WalletIcon from '@/components/icons/WalletIcon'
import PromotionIcon from '@/components/icons/PromotionIcon'
import PromoCodeIcon from '@/components/icons/PromoCodeIcon'

export const siteConfig = {
  name: 'OBS',
  description: 'شبیه ساز شغلی آنلاین',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  
  // Role-based menu configurations
  roleMenus: {
    admin: [
      {
        title: 'داشبورد ادمین',
        icon: (className: string = 'size-6') => <DashboardIcon className={className} />,
        link: '/admin',
        isShortAccess: true,
        children: [],
      },
      {
        title: 'مدیریت کاربران',
        icon: (className: string = 'size-6') => <UserIcon className={className} />,
        link: '/admin/users',
        isShortAccess: true,
        children: [],
      },
      {
        title: 'مدیریت فروشگاه‌ها',
        icon: (className: string = 'size-6') => <StoreIcon className={className} />,
        link: '/admin/stores',
        isShortAccess: true,
        children: [],
      },
      {
        title: 'مدیریت تبلیغات',
        icon: (className: string = 'size-6') => <PromotionIcon className={className} />,
        link: '/admin/promotions',
        isShortAccess: true,
        children: [],
      },
      {
        title: 'مدیریت کدهای تخفیف',
        icon: (className: string = 'size-6') => <PromoCodeIcon className={className} />,
        link: '/admin/promo-codes',
        isShortAccess: true,
        children: [],
      }
    ],
    store: [
      {
        title: 'داشبورد فروشگاه',
        icon: (className: string = 'size-6') => <DashboardIcon className={className} />,
        link: '/store',
        isShortAccess: true,
        children: [],
      },
      {
        title: 'تبلیغات',
        icon: (className: string = 'size-6') => <PromotionIcon className={className} />,
        link: '/store/promotions',
        isShortAccess: true,
        children: [],
      },
      {
        title: 'کدهای تخفیف',
        icon: (className: string = 'size-6') => <PromoCodeIcon className={className} />,
        link: '/store/promo-codes',
        isShortAccess: true,
        children: [],
      },
      {
        title: 'مشتریان',
        icon: (className: string = 'size-6') => <UserIcon className={className} />,
        link: '/store/users',
        isShortAccess: true,
        children: [],
      },
      {
        title: 'اعمال کد تخفیف',
        icon: (className: string = 'size-6') => <PromoCodeIcon className={className} />,
        link: '/store/apply-promo-code',
        isShortAccess: true,
        children: [],
      },
    ],
    customer: [
      {
        title: 'استفاده از کد تخفیف',
        icon: (className: string = 'size-6') => <PromoCodeIcon className={className} />,
        link: '/customer/use-promotion',
        isShortAccess: true,
        children: [],
      },
    ],
  },

  // Legacy userSidebar (keeping for backward compatibility)
  userSidebar: [
    // {
    //   title: 'داشبورد',
    //   icon: (className: string = 'size-6') => <DashboardIcon className={className} />,
    //   link: '/user',
    //   isShortAccess: true,
    //   children: [],
    // },
    // {
    //   title: 'شبیه ساز ها',
    //   icon: (className: string = 'size-6') => <LayersIcon className={className} />,
    //   link: '/user/simulators',
    //   isShortAccess: true,
    //   children: [
    //     {
    //       title: 'اطلاعات شبیه ساز',
    //       icon: (className: string = 'size-6') => <LayersIcon className={className} />,
    //       link: '/user/simulators/:id',
    //       isShortAccess: false,
    //     },
    //   ],
    // },
    // {
    //   title: 'تراکنش ها',
    //   icon: (className: string = 'size-6') => <LayersIcon className={className} />,
    //   link: '/user/transactions',
    //   isShortAccess: true,
    //   children: [],
    // },
    // {
    //   title: 'نشان شده ها',
    //   icon: (className: string = 'size-6') => <BookmarkIcon className={className} />,
    //   link: '/user/bookmarks',
    //   isShortAccess: true,
    //   children: [],
    // },
    {
      title: 'بلاگ ها',
      icon: (className: string = 'size-6') => <CommentAltIcon className={className} />,
      link: 'https://lms.obs.ir/blog-list',
      isShortAccess: false,
      target: '_blank',
      children: [],
    },
    // {
    //   title: 'ارزیاب ها',
    //   icon: (className: string = 'size-6') => <Headphone2Icon className={className} />,
    //   link: '/user/evaluators',
    //   isShortAccess: false,
    //   children: [
    //     {
    //       title: 'اطلاعات ارزیابی',
    //       icon: (className: string = 'size-6') => <Headphone2Icon className={className} />,
    //       link: '/user/evaluators/:id',
    //       isShortAccess: false,
    //       children: [
    //         {
    //           title: 'گفتگو با ارزیاب',
    //           icon: (className: string = 'size-6') => <Headphone2Icon className={className} />,
    //           link: '/user/evaluators/:id/talk',
    //           isShortAccess: false,
    //         },
    //       ],
    //     },
    //   ],
    // },
    // {
    //   title: 'فراگیران',
    //   icon: (className: string = 'size-6') => <UserIcon className={className} />,
    //   link: '/user/Learners',
    //   isShortAccess: false,
    //   children: [],
    // },
    {
      title: 'کسب و کار ها',
      icon: (className: string = 'size-6') => <ChartTreeIcon className={className} />,
      link: '/user/businesses',
      isShortAccess: false,
      disable: true,
      children: [],
    },
    {
      title: 'شغل ها',
      icon: (className: string = 'size-6') => <JobIcon className={className} />,
      link: '/user/jobs',
      isShortAccess: false,
      disable: true,
      children: [],
    },
    {
      title: 'مهارت ها',
      icon: (className: string = 'size-6') => <BrainstorminIcon className={className} />,
      link: '/user/skills',
      isShortAccess: false,
      disable: true,
      children: [],
    },
    {
      title: 'نظرات',
      icon: (className: string = 'size-6') => <CommentIcon className={className} />,
      link: '/user/comments',
      isShortAccess: false,
      disable: true,
      children: [],
    },
  ],
  landingNavbar: [
    // {
    //   type: 'button',
    //   title: 'شبیه ساز ها',
    //   link: '/simulators',
    // },
    // {
    //   type: 'select',
    //   title: 'کسب و کار ها',
    //   items: [
    //     {
    //       title: 'تمامی کسب و کار ها',
    //       link: '/organizations',
    //     },
    //     {
    //       title: 'درخواست شبیه ساز',
    //       link: '/organizations/request',
    //     },
    //   ],
    // },
    {
      type: 'button',
      title: 'مسیر مهارت آموزی',
      link: 'https://lms.obs.ir',
      target: '_blank',
    },
    // {
    //   type: 'select',
    //   title: 'مسیر مهارت آموزی',
    //   items: [
    //     {
    //       title: 'رغبت سنجی',
    //       link: '/',
    //     },
    //     {
    //       title: 'شبیه ساز ها',
    //       link: '/simulators',
    //     },
    //     {
    //       title: 'معرفی ارزیاب',
    //       link: '/evaluators',
    //     },
    //   ],
    // },
    {
      type: 'button',
      title: 'بلاگ',
      link: 'https://lms.obs.ir/blog-list',
      target: '_blank',
    },
    // {
    //   type: 'button',
    //   title: 'سوالات متداول',
    //   link: '/questions',
    // },
    // {
    //   type: 'button',
    //   title: 'درباره ما',
    //   link: '/about-us',
    // },
    // {
    //   type: 'button',
    //   title: 'ارتباط با ما',
    //   link: '/contact-us',
    // },
    {
      type: 'select',
      title: 'آشنایی با OBS',
      items: [
        {
          title: 'درباره ما',
          link: '/about-us',
        },
        {
          title: 'ارتباط با ما',
          link: '/contact-us',
        },
        {
          title: 'سوالات متدوال',
          link: '/questions',
        },
      ],
    },
  ],
}

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  themeColor: [{ media: '(prefers-color-scheme: light)', color: 'white' }],
}
