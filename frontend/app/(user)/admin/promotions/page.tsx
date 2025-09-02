'use client'
import { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/table'

import PromotionIcon from '@/components/icons/PromotionIcon'
import EditIcon from '@/components/icons/EditIcon'
import TrashIcon from '@/components/icons/TrashIcon'
import EyeIcon from '@/components/icons/EyeIcon'
import { getAllPromotions, getPromotionStats, deletePromotion, Promotion, PromotionStats } from '@/services/promotions'
import { getAllStores, Store } from '@/services/stores'
import useLoading from '@/hooks/useLoading'
import { getPromotionTypeConfig, getPromotionStatusConfig } from '@/types/enums'
import PromotionFormModal from '@/components/modals/PromotionFormModal'
import PromotionViewModal from '@/components/modals/PromotionViewModal'
import DeleteConfirmModal from '@/components/modals/DeleteConfirmModal'

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
    promotionId: undefined as string | undefined
  })

  // Promotion view modal state
  const [promotionViewModal, setPromotionViewModal] = useState({
    isOpen: false,
    promotionId: undefined as string | undefined
  })

  // Delete confirmation modal state
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({
    isOpen: false,
    promotionId: undefined as string | undefined,
    promotionTitle: ''
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

  const getTypeColor = (type: string) => {
    return getPromotionTypeConfig(type).color
  }

  const getTypeText = (type: string) => {
    return getPromotionTypeConfig(type).text
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fa-IR')
  }

  const getStoreName = (storeId: string) => {
    const store = stores.find(s => s.id === storeId)
    return store ? store.name : 'نامشخص'
  }

  const formatValue = (promotion: Promotion) => {
    return `${promotion.price.toLocaleString()} تومان → ${promotion.points} امتیاز`
  }

  const handleViewPromotion = (promotionId: string) => {
    setPromotionViewModal({
      isOpen: true,
      promotionId
    })
  }

  const handleEditPromotion = (promotionId: string) => {
    setPromotionFormModal({
      isOpen: true,
      promotionId
    })
  }

  const handleDeletePromotion = async (promotionId: string) => {
    // Find the promotion to get its title for the confirmation modal
    const promotion = promotions.find(p => p.id === promotionId)
    const promotionTitle = promotion ? promotion.title : ''
    
    setDeleteConfirmModal({
      isOpen: true,
      promotionId,
      promotionTitle
    })
  }

  const handleAddPromotion = () => {
    setPromotionFormModal({
      isOpen: true,
      promotionId: undefined
    })
  }

  const handleDetailsModalSuccess = () => {
    fetchPromotions() // Refresh the list
    fetchStats() // Refresh stats
  }

  const handlePromotionViewEdit = (promotionId: string) => {
    setPromotionFormModal({
      isOpen: true,
      promotionId
    })
  }

  const handlePromotionViewDelete = (promotionId: string) => {
    // This will be handled by the view modal itself
  }

  const handlePromotionViewSuccess = () => {
    fetchPromotions() // Refresh the list
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
              <TableColumn>تاریخ ایجاد</TableColumn>
              <TableColumn>عملیات</TableColumn>
            </TableHeader>
            <TableBody>
              {promotions.map((promotion) => (
                <TableRow key={promotion.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {promotion.title.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">{promotion.title}</span>
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
                  <TableCell>{formatDate(promotion.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="primary"
                        aria-label="مشاهده"
                        onClick={() => handleViewPromotion(promotion.id)}
                      >
                        <EyeIcon className="size-4" />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="primary"
                        aria-label="ویرایش"
                        onClick={() => handleEditPromotion(promotion.id)}
                      >
                        <EditIcon className="size-4" />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        aria-label="حذف"
                        onClick={() => handleDeletePromotion(promotion.id)}
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

      {/* Promotion Form Modal (for editing) */}
      <PromotionFormModal
        isOpen={promotionFormModal.isOpen}
        onOpenChange={(isOpen) => setPromotionFormModal(prev => ({ ...prev, isOpen }))}
        onSuccess={handleDetailsModalSuccess}
        promotionId={promotionFormModal.promotionId}
        stores={stores}
      />

      {/* Promotion View Modal */}
      <PromotionViewModal
        isOpen={promotionViewModal.isOpen}
        onOpenChange={(isOpen) => setPromotionViewModal(prev => ({ ...prev, isOpen }))}
        onEdit={handlePromotionViewEdit}
        onDelete={handlePromotionViewDelete}
        onSuccess={handlePromotionViewSuccess}
        promotionId={promotionViewModal.promotionId}
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
    </div>
  )
}

export default AdminPromotions
