'use client'
import { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import { useRouter, useParams } from 'next/navigation'

import UserIcon from '@/components/icons/UserIcon'
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon'
import EditIcon from '@/components/icons/EditIcon'
import TrashIcon from '@/components/icons/TrashIcon'
import { getUserById, deleteUser, User } from '@/services/users'
import useLoading from '@/hooks/useLoading'
import { UserRole, UserStatus, getRoleConfig, getStatusConfig } from '@/types/enums'

const UserView = () => {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string
  const { setLoading } = useLoading()
  
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (userId) {
      fetchUser()
    }
  }, [userId])

  const fetchUser = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const userData = await getUserById(userId)
      setUser(userData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در بارگذاری اطلاعات کاربر')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    router.push(`/admin/users/${userId}`)
  }

  const handleDelete = async () => {
    if (confirm('آیا از حذف این کاربر اطمینان دارید؟')) {
      try {
        setLoading(true)
        await deleteUser(userId)
        router.push('/admin/users')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'خطا در حذف کاربر')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleBack = () => {
    router.push('/admin/users')
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

  const getStatusColor = (status: string) => {
    return getStatusConfig(status).color
  }

  const getStatusText = (status: string) => {
    return getStatusConfig(status).text
  }

  const getRoleColor = (role: string) => {
    return getRoleConfig(role).color
  }

  const getRoleText = (role: string) => {
    return getRoleConfig(role).text
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <Card className="border-1">
          <CardBody className="p-6">
            <div className="text-center">
              <p className="text-text-light">در حال بارگذاری...</p>
            </div>
          </CardBody>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-1">
          <CardBody className="p-6">
            <div className="text-center">
              <p className="text-danger mb-4">{error}</p>
              <Button color="primary" onClick={fetchUser}>
                تلاش مجدد
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="p-6">
        <Card className="border-1">
          <CardBody className="p-6">
            <div className="text-center">
              <p className="text-text-light">کاربر یافت نشد</p>
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
        <div className="flex items-center gap-4">
          <Button
            isIconOnly
            variant="light"
            onClick={handleBack}
            aria-label="بازگشت"
          >
            <ArrowLeftIcon className="size-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <UserIcon className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-dark">
                {user.firstName && user.lastName 
                  ? `${user.firstName} ${user.lastName}` 
                  : user.phoneNumber}
              </h1>
              <p className="text-text-light">مشاهده اطلاعات کاربر</p>
            </div>
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

      {/* User Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-1">
          <CardHeader className="pb-3">
            <h3 className="text-lg font-semibold text-text-dark">اطلاعات شخصی</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <label className="text-sm text-text-light">نام</label>
              <p className="font-medium">{user.firstName || 'ثبت نشده'}</p>
            </div>
            <div>
              <label className="text-sm text-text-light">نام خانوادگی</label>
              <p className="font-medium">{user.lastName || 'ثبت نشده'}</p>
            </div>
            <div>
              <label className="text-sm text-text-light">شماره تلفن</label>
              <p className="font-medium">{formatPhoneNumber(user.phoneNumber)}</p>
            </div>
            <div>
              <label className="text-sm text-text-light">نقش</label>
              <div className="mt-1">
                <Chip
                  color={getRoleColor(user.role)}
                  size="sm"
                  variant="flat"
                >
                  {getRoleText(user.role)}
                </Chip>
              </div>
            </div>
            <div>
              <label className="text-sm text-text-light">وضعیت</label>
              <div className="mt-1">
                <Chip
                  color={getStatusColor(user.status || 'active')}
                  size="sm"
                  variant="flat"
                >
                  {getStatusText(user.status || 'active')}
                </Chip>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="border-1">
          <CardHeader className="pb-3">
            <h3 className="text-lg font-semibold text-text-dark">آمار و اطلاعات</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <label className="text-sm text-text-light">امتیاز کل</label>
              <p className="font-medium text-2xl text-primary">{user.totalPoints.toLocaleString()}</p>
            </div>
            <div>
              <label className="text-sm text-text-light">تعداد خریدها</label>
              <p className="font-medium">{user.purchases.length}</p>
            </div>
            <div>
              <label className="text-sm text-text-light">تاریخ عضویت</label>
              <p className="font-medium">{formatDate(user.createdAt)}</p>
            </div>
            <div>
              <label className="text-sm text-text-light">آخرین فعالیت</label>
              <p className="font-medium">{formatDate(user.lastActivity)}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Purchases */}
      {user.purchases.length > 0 && (
        <Card className="border-1">
          <CardHeader className="pb-3">
            <h3 className="text-lg font-semibold text-text-dark">تاریخچه خریدها</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {user.purchases.map((purchase, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">خرید #{index + 1}</p>
                    <p className="text-sm text-text-light">
                      {formatDate(purchase.date)} - {purchase.entryMethod === 'sms' ? 'پیامک' : 'QR کد'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{purchase.amount.toLocaleString()} ریال</p>
                    <p className="text-sm text-text-light">
                      {purchase.rewardApplied.type === 'cashback' ? 'کش بک' : 
                       purchase.rewardApplied.type === 'discount' ? 'تخفیف' : 'قرعه کشی'}: 
                      {purchase.rewardApplied.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}

export default UserView
