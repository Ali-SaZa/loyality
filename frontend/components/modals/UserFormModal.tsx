'use client'
import { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import Modal from './Modal'
import Input from '@/components/formElements/Input'
import useLoading from '@/hooks/useLoading'
import { CreateUserFormValidation, UpdateUserFormValidation } from '@/validation/user'
import { UserRole, UserStatus } from '@/types/enums'
import { User, getUserById, createUser, updateUser } from '@/services/users'

type UserFormData = {
  firstName?: string
  lastName?: string
  phoneNumber: string
  role: UserRole
  status: UserStatus
}

interface UserFormModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onSuccess?: () => void
  userId?: string // If provided, it's edit mode
}

const UserFormModal = ({ isOpen, onOpenChange, onSuccess, userId }: UserFormModalProps) => {
  const { setLoading } = useLoading()
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isEditMode = !!userId

  const methods = useForm<UserFormData>({
    resolver: zodResolver(isEditMode ? UpdateUserFormValidation : CreateUserFormValidation),
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      role: UserRole.CUSTOMER,
      status: UserStatus.ACTIVE
    }
  })

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && userId) {
        fetchUser(userId)
      } else {
        // Reset form for create mode
        methods.reset({
          firstName: '',
          lastName: '',
          phoneNumber: '',
          role: UserRole.CUSTOMER,
          status: UserStatus.ACTIVE
        })
        setError(null)
      }
    }
  }, [isOpen, isEditMode, userId])

  const fetchUser = async (userId: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const userData = await getUserById(userId)
      setUser(userData)
      
      methods.reset({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phoneNumber: userData.phoneNumber,
        role: userData.role as UserRole,
        status: userData.status as UserStatus || UserStatus.ACTIVE
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در بارگذاری اطلاعات کاربر')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: UserFormData) => {
    try {
      setLoading(true)
      setError(null)
      
      if (isEditMode && userId) {
        // Update existing user
        const userData = {
          firstName: data.firstName || undefined,
          lastName: data.lastName || undefined
        }
        
        await updateUser(userId, userData)
      } else {
        // Create new user
        const userData = {
          phoneNumber: data.phoneNumber,
          firstName: data.firstName || undefined,
          lastName: data.lastName || undefined
        }
        
        await createUser(userData)
      }
      
      onOpenChange(false)
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : isEditMode ? 'خطا در بروزرسانی کاربر' : 'خطا در ایجاد کاربر')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setError(null)
  }

  const roleOptions = [
    { code: UserRole.CUSTOMER, name: 'مشتری' },
    { code: UserRole.STORE, name: 'فروشگاه' }
  ]

  const statusOptions = [
    { code: UserStatus.ACTIVE, name: 'فعال' },
    { code: UserStatus.BLOCKED, name: 'مسدود' },
    ...(isEditMode ? [{ code: UserStatus.DELETED, name: 'حذف شده' }] : [])
  ]

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={handleClose}
      onAccept={methods.handleSubmit(onSubmit)}
      onReject={handleClose}
      title={isEditMode ? 'ویرایش کاربر' : 'افزودن کاربر جدید'}
      acceptBtnText={isEditMode ? 'بروزرسانی کاربر' : 'ایجاد کاربر'}
      rejectBtnText="انصراف"
      acceptBtnColor="primary"
      size="lg"
    >
      <div className="space-y-6">
        {error && (
          <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
            <p className="text-danger text-sm">{error}</p>
          </div>
        )}

        <FormProvider {...methods}>
          <div className="space-y-6">
            {/* First row: Phone number → Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                generalType="input"
                name="phoneNumber"
                label="شماره تلفن"
                placeholder="09XXXXXXXXX"
                inputType="tel"
                description="شماره تلفن باید با 09 شروع شود"
                disabled={isEditMode}
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
              />
            </div>

            {/* Second row: Status */}
            <div className="grid grid-cols-1 gap-6">
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
          </div>
        </FormProvider>
      </div>
    </Modal>
  )
}

export default UserFormModal
