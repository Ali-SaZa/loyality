'use client'
import React from 'react'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/table'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import UserIcon from '@/components/icons/UserIcon'
import EditIcon from '@/components/icons/EditIcon'
import TrashIcon from '@/components/icons/TrashIcon'
import useAuth from '@/hooks/useAuth'

const AdminUsers = () => {
  const { user } = useAuth()
  const router = useRouter()

  // Redirect if user is not admin
  useEffect(() => {
    if (user) {
      // Redirect non-admin users to their appropriate dashboard
      if (user.role === 'store') {
        router.replace('/store')
      } else if (user.role === 'customer') {
        router.replace('/customer')
      } else {
        router.replace('/auth')
      }
    } else {
      // No user, redirect to auth
      router.replace('/auth')
    }
  }, [user, router])

  // Show loading while checking auth
  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-light">در حال بارگذاری...</p>
        </div>
      </div>
    )
  }

  const users = [
    {
      id: '1',
      name: 'علی محمدی',
      phone: '09111111111',
      role: 'customer',
      points: 150,
      status: 'active',
      joinDate: '1403/01/15',
    },
    {
      id: '2',
      name: 'فاطمه احمدی',
      phone: '09222222222',
      role: 'store',
      points: 0,
      status: 'active',
      joinDate: '1403/01/10',
    },
    {
      id: '3',
      name: 'محمد رضایی',
      phone: '09333333333',
      role: 'customer',
      points: 75,
      status: 'inactive',
      joinDate: '1402/12/20',
    },
  ]

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'danger'
      case 'store':
        return 'success'
      case 'customer':
        return 'primary'
      default:
        return 'default'
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return 'ادمین'
      case 'store':
        return 'فروشگاه'
      case 'customer':
        return 'مشتری'
      default:
        return 'نامشخص'
    }
  }

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'success' : 'danger'
  }

  const getStatusText = (status: string) => {
    return status === 'active' ? 'فعال' : 'غیرفعال'
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserIcon className="size-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-text-dark">مدیریت کاربران</h1>
            <p className="text-text-light">مشاهده و مدیریت تمام کاربران سیستم</p>
          </div>
        </div>
        <Button
          color="primary"
          startContent={<UserIcon className="size-5" />}
        >
          افزودن کاربر جدید
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">کل کاربران</p>
                <p className="text-2xl font-bold text-text-dark">1,234</p>
              </div>
              <UserIcon className="size-8 text-primary" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">مشتریان</p>
                <p className="text-2xl font-bold text-text-dark">1,100</p>
              </div>
              <UserIcon className="size-8 text-primary" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">فروشگاه‌ها</p>
                <p className="text-2xl font-bold text-text-dark">89</p>
              </div>
              <UserIcon className="size-8 text-success" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">ادمین‌ها</p>
                <p className="text-2xl font-bold text-text-dark">45</p>
              </div>
              <UserIcon className="size-8 text-danger" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="border-1">
        <CardHeader className="pb-3">
          <h3 className="text-lg font-semibold text-text-dark">لیست کاربران</h3>
        </CardHeader>
        <CardBody className="p-0">
          <Table aria-label="لیست کاربران">
            <TableHeader>
              <TableColumn>نام</TableColumn>
              <TableColumn>شماره تماس</TableColumn>
              <TableColumn>نقش</TableColumn>
              <TableColumn>امتیاز</TableColumn>
              <TableColumn>وضعیت</TableColumn>
              <TableColumn>تاریخ عضویت</TableColumn>
              <TableColumn>عملیات</TableColumn>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <Chip
                      color={getRoleColor(user.role)}
                      size="sm"
                      variant="flat"
                    >
                      {getRoleText(user.role)}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{user.points}</span>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={getStatusColor(user.status)}
                      size="sm"
                      variant="flat"
                    >
                      {getStatusText(user.status)}
                    </Chip>
                  </TableCell>
                  <TableCell>{user.joinDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
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

export default AdminUsers
