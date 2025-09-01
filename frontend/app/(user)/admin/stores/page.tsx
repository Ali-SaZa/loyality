'use client'
import { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/table'
import { useRouter } from 'next/navigation'

import StoreIcon from '@/components/icons/ChartTreeIcon'
import EditIcon from '@/components/icons/EditIcon'
import TrashIcon from '@/components/icons/TrashIcon'
import EyeIcon from '@/components/icons/EyeIcon'
import { getAllStores, getStoreStats, deleteStore, Store, StoreStats } from '@/services/stores'
import useLoading from '@/hooks/useLoading'
import { StoreStatus, getStoreStatusConfig } from '@/types/enums'
import StoreFormModal from '@/components/modals/StoreFormModal'
import DeleteConfirmModal from '@/components/modals/DeleteConfirmModal'

const AdminStores = () => {
  const router = useRouter()
  const { setLoading } = useLoading()
  
  const [stores, setStores] = useState<Store[]>([])
  const [stats, setStats] = useState<StoreStats>({
    total: 0,
    active: 0,
    pending: 0,
    deleted: 0,
    suspended: 0
  })
  const [error, setError] = useState<string | null>(null)

  // Store form modal state
  const [storeFormModal, setStoreFormModal] = useState({
    isOpen: false,
    storeId: undefined as string | undefined
  })

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    storeId: '',
    storeName: '',
    isLoading: false
  })

  useEffect(() => {
    fetchStores()
    fetchStats()
  }, [])

  const fetchStores = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getAllStores({ page: 1, limit: 50 })
      setStores(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در بارگذاری فروشگاه‌ها')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const statsData = await getStoreStats()
      setStats(statsData)
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  const getStatusColor = (status: string) => {
    return getStoreStatusConfig(status).color
  }

  const getStatusText = (status: string) => {
    return getStoreStatusConfig(status).text
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

  const getAddressText = (address: Store['address']) => {
    const parts = []
    if (address.city) parts.push(address.city)
    if (address.province) parts.push(address.province)
    return parts.join('، ') || 'آدرس ثبت نشده'
  }

  const handleViewStore = (storeId: string) => {
    router.push(`/admin/stores/${storeId}/view`)
  }

  const handleEditStore = (storeId: string) => {
    setStoreFormModal({
      isOpen: true,
      storeId
    })
  }

  const handleDeleteStore = (storeId: string) => {
    const store = stores.find(s => s.id === storeId)
    setDeleteModal({
      isOpen: true,
      storeId,
      storeName: store?.name || 'نامشخص',
      isLoading: false
    })
  }

  const handleDeleteConfirm = async () => {
    try {
      setDeleteModal(prev => ({ ...prev, isLoading: true }))
      await deleteStore(deleteModal.storeId)
      await fetchStores() // Refresh the list
      await fetchStats() // Refresh stats
      setDeleteModal({
        isOpen: false,
        storeId: '',
        storeName: '',
        isLoading: false
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در حذف فروشگاه')
      setDeleteModal(prev => ({ ...prev, isLoading: false }))
    }
  }

  const handleAddStore = () => {
    setStoreFormModal({
      isOpen: true,
      storeId: undefined
    })
  }

  const handleStoreFormSuccess = () => {
    fetchStores() // Refresh the list
    fetchStats() // Refresh stats
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-1">
          <CardBody className="p-6">
            <div className="text-center">
              <p className="text-danger mb-4">{error}</p>
              <Button color="primary" onClick={fetchStores}>
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
          <StoreIcon className="size-8 text-success" />
          <div>
            <h1 className="text-2xl font-bold text-text-dark">مدیریت فروشگاه‌ها</h1>
            <p className="text-text-light">مشاهده و مدیریت تمام فروشگاه‌های سیستم</p>
          </div>
        </div>
        <Button
          color="success"
          startContent={<StoreIcon className="size-5" />}
          onClick={handleAddStore}
        >
          افزودن فروشگاه جدید
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">کل فروشگاه‌ها</p>
                <p className="text-2xl font-bold text-text-dark">{stats.total}</p>
              </div>
              <StoreIcon className="size-8 text-success" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">فروشگاه‌های فعال</p>
                <p className="text-2xl font-bold text-text-dark">{stats.active}</p>
              </div>
              <StoreIcon className="size-8 text-success" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">در انتظار تایید</p>
                <p className="text-2xl font-bold text-text-dark">{stats.pending}</p>
              </div>
              <StoreIcon className="size-8 text-warning" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">معلق</p>
                <p className="text-2xl font-bold text-text-dark">{stats.suspended}</p>
              </div>
              <StoreIcon className="size-8 text-danger" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">حذف شده</p>
                <p className="text-2xl font-bold text-text-dark">{stats.deleted}</p>
              </div>
              <StoreIcon className="size-8 text-default" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Stores Table */}
      <Card className="border-1">
        <CardHeader className="pb-3">
          <h3 className="text-lg font-semibold text-text-dark">لیست فروشگاه‌ها</h3>
        </CardHeader>
        <CardBody className="p-0">
          <Table aria-label="لیست فروشگاه‌ها">
            <TableHeader>
              <TableColumn>نام فروشگاه</TableColumn>
              <TableColumn>وضعیت</TableColumn>
              <TableColumn>آدرس</TableColumn>
              <TableColumn>تعداد تبلیغات</TableColumn>
              <TableColumn>تاریخ عضویت</TableColumn>
              <TableColumn>عملیات</TableColumn>
            </TableHeader>
            <TableBody>
              {stores.map((store) => (
                <TableRow key={store.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {store.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">{store.name}</span>
                        <p className="text-xs text-text-light">{formatPhoneNumber(store.phoneNumber)}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={getStatusColor(store.status)}
                      size="sm"
                      variant="flat"
                    >
                      {getStatusText(store.status)}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div>
                      <span className="text-sm">{getAddressText(store.address)}</span>
                      <p className="text-xs text-text-light">
                        {store.address.fullAddress ? store.address.fullAddress.substring(0, 30) + '...' : 'آدرس کامل ثبت نشده'}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <span className="font-medium">{store.promotions?.length || 0}</span>
                      <p className="text-xs text-text-light">تبلیغ فعال</p>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(store.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="primary"
                        aria-label="مشاهده"
                        onClick={() => handleViewStore(store.id)}
                      >
                        <EyeIcon className="size-4" />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="primary"
                        aria-label="ویرایش"
                        onClick={() => handleEditStore(store.id)}
                      >
                        <EditIcon className="size-4" />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        aria-label="حذف"
                        onClick={() => handleDeleteStore(store.id)}
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

      {/* Store Form Modal */}
      <StoreFormModal
        isOpen={storeFormModal.isOpen}
        onOpenChange={(isOpen) => setStoreFormModal(prev => ({ ...prev, isOpen }))}
        onSuccess={handleStoreFormSuccess}
        storeId={storeFormModal.storeId}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onOpenChange={(isOpen) => setDeleteModal(prev => ({ ...prev, isOpen }))}
        onConfirm={handleDeleteConfirm}
        title="حذف فروشگاه"
        message="آیا از حذف این فروشگاه اطمینان دارید؟"
        itemName={deleteModal.storeName}
        isLoading={deleteModal.isLoading}
      />
    </div>
  )
}

export default AdminStores
