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
import { getAllUsers, User } from '@/services/users'
import useLoading from '@/hooks/useLoading'
import { UserRole, UserStatus, getRoleConfig, getStatusConfig } from '@/types/enums'

const AdminUsers = () => {
  const router = useRouter()
  const { setLoading } = useLoading()
  
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [stats, setStats] = useState({
    total: 0,
    customers: 0,
    stores: 0,
    active: 0,
    blocked: 0,
    deleted: 0
  })
  const [error, setError] = useState<string | null>(null)

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
      setUsers(response.users)
      
      // Calculate stats
      const total = response.users.length
      const customers = response.users.filter(u => u.role === 'customer').length
      const stores = response.users.filter(u => u.role === 'store').length
      const active = response.users.filter(u => u.status === 'active').length
      const blocked = response.users.filter(u => u.status === 'blocked').length
      const deleted = response.users.filter(u => u.status === 'deleted').length
      
      setStats({ total, customers, stores, active, blocked, deleted })
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
    router.push(`/admin/users/${userId}/edit`)
  }

  const handleDeleteUser = async (userId: string) => {
    if (confirm('آیا از حذف این کاربر اطمینان دارید؟')) {
      try {
        setLoading(true)
        // TODO: Implement delete user functionality
        await fetchUsers() // Refresh the list
      } catch (err) {
        setError(err instanceof Error ? err.message : 'خطا در حذف کاربر')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleAddUser = () => {
    router.push('/admin/users/new')
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
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
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
              <StoreIcon className="size-8 text-success" />
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
                <p className="text-sm text-text-light mb-1">حذف شده</p>
                <p className="text-2xl font-bold text-text-dark">{stats.deleted}</p>
              </div>
              <UserIcon className="size-8 text-danger" />
            </div>
          </CardBody>
        </Card>
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
    </div>
  )
}

export default AdminUsers
