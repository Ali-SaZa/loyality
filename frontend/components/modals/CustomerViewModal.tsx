'use client'
import { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/table'

import Modal from './Modal'
import UserIcon from '@/components/icons/UserIcon'
import EditIcon from '@/components/icons/EditIcon'
import TrashIcon from '@/components/icons/TrashIcon'
import { CustomerTransaction, Transaction, transactionsService } from '@/services/transactions'
import { getUserById, User } from '@/services/users'
import useLoading from '@/hooks/useLoading'
import { UserStatus, getStatusConfig } from '@/types/enums'
import { formatDateToPersianJalali } from '@/helpers'

interface CustomerViewModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onEdit?: (userId: string) => void
  onDelete?: (userId: string) => void
  onSuccess?: () => void
  customerId?: string
}

const CustomerViewModal = ({ isOpen, onOpenChange, onEdit, onDelete, onSuccess, customerId }: CustomerViewModalProps) => {
  const { setLoading } = useLoading()
  const [customer, setCustomer] = useState<CustomerTransaction | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && customerId) {
      fetchCustomerData()
    }
  }, [isOpen, customerId])

  const fetchCustomerData = async () => {
    if (!customerId) return
    
    try {
      setIsLoading(true)
      setError(null)
      
      // Fetch user details and transactions in parallel
      const [userData, transactionsData] = await Promise.all([
        getUserById(customerId),
        transactionsService.getCustomerTransactions(customerId)
      ])
      
      setUser(userData)
      setTransactions(transactionsData)
      
      // Create customer object from user data and transactions
      const customerObj: CustomerTransaction = {
        id: userData.id,
        phoneNumber: userData.phoneNumber,
        firstName: userData.firstName,
        lastName: userData.lastName,
        status: userData.status || 'active',
        totalTransactions: transactionsData.length,
        totalSpent: transactionsData.reduce((sum, t) => sum + (t.promotion?.price || 0), 0),
        totalPointsEarned: transactionsData.reduce((sum, t) => sum + (t.promotion?.points || 0), 0),
        firstTransactionDate: transactionsData.length > 0 ? new Date(Math.min(...transactionsData.map(t => new Date(t.createdAt).getTime()))) : new Date(),
        lastTransactionDate: transactionsData.length > 0 ? new Date(Math.max(...transactionsData.map(t => new Date(t.createdAt).getTime()))) : new Date(),
        lastActivity: new Date(userData.lastActivity)
      }
      
      setCustomer(customerObj)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در بارگذاری اطلاعات مشتری')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    if (customerId && onEdit) {
      onOpenChange(false)
      onEdit(customerId)
    }
  }

  const handleDelete = async () => {
    if (!customerId) return
    
    if (confirm('آیا از حذف این مشتری اطمینان دارید؟')) {
      try {
        setLoading(true)
        // Note: We might need to implement a specific delete customer endpoint
        // For now, we'll just close the modal
        onOpenChange(false)
        onSuccess?.()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'خطا در حذف مشتری')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setError(null)
    setCustomer(null)
    setUser(null)
    setTransactions([])
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

  const getStatusColor = (status: string) => {
    return getStatusConfig(status).color
  }

  const getStatusText = (status: string) => {
    return getStatusConfig(status).text
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={handleClose}
      title="مشاهده اطلاعات مشتری"
      size="xl"
      hideFooter={true}
    >
      <div className="space-y-6">
        {error && (
          <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
            <p className="text-danger text-sm">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-text-light">در حال بارگذاری...</p>
          </div>
        ) : customer && user ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <UserIcon className="size-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text-dark">
                    {customer.firstName && customer.lastName 
                      ? `${customer.firstName} ${customer.lastName}` 
                      : customer.phoneNumber}
                  </h2>
                  <p className="text-text-light">مشاهده اطلاعات مشتری</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  color="primary"
                  startContent={<EditIcon className="size-5" />}
                  onClick={handleEdit}
                >
                  ویرایش
                </Button>
                <Button
                  color="danger"
                  variant="light"
                  startContent={<TrashIcon className="size-5" />}
                  onClick={handleDelete}
                >
                  حذف
                </Button>
              </div>
            </div>

            {/* Customer Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-1">
                <CardBody className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-text-light mb-1">کل تراکنش‌ها</p>
                    <p className="text-2xl font-bold text-primary">{customer.totalTransactions}</p>
                  </div>
                </CardBody>
              </Card>

              <Card className="border-1">
                <CardBody className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-text-light mb-1">کل خرید</p>
                    <p className="text-2xl font-bold text-success">{formatCurrency(customer.totalSpent)} تومان</p>
                  </div>
                </CardBody>
              </Card>

              <Card className="border-1">
                <CardBody className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-text-light mb-1">امتیازات</p>
                    <p className="text-2xl font-bold text-warning">{customer.totalPointsEarned}</p>
                  </div>
                </CardBody>
              </Card>

              <Card className="border-1">
                <CardBody className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-text-light mb-1">وضعیت</p>
                    <Chip
                      color={getStatusColor(customer.status)}
                      size="sm"
                      variant="flat"
                    >
                      {getStatusText(customer.status)}
                    </Chip>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-1">
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold text-text-dark">اطلاعات شخصی</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div>
                    <label className="text-sm text-text-light">نام</label>
                    <p className="font-medium">{customer.firstName || 'ثبت نشده'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-text-light">نام خانوادگی</label>
                    <p className="font-medium">{customer.lastName || 'ثبت نشده'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-text-light">شماره تلفن</label>
                    <p className="font-medium">{formatPhoneNumber(customer.phoneNumber)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-text-light">وضعیت</label>
                    <div className="mt-1">
                      <Chip
                        color={getStatusColor(customer.status)}
                        size="sm"
                        variant="flat"
                      >
                        {getStatusText(customer.status)}
                      </Chip>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="border-1">
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold text-text-dark">اطلاعات فعالیت</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div>
                    <label className="text-sm text-text-light">اولین خرید</label>
                    <p className="font-medium">{formatDate(customer.firstTransactionDate.toString())}</p>
                  </div>
                  <div>
                    <label className="text-sm text-text-light">آخرین خرید</label>
                    <p className="font-medium">{formatDate(customer.lastTransactionDate.toString())}</p>
                  </div>
                  <div>
                    <label className="text-sm text-text-light">آخرین فعالیت</label>
                    <p className="font-medium">{formatDate(customer.lastActivity.toString())}</p>
                  </div>
                  <div>
                    <label className="text-sm text-text-light">تاریخ عضویت</label>
                    <p className="font-medium">{formatDate(user.createdAt)}</p>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Transactions History */}
            {transactions.length > 0 && (
              <Card className="border-1">
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold text-text-dark">تاریخچه تراکنش‌ها</h3>
                </CardHeader>
                <CardBody className="p-0">
                  <Table aria-label="تاریخچه تراکنش‌ها">
                    <TableHeader>
                      <TableColumn>تاریخ</TableColumn>
                      <TableColumn>پروماکد</TableColumn>
                      <TableColumn>پیشنهاد</TableColumn>
                      <TableColumn>قیمت</TableColumn>
                      <TableColumn>امتیاز</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{formatDate(transaction.createdAt.toString())}</TableCell>
                          <TableCell>
                            <span className="font-medium">{transaction.promoCode?.code || 'نامشخص'}</span>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">{transaction.promotion?.title || 'نامشخص'}</span>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">{formatCurrency(transaction.promotion?.price || 0)} تومان</span>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">{transaction.promotion?.points || 0}</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardBody>
              </Card>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-text-light">مشتری یافت نشد</p>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default CustomerViewModal
