'use client'
import React from 'react'
import { Card, CardBody, CardHeader } from '@heroui/card'
import Button from '@/components/formElements/Button'
import { User } from '@heroui/user'
import { Chip } from '@heroui/chip'

import useAuth from '@/hooks/useAuth'
import { getMenuByRole } from '@/helpers/menuUtils'
import { UserRole, getRoleConfig } from '@/types/enums'

// User data interface
interface UserData {
  accessToken: string
  refreshToken: string
  userId: string
  AccessTokenExpireTime: number
  refreshTokenExpireTime: number
  _id?: string
  phoneNumber?: string
  name?: string
  totalPoints?: number
  role?: string
  lastActivity?: string
  [key: string]: any
}


const getUserLevelInfo = (role: string) => {
  switch (role) {
    case 'admin':
      return {
        title: 'مدیر سیستم',
        description: 'دسترسی کامل به تمام بخش‌ها',
        color: 'bg-red-500',
        textColor: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      }
    case 'store':
      return {
        title: 'صاحب فروشگاه',
        description: 'مدیریت فروشگاه و مشتریان',
        color: 'bg-blue-500',
        textColor: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      }
    case 'customer':
    default:
      return {
        title: 'مشتری',
        description: 'استفاده از خدمات وفاداری',
        color: 'bg-green-500',
        textColor: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      }
  }
}

function CustomerDashboardContent() {
  const { user } = useAuth()

  // Don't render if user is not available
  if (!user) {
    return null
  }

  const userLevelInfo = getRoleConfig(user.role || 'customer')
  const menuItems = getMenuByRole(user.role || 'customer')

  return (
    <div className="p-6 space-y-6">
      {/* User Level Banner */}
      <div className={`p-4 rounded-lg border-2 ${userLevelInfo.bgColor} ${userLevelInfo.borderColor}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${userLevelInfo.color}`}></div>
            <div>
              <h2 className={`text-lg font-bold ${userLevelInfo.textColor}`}>
                {userLevelInfo.title}
              </h2>
              <p className="text-gray-600 text-sm">
                {userLevelInfo.description}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">سطح کاربری</p>
                          <p className={`font-semibold ${userLevelInfo.textColor}`}>
                {user.role === UserRole.ADMIN ? 'Admin' : user.role === UserRole.STORE ? 'Store' : 'Customer'}
              </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">داشبورد برنامه وفاداری</h1>
        <Chip
          color={getRoleConfig(user.role || 'customer').color}
          variant="flat"
          size="lg"
        >
          {getRoleConfig(user.role || 'customer').title}
        </Chip>
      </div>

      {/* User Info Card */}
      <Card className="border-1">
        <CardHeader>
          <h2 className="text-xl font-semibold">اطلاعات کاربر</h2>
        </CardHeader>
        <CardBody>
          <div className="flex items-center gap-4">
            <User
              name={user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName || user.lastName || user.phoneNumber || 'کاربر'}
              description={user.phoneNumber || 'شماره موبایل'}
              avatarProps={{
                src: `https://ui-avatars.com/api/?name=${user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName || user.lastName || user.phoneNumber || 'کاربر'}&background=random`,
                size: "lg"
              }}
            />
            <div className="ml-auto text-right">
              <p className="text-sm text-gray-500">نقش</p>
              <p className="font-medium capitalize">{getRoleConfig(user.role || 'customer').text}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Points Card */}
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

      {/* Quick Actions */}
      <Card className="border-1">
        <CardHeader>
          <h2 className="text-xl font-semibold">عملیات سریع</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {menuItems.slice(0, 3).map((item, index) => (
              <Button
                key={index}
                color="primary"
                variant="flat"
                className="h-20 justify-start"
                iconStart={item.icon('size-6')}
                to={item.link}
              >
                <div className="text-center">
                  <div className="text-lg font-medium">{item.title}</div>
                  <div className="text-sm text-gray-500">دسترسی سریع</div>
                </div>
              </Button>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Debug Info (Remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="border-1">
          <CardHeader>
            <h2 className="text-xl font-semibold text-yellow-600">Debug Info</h2>
          </CardHeader>
          <CardBody>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </CardBody>
        </Card>
      )}
    </div>
  )
}

// Main customer dashboard page
export default function CustomerDashboardPage() {
  return <CustomerDashboardContent />
}
