'use client'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/table'
import { useRouter } from 'next/navigation'

import StoreIcon from '@/components/icons/ChartTreeIcon'
import EditIcon from '@/components/icons/EditIcon'
import TrashIcon from '@/components/icons/TrashIcon'
import EyeIcon from '@/components/icons/EyeIcon'

const AdminStores = () => {
  const router = useRouter()

  const stores = [
    {
      id: '1',
      name: 'فروشگاه الکترونیک تهران',
      owner: 'علی محمدی',
      phone: '021-12345678',
      address: 'تهران، خیابان ولیعصر',
      status: 'active',
      type: 'electronics',
      joinDate: '1403/01/15',
      customers: 456,
      transactions: 1234,
    },
    {
      id: '2',
      name: 'فروشگاه لباس مد',
      owner: 'فاطمه احمدی',
      phone: '021-87654321',
      address: 'تهران، خیابان انقلاب',
      status: 'active',
      type: 'clothing',
      joinDate: '1403/01/10',
      customers: 234,
      transactions: 567,
    },
    {
      id: '3',
      name: 'فروشگاه مواد غذایی',
      owner: 'محمد رضایی',
      phone: '021-11223344',
      address: 'تهران، خیابان آزادی',
      status: 'pending',
      type: 'food',
      joinDate: '1402/12/20',
      customers: 89,
      transactions: 234,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success'
      case 'pending':
        return 'warning'
      case 'inactive':
        return 'danger'
      default:
        return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'فعال'
      case 'pending':
        return 'در انتظار تایید'
      case 'inactive':
        return 'غیرفعال'
      default:
        return 'نامشخص'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'electronics':
        return 'primary'
      case 'clothing':
        return 'success'
      case 'food':
        return 'warning'
      default:
        return 'default'
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'electronics':
        return 'الکترونیک'
      case 'clothing':
        return 'لباس'
      case 'food':
        return 'مواد غذایی'
      default:
        return 'سایر'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StoreIcon className="size-8 text-success" />
          <div>
            <h1 className="text-2xl font-bold text-text-dark">مدیریت فروشگاه‌ها</h1>
            <p className="text-text-light">مشاهده و مدیریت تمام فروشگاه‌های سیستم</p>
          </div>
        </div>
        <Button
          color="success"
          startContent={<StoreIcon className="size-5" />}
        >
          افزودن فروشگاه جدید
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">کل فروشگاه‌ها</p>
                <p className="text-2xl font-bold text-text-dark">89</p>
              </div>
              <StoreIcon className="size-8 text-success" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">فروشگاه‌های فعال</p>
                <p className="text-2xl font-bold text-text-dark">67</p>
              </div>
              <StoreIcon className="size-8 text-success" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">در انتظار تایید</p>
                <p className="text-2xl font-bold text-text-dark">12</p>
              </div>
              <StoreIcon className="size-8 text-warning" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">غیرفعال</p>
                <p className="text-2xl font-bold text-text-dark">10</p>
              </div>
              <StoreIcon className="size-8 text-danger" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Stores Table */}
      <Card className="border-1">
        <CardHeader className="pb-3">
          <h3 className="text-lg font-semibold text-text-dark">لیست فروشگاه‌ها</h3>
        </CardHeader>
        <CardBody className="p-0">
          <Table aria-label="لیست فروشگاه‌ها">
            <TableHeader>
              <TableColumn>نام فروشگاه</TableColumn>
              <TableColumn>صاحب</TableColumn>
              <TableColumn>نوع</TableColumn>
              <TableColumn>وضعیت</TableColumn>
              <TableColumn>مشتریان</TableColumn>
              <TableColumn>تراکنش‌ها</TableColumn>
              <TableColumn>تاریخ عضویت</TableColumn>
              <TableColumn>عملیات</TableColumn>
            </TableHeader>
            <TableBody>
              {stores.map((store) => (
                <TableRow key={store.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {store.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">{store.name}</span>
                        <p className="text-xs text-text-light">{store.address}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <span className="font-medium">{store.owner}</span>
                      <p className="text-xs text-text-light">{store.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={getTypeColor(store.type)}
                      size="sm"
                      variant="flat"
                    >
                      {getTypeText(store.type)}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={getStatusColor(store.status)}
                      size="sm"
                      variant="flat"
                    >
                      {getStatusText(store.status)}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{store.customers.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{store.transactions.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>{store.joinDate}</TableCell>
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

export default AdminStores
