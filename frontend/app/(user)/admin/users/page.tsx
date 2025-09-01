'use client'
import { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/table'
import { useRouter } from 'next/navigation'
import { Select, SelectItem } from '@heroui/select'

import UserIcon from '@/components/icons/UserIcon'
import EditIcon from '@/components/icons/EditIcon'
import TrashIcon from '@/components/icons/TrashIcon'
import EyeIcon from '@/components/icons/EyeIcon'
import StoreIcon from '@/components/icons/ChartTreeIcon'
import { getAllUsers, deleteUser, User } from '@/services/users'
import useLoading from '@/hooks/useLoading'
import { UserRole, UserStatus, getRoleConfig, getStatusConfig } from '@/types/enums'
import Modal from '@/components/modals/Modal'
import UserFormModal from '@/components/modals/UserFormModal'

const AdminUsers = () => {
  const router = useRouter()
  const { setLoading } = useLoading()
  
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [selectedRole, setSelectedRole] = useState<string>('all')

  const [error, setError] = useState<string | null>(null)
  
  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    userId: '',
    userName: '',
    isLoading: false
  })

  // User form modal state
  const [userFormModal, setUserFormModal] = useState({
    isOpen: false,
    userId: undefined as string | undefined
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, selectedRole])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getAllUsers(1, 50)
      console.log(response.users)
      setUsers(response.users)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در بارگذاری کاربران')
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    if (selectedRole === 'all') {
      setFilteredUsers(users)
    } else {
      setFilteredUsers(users.filter(user => user.role === selectedRole))
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

  const handleDeleteClick = (user: User) => {
    const userName = user.firstName && user.lastName 
      ? `${user.firstName} ${user.lastName}` 
      : user.phoneNumber
    
    setDeleteModal({
      isOpen: true,
      userId: user.id,
      userName,
      isLoading: false
    })
  }

  const handleDeleteConfirm = async () => {
    try {
      setDeleteModal(prev => ({ ...prev, isLoading: true }))
      await deleteUser(deleteModal.userId)
      
      // Refresh the users list to show updated status
      await fetchUsers()
      
      // Close modal
      setDeleteModal({
        isOpen: false,
        userId: '',
        userName: '',
        isLoading: false
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در حذف کاربر')
      setDeleteModal(prev => ({ ...prev, isLoading: false }))
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModal({
      isOpen: false,
      userId: '',
      userName: '',
      isLoading: false
    })
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

  const handleViewUser = (userId: string) => {
    router.push(`/admin/users/${userId}`)
  }

  const handleEditUser = (userId: string) => {
    setUserFormModal({
      isOpen: true,
      userId: userId
    })
  }

  const handleAddUser = () => {
    setUserFormModal({
      isOpen: true,
      userId: undefined
    })
  }

  const handleUserFormSuccess = () => {
    fetchUsers() // Refresh the users list
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

      {/* Filter */}
      <Card className="border-1">
        <CardBody className="p-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-text-dark">فیلتر بر اساس نقش:</span>
            <Select
              selectedKeys={[selectedRole]}
              onSelectionChange={(keys) => setSelectedRole(Array.from(keys)[0] as string)}
              className="w-48"
            >
              <SelectItem key="all">همه کاربران</SelectItem>
              <SelectItem key={UserRole.CUSTOMER}>{getRoleConfig(UserRole.CUSTOMER).text}</SelectItem>
              <SelectItem key={UserRole.STORE}>{getRoleConfig(UserRole.STORE).text}</SelectItem>
            </Select>
          </div>
        </CardBody>
      </Card>

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
              <TableColumn>امتیازات</TableColumn>
              <TableColumn>خریدها</TableColumn>
              <TableColumn>آخرین فعالیت</TableColumn>
              <TableColumn>عملیات</TableColumn>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {user.firstName?.charAt(0) || user.phoneNumber.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">
                          {user.firstName && user.lastName 
                            ? `${user.firstName} ${user.lastName}`
                            : user.firstName || 'نامشخص'
                          }
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
                  <TableCell>
                    <span className="font-medium">{user.totalPoints.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{user.purchases?.length || 0}</span>
                  </TableCell>
                  <TableCell>{formatDate(user.lastActivity)}</TableCell>
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
                        onClick={() => handleDeleteClick(user)}
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onOpenChange={(isOpen) => !isOpen && handleDeleteCancel()}
        onAccept={handleDeleteConfirm}
        onReject={handleDeleteCancel}
        isLoading={deleteModal.isLoading}
        title="تأیید حذف کاربر"
        acceptBtnText="حذف"
        rejectBtnText="انصراف"
        acceptBtnColor="danger"
        size="md"
      >
        <div className="py-4">
          <p className="text-lg mb-2">
            آیا از حذف کاربر <span className="font-semibold">{deleteModal.userName}</span> اطمینان دارید؟
          </p>
        </div>
      </Modal>

      {/* User Form Modal */}
      <UserFormModal
        isOpen={userFormModal.isOpen}
        onOpenChange={(isOpen) => setUserFormModal(prev => ({ ...prev, isOpen }))}
        onSuccess={handleUserFormSuccess}
        userId={userFormModal.userId}
      />
    </div>
  )
}

export default AdminUsers
