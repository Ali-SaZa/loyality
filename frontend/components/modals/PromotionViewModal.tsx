'use client'
import { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'

import Modal from './Modal'
import PromotionIcon from '@/components/icons/PromotionIcon'
import EditIcon from '@/components/icons/EditIcon'
import TrashIcon from '@/components/icons/TrashIcon'
import { getPromotionById, deletePromotion, Promotion } from '@/services/promotions'
import { Store } from '@/services/stores'
import useLoading from '@/hooks/useLoading'
import { getPromotionTypeConfig, getPromotionStatusConfig } from '@/types/enums'

interface PromotionViewModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onEdit?: (promotionId: string) => void
  onDelete?: (promotionId: string) => void
  onSuccess?: () => void
  promotionId?: string
  stores: Store[]
}

const PromotionViewModal = ({ isOpen, onOpenChange, onEdit, onDelete, onSuccess, promotionId, stores }: PromotionViewModalProps) => {
  const { setLoading } = useLoading()
  const [promotion, setPromotion] = useState<Promotion | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && promotionId) {
      fetchPromotion()
    }
  }, [isOpen, promotionId])

  const fetchPromotion = async () => {
    if (!promotionId) return
    
    try {
      setIsLoading(true)
      setError(null)
      const promotionData = await getPromotionById(promotionId)
      setPromotion(promotionData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در بارگذاری اطلاعات تبلیغ')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    if (promotionId && onEdit) {
      onOpenChange(false)
      onEdit(promotionId)
    }
  }

  const handleDelete = async () => {
    if (!promotionId) return
    
    if (confirm('آیا از حذف این تبلیغ اطمینان دارید؟')) {
      try {
        setLoading(true)
        await deletePromotion(promotionId)
        onOpenChange(false)
        onSuccess?.()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'خطا در حذف تبلیغ')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setError(null)
    setPromotion(null)
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
    return getPromotionStatusConfig(status).color
  }

  const getStatusText = (status: string) => {
    return getPromotionStatusConfig(status).text
  }

  const getTypeColor = (type: string) => {
    return getPromotionTypeConfig(type).color
  }

  const getTypeText = (type: string) => {
    return getPromotionTypeConfig(type).text
  }

  const getStoreName = (storeId: string) => {
    const store = stores.find(s => s.id === storeId)
    return store ? store.name : 'نامشخص'
  }

  const formatValue = (promotion: Promotion) => {
    if (promotion.type === 'percentage') {
      return `${promotion.value}%`
    } else if (promotion.type === 'fixed' || promotion.type === 'conditional') {
      return `${promotion.value?.toLocaleString()} تومان`
    } else if (promotion.type === 'loyaltyPoints') {
      return `${promotion.points} امتیاز`
    } else if (promotion.type === 'coupon') {
      return promotion.code || 'بدون کد'
    }
    return promotion.value ? `${promotion.value}` : '-'
  }

  const formatStackableWith = (stackableWith: string[]) => {
    if (!stackableWith || stackableWith.length === 0) return 'هیچ‌کدام'
    return stackableWith.map(type => getTypeText(type)).join('، ')
  }

  const formatApplicableEvents = (events: string[]) => {
    if (!events || events.length === 0) return 'هیچ‌کدام'
    
    const eventNames: { [key: string]: string } = {
      birthday: 'تولد مشتری',
      first_login: 'ورود اول به اپ',
      monthly_login: 'ورود ماهانه',
      purchase_milestone: 'دستاورد خرید',
      referral: 'معرفی دوست',
      holiday: 'تعطیلات'
    }
    
    return events.map(event => eventNames[event] || event).join('، ')
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={handleClose}
      title="مشاهده اطلاعات تبلیغ"
      size="2xl"
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
        ) : promotion ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <PromotionIcon className="size-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text-dark">{promotion.title}</h2>
                  <p className="text-text-light">مشاهده اطلاعات تبلیغ</p>
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

            {/* Promotion Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-1">
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold text-text-dark">اطلاعات پایه</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div>
                    <label className="text-sm text-text-light">عنوان</label>
                    <p className="font-medium">{promotion.title}</p>
                  </div>
                  {promotion.description && (
                    <div>
                      <label className="text-sm text-text-light">توضیحات</label>
                      <p className="font-medium">{promotion.description}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm text-text-light">نوع تبلیغ</label>
                    <div className="mt-1">
                      <Chip
                        color={getTypeColor(promotion.type)}
                        size="sm"
                        variant="flat"
                      >
                        {getTypeText(promotion.type)}
                      </Chip>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-text-light">فروشگاه</label>
                    <p className="font-medium">{getStoreName(promotion.storeId)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-text-light">وضعیت</label>
                    <div className="mt-1">
                      <Chip
                        color={getStatusColor(promotion.status)}
                        size="sm"
                        variant="flat"
                      >
                        {getStatusText(promotion.status)}
                      </Chip>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-text-light">مقدار</label>
                    <p className="font-medium">{formatValue(promotion)}</p>
                  </div>
                </CardBody>
              </Card>

              <Card className="border-1">
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold text-text-dark">جزئیات و محدودیت‌ها</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  {promotion.minPurchaseAmount && (
                    <div>
                      <label className="text-sm text-text-light">حداقل مبلغ خرید</label>
                      <p className="font-medium">{promotion.minPurchaseAmount.toLocaleString()} تومان</p>
                    </div>
                  )}
                  {promotion.maxDiscountAmount && (
                    <div>
                      <label className="text-sm text-text-light">حداکثر مبلغ تخفیف</label>
                      <p className="font-medium">{promotion.maxDiscountAmount.toLocaleString()} تومان</p>
                    </div>
                  )}
                  {promotion.usageLimit && (
                    <div>
                      <label className="text-sm text-text-light">حد مجاز استفاده</label>
                      <p className="font-medium">{promotion.usageLimit}</p>
                    </div>
                  )}
                  {promotion.currentUsageCount !== undefined && (
                    <div>
                      <label className="text-sm text-text-light">تعداد استفاده شده</label>
                      <p className="font-medium">{promotion.currentUsageCount}</p>
                    </div>
                  )}
                  {promotion.maxUsagePerCustomer && (
                    <div>
                      <label className="text-sm text-text-light">حد مجاز برای هر مشتری</label>
                      <p className="font-medium">{promotion.maxUsagePerCustomer}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm text-text-light">قابل ترکیب</label>
                    <p className="font-medium">{promotion.isStackable ? 'بله' : 'خیر'}</p>
                  </div>
                  {promotion.isStackable && promotion.stackableWith && (
                    <div>
                      <label className="text-sm text-text-light">قابل ترکیب با</label>
                      <p className="font-medium">{formatStackableWith(promotion.stackableWith)}</p>
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-1">
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold text-text-dark">زمان‌بندی</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  {promotion.startDate && (
                    <div>
                      <label className="text-sm text-text-light">تاریخ شروع</label>
                      <p className="font-medium">{formatDateTime(promotion.startDate)}</p>
                    </div>
                  )}
                  {promotion.endDate && (
                    <div>
                      <label className="text-sm text-text-light">تاریخ پایان</label>
                      <p className="font-medium">{formatDateTime(promotion.endDate)}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm text-text-light">تاریخ ایجاد</label>
                    <p className="font-medium">{formatDateTime(promotion.createdAt)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-text-light">آخرین بروزرسانی</label>
                    <p className="font-medium">{formatDateTime(promotion.updatedAt)}</p>
                  </div>
                </CardBody>
              </Card>

              <Card className="border-1">
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold text-text-dark">تنظیمات اضافی</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  {promotion.code && (
                    <div>
                      <label className="text-sm text-text-light">کد تخفیف</label>
                      <p className="font-medium font-mono bg-gray-100 px-2 py-1 rounded">{promotion.code}</p>
                    </div>
                  )}
                  {promotion.points && (
                    <div>
                      <label className="text-sm text-text-light">امتیاز</label>
                      <p className="font-medium">{promotion.points}</p>
                    </div>
                  )}
                  {promotion.applicableEvents && promotion.applicableEvents.length > 0 && (
                    <div>
                      <label className="text-sm text-text-light">رویدادهای قابل اعمال</label>
                      <p className="font-medium">{formatApplicableEvents(promotion.applicableEvents)}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm text-text-light">نیاز به تایید</label>
                    <p className="font-medium">{promotion.requiresApproval ? 'بله' : 'خیر'}</p>
                  </div>
                  {promotion.termsAndConditions && (
                    <div>
                      <label className="text-sm text-text-light">شرایط و قوانین</label>
                      <p className="font-medium text-sm">{promotion.termsAndConditions}</p>
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-text-light">تبلیغ یافت نشد</p>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default PromotionViewModal
