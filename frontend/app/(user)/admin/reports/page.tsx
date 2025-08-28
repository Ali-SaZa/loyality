'use client'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import { useRouter } from 'next/navigation'

import ChartTreeIcon from '@/components/icons/ChartTreeIcon'
import DownloadIcon from '@/components/icons/DownloadIcon'
import CalendarIcon from '@/components/icons/CalendarIcon'
import FilterIcon from '@/components/icons/FilterIcon'

const AdminReports = () => {
  const router = useRouter()

  const reportCategories = [
    {
      id: '1',
      title: 'گزارش مالی',
      description: 'درآمد، هزینه‌ها و سودآوری سیستم',
      icon: <ChartTreeIcon className="size-8 text-success" />,
      color: 'success',
      metrics: ['درآمد کل: 125.5M تومان', 'هزینه‌ها: 45.2M تومان', 'سود خالص: 80.3M تومان'],
    },
    {
      id: '2',
      title: 'گزارش کاربران',
      description: 'آمار کاربران و فعالیت‌های آنان',
      icon: <ChartTreeIcon className="size-8 text-primary" />,
      color: 'primary',
      metrics: ['کل کاربران: 1,234', 'کاربران فعال: 987', 'نرخ رشد: +12%'],
    },
    {
      id: '3',
      title: 'گزارش فروشگاه‌ها',
      description: 'عملکرد فروشگاه‌ها و تراکنش‌ها',
      icon: <ChartTreeIcon className="size-8 text-warning" />,
      color: 'warning',
      metrics: ['کل فروشگاه‌ها: 89', 'فروشگاه‌های فعال: 67', 'میانگین تراکنش: 234'],
    },
    {
      id: '4',
      title: 'گزارش کارت‌های تخفیف',
      description: 'استفاده و اثربخشی کارت‌های تخفیف',
      icon: <ChartTreeIcon className="size-8 text-danger" />,
      color: 'danger',
      metrics: ['کل کارت‌ها: 2,345', 'استفاده شده: 1,890', 'نرخ استفاده: 80%'],
    },
  ]

  const recentReports = [
    {
      id: '1',
      title: 'گزارش ماهانه دی 1402',
      type: 'monthly',
      status: 'completed',
      generatedAt: '1402/10/01',
      size: '2.5MB',
      downloads: 45,
    },
    {
      id: '2',
      title: 'گزارش هفتگی هفته سوم',
      type: 'weekly',
      status: 'completed',
      generatedAt: '1402/09/25',
      size: '1.2MB',
      downloads: 23,
    },
    {
      id: '3',
      title: 'گزارش روزانه امروز',
      type: 'daily',
      status: 'processing',
      generatedAt: '1402/10/01',
      size: '0.5MB',
      downloads: 0,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'processing':
        return 'warning'
      case 'failed':
        return 'danger'
      default:
        return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'تکمیل شده'
      case 'processing':
        return 'در حال پردازش'
      case 'failed':
        return 'ناموفق'
      default:
        return 'نامشخص'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'daily':
        return 'primary'
      case 'weekly':
        return 'success'
      case 'monthly':
        return 'warning'
      case 'quarterly':
        return 'danger'
      default:
        return 'default'
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'daily':
        return 'روزانه'
      case 'weekly':
        return 'هفتگی'
      case 'monthly':
        return 'ماهانه'
      case 'quarterly':
        return 'فصلانه'
      default:
        return 'سایر'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ChartTreeIcon className="size-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-text-dark">گزارشات و تحلیل‌ها</h1>
            <p className="text-text-light">مشاهده و تحلیل عملکرد سیستم وفاداری</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            color="primary"
            variant="flat"
            startContent={<CalendarIcon className="size-5" />}
          >
            انتخاب بازه زمانی
          </Button>
          <Button
            color="success"
            startContent={<DownloadIcon className="size-5" />}
          >
            دانلود گزارش
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">درآمد ماه جاری</p>
                <p className="text-2xl font-bold text-text-dark">15.2M</p>
                <Chip color="success" size="sm" variant="flat" className="mt-2">
                  +8.5%
                </Chip>
              </div>
              <ChartTreeIcon className="size-8 text-success" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">کاربران جدید</p>
                <p className="text-2xl font-bold text-text-dark">234</p>
                <Chip color="success" size="sm" variant="flat" className="mt-2">
                  +12.3%
                </Chip>
              </div>
              <ChartTreeIcon className="size-8 text-primary" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">تراکنش‌های موفق</p>
                <p className="text-2xl font-bold text-text-dark">98.5%</p>
                <Chip color="success" size="sm" variant="flat" className="mt-2">
                  +1.2%
                </Chip>
              </div>
              <ChartTreeIcon className="size-8 text-warning" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">رضایت کاربران</p>
                <p className="text-2xl font-bold text-text-dark">4.8/5</p>
                <Chip color="success" size="sm" variant="flat" className="mt-2">
                  +0.3
                </Chip>
              </div>
              <ChartTreeIcon className="size-8 text-danger" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportCategories.map((category) => (
          <Card key={category.id} className="border-1">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                {category.icon}
                <div>
                  <h3 className="text-lg font-semibold text-text-dark">{category.title}</h3>
                  <p className="text-sm text-text-light">{category.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {category.metrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-background-50 rounded-lg">
                    <span className="text-sm text-text-dark">{metric}</span>
                    <Chip color={category.color as any} size="sm" variant="flat">
                      {index === 0 ? 'کل' : index === 1 ? 'میانگین' : 'نرخ'}
                    </Chip>
                  </div>
                ))}
                <Button
                  color={category.color as any}
                  variant="flat"
                  className="w-full mt-4"
                  startContent={<ChartTreeIcon className="size-4" />}
                >
                  مشاهده گزارش کامل
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Recent Reports */}
      <Card className="border-1">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text-dark">گزارشات اخیر</h3>
            <Button
              color="primary"
              variant="flat"
              startContent={<FilterIcon className="size-4" />}
            >
              فیلتر
            </Button>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <div className="divide-y divide-divider">
            {recentReports.map((report) => (
              <div key={report.id} className="p-4 hover:bg-background-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-background-100 rounded-lg flex items-center justify-center">
                      <ChartTreeIcon className="size-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-text-dark">{report.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <Chip
                          color={getTypeColor(report.type)}
                          size="sm"
                          variant="flat"
                        >
                          {getTypeText(report.type)}
                        </Chip>
                        <Chip
                          color={getStatusColor(report.status)}
                          size="sm"
                          variant="flat"
                        >
                          {getStatusText(report.status)}
                        </Chip>
                        <span className="text-xs text-text-light">
                          {report.generatedAt} - {report.size}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm text-text-light">دانلودها</p>
                      <p className="font-medium">{report.downloads}</p>
                    </div>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="primary"
                      aria-label="دانلود"
                      isDisabled={report.status !== 'completed'}
                    >
                      <DownloadIcon className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default AdminReports
