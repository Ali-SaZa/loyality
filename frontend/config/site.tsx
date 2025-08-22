import { Metadata, Viewport } from 'next'

import BrainstorminIcon from '@/components/icons/BrainstormingIcon'
import ChartTreeIcon from '@/components/icons/ChartTreeIcon'
import CoinIcon from '@/components/icons/CoinIcon'
import CommentAltIcon from '@/components/icons/CommentAltIcon'
import CommentIcon from '@/components/icons/CommentIcon'
import JobIcon from '@/components/icons/JobIcon'
import LayersIcon from '@/components/icons/LayersIcon'
import BookmarkIcon from '@/components/icons/BookmarkIcon'

export const siteConfig = {
  name: 'OBS',
  description: 'شبیه ساز شغلی آنلاین',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  userSidebar: [
    // {
    //   title: 'داشبورد',
    //   icon: (className: string = 'size-6') => <DashboardIcon className={className} />,
    //   link: '/user',
    //   isShortAccess: true,
    //   children: [],
    // },
    {
      title: 'شبیه ساز ها',
      icon: (className: string = 'size-6') => <LayersIcon className={className} />,
      link: '/user/simulators',
      isShortAccess: true,
      children: [
        {
          title: 'اطلاعات شبیه ساز',
          icon: (className: string = 'size-6') => <LayersIcon className={className} />,
          link: '/user/simulators/:id',
          isShortAccess: false,
        },
      ],
    },
    {
      title: 'تراکنش ها',
      icon: (className: string = 'size-6') => <CoinIcon className={className} />,
      link: '/user/transactions',
      isShortAccess: true,
      children: [],
    },
    {
      title: 'نشان شده ها',
      icon: (className: string = 'size-6') => <BookmarkIcon className={className} />,
      link: '/user/bookmarks',
      isShortAccess: true,
      children: [],
    },
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
    {
      type: 'button',
      title: 'شبیه ساز ها',
      link: '/simulators',
    },
    {
      type: 'select',
      title: 'کسب و کار ها',
      items: [
        {
          title: 'تمامی کسب و کار ها',
          link: '/organizations',
        },
        {
          title: 'درخواست شبیه ساز',
          link: '/organizations/request',
        },
      ],
    },
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
