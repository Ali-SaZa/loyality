'use client'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import { useRouter } from 'next/navigation'

import DashboardIcon from '@/components/icons/DashboardIcon'
import UserIcon from '@/components/icons/UserIcon'
import StoreIcon from '@/components/icons/ChartTreeIcon'
import WalletIcon from '@/components/icons/WalletIcon'
import ListIcon from '@/components/icons/ListIcon'

const AdminDashboard = () => {
  const router = useRouter()

  const stats = [
    {
      title: 'کل مشتریان',
      value: '1,234',
      icon: <UserIcon className="size-8 text-primary" />,
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'فروشگاه‌ها',
      value: '89',
      icon: <StoreIcon className="size-8 text-success" />,
      change: '+5%',
      changeType: 'positive' as const,
    },
    {
      title: 'تراکنش‌ها',
      value: '5,678',
      icon: <WalletIcon className="size-8 text-warning" />,
      change: '+23%',
      changeType: 'positive' as const,
    },
    {
      title: 'کارت‌های تخفیف',
      value: '2,345',
      icon: <ListIcon className="size-8 text-danger" />,
      change: '+8%',
      changeType: 'positive' as const,
    },
  ]

  const recentActivities = [
    {
      action: 'کاربر جدید ثبت نام کرد',
      user: 'علی محمدی',
      time: '2 دقیقه پیش',
      type: 'user' as const,
    },
    {
      action: 'فروشگاه جدید اضافه شد',
      user: 'فروشگاه الکترونیک',
      time: '15 دقیقه پیش',
      type: 'store' as const,
    },
    {
      action: 'تراکنش جدید انجام شد',
      user: 'کاربر 123',
      time: '1 ساعت پیش',
      type: 'transaction' as const,
    },
    {
      action: 'کارت تخفیف جدید ایجاد شد',
      user: 'فروشگاه لباس',
      time: '2 ساعت پیش',
      type: 'card' as const,
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <UserIcon className="size-5 text-primary" />
      case 'store':
        return <StoreIcon className="size-5 text-success" />
      case 'transaction':
        return <WalletIcon className="size-5 text-warning" />
      case 'card':
        return <ListIcon className="size-5 text-danger" />
      default:
        return <DashboardIcon className="size-5 text-default" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user':
        return 'primary'
      case 'store':
        return 'success'
      case 'transaction':
        return 'warning'
      case 'card':
        return 'danger'
      default:
        return 'default'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <DashboardIcon className="size-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-text-dark">داشبورد ادمین</h1>
          <p className="text-text-light">مدیریت سیستم وفاداری</p>
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
                  <div className={`p-2 rounded-full bg-${getActivityColor(activity.type)}-50`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-text-dark font-medium">{activity.action}</p>
                    <p className="text-xs text-text-light">{activity.user}</p>
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
              startContent={<UserIcon className="size-5" />}
              className="justify-start h-12"
              onPress={() => router.push('/admin/customers')}
            >
              مدیریت مشتریان
            </Button>
            <Button
              color="success"
              variant="flat"
              startContent={<StoreIcon className="size-5" />}
              className="justify-start h-12"
              onPress={() => router.push('/admin/stores')}
            >
              مدیریت فروشگاه‌ها
            </Button>
            <Button
              color="warning"
              variant="flat"
              startContent={<ListIcon className="size-5" />}
              className="justify-start h-12"
              onPress={() => router.push('/admin/scratch-cards')}
            >
              ایجاد کارت تخفیف
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default AdminDashboard
