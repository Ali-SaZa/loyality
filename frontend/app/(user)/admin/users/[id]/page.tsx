'use client'
import { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Button } from '@heroui/button'
import { useRouter, useParams } from 'next/navigation'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import UserIcon from '@/components/icons/UserIcon'
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon'
import Input from '@/components/formElements/Input'
import { getUserById, createUser, updateUser, User, CreateUserRequest, UpdateUserRequest } from '@/services/users'
import useLoading from '@/hooks/useLoading'
import { UserRole, UserStatus } from '@/types/enums'
import { CreateUserFormValidation, UpdateUserFormValidation, UserFormData, UserUpdateData } from '@/validation/user'

const UserForm = () => {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string
  const isEditing = userId && userId !== 'new'
  const { setLoading } = useLoading()
  
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(isEditing)

  const defaultValues = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: UserRole.CUSTOMER,
    status: UserStatus.ACTIVE
  }

  const methods = useForm({
    resolver: zodResolver(isEditing ? UpdateUserFormValidation : CreateUserFormValidation),
    defaultValues
  })

  const { handleSubmit, reset, formState: { errors } } = methods

  useEffect(() => {
    if (isEditing) {
      fetchUser()
    }
  }, [userId])

  const fetchUser = async () => {
    try {
      setIsLoading(true)
      const userData = await getUserById(userId)
      setUser(userData)
      reset({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phoneNumber: userData.phoneNumber,
        role: userData.role as UserRole,
        status: userData.status as UserStatus || UserStatus.ACTIVE
      } as any)
    } catch (error) {
      console.error('Error fetching user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: UserFormData | UserUpdateData) => {
    try {
      setLoading(true)
      
      if (isEditing) {
        // Update existing user
        const updateData: UpdateUserRequest = {
          firstName: data.firstName,
          lastName: data.lastName
        }
        await updateUser(userId, updateData)
        
        // Update status separately if it changed
        if (user && user.status !== data.status) {
          // This would need to be implemented in the service
          console.log('Status update needed:', data.status)
        }
      } else {
        // Create new user
        const createData: CreateUserRequest = {
          phoneNumber: data.phoneNumber,
          firstName: data.firstName,
          lastName: data.lastName
        }
        await createUser(createData)
      }
      
      router.push('/admin/users')
    } catch (error) {
      console.error('Error saving user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/admin/users')
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <Card className="border-1">
          <CardBody className="p-6">
            <div className="text-center">
              <p className="text-text-light">در حال بارگذاری...</p>
            </div>
          </CardBody>
        </Card>
      </div>
    )
  }

  const roleOptions = [
    { code: UserRole.CUSTOMER, name: 'مشتری' },
    { code: UserRole.STORE, name: 'فروشگاه' }
  ]

  const statusOptions = [
    { code: UserStatus.ACTIVE, name: 'فعال' },
    { code: UserStatus.BLOCKED, name: 'مسدود' },
    ...(isEditing ? [{ code: UserStatus.DELETED, name: 'حذف شده' }] : [])
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          isIconOnly
          variant="light"
          onClick={handleCancel}
          aria-label="بازگشت"
        >
          <ArrowLeftIcon className="size-5" />
        </Button>
        <div className="flex items-center gap-3">
          <UserIcon className="size-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-text-dark">
              {isEditing ? 'ویرایش کاربر' : 'افزودن کاربر جدید'}
            </h1>
            <p className="text-text-light">
              {isEditing ? 'ویرایش اطلاعات کاربر' : 'ایجاد کاربر جدید در سیستم'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="border-1">
        <CardHeader className="pb-3">
          <h3 className="text-lg font-semibold text-text-dark">اطلاعات کاربر</h3>
        </CardHeader>
        <CardBody>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* First row: Phone number */}
              <div className="grid grid-cols-1 gap-6">
                <Input
                  generalType="input"
                  name="phoneNumber"
                  label="شماره تلفن"
                  placeholder="09XXXXXXXXX"
                  inputType="tel"
                  description="شماره تلفن باید با 09 شروع شود"
                  disabled={isEditing}
                  required={true}
                />
              </div>

              {/* Second row: Status → Role */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  generalType="select"
                  name="status"
                  label="وضعیت"
                  placeholder="وضعیت کاربر را انتخاب کنید"
                  selectOptions={statusOptions}
                  selectKey="code"
                  selectValue="name"
                  required={true}
                />

                <Input
                  generalType="select"
                  name="role"
                  label="نقش کاربر"
                  placeholder="نقش کاربر را انتخاب کنید"
                  selectOptions={roleOptions}
                  selectKey="code"
                  selectValue="name"
                  required={true}
                  disabled={isEditing} // Role cannot be changed in edit mode
                />
              </div>

              {/* Third row: First name → Last name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  generalType="input"
                  name="firstName"
                  label="نام"
                  placeholder="نام کاربر"
                  inputType="text"
                />
                
                <Input
                  generalType="input"
                  name="lastName"
                  label="نام خانوادگی"
                  placeholder="نام خانوادگی کاربر"
                  inputType="text"
                />
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-divider">
                <Button
                  type="button"
                  variant="light"
                  onClick={handleCancel}
                >
                  انصراف
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  startContent={<UserIcon className="size-5" />}
                >
                  {isEditing ? 'بروزرسانی کاربر' : 'ایجاد کاربر'}
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardBody>
      </Card>
    </div>
  )
}

export default UserForm
