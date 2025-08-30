'use client'
import { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/table'
import { useRouter } from 'next/navigation'

import UserIcon from '@/components/icons/UserIcon'
import EditIcon from '@/components/icons/EditIcon'
import TrashIcon from '@/components/icons/TrashIcon'
import EyeIcon from '@/components/icons/EyeIcon'
import { getAllUsers, User } from '@/services/users'
import useLoading from '@/hooks/useLoading'
import { UserStatus, getStatusConfig } from '@/types/enums'

const AdminCustomers = () => {
  const router = useRouter()
  const { setLoading } = useLoading()
  
  const [customers, setCustomers] = useState<User[]>([])
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    blocked: 0,
    deleted: 0
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getAllUsers(1, 50)
      // Filter only customers (role === 'customer')
      const customerUsers = response.users.filter(user => user.role === 'customer')
      setCustomers(customerUsers)
      
      // Calculate stats
      const total = customerUsers.length
      const active = customerUsers.filter(c => c.status === 'active').length
      const blocked = customerUsers.filter(c => c.status === 'blocked').length
      const deleted = customerUsers.filter(c => c.status === 'deleted').length
      
      setStats({ total, active, blocked, deleted })
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
    return date.toLocaleDateString('fa-IR')
  }

  const formatPhoneNumber = (phone: string) => {
    // Format Iranian phone number
    if (phone.startsWith('09')) {
      return phone.replace(/(\d{4})(\d{3})(\d{4})/, '$1-$2-$3')
    }
    return phone
  }

  const handleViewCustomer = (customerId: string) => {
    router.push(`/admin/customers/${customerId}`)
  }

  const handleEditCustomer = (customerId: string) => {
    router.push(`/admin/customers/${customerId}/edit`)
  }

  const handleDeleteCustomer = async (customerId: string) => {
    if (confirm('آیا از حذف این مشتری اطمینان دارید؟')) {
      try {
        setLoading(true)
        // TODO: Implement delete customer functionality
        await fetchCustomers() // Refresh the list
      } catch (err) {
        setError(err instanceof Error ? err.message : 'خطا در حذف مشتری')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleAddCustomer = () => {
    router.push('/admin/customers/new')
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
            <h1 className="text-2xl font-bold text-text-dark">مدیریت مشتریان</h1>
            <p className="text-text-light">مشاهده و مدیریت تمام مشتریان سیستم</p>
          </div>
        </div>
        <Button
          color="primary"
          startContent={<UserIcon className="size-5" />}
          onClick={handleAddCustomer}
        >
          افزودن مشتری جدید
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">کل مشتریان</p>
                <p className="text-2xl font-bold text-text-dark">{stats.total}</p>
              </div>
              <UserIcon className="size-8 text-primary" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">مشتریان فعال</p>
                <p className="text-2xl font-bold text-text-dark">{stats.active}</p>
              </div>
              <UserIcon className="size-8 text-success" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">مشتریان مسدود</p>
                <p className="text-2xl font-bold text-text-dark">{stats.blocked}</p>
              </div>
              <UserIcon className="size-8 text-warning" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">حذف شده</p>
                <p className="text-2xl font-bold text-text-dark">{stats.deleted}</p>
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
              <TableColumn>امتیازات</TableColumn>
              <TableColumn>خریدها</TableColumn>
              <TableColumn>آخرین فعالیت</TableColumn>
              <TableColumn>عملیات</TableColumn>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {customer.firstName?.charAt(0) || customer.phoneNumber.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">
                          {customer.firstName && customer.lastName 
                            ? `${customer.firstName} ${customer.lastName}`
                            : customer.firstName || 'نامشخص'
                          }
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
                      color={getStatusColor(customer.status || 'active')}
                      size="sm"
                      variant="flat"
                    >
                      {getStatusText(customer.status || 'active')}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{customer.totalPoints.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{customer.purchases?.length || 0}</span>
                  </TableCell>
                  <TableCell>{formatDate(customer.lastActivity)}</TableCell>
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
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        aria-label="حذف"
                        onClick={() => handleDeleteCustomer(customer.id)}
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

export default AdminCustomers
