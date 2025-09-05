'use client'
import { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/table'

import UserIcon from '@/components/icons/UserIcon'
import EditIcon from '@/components/icons/EditIcon'
import TrashIcon from '@/components/icons/TrashIcon'
import EyeIcon from '@/components/icons/EyeIcon'
import { getAllUsers, getUserStats, deleteUser, User, UserStats } from '@/services/users'
import useLoading from '@/hooks/useLoading'
import { getRoleConfig, getStatusConfig } from '@/types/enums'
import { formatDateToPersianJalali, formatPhoneNumber } from '@/helpers'
import UserFormModal from '@/components/modals/UserFormModal'
import UserViewModal from '@/components/modals/UserViewModal'
import DeleteConfirmModal from '@/components/modals/DeleteConfirmModal'

const AdminUsers = () => {
  const { setLoading } = useLoading()
  
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    active: 0,
    blocked: 0,
    deleted: 0
  })
  const [error, setError] = useState<string | null>(null)

  // User form modal state
  const [userFormModal, setUserFormModal] = useState({
    isOpen: false,
    userId: undefined as string | undefined
  })

  // User view modal state
  const [userViewModal, setUserViewModal] = useState({
    isOpen: false,
    userId: undefined as string | undefined
  })

  // Delete confirmation modal state
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({
    isOpen: false,
    userId: undefined as string | undefined,
    userName: ''
  })

  useEffect(() => {
    fetchUsers()
    fetchStats()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getAllUsers({ page: 1, limit: 50 })
      setUsers(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در بارگذاری کاربران')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const statsData = await getUserStats()
      setStats(statsData)
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return formatDateToPersianJalali(date)
  }


  const handleViewUser = (userId: string) => {
    setUserViewModal({
      isOpen: true,
      userId
    })
  }

  const handleEditUser = (userId: string) => {
    setUserFormModal({
      isOpen: true,
      userId
    })
  }

  const handleDeleteUser = async (userId: string) => {
    // Find the user to get their name for the confirmation modal
    const user = users.find(u => u.id === userId)
    const userName = user ? (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.phoneNumber) : ''
    
    setDeleteConfirmModal({
      isOpen: true,
      userId,
      userName
    })
  }

  const handleAddUser = () => {
    setUserFormModal({
      isOpen: true,
      userId: undefined
    })
  }

  const handleUserFormSuccess = () => {
    fetchUsers() // Refresh the list
    fetchStats() // Refresh stats
  }

  const handleUserViewEdit = (userId: string) => {
    setUserFormModal({
      isOpen: true,
      userId
    })
  }

  const handleUserViewDelete = (userId: string) => {
    // This will be handled by the view modal itself
  }

  const handleUserViewSuccess = () => {
    fetchUsers() // Refresh the list
    fetchStats() // Refresh stats
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmModal.userId) return
    
    try {
      setLoading(true)
      await deleteUser(deleteConfirmModal.userId)
      await fetchUsers() // Refresh the list
      await fetchStats() // Refresh stats
      setDeleteConfirmModal({ isOpen: false, userId: undefined, userName: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در حذف کاربر')
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
              <Button color="primary" onClick={fetchUsers}>
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
          <UserIcon className="size-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-text-dark">مدیریت کاربران</h1>
            <p className="text-text-light">مشاهده و مدیریت تمام کاربران سیستم</p>
          </div>
        </div>
        <Button
          color="primary"
          startContent={<UserIcon className="size-5" />}
          onClick={handleAddUser}
        >
          افزودن کاربر جدید
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">کل کاربران</p>
                <p className="text-2xl font-bold text-text-dark">{stats.total}</p>
              </div>
              <UserIcon className="size-8 text-primary" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">کاربران فعال</p>
                <p className="text-2xl font-bold text-text-dark">{stats.active}</p>
              </div>
              <UserIcon className="size-8 text-success" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">کاربران مسدود</p>
                <p className="text-2xl font-bold text-text-dark">{stats.blocked}</p>
              </div>
              <UserIcon className="size-8 text-warning" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">کاربران حذف شده</p>
                <p className="text-2xl font-bold text-text-dark">{stats.deleted}</p>
              </div>
              <UserIcon className="size-8 text-danger" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="border-1">
        <CardHeader className="pb-3">
          <h3 className="text-lg font-semibold text-text-dark">لیست کاربران</h3>
        </CardHeader>
        <CardBody className="p-0">
          <Table aria-label="لیست کاربران">
            <TableHeader>
              <TableColumn>نام کاربر</TableColumn>
              <TableColumn>شماره تلفن</TableColumn>
              <TableColumn>نقش</TableColumn>
              <TableColumn>وضعیت</TableColumn>
              <TableColumn>تاریخ عضویت</TableColumn>
              <TableColumn>عملیات</TableColumn>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {user.firstName ? user.firstName.charAt(0) : user.phoneNumber.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">
                          {user.firstName && user.lastName 
                            ? `${user.firstName} ${user.lastName}` 
                            : 'نام ثبت نشده'}
                        </span>
                        <p className="text-xs text-text-light">ID: {user.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{formatPhoneNumber(user.phoneNumber)}</span>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={getRoleColor(user.role)}
                      size="sm"
                      variant="flat"
                    >
                      {getRoleText(user.role)}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={getStatusColor(user.status || 'active')}
                      size="sm"
                      variant="flat"
                    >
                      {getStatusText(user.status || 'active')}
                    </Chip>
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="primary"
                        aria-label="مشاهده"
                        onClick={() => handleViewUser(user.id)}
                      >
                        <EyeIcon className="size-4" />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="primary"
                        aria-label="ویرایش"
                        onClick={() => handleEditUser(user.id)}
                      >
                        <EditIcon className="size-4" />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        aria-label="حذف"
                        onClick={() => handleDeleteUser(user.id)}
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

      {/* User Form Modal */}
      <UserFormModal
        isOpen={userFormModal.isOpen}
        onOpenChange={(isOpen) => setUserFormModal(prev => ({ ...prev, isOpen }))}
        onSuccess={handleUserFormSuccess}
        userId={userFormModal.userId}
      />

      {/* User View Modal */}
      <UserViewModal
        isOpen={userViewModal.isOpen}
        onOpenChange={(isOpen) => setUserViewModal(prev => ({ ...prev, isOpen }))}
        onEdit={handleUserViewEdit}
        onDelete={handleUserViewDelete}
        onSuccess={handleUserViewSuccess}
        userId={userViewModal.userId}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteConfirmModal.isOpen}
        onOpenChange={(isOpen) => setDeleteConfirmModal(prev => ({ ...prev, isOpen }))}
        onConfirm={handleDeleteConfirm}
        title="حذف کاربر"
        message="آیا از حذف این کاربر اطمینان دارید؟"
        itemName={deleteConfirmModal.userName}
        isLoading={false}
      />
    </div>
  )
}

export default AdminUsers