'use client'
import { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/table'

import Modal from './Modal'
import PromotionIcon from '@/components/icons/PromotionIcon'
import EditIcon from '@/components/icons/EditIcon'
import TrashIcon from '@/components/icons/TrashIcon'
import { getPromotionByIdWithCodeCount, PromotionWithCodeCount } from '@/services/promotions'
import { getPromoCodesByPromotion, PromoCode } from '@/services/promo-codes'
import { Store } from '@/services/stores'
import useLoading from '@/hooks/useLoading'
import { getPromotionStatusConfig, getPromoCodeStatusConfig } from '@/types/enums'

interface PromotionDetailsModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onEdit?: (promotionId: string) => void
  onDelete?: (promotionId: string) => void
  onSuccess?: () => void
  promotionId?: string
  stores: Store[]
}

const PromotionDetailsModal = ({ isOpen, onOpenChange, onEdit, onDelete, onSuccess, promotionId, stores }: PromotionDetailsModalProps) => {
  const { setLoading } = useLoading()
  const [promotion, setPromotion] = useState<PromotionWithCodeCount | null>(null)
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && promotionId) {
      fetchPromotionDetails()
    }
  }, [isOpen, promotionId])

  const fetchPromotionDetails = async () => {
    if (!promotionId) return
    
    try {
      setIsLoading(true)
      setError(null)
      
      // Fetch promotion with code count
      const promotionData = await getPromotionByIdWithCodeCount(promotionId)
      setPromotion(promotionData)
      
      // Fetch promo codes for this promotion
      const promoCodesResponse = await getPromoCodesByPromotion(promotionId, { page: 1, limit: 50 })
      setPromoCodes(promoCodesResponse.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در بارگذاری اطلاعات تبلیغ')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    // Handler removed as requested
  }

  const handleDelete = async () => {
    // Handler removed as requested
  }

  const handleStatusChange = () => {
    // Handler removed as requested
  }

  const handleClose = () => {
    onOpenChange(false)
    setError(null)
    setPromotion(null)
    setPromoCodes([])
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

  const getPromoCodeStatusColor = (status: string) => {
    return getPromoCodeStatusConfig(status).color
  }

  const getPromoCodeStatusText = (status: string) => {
    return getPromoCodeStatusConfig(status).text
  }

  const getStoreName = (storeId: string) => {
    const store = stores.find(s => s.id === storeId)
    return store ? store.name : 'نامشخص'
  }

  const formatValue = (promotion: PromotionWithCodeCount) => {
    return `${promotion.price.toLocaleString()} تومان → ${promotion.points} امتیاز`
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={handleClose}
      title="جزئیات تبلیغ و کدهای تخفیف"
      size="4xl"
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
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-text-dark">{promotion.title}</h2>
                    {promotion.status === 'deleted' && (
                      <Chip size="sm" color="danger" variant="flat">
                        حذف شده
                      </Chip>
                    )}
                  </div>
                  <p className="text-text-light">جزئیات تبلیغ و کدهای تخفیف</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Action buttons removed as requested */}
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
                  <div>
                    <label className="text-sm text-text-light">تعداد کدهای تخفیف</label>
                    <p className="font-medium">{promotion.promoCodeCount} کد</p>
                  </div>
                </CardBody>
              </Card>

              <Card className="border-1">
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold text-text-dark">جزئیات</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div>
                    <label className="text-sm text-text-light">مبلغ خرید</label>
                    <p className="font-medium">{promotion.price.toLocaleString()} تومان</p>
                  </div>
                  <div>
                    <label className="text-sm text-text-light">امتیاز اعطایی</label>
                    <p className="font-medium">{promotion.points} امتیاز</p>
                  </div>
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
            </div>

            {/* Promo Codes Table */}
            <Card className="border-1">
              <CardHeader className="pb-3">
                <h3 className="text-lg font-semibold text-text-dark">کدهای تخفیف</h3>
              </CardHeader>
              <CardBody>
                {promoCodes.length > 0 ? (
                  <Table aria-label="Promo codes table">
                    <TableHeader>
                      <TableColumn>کد تخفیف</TableColumn>
                      <TableColumn>وضعیت</TableColumn>
                      <TableColumn>کاربر</TableColumn>
                      <TableColumn>تاریخ ثبت</TableColumn>
                      <TableColumn>تاریخ استفاده</TableColumn>
                      <TableColumn>یادداشت</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {promoCodes.map((promoCode) => (
                        <TableRow key={promoCode.id}>
                          <TableCell>
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                              {promoCode.code}
                            </code>
                          </TableCell>
                          <TableCell>
                            <Chip
                              color={getPromoCodeStatusColor(promoCode.status)}
                              size="sm"
                              variant="flat"
                            >
                              {getPromoCodeStatusText(promoCode.status)}
                            </Chip>
                          </TableCell>
                          <TableCell>
                            {promoCode.userId ? 'ثبت شده' : 'ثبت نشده'}
                          </TableCell>
                          <TableCell>
                            {promoCode.registeredAt ? formatDate(promoCode.registeredAt) : '-'}
                          </TableCell>
                          <TableCell>
                            {promoCode.usedAt ? formatDate(promoCode.usedAt) : '-'}
                          </TableCell>
                          <TableCell>
                            {promoCode.notes || '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-text-light">هیچ کد تخفیفی برای این تبلیغ یافت نشد</p>
                  </div>
                )}
              </CardBody>
            </Card>
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

export default PromotionDetailsModal
