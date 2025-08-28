'use client'
import { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/table'
import { Input } from '@heroui/input'
import { Spinner } from '@heroui/spinner'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/modal'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

import UserIcon from '@/components/icons/UserIcon'
import EditIcon from '@/components/icons/EditIcon'
import TrashIcon from '@/components/icons/TrashIcon'
import SearchIcon from '@/components/icons/SearchIcon'
import { getAllUsers, deleteUser, User } from '@/services/users'
import { UserRole, UserStatus, getRoleConfig, getStatusConfig } from '@/types/enums'

const AdminUsers = () => {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()

  // Fetch users from API
  useEffect(() => {
    fetchUsers()
  }, [])

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users)
    } else {
      const filtered = users.filter(user => 
        (user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        user.phoneNumber.includes(searchTerm)
      )
      setFilteredUsers(filtered)
    }
  }, [searchTerm, users])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await getAllUsers()
      setUsers(response.users)
      setFilteredUsers(response.users)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('خطا در دریافت لیست کاربران')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user)
    onOpen()
  }

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return

    try {
      setDeleteLoading(true)
              console.log('Starting delete process for user:', userToDelete.id, userToDelete.firstName, userToDelete.lastName)
      
      await deleteUser(userToDelete.id)
      
      console.log('User deleted successfully, refreshing list...')
      toast.success('کاربر با موفقیت حذف شد')
      
      // Refresh the list
      await fetchUsers()
      
      // Close modal and reset state
      onClose()
      setUserToDelete(null)
      
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error(`خطا در حذف کاربر: ${error instanceof Error ? error.message : 'خطای نامشخص'}`)
    } finally {
      setDeleteLoading(false)
    }
  }











  // Calculate statistics (excluding deleted users)
  const stats = {
    total: users.filter(u => u.status !== UserStatus.DELETED).length,
    customers: users.filter(u => u.role === UserRole.CUSTOMER && u.status !== UserStatus.DELETED).length,
    stores: users.filter(u => u.role === UserRole.STORE && u.status !== UserStatus.DELETED).length,
    admins: users.filter(u => u.role === UserRole.ADMIN && u.status !== UserStatus.DELETED).length,
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="mt-4 text-text-light">در حال بارگذاری کاربران...</p>
        </div>
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
          onPress={() => router.push('/admin/users/add')}
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
                <p className="text-sm text-text-light mb-1">مشتریان</p>
                <p className="text-2xl font-bold text-text-dark">{stats.customers}</p>
              </div>
              <UserIcon className="size-8 text-primary" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">فروشگاه‌ها</p>
                <p className="text-2xl font-bold text-text-dark">{stats.stores}</p>
              </div>
              <UserIcon className="size-8 text-success" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-1">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light mb-1">ادمین‌ها</p>
                <p className="text-2xl font-bold text-text-dark">{stats.admins}</p>
              </div>
              <UserIcon className="size-8 text-danger" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-1">
        <CardBody className="p-4">
          <div className="flex items-center gap-4">
            <Input
              placeholder="جستجو بر اساس نام یا شماره تماس..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startContent={<SearchIcon className="size-4 text-text-light" />}
              className="max-w-md"
            />
            <Button
              variant="light"
              color="primary"
              onPress={() => setSearchTerm('')}
            >
              پاک کردن
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Users Table */}
      <Card className="border-1">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text-dark">
              لیست کاربران ({filteredUsers.filter(u => u.status !== 'deleted').length} کاربر)
            </h3>
            <Button
              size="sm"
              variant="light"
              color="primary"
              onPress={fetchUsers}
            >
              بروزرسانی
            </Button>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {filteredUsers.filter(u => u.status !== 'deleted').length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-text-light">
                {searchTerm ? 'هیچ کاربری با این مشخصات یافت نشد' : 'هیچ کاربری در سیستم وجود ندارد'}
              </p>
            </div>
          ) : (
            <Table aria-label="لیست کاربران">
              <TableHeader>
                <TableColumn>نام</TableColumn>
                <TableColumn>شماره تماس</TableColumn>
                <TableColumn>نقش</TableColumn>
                <TableColumn>وضعیت</TableColumn>
                <TableColumn>امتیاز</TableColumn>
                <TableColumn>تاریخ عضویت</TableColumn>
                <TableColumn>عملیات</TableColumn>
              </TableHeader>
              <TableBody>
                {filteredUsers
                  .filter(u => u.status !== 'deleted')
                  .map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {user.firstName?.charAt(0) || user.lastName?.charAt(0) || '?'}
                          </span>
                        </div>
                        <span className="font-medium">
                                          {user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user.firstName || user.lastName || 'نامشخص'
                }
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{user.phoneNumber}</TableCell>
                    <TableCell>
                      <Chip
                        color={getRoleConfig(user.role).color}
                        size="sm"
                        variant="flat"
                      >
                        {getRoleConfig(user.role).text}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={getStatusConfig(user.status || 'active').color}
                        size="sm"
                        variant="flat"
                      >
                        {getStatusConfig(user.status || 'active').text}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{user.totalPoints || 0}</span>
                    </TableCell>
                    <TableCell>
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fa-IR') : 'نامشخص'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="primary"
                          aria-label="ویرایش"
                          onPress={() => router.push(`/admin/users/add?id=${user.id}`)}
                        >
                          <EditIcon className="size-4" />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="danger"
                          aria-label="حذف"
                          onPress={() => handleDeleteClick(user)}
                          isDisabled={deleteLoading}
                        >
                          <TrashIcon className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>تایید حذف کاربر</ModalHeader>
          <ModalBody>
            <p>
              آیا از حذف کاربر <strong>
                                {userToDelete?.firstName && userToDelete?.lastName
                  ? `${userToDelete.firstName} ${userToDelete.lastName}`
                  : userToDelete?.firstName || userToDelete?.lastName || 'نامشخص'
                }
              </strong> اطمینان دارید؟
            </p>
            <p className="text-sm text-text-light mt-2">
              این عملیات قابل بازگشت نیست و کاربر به وضعیت "حذف شده" تغییر خواهد کرد.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              انصراف
            </Button>
            <Button 
              color="danger" 
              onPress={handleDeleteConfirm}
              isLoading={deleteLoading}
              isDisabled={deleteLoading}
            >
              حذف کاربر
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default AdminUsers
