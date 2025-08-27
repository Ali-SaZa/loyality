'use client'
import React from 'react'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import DashboardIcon from '@/components/icons/DashboardIcon'
import StoreIcon from '@/components/icons/ChartTreeIcon'
import UserIcon from '@/components/icons/UserIcon'
import WalletIcon from '@/components/icons/WalletIcon'
import ListIcon from '@/components/icons/ListIcon'
import useAuth from '@/hooks/useAuth'

const StoreDashboard = () => {
  const { user, redirectIfUnauthorized } = useAuth()
  const router = useRouter()

  // Simple one-liner for role-based access control
  useEffect(() => {
    redirectIfUnauthorized('store')
  }, [redirectIfUnauthorized])

  // Show loading while checking auth
  if (!user || user.role !== 'store') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-light">در حال بارگذاری...</p>
        </div>
      </div>
    )
  }

  const stats = [
    {
      title: 'کل مشتریان',
      value: '456',
      icon: <UserIcon className="size-8 text-primary" />,
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      title: 'محصولات فعال',
      value: '23',
      icon: <ListIcon className="size-8 text-success" />,
      change: '+2',
      changeType: 'positive' as const,
    },
    {
      title: 'کارت‌های تخفیف',
      value: '89',
      icon: <ListIcon className="size-8 text-warning" />,
      change: '+15',
      changeType: 'positive' as const,
    },
    {
      title: 'درآمد ماهانه',
      value: '12.5M',
      icon: <WalletIcon className="size-8 text-danger" />,
      change: '+12%',
      changeType: 'positive' as const,
    },
  ]

  const recentActivities = [
    {
      action: 'کارت تخفیف جدید ایجاد شد',
      details: '20% تخفیف برای خرید بالای 500 هزار تومان',
      time: '2 دقیقه پیش',
      type: 'card' as const,
    },
    {
      action: 'مشتری جدید ثبت نام کرد',
      details: 'علی محمدی - شماره: 09111111111',
      time: '15 دقیقه پیش',
      type: 'customer' as const,
    },
    {
      action: 'تراکنش جدید انجام شد',
      details: 'مبلغ: 250 هزار تومان - امتیاز: 25',
      time: '1 ساعت پیش',
      type: 'transaction' as const,
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'card':
        return <ListIcon className="size-5 text-warning" />
      case 'customer':
        return <UserIcon className="size-5 text-primary" />
      case 'transaction':
        return <WalletIcon className="size-5 text-success" />
      default:
        return <DashboardIcon className="size-5 text-default" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <StoreIcon className="size-8 text-success" />
        <div>
          <h1 className="text-2xl font-bold text-text-dark">داشبورد فروشگاه</h1>
          <p className="text-text-light">مدیریت کسب و کار و مشتریان</p>
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
                  <p className="text-2xl font-bold text-text-dark">{stat.value}</p>
                  <Chip
                    color={stat.changeType === 'positive' ? 'success' : 'danger'}
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
          <h3 className="text-lg font-semibold text-text-dark">فعالیت‌های اخیر</h3>
        </CardHeader>
        <CardBody className="p-0">
          <div className="divide-y divide-divider">
            {recentActivities.map((activity, index) => (
              <div key={index} className="p-4 hover:bg-background-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-background-100">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-text-dark font-medium">{activity.action}</p>
                    <p className="text-xs text-text-light">{activity.details}</p>
                  </div>
                  <span className="text-xs text-text-light">{activity.time}</span>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              color="primary"
              variant="flat"
              startContent={<ListIcon className="size-5" />}
              className="justify-start h-12"
              onPress={() => router.push('/store/scratch-cards')}
            >
              ایجاد کارت تخفیف
            </Button>
            <Button
              color="success"
              variant="flat"
              startContent={<UserIcon className="size-5" />}
              className="justify-start h-12"
              onPress={() => router.push('/store/customers')}
            >
              مدیریت مشتریان
            </Button>
            <Button
              color="warning"
              variant="flat"
              startContent={<WalletIcon className="size-5" />}
              className="justify-start h-12"
              onPress={() => router.push('/store/transactions')}
            >
              مشاهده تراکنش‌ها
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default StoreDashboard
