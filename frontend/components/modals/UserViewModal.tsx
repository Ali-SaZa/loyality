'use client'
import { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'

import Modal from './Modal'
import UserIcon from '@/components/icons/UserIcon'
import EditIcon from '@/components/icons/EditIcon'
import TrashIcon from '@/components/icons/TrashIcon'
import { getUserById, deleteUser, User } from '@/services/users'
import useLoading from '@/hooks/useLoading'
import { getRoleConfig, getStatusConfig } from '@/types/enums'
import { formatDateToPersianJalali, formatPhoneNumber } from '@/helpers'

interface UserViewModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onEdit?: (userId: string) => void
  onDelete?: (userId: string) => void
  onSuccess?: () => void
  userId?: string
}

const UserViewModal = ({ isOpen, onOpenChange, onEdit, onDelete, onSuccess, userId }: UserViewModalProps) => {
  const { setLoading } = useLoading()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && userId) {
      fetchUser()
    }
  }, [isOpen, userId])

  const fetchUser = async () => {
    if (!userId) return
    
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
    if (userId && onEdit) {
      onOpenChange(false)
      onEdit(userId)
    }
  }

  const handleDelete = async () => {
    if (!userId) return
    
    if (confirm('آیا از حذف این کاربر اطمینان دارید؟')) {
      try {
        setLoading(true)
        await deleteUser(userId)
        onOpenChange(false)
        onSuccess?.()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'خطا در حذف کاربر')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setError(null)
    setUser(null)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fa-IR')
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

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={handleClose}
      title="مشاهده اطلاعات کاربر"
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
        ) : user ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <UserIcon className="size-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text-dark">
                    {user.firstName && user.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : user.phoneNumber}
                  </h2>
                  <p className="text-text-light">مشاهده اطلاعات کاربر</p>
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
                  <h3 className="text-lg font-semibold text-text-dark">اطلاعات سیستم</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div>
                    <label className="text-sm text-text-light">تاریخ عضویت</label>
                    <p className="font-medium">{formatDate(user.createdAt)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-text-light">آخرین فعالیت</label>
                    <p className="font-medium">{formatDateToPersianJalali(user.lastActivity)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-text-light">آخرین بروزرسانی</label>
                    <p className="font-medium">{formatDateToPersianJalali(user.updatedAt)}</p>
                  </div>
                </CardBody>
              </Card>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-text-light">کاربر یافت نشد</p>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default UserViewModal
