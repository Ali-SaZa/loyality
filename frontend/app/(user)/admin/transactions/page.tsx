'use client'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/table'
import { useRouter } from 'next/navigation'

import WalletIcon from '@/components/icons/WalletIcon'
import EditIcon from '@/components/icons/EditIcon'
import TrashIcon from '@/components/icons/TrashIcon'
import EyeIcon from '@/components/icons/EyeIcon'
import UserIcon from '@/components/icons/UserIcon'
import StoreIcon from '@/components/icons/ChartTreeIcon'

const AdminTransactions = () => {
  const router = useRouter()

  const transactions = [
    {
      id: '1',
      user: 'علی محمدی',
      store: 'فروشگاه الکترونیک تهران',
      type: 'purchase',
      amount: 250000,
      points: 25,
      status: 'completed',
      date: '1403/01/15',
      time: '14:30',
      description: 'خرید گوشی موبایل',
    },
    {
      id: '2',
      user: 'فاطمه احمدی',
      store: 'فروشگاه لباس مد',
      type: 'redemption',
      amount: -50000,
      points: -50,
      status: 'completed',
      date: '1403/01/15',
      time: '13:15',
      description: 'استفاده از کارت تخفیف',
    },
    {
      id: '3',
      user: 'محمد رضایی',
      store: 'فروشگاه مواد غذایی',
      type: 'purchase',
      amount: 75000,
      points: 7,
      status: 'pending',
      date: '1403/01/15',
      time: '12:45',
      description: 'خرید مواد غذایی',
    },
    {
      id: '4',
      user: 'زهرا کریمی',
      store: 'فروشگاه الکترونیک تهران',
      type: 'bonus',
      amount: 0,
      points: 100,
      status: 'completed',
      date: '1403/01/14',
      time: '16:20',
      description: 'امتیاز هدیه ثبت نام',
    },
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'purchase':
        return 'success'
      case 'redemption':
        return 'warning'
      case 'bonus':
        return 'primary'
      case 'refund':
        return 'danger'
      default:
        return 'default'
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'purchase':
        return 'خرید'
      case 'redemption':
        return 'استفاده از تخفیف'
      case 'bonus':
        return 'امتیاز هدیه'
      case 'refund':
        return 'بازگشت وجه'
      default:
        return 'سایر'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'pending':
        return 'warning'
      case 'failed':
        return 'danger'
      case 'cancelled':
        return 'default'
      default:
        return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'تکمیل شده'
      case 'pending':
        return 'در انتظار'
      case 'failed':
        return 'ناموفق'
      case 'cancelled':
        return 'لغو شده'
      default:
        return 'نامشخص'
    }
  }

  const formatAmount = (amount: number) => {
    if (amount === 0) return '0 تومان'
    const sign = amount > 0 ? '+' : ''
    return `${sign}${amount.toLocaleString()} تومان`
  }

  const formatPoints = (points: number) => {
    const sign = points > 0 ? '+' : ''
    return `${sign}${points} امتیاز`
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <WalletIcon className="size-8 text-warning" />
          <div>
            <h1 className="text-2xl font-bold text-text-dark">مدیریت تراکنش‌ها</h1>
            <p className="text-text-light">مشاهده و مدیریت تمام تراکنش‌های سیستم</p>
          </div>
        </div>
        <Button
          color="warning"
          startContent={<WalletIcon className="size-5" />}
        >
          گزارش مالی
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">کل تراکنش‌ها</p>
                <p className="text-2xl font-bold text-text-dark">5,678</p>
              </div>
              <WalletIcon className="size-8 text-warning" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">درآمد کل</p>
                <p className="text-2xl font-bold text-text-dark">125.5M</p>
              </div>
              <WalletIcon className="size-8 text-success" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">امتیازات توزیع شده</p>
                <p className="text-2xl font-bold text-text-dark">45,678</p>
              </div>
              <WalletIcon className="size-8 text-primary" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">تراکنش‌های امروز</p>
                <p className="text-2xl font-bold text-text-dark">234</p>
              </div>
              <WalletIcon className="size-8 text-info" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="border-1">
        <CardHeader className="pb-3">
          <h3 className="text-lg font-semibold text-text-dark">لیست تراکنش‌ها</h3>
        </CardHeader>
        <CardBody className="p-0">
          <Table aria-label="لیست تراکنش‌ها">
            <TableHeader>
              <TableColumn>کاربر</TableColumn>
              <TableColumn>فروشگاه</TableColumn>
              <TableColumn>نوع</TableColumn>
              <TableColumn>مبلغ</TableColumn>
              <TableColumn>امتیاز</TableColumn>
              <TableColumn>وضعیت</TableColumn>
              <TableColumn>تاریخ و زمان</TableColumn>
              <TableColumn>عملیات</TableColumn>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {transaction.user.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">{transaction.user}</span>
                        <p className="text-xs text-text-light">{transaction.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <StoreIcon className="size-4 text-success" />
                      <span className="text-sm">{transaction.store}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={getTypeColor(transaction.type)}
                      size="sm"
                      variant="flat"
                    >
                      {getTypeText(transaction.type)}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${
                      transaction.amount > 0 ? 'text-success' : 
                      transaction.amount < 0 ? 'text-danger' : 'text-text-dark'
                    }`}>
                      {formatAmount(transaction.amount)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${
                      transaction.points > 0 ? 'text-success' : 
                      transaction.points < 0 ? 'text-danger' : 'text-text-dark'
                    }`}>
                      {formatPoints(transaction.points)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={getStatusColor(transaction.status)}
                      size="sm"
                      variant="flat"
                    >
                      {getStatusText(transaction.status)}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{transaction.date}</div>
                      <div className="text-text-light">{transaction.time}</div>
                    </div>
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
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  )
}

export default AdminTransactions
