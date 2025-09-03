'use client'
import { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/table'

import PromotionIcon from '@/components/icons/PromotionIcon'
import EditIcon from '@/components/icons/EditIcon'
import EyeIcon from '@/components/icons/EyeIcon'
import ClockIcon from '@/components/icons/ClockIcon'
import { getAllPromotions, getPromotionStats, deletePromotion, Promotion, PromotionStats, getPromotionByIdWithCodeCount, PromotionWithCodeCount } from '@/services/promotions'
import useLoading from '@/hooks/useLoading'
import { getPromotionTypeConfig, getPromotionStatusConfig } from '@/types/enums'
import { formatDateToPersianJalali } from '@/helpers'
import PromotionFormModal from '@/components/modals/PromotionFormModal'
import PromotionViewModal from '@/components/modals/PromotionViewModal'
import PromotionDetailsModal from '@/components/modals/PromotionDetailsModal'
import PromotionStatusModal from '@/components/modals/PromotionStatusModal'
import DeleteConfirmModal from '@/components/modals/DeleteConfirmModal'
import AutomaticPromoCodeCreationModal from '@/components/modals/AutomaticPromoCodeCreationModal'
import useAuth from '@/hooks/useAuth'

const StorePromotions = () => {
  const { setLoading } = useLoading()
  const { user } = useAuth()
  
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [stats, setStats] = useState<PromotionStats>({
    total: 0,
    active: 0,
    inactive: 0,
    expired: 0,
    deleted: 0
  })
  const [error, setError] = useState<string | null>(null)

  // Promotion form modal state
  const [promotionFormModal, setPromotionFormModal] = useState({
    isOpen: false,
    promotionId: undefined as string | undefined,
    promotionTitle: ''
  })

  // Promotion view modal state
  const [promotionViewModal, setPromotionViewModal] = useState({
    isOpen: false,
    promotionId: undefined as string | undefined
  })

  // Promotion details modal state
  const [promotionDetailsModal, setPromotionDetailsModal] = useState({
    isOpen: false,
    promotionId: undefined as string | undefined
  })

  // Delete confirmation modal state
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({
    isOpen: false,
    promotionId: undefined as string | undefined,
    promotionTitle: ''
  })

  // Status change modal state
  const [statusModal, setStatusModal] = useState({
    isOpen: false,
    promotionId: undefined as string | undefined,
    currentStatus: '',
    promotionTitle: ''
  })

  // Automatic promo code creation modal state
  const [automaticPromoCodeModal, setAutomaticPromoCodeModal] = useState({
    isOpen: false,
    promotionId: '',
    storeName: ''
  })

  useEffect(() => {
    fetchPromotions()
    fetchStats()
  }, [])

  const fetchPromotions = async () => {
    try {
      setLoading(true)
      setError(null)
      // For store users, the backend should filter promotions by the authenticated store
      const response = await getAllPromotions({ page: 1, limit: 50 })
      
      // The backend now returns promotions with promo code counts directly
      setPromotions(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در بارگذاری تبلیغات')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const statsData = await getPromotionStats()
      setStats(statsData)
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  const handleCreatePromotion = () => {
    setPromotionFormModal({
      isOpen: true,
      promotionId: undefined,
      promotionTitle: 'ایجاد تبلیغ جدید'
    })
  }

  const handleEditPromotion = (promotion: Promotion) => {
    setPromotionFormModal({
      isOpen: true,
      promotionId: promotion.id,
      promotionTitle: `ویرایش تبلیغ: ${promotion.title}`
    })
  }

  const handleViewPromotion = (promotion: Promotion) => {
    setPromotionViewModal({
      isOpen: true,
      promotionId: promotion.id
    })
  }

  const handleViewPromotionDetails = (promotion: Promotion) => {
    setPromotionDetailsModal({
      isOpen: true,
      promotionId: promotion.id
    })
  }

  const handleDeletePromotion = (promotion: Promotion) => {
    setDeleteConfirmModal({
      isOpen: true,
      promotionId: promotion.id,
      promotionTitle: promotion.title
    })
  }

  const handleStatusChange = (promotion: Promotion) => {
    setStatusModal({
      isOpen: true,
      promotionId: promotion.id,
      currentStatus: promotion.status,
      promotionTitle: promotion.title
    })
  }

  const handleAutomaticPromoCodeCreation = (promotion: Promotion) => {
    setAutomaticPromoCodeModal({
      isOpen: true,
      promotionId: promotion.id,
      storeName: 'فروشگاه' // Use a default name since storeName is not available
    })
  }

  const handleFormSubmit = async (data: any) => {
    try {
      setLoading(true)
      // Add storeId to the data - the backend should handle this based on authentication
      const promotionData = {
        ...data
      }
      
      if (promotionFormModal.promotionId) {
        // Update existing promotion
        // await updatePromotion(promotionFormModal.promotionId, promotionData)
      } else {
        // Create new promotion
        // await createPromotion(promotionData)
      }
      
      setPromotionFormModal({ isOpen: false, promotionId: undefined, promotionTitle: '' })
      fetchPromotions()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در ذخیره تبلیغ')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmModal.promotionId) return
    
    try {
      setLoading(true)
      await deletePromotion(deleteConfirmModal.promotionId)
      setDeleteConfirmModal({ isOpen: false, promotionId: undefined, promotionTitle: '' })
      fetchPromotions()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در حذف تبلیغ')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusSubmit = async (newStatus: string) => {
    if (!statusModal.promotionId) return
    
    try {
      setLoading(true)
      // await updatePromotionStatus(statusModal.promotionId, newStatus)
      setStatusModal({ isOpen: false, promotionId: undefined, currentStatus: '', promotionTitle: '' })
      fetchPromotions()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در تغییر وضعیت تبلیغ')
    } finally {
      setLoading(false)
    }
  }

  const handleAutomaticPromoCodeSubmit = async (data: any) => {
    try {
      setLoading(true)
      // await createAutomaticPromoCodes(data)
      setAutomaticPromoCodeModal({ isOpen: false, promotionId: '', storeName: '' })
      fetchPromotions()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در ایجاد کدهای تخفیف')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PromotionIcon className="size-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-text-dark">مدیریت تبلیغات</h1>
            <p className="text-text-light">ایجاد و مدیریت تبلیغات فروشگاه</p>
          </div>
        </div>
        <Button
          color="primary"
          onPress={handleCreatePromotion}
        >
          ایجاد تبلیغ جدید
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-1">
          <CardBody className="p-4">
            <div className="text-center">
              <p className="text-sm text-text-light">کل تبلیغات</p>
              <p className="text-2xl font-bold text-text-dark">{stats.total}</p>
            </div>
          </CardBody>
        </Card>
        <Card className="border-1">
          <CardBody className="p-4">
            <div className="text-center">
              <p className="text-sm text-text-light">فعال</p>
              <p className="text-2xl font-bold text-success">{stats.active}</p>
            </div>
          </CardBody>
        </Card>
        <Card className="border-1">
          <CardBody className="p-4">
            <div className="text-center">
              <p className="text-sm text-text-light">غیرفعال</p>
              <p className="text-2xl font-bold text-warning">{stats.inactive}</p>
            </div>
          </CardBody>
        </Card>
        <Card className="border-1">
          <CardBody className="p-4">
            <div className="text-center">
              <p className="text-sm text-text-light">منقضی شده</p>
              <p className="text-2xl font-bold text-danger">{stats.expired}</p>
            </div>
          </CardBody>
        </Card>
        <Card className="border-1">
          <CardBody className="p-4">
            <div className="text-center">
              <p className="text-sm text-text-light">حذف شده</p>
              <p className="text-2xl font-bold text-default">{stats.deleted}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-1 border-danger">
          <CardBody className="p-4">
            <p className="text-danger">{error}</p>
          </CardBody>
        </Card>
      )}

      {/* Promotions Table */}
      <Card className="border-1">
        <CardHeader className="pb-3">
          <h3 className="text-lg font-semibold text-text-dark">لیست تبلیغات</h3>
        </CardHeader>
        <CardBody className="p-0">
          <Table aria-label="Promotions table">
            <TableHeader>
              <TableColumn>عنوان</TableColumn>
              <TableColumn>توضیحات</TableColumn>
              <TableColumn>مبلغ</TableColumn>
              <TableColumn>امتیاز</TableColumn>
              <TableColumn>وضعیت</TableColumn>
              <TableColumn>تاریخ ایجاد</TableColumn>
              <TableColumn>عملیات</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent={error ? "خطا در بارگذاری" : "هیچ تبلیغی یافت نشد"}
            >
              {promotions.map((promotion) => (
                <TableRow key={promotion.id}>
                  <TableCell>
                    <div className="font-medium text-text-dark">{promotion.title}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-text-light max-w-xs truncate">
                      {promotion.description || '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-text-dark">
                      {formatPrice(promotion.price)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip size="sm" color="primary" variant="flat">
                      {promotion.points} امتیاز
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      color={getPromotionStatusConfig(promotion.status).color}
                      variant="flat"
                    >
                      {getPromotionStatusConfig(promotion.status).text}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-text-light">
                      {formatDateToPersianJalali(promotion.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="primary"
                        onPress={() => handleViewPromotion(promotion)}
                      >
                        <EyeIcon className="size-4" />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="warning"
                        onPress={() => handleEditPromotion(promotion)}
                      >
                        <EditIcon className="size-4" />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="secondary"
                        onPress={() => handleStatusChange(promotion)}
                      >
                        <ClockIcon className="size-4" />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        onPress={() => handleDeletePromotion(promotion)}
                      >
                        <ClockIcon className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Modals */}
      {/* Note: Modal implementations need to be updated to match the actual prop interfaces */}
      {/* For now, we'll use basic modals without the complex form modals */}
    </div>
  )
}

export default StorePromotions
