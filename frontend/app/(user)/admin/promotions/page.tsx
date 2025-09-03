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
import { getAllStores, Store } from '@/services/stores'
import useLoading from '@/hooks/useLoading'
import { getPromotionStatusConfig } from '@/types/enums'
import { formatDateToPersianJalali } from '@/helpers'
import PromotionFormModal from '@/components/modals/PromotionFormModal'
import PromotionDetailsModal from '@/components/modals/PromotionDetailsModal'
import PromotionStatusModal from '@/components/modals/PromotionStatusModal'
import DeleteConfirmModal from '@/components/modals/DeleteConfirmModal'
import AutomaticPromoCodeCreationModal from '@/components/modals/AutomaticPromoCodeCreationModal'

const AdminPromotions = () => {
  const { setLoading } = useLoading()
  
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [stores, setStores] = useState<Store[]>([])
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
    fetchStores()
  }, [])

  const fetchPromotions = async () => {
    try {
      setLoading(true)
      setError(null)
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

  const fetchStores = async () => {
    try {
      const response = await getAllStores({ page: 1, limit: 100 })
      setStores(response.data)
    } catch (err) {
      console.error('Error fetching stores:', err)
    }
  }

  const getStatusColor = (status: string) => {
    return getPromotionStatusConfig(status).color
  }

  const getStatusText = (status: string) => {
    return getPromotionStatusConfig(status).text
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return formatDateToPersianJalali(date)
  }

  const getStoreName = (storeId: string) => {
    const store = stores.find(s => s.id === storeId)
    return store ? store.name : 'نامشخص'
  }

  const formatValue = (promotion: Promotion) => {
    return `${promotion.price.toLocaleString()} تومان → ${promotion.points} امتیاز`
  }

  const handleViewPromotion = (promotionItem: PromotionWithCodeCount) => {
    setPromotionDetailsModal({
      isOpen: true,
      promotionId: promotionItem.id,
    })
  }

  const handleEditPromotion = (promotionItem: PromotionWithCodeCount) => {
    setPromotionFormModal({
      isOpen: true,
      promotionId: promotionItem.id,
      promotionTitle: promotionItem.title
    })
  }

  const handleStatusChange = (promotionItem: PromotionWithCodeCount) => {
    setStatusModal({
      isOpen: true,
      promotionId: promotionItem.id,
      currentStatus: promotionItem.status,
      promotionTitle: promotionItem.title
    })
  }

  const handleAddPromotion = () => {
    setPromotionFormModal({
      isOpen: true,
      promotionId: undefined,
      promotionTitle: ''
    })
  }

  const handleDetailsModalSuccess = () => {
    fetchPromotions() // Refresh the list
    fetchStats() // Refresh stats
  }

  const handlePromotionDetailsEdit = (promotionId: string) => {
    setPromotionFormModal({
      isOpen: true,
      promotionId,
      promotionTitle: ''
    })
  }

  const handlePromotionDetailsDelete = async (promotionId: string) => {
    // Find the promotion to get its title for the confirmation modal
    const promotion = promotions.find(p => p.id === promotionId)
    const promotionTitle = promotion ? promotion.title : ''
    
    setDeleteConfirmModal({
      isOpen: true,
      promotionId,
      promotionTitle
    })
  }

  const handlePromotionDetailsSuccess = () => {
    fetchPromotions() // Refresh the list
    fetchStats() // Refresh stats
  }

  const handlePromotionCreated = (promotionId: string, storeName: string) => {
    // Open the automatic promo code creation modal
    setAutomaticPromoCodeModal({
      isOpen: true,
      promotionId,
      storeName
    })
  }

  const handleAutomaticPromoCodeSuccess = () => {
    fetchPromotions() // Refresh the list to show updated promo code count
    fetchStats() // Refresh stats
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmModal.promotionId) return
    
    try {
      setLoading(true)
      await deletePromotion(deleteConfirmModal.promotionId)
      await fetchPromotions() // Refresh the list
      await fetchStats() // Refresh stats
      setDeleteConfirmModal({ isOpen: false, promotionId: undefined, promotionTitle: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در حذف تبلیغ')
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-1">
          <CardBody className="p-6">
            <div className="text-center">
              <p className="text-danger mb-4">{error}</p>
              <Button color="primary" onClick={fetchPromotions}>
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
          <PromotionIcon className="size-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-text-dark">مدیریت تبلیغات</h1>
            <p className="text-text-light">مشاهده و مدیریت تمام تبلیغات سیستم</p>
          </div>
        </div>
        <Button
          color="primary"
          startContent={<PromotionIcon className="size-5" />}
          onClick={handleAddPromotion}
        >
          افزودن تبلیغ جدید
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">کل تبلیغات</p>
                <p className="text-2xl font-bold text-text-dark">{stats.total}</p>
              </div>
              <PromotionIcon className="size-8 text-primary" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">تبلیغات فعال</p>
                <p className="text-2xl font-bold text-text-dark">{stats.active}</p>
              </div>
              <PromotionIcon className="size-8 text-success" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">تبلیغات غیرفعال</p>
                <p className="text-2xl font-bold text-text-dark">{stats.inactive}</p>
              </div>
              <PromotionIcon className="size-8 text-default" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">تبلیغات منقضی</p>
                <p className="text-2xl font-bold text-text-dark">{stats.expired}</p>
              </div>
              <PromotionIcon className="size-8 text-warning" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">تبلیغات حذف شده</p>
                <p className="text-2xl font-bold text-text-dark">{stats.deleted}</p>
              </div>
              <PromotionIcon className="size-8 text-danger" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Promotions Table */}
      <Card className="border-1">
        <CardHeader className="pb-3">
          <h3 className="text-lg font-semibold text-text-dark">لیست تبلیغات</h3>
        </CardHeader>
        <CardBody className="p-0">
          <Table aria-label="لیست تبلیغات">
            <TableHeader>
              <TableColumn>عنوان تبلیغ</TableColumn>
              <TableColumn>فروشگاه</TableColumn>
              <TableColumn>مقدار</TableColumn>
              <TableColumn>وضعیت</TableColumn>
              <TableColumn>تعداد کدها</TableColumn>
              <TableColumn>تاریخ ایجاد</TableColumn>
              <TableColumn>عملیات</TableColumn>
            </TableHeader>
            <TableBody>
              {promotions.map((promotion) => (
                <TableRow 
                  key={promotion.id}
                  className={promotion.status === 'deleted' ? 'opacity-60 bg-gray-50' : ''}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {promotion.title.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{promotion.title}</span>
                        </div>
                        {promotion.description && (
                          <p className="text-xs text-text-light">{promotion.description}</p>
                        )}
                        <p className="text-xs text-text-light">ID: {promotion.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{getStoreName(promotion.storeId)}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{formatValue(promotion)}</span>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={getStatusColor(promotion.status)}
                      size="sm"
                      variant="flat"
                    >
                      {getStatusText(promotion.status)}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{promotion.promoCodeCount || 0} کد</span>
                  </TableCell>
                  <TableCell>{formatDate(promotion.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="primary"
                        aria-label="مشاهده"
                        onClick={() => handleViewPromotion(promotion as PromotionWithCodeCount)}
                      >
                        <EyeIcon className="size-4" />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="primary"
                        aria-label="ویرایش"
                        disabled={promotion.status === 'deleted'}
                        onClick={() => handleEditPromotion(promotion as PromotionWithCodeCount)}
                      >
                        <EditIcon className="size-4" />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="success"
                        aria-label="ایجاد کدهای تخفیف"
                        disabled={promotion.status === 'deleted'}
                        onClick={() => {
                          const storeName = getStoreName(promotion.storeId)
                          setAutomaticPromoCodeModal({
                            isOpen: true,
                            promotionId: promotion.id,
                            storeName
                          })
                        }}
                      >
                        <PromotionIcon className="size-4" />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="warning"
                        aria-label="تغییر وضعیت"
                        disabled={promotion.status === 'deleted'}
                        onClick={() => handleStatusChange(promotion as PromotionWithCodeCount)}
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

      {/* Promotion Form Modal (for editing) */}
      <PromotionFormModal
        isOpen={promotionFormModal.isOpen}
        onOpenChange={(isOpen) => setPromotionFormModal(prev => ({ ...prev, isOpen }))}
        onSuccess={handleDetailsModalSuccess}
        onPromotionCreated={handlePromotionCreated}
        promotionId={promotionFormModal.promotionId}
        stores={stores}
      />

      {/* Automatic Promo Code Creation Modal */}
      <AutomaticPromoCodeCreationModal
        isOpen={automaticPromoCodeModal.isOpen}
        onOpenChange={(isOpen) => setAutomaticPromoCodeModal(prev => ({ ...prev, isOpen }))}
        onSuccess={handleAutomaticPromoCodeSuccess}
        promotionId={automaticPromoCodeModal.promotionId}
        storeName={automaticPromoCodeModal.storeName}
      />

      {/* Promotion Details Modal */}
      <PromotionDetailsModal
        isOpen={promotionDetailsModal.isOpen}
        onOpenChange={(isOpen) => setPromotionDetailsModal(prev => ({ ...prev, isOpen }))}
        onEdit={handlePromotionDetailsEdit}
        onDelete={handlePromotionDetailsDelete}
        onSuccess={handlePromotionDetailsSuccess}
        promotionId={promotionDetailsModal.promotionId}
        stores={stores}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteConfirmModal.isOpen}
        onOpenChange={(isOpen) => setDeleteConfirmModal(prev => ({ ...prev, isOpen }))}
        onConfirm={handleDeleteConfirm}
        title="حذف تبلیغ"
        message="آیا از حذف این تبلیغ اطمینان دارید؟"
        itemName={deleteConfirmModal.promotionTitle}
        isLoading={false}
      />

      {/* Status Change Modal */}
      <PromotionStatusModal
        isOpen={statusModal.isOpen}
        onOpenChange={(isOpen) => setStatusModal(prev => ({ ...prev, isOpen }))}
        onSuccess={() => {
          fetchPromotions()
          fetchStats()
        }}
        promotionId={statusModal.promotionId}
        currentStatus={statusModal.currentStatus}
        promotionTitle={statusModal.promotionTitle}
      />
    </div>
  )
}

export default AdminPromotions
