'use client'
import React from 'react'
import { Card, CardBody, CardHeader } from '@heroui/card'
import Button from '@/components/formElements/Button'
import { User } from '@heroui/user'
import { Chip } from '@heroui/chip'

import useAuth from '@/hooks/useAuth'

export default function UserIndexPage() {
  const { user } = useAuth()

  // Don't render if user is not available
  if (!user) {
    return null
  }

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'admin':
        return {
          title: 'پنل مدیریت',
          description: 'خوش آمدید به پنل مدیریت سیستم وفاداری',
          color: 'danger',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-600'
        }
      case 'store':
        return {
          title: 'پنل فروشگاه',
          description: 'خوش آمدید به پنل مدیریت فروشگاه',
          color: 'success',
          bgColor: 'bg-success-50',
          borderColor: 'border-success-200',
          textColor: 'text-success-600'
        }
      case 'customer':
      default:
        return {
          title: 'پنل مشتری',
          description: 'خوش آمدید به پنل مشتری',
          color: 'primary',
          bgColor: 'bg-primary-50',
          borderColor: 'border-primary-200',
          textColor: 'text-primary-600'
        }
    }
  }

  const roleInfo = getRoleInfo(user.role || 'customer')

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Banner */}
      <div className={`p-6 rounded-lg border-2 ${roleInfo.bgColor} ${roleInfo.borderColor}`}>
        <div className="text-center">
          <h1 className={`text-3xl font-bold ${roleInfo.textColor} mb-2`}>
            {roleInfo.title}
          </h1>
          <p className="text-gray-600 text-lg">
            {roleInfo.description}
          </p>
        </div>
      </div>

      {/* User Info Card */}
      <Card className="border-1">
        <CardHeader>
          <h2 className="text-xl font-semibold">اطلاعات کاربر</h2>
        </CardHeader>
        <CardBody>
          <div className="flex items-center gap-4">
            <User
              name={user.name || user.phoneNumber || 'کاربر'}
              description={user.phoneNumber || 'شماره موبایل'}
              avatarProps={{
                src: `https://ui-avatars.com/api/?name=${user.name || user.phoneNumber || 'کاربر'}&background=random`,
                size: "lg"
              }}
            />
            <div className="ml-auto text-right">
              <p className="text-sm text-gray-500">نقش</p>
              <p className="font-medium capitalize">{user.role || 'customer'}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Quick Navigation */}
      <Card className="border-1">
        <CardHeader>
          <h2 className="text-xl font-semibold">دسترسی سریع</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.role === 'admin' && (
              <Button
                color="danger"
                variant="flat"
                className="h-16 justify-start"
                to="/admin"
              >
                <div className="text-center">
                  <div className="text-lg font-medium">پنل مدیریت</div>
                  <div className="text-sm text-gray-500">مدیریت سیستم</div>
                </div>
              </Button>
            )}
            
            {user.role === 'store' && (
              <Button
                color="success"
                variant="flat"
                className="h-16 justify-start"
                to="/store"
              >
                <div className="text-center">
                  <div className="text-lg font-medium">پنل فروشگاه</div>
                  <div className="text-sm text-gray-500">مدیریت فروشگاه</div>
                </div>
              </Button>
            )}
            
            {user.role === 'customer' && (
              <Button
                color="primary"
                variant="flat"
                className="h-16 justify-start"
                to="/customer"
              >
                <div className="text-center">
                  <div className="text-lg font-medium">پنل مشتری</div>
                  <div className="text-sm text-gray-500">داشبورد مشتری</div>
                </div>
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Points Display (if customer) */}
      {user.role === 'customer' && (
        <Card className="border-1">
          <CardHeader>
            <h2 className="text-xl font-semibold">امتیازات وفاداری</h2>
          </CardHeader>
          <CardBody>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {(user.totalPoints || 0).toLocaleString()}
              </div>
              <p className="text-gray-600">امتیاز کل</p>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
