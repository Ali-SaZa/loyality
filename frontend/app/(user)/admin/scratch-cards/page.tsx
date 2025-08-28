'use client'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/table'
import { useRouter } from 'next/navigation'

import ListIcon from '@/components/icons/ListIcon'
import EditIcon from '@/components/icons/EditIcon'
import TrashIcon from '@/components/icons/TrashIcon'
import EyeIcon from '@/components/icons/EyeIcon'
import StoreIcon from '@/components/icons/ChartTreeIcon'

const AdminScratchCards = () => {
  const router = useRouter()

  const scratchCards = [
    {
      id: '1',
      code: 'SCR001',
      value: 50000,
      discount: '20%',
      store: 'فروشگاه الکترونیک تهران',
      status: 'active',
      type: 'percentage',
      maxUsage: 100,
      usedCount: 45,
      expiryDate: '1403/12/29',
      createdAt: '1403/01/15',
    },
    {
      id: '2',
      code: 'SCR002',
      value: 100000,
      discount: '50000 تومان',
      store: 'فروشگاه لباس مد',
      status: 'active',
      type: 'fixed',
      maxUsage: 50,
      usedCount: 23,
      expiryDate: '1403/12/29',
      createdAt: '1403/01/10',
    },
    {
      id: '3',
      code: 'SCR003',
      value: 25000,
      discount: '15%',
      store: 'فروشگاه مواد غذایی',
      status: 'expired',
      type: 'percentage',
      maxUsage: 200,
      usedCount: 189,
      expiryDate: '1402/12/29',
      createdAt: '1402/11/20',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success'
      case 'expired':
        return 'danger'
      case 'depleted':
        return 'warning'
      case 'inactive':
        return 'default'
      default:
        return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'فعال'
      case 'expired':
        return 'منقضی شده'
      case 'depleted':
        return 'تمام شده'
      case 'inactive':
        return 'غیرفعال'
      default:
        return 'نامشخص'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'percentage':
        return 'primary'
      case 'fixed':
        return 'success'
      default:
        return 'default'
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'percentage':
        return 'درصدی'
      case 'fixed':
        return 'مبلغ ثابت'
      default:
        return 'سایر'
    }
  }

  const getUsagePercentage = (used: number, max: number) => {
    return Math.round((used / max) * 100)
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 80) return 'danger'
    if (percentage >= 60) return 'warning'
    return 'success'
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ListIcon className="size-8 text-warning" />
          <div>
            <h1 className="text-2xl font-bold text-text-dark">مدیریت کارت‌های تخفیف</h1>
            <p className="text-text-light">ایجاد و مدیریت کارت‌های تخفیف سیستم</p>
          </div>
        </div>
        <Button
          color="warning"
          startContent={<ListIcon className="size-5" />}
        >
          ایجاد کارت تخفیف جدید
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">کل کارت‌ها</p>
                <p className="text-2xl font-bold text-text-dark">2,345</p>
              </div>
              <ListIcon className="size-8 text-warning" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">کارت‌های فعال</p>
                <p className="text-2xl font-bold text-text-dark">1,890</p>
              </div>
              <ListIcon className="size-8 text-success" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">استفاده شده</p>
                <p className="text-2xl font-bold text-text-dark">456</p>
              </div>
              <ListIcon className="size-8 text-primary" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">منقضی شده</p>
                <p className="text-2xl font-bold text-text-dark">89</p>
              </div>
              <ListIcon className="size-8 text-danger" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Scratch Cards Table */}
      <Card className="border-1">
        <CardHeader className="pb-3">
          <h3 className="text-lg font-semibold text-text-dark">لیست کارت‌های تخفیف</h3>
        </CardHeader>
        <CardBody className="p-0">
          <Table aria-label="لیست کارت‌های تخفیف">
            <TableHeader>
              <TableColumn>کد کارت</TableColumn>
              <TableColumn>مقدار تخفیف</TableColumn>
              <TableColumn>فروشگاه</TableColumn>
              <TableColumn>نوع</TableColumn>
              <TableColumn>وضعیت</TableColumn>
              <TableColumn>استفاده</TableColumn>
              <TableColumn>تاریخ انقضا</TableColumn>
              <TableColumn>عملیات</TableColumn>
            </TableHeader>
            <TableBody>
              {scratchCards.map((card) => {
                const usagePercentage = getUsagePercentage(card.usedCount, card.maxUsage)
                return (
                  <TableRow key={card.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-warning rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {card.code.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium font-mono">{card.code}</span>
                          <p className="text-xs text-text-light">ارزش: {card.value.toLocaleString()} تومان</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <span className="font-medium">{card.discount}</span>
                        <p className="text-xs text-text-light">
                          {card.type === 'percentage' ? 'تخفیف درصدی' : 'تخفیف مبلغی'}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StoreIcon className="size-4 text-success" />
                        <span className="text-sm">{card.store}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={getTypeColor(card.type)}
                        size="sm"
                        variant="flat"
                      >
                        {getTypeText(card.type)}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={getStatusColor(card.status)}
                        size="sm"
                        variant="flat"
                      >
                        {getStatusText(card.status)}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>{card.usedCount}/{card.maxUsage}</span>
                          <span>{usagePercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full bg-${getUsageColor(usagePercentage)}`}
                            style={{ width: `${usagePercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{card.expiryDate}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="primary"
                          aria-label="مشاهده"
                        >
                          <EyeIcon className="size-4" />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="primary"
                          aria-label="ویرایش"
                        >
                          <EditIcon className="size-4" />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="danger"
                          aria-label="حذف"
                        >
                          <TrashIcon className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  )
}

export default AdminScratchCards
