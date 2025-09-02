'use client'
import { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'

import Modal from './Modal'
import PromoCodeIcon from '@/components/icons/PromoCodeIcon'
import EditIcon from '@/components/icons/EditIcon'
import TrashIcon from '@/components/icons/TrashIcon'
import { getPromoCodeById, deletePromoCode, PromoCode } from '@/services/promo-codes'
import { Promotion } from '@/services/promotions'
import useLoading from '@/hooks/useLoading'
import { getPromoCodeStatusConfig } from '@/types/enums'

interface PromoCodeViewModalProps {
  isOpen: boolean
  onClose: () => void
  onEdit?: (promoCodeId: string) => void
  onDelete?: (promoCodeId: string) => void
  onSuccess?: () => void
  promoCodeId?: string
  promotions: Promotion[]
}

const PromoCodeViewModal = ({ isOpen, onClose, onEdit, onDelete, onSuccess, promoCodeId, promotions }: PromoCodeViewModalProps) => {
  const { setLoading } = useLoading()
  const [promoCode, setPromoCode] = useState<PromoCode | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && promoCodeId) {
      fetchPromoCode()
    }
  }, [isOpen, promoCodeId])

  const fetchPromoCode = async () => {
    if (!promoCodeId) return
    
    try {
      setIsLoading(true)
      setError(null)
      const promoCodeData = await getPromoCodeById(promoCodeId)
      setPromoCode(promoCodeData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در بارگذاری اطلاعات کد تخفیف')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    if (promoCodeId && onEdit) {
      onClose()
      onEdit(promoCodeId)
    }
  }

  const handleDelete = async () => {
    if (!promoCodeId) return
    
    if (confirm('آیا از حذف این کد تخفیف اطمینان دارید؟')) {
      try {
        setLoading(true)
        await deletePromoCode(promoCodeId)
        onClose()
        onSuccess?.()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'خطا در حذف کد تخفیف')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleClose = () => {
    onClose()
    setError(null)
    setPromoCode(null)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fa-IR')
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fa-IR', { hour: 'numeric', minute: 'numeric' })
  }

  const getStatusColor = (status: string) => {
    return getPromoCodeStatusConfig(status).color
  }

  const getStatusText = (status: string) => {
    return getPromoCodeStatusConfig(status).text
  }

  const getPromotionTitle = (promotionId: string) => {
    const promotion = promotions.find(p => p.id === promotionId)
    return promotion?.title || 'نامشخص'
  }

  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onOpenChange={handleClose} title="بارگذاری..." size="2xl">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Modal>
    )
  }

  if (error) {
    return (
      <Modal isOpen={isOpen} onOpenChange={handleClose} title="خطا" size="2xl">
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
          <div className="flex justify-end mt-4">
            <Button color="danger" onClick={handleClose}>
              بستن
            </Button>
          </div>
        </div>
      </Modal>
    )
  }

  if (!promoCode) {
    return null
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={handleClose} title="جزئیات کد تخفیف" size="2xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <PromoCodeIcon className="w-8 h-8 text-primary" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">کد تخفیف: {promoCode.code}</h2>
            <p className="text-gray-600">جزئیات کامل کد تخفیف</p>
          </div>
        </div>

        {/* Status */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">وضعیت</h3>
          </CardHeader>
          <CardBody>
            <Chip
              color={getStatusColor(promoCode.status)}
              variant="flat"
              size="lg"
            >
              {getStatusText(promoCode.status)}
            </Chip>
          </CardBody>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">اطلاعات پایه</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">کد تخفیف</label>
                <div className="font-mono font-bold text-lg text-primary bg-gray-50 p-2 rounded">
                  {promoCode.code}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تبلیغ مربوطه</label>
                <div className="text-gray-900">{getPromotionTitle(promoCode.promotionId)}</div>
              </div>
            </div>
            
            {promoCode.notes && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">یادداشت</label>
                <div className="text-gray-900 bg-gray-50 p-3 rounded">{promoCode.notes}</div>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Usage Information */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">اطلاعات استفاده</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">کاربر ثبت شده</label>
                <div className="text-gray-900">
                  {promoCode.userId ? 'بله' : 'خیر'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تاریخ ثبت</label>
                <div className="text-gray-900">
                  {promoCode.registeredAt ? formatDateTime(promoCode.registeredAt) : 'ثبت نشده'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تاریخ استفاده</label>
                <div className="text-gray-900">
                  {promoCode.usedAt ? formatDateTime(promoCode.usedAt) : 'استفاده نشده'}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Timestamps */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">تاریخ‌ها</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تاریخ ایجاد</label>
                <div className="text-gray-900">{formatDateTime(promoCode.createdAt)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">آخرین بروزرسانی</label>
                <div className="text-gray-900">{formatDateTime(promoCode.updatedAt)}</div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="light"
            color="danger"
            onClick={handleDelete}
            startContent={<TrashIcon className="w-4 h-4" />}
          >
            حذف
          </Button>
          <Button
            color="primary"
            onClick={handleEdit}
            startContent={<EditIcon className="w-4 h-4" />}
          >
            ویرایش
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default PromoCodeViewModal
