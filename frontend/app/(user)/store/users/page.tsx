'use client'
import { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/table'

import UserIcon from '@/components/icons/UserIcon'
import EditIcon from '@/components/icons/EditIcon'
import EyeIcon from '@/components/icons/EyeIcon'
import { transactionsService, CustomerTransaction } from '@/services/transactions'
import useLoading from '@/hooks/useLoading'
import { getStatusConfig } from '@/types/enums'
import { formatDateToPersianJalali } from '@/helpers'
import CustomerViewModal from '@/components/modals/CustomerViewModal'

const StoreUsers = () => {
  const { setLoading } = useLoading()
  
  const [customers, setCustomers] = useState<CustomerTransaction[]>([])
  const [error, setError] = useState<string | null>(null)

  // Customer view modal state
  const [customerViewModal, setCustomerViewModal] = useState({
    isOpen: false,
    customerId: undefined as string | undefined
  })

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await transactionsService.getMyStoreCustomers()
      setCustomers(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در بارگذاری مشتریان')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    return getStatusConfig(status).color
  }

  const getStatusText = (status: string) => {
    return getStatusConfig(status).text
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return formatDateToPersianJalali(date)
  }

  const formatPhoneNumber = (phone: string) => {
    // Format Iranian phone number
    if (phone.startsWith('09')) {
      return phone.replace(/(\d{4})(\d{3})(\d{4})/, '$1-$2-$3')
    }
    return phone
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount)
  }

  const handleViewCustomer = (customerId: string) => {
    setCustomerViewModal({
      isOpen: true,
      customerId
    })
  }

  const handleEditCustomer = (customerId: string) => {
    setCustomerViewModal({
      isOpen: true,
      customerId
    })
  }

  const handleCustomerViewEdit = (customerId: string) => {
    setCustomerViewModal({
      isOpen: true,
      customerId
    })
  }

  const handleCustomerViewDelete = (customerId: string) => {
    // This will be handled by the view modal itself
  }

  const handleCustomerViewSuccess = () => {
    fetchCustomers() // Refresh the list
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-1">
          <CardBody className="p-6">
            <div className="text-center">
              <p className="text-danger mb-4">{error}</p>
              <Button color="primary" onClick={fetchCustomers}>
                تلاش مجدد
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserIcon className="size-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-text-dark">مشتریان فروشگاه</h1>
            <p className="text-text-light">مدیریت مشتریان و تراکنش‌های فروشگاه</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">کل مشتریان</p>
                <p className="text-2xl font-bold text-text-dark">{customers.length}</p>
              </div>
              <UserIcon className="size-8 text-primary" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">کل تراکنش‌ها</p>
                <p className="text-2xl font-bold text-text-dark">
                  {customers.reduce((sum, customer) => sum + customer.totalTransactions, 0)}
                </p>
              </div>
              <UserIcon className="size-8 text-success" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">کل فروش</p>
                <p className="text-2xl font-bold text-text-dark">
                  {formatCurrency(customers.reduce((sum, customer) => sum + customer.totalSpent, 0))} تومان
                </p>
              </div>
              <UserIcon className="size-8 text-warning" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">کل امتیازات</p>
                <p className="text-2xl font-bold text-text-dark">
                  {customers.reduce((sum, customer) => sum + customer.totalPointsEarned, 0)}
                </p>
              </div>
              <UserIcon className="size-8 text-danger" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Customers Table */}
      <Card className="border-1">
        <CardHeader className="pb-3">
          <h3 className="text-lg font-semibold text-text-dark">لیست مشتریان</h3>
        </CardHeader>
        <CardBody className="p-0">
          <Table aria-label="لیست مشتریان">
            <TableHeader>
              <TableColumn>نام مشتری</TableColumn>
              <TableColumn>شماره تلفن</TableColumn>
              <TableColumn>وضعیت</TableColumn>
              <TableColumn>تعداد تراکنش</TableColumn>
              <TableColumn>کل خرید</TableColumn>
              <TableColumn>امتیازات</TableColumn>
              <TableColumn>آخرین خرید</TableColumn>
              <TableColumn>عملیات</TableColumn>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {customer.firstName ? customer.firstName.charAt(0) : customer.phoneNumber.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">
                          {customer.firstName && customer.lastName 
                            ? `${customer.firstName} ${customer.lastName}` 
                            : 'نام ثبت نشده'}
                        </span>
                        <p className="text-xs text-text-light">ID: {customer.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{formatPhoneNumber(customer.phoneNumber)}</span>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={getStatusColor(customer.status)}
                      size="sm"
                      variant="flat"
                    >
                      {getStatusText(customer.status)}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{customer.totalTransactions}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{formatCurrency(customer.totalSpent)} تومان</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{customer.totalPointsEarned}</span>
                  </TableCell>
                  <TableCell>{formatDate(customer.lastTransactionDate.toString())}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="primary"
                        aria-label="مشاهده"
                        onClick={() => handleViewCustomer(customer.id)}
                      >
                        <EyeIcon className="size-4" />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="primary"
                        aria-label="ویرایش"
                        onClick={() => handleEditCustomer(customer.id)}
                      >
                        <EditIcon className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Customer View Modal */}
      <CustomerViewModal
        isOpen={customerViewModal.isOpen}
        onOpenChange={(isOpen) => setCustomerViewModal(prev => ({ ...prev, isOpen }))}
        onEdit={handleCustomerViewEdit}
        onDelete={handleCustomerViewDelete}
        onSuccess={handleCustomerViewSuccess}
        customerId={customerViewModal.customerId}
      />
    </div>
  )
}

export default StoreUsers