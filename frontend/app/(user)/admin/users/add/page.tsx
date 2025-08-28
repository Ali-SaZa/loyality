'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@heroui/button'
import { Spinner } from '@heroui/spinner'
import { Chip } from '@heroui/chip'
import { useForm, FormProvider } from 'react-hook-form'
import toast from 'react-hot-toast'

import UserIcon from '@/components/icons/UserIcon'
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon'
import Input from '@/components/formElements/Input'
import { createUser, updateUser, getUserById, User } from '@/services/users'
import { UserRole, UserStatus, getRoleConfig, getStatusConfig } from '@/types/enums'

type FormData = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'purchases' | 'lastActivity' | 'status' | 'role'> & {
  firstname: string;
  lastname: string;
  role: UserRole;
  status: UserStatus;
}

const AddEditUser = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get('id')
  const isEditMode = !!userId

  const [loading, setLoading] = useState(false)

  const methods = useForm<FormData>({
    defaultValues: {
      phoneNumber: '',
      firstname: '',
      lastname: '',
      role: UserRole.CUSTOMER,
      status: UserStatus.ACTIVE,
      totalPoints: 0,
      storeName: '',
      address: '',
      description: ''
    }
  })

  const { handleSubmit, reset, watch } = methods

  useEffect(() => {
    if (isEditMode) {
      fetchUser()
    }
  }, [userId])

  const fetchUser = async () => {
    try {
      setLoading(true)
      const user = await getUserById(userId!)
      reset({
        phoneNumber: user.phoneNumber,
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        role: user.role as UserRole,
        status: user.status as UserStatus,
        totalPoints: user.totalPoints || 0,
        storeName: user.storeName || '',
        address: user.address || '',
        description: user.description || ''
      })
    } catch (error) {
      toast.error('خطا در دریافت اطلاعات کاربر')
      router.push('/admin/users')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: FormData) => {
    if (!data.phoneNumber.trim()) {
      toast.error('شماره تماس الزامی است')
      return
    }

    if (data.phoneNumber.length !== 11 || !data.phoneNumber.startsWith('09')) {
      toast.error('شماره تماس باید ۱۱ رقم و با ۰۹ شروع شود')
      return
    }

    try {
      setLoading(true)
      
      if (isEditMode) {
        await updateUser(userId!, {
          firstname: data.firstname,
          lastname: data.lastname,
          storeName: data.storeName,
          address: data.address,
          description: data.description
        })
        toast.success('کاربر با موفقیت بروزرسانی شد')
      } else {
        await createUser({
          phoneNumber: data.phoneNumber,
          firstname: data.firstname,
          lastname: data.lastname,
          storeName: data.storeName,
          address: data.address,
          description: data.description
        })
        toast.success('کاربر با موفقیت ایجاد شد')
      }
      
      router.push('/admin/users')
    } catch (error) {
      toast.error(isEditMode ? 'خطا در بروزرسانی کاربر' : 'خطا در ایجاد کاربر')
    } finally {
      setLoading(false)
    }
  }



  if (loading && isEditMode) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="mt-4 text-text-light">در حال بارگذاری...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="light"
          isIconOnly
          onPress={() => router.push('/admin/users')}
        >
          <ArrowLeftIcon className="size-5" />
        </Button>
        <UserIcon className="size-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-text-dark">
            {isEditMode ? 'ویرایش کاربر' : 'افزودن کاربر جدید'}
          </h1>
          <p className="text-text-light">
            {isEditMode ? 'ویرایش اطلاعات کاربر' : 'ایجاد کاربر جدید در سیستم'}
          </p>
        </div>
      </div>

      {/* Form */}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Phone Number */}
              <Input
                generalType="input"
                name="phoneNumber"
                label="شماره تماس"
                inputType="tel"
                placeholder="09123456789"
                required={!isEditMode}
                disabled={isEditMode}
                maxValue={11}
                description={!isEditMode ? "شماره تماس باید ۱۱ رقم و با ۰۹ شروع شود" : undefined}
              />

              {/* First Name */}
              <Input
                generalType="input"
                name="firstname"
                label="نام"
                inputType="text"
                placeholder="نام کاربر را وارد کنید"
                maxValue={100}
              />

              {/* Last Name */}
              <Input
                generalType="input"
                name="lastname"
                label="نام خانوادگی"
                inputType="text"
                placeholder="نام خانوادگی کاربر را وارد کنید"
                maxValue={100}
              />

              {/* Role */}
              <Input
                generalType="select"
                name="role"
                label="نقش کاربر"
                placeholder="نقش کاربر را انتخاب کنید"
                selectOptions={[
                  { code: UserRole.CUSTOMER, name: getRoleConfig(UserRole.CUSTOMER).text },
                  { code: UserRole.STORE, name: getRoleConfig(UserRole.STORE).text },
                  { code: UserRole.ADMIN, name: getRoleConfig(UserRole.ADMIN).text }
                ]}
                disabled={isEditMode}
                selectKey="code"
                selectValue="name"
              />

              {/* Store-specific fields - only show when role is store */}
              {watch('role') === UserRole.STORE && (
                <>
                  {/* Store Name */}
                  <Input
                    generalType="input"
                    name="storeName"
                    label="نام فروشگاه"
                    inputType="text"
                    placeholder="نام فروشگاه را وارد کنید"
                    maxValue={200}
                    required
                  />

                  {/* Store Address */}
                  <Input
                    generalType="textarea"
                    name="address"
                    label="آدرس فروشگاه"
                    placeholder="آدرس کامل فروشگاه را وارد کنید"
                    maxValue={500}
                    required
                  />

                  {/* Store Description */}
                  <Input
                    generalType="textarea"
                    name="description"
                    label="توضیحات فروشگاه"
                    placeholder="توضیحات فروشگاه را وارد کنید"
                    maxValue={1000}
                  />
                </>
              )}

              {/* Status */}
              <Input
                generalType="select"
                name="status"
                label="وضعیت کاربر"
                placeholder="وضعیت کاربر را انتخاب کنید"
                selectOptions={[
                  { code: UserStatus.ACTIVE, name: getStatusConfig(UserStatus.ACTIVE).text },
                  { code: UserStatus.BLOCKED, name: getStatusConfig(UserStatus.BLOCKED).text },
                  { code: UserStatus.DELETED, name: getStatusConfig(UserStatus.DELETED).text }
                ]}
                selectKey="code"
                selectValue="name"
              />

              {/* Total Points */}
              <Input
                generalType="input"
                name="totalPoints"
                label="امتیاز کل"
                inputType="number"
                placeholder="0"
                minValue={0}
                description="امتیاز اولیه کاربر"
              />
            </div>


          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <Button
              type="submit"
              color="primary"
              isLoading={loading}
              className="flex-1"
            >
              {isEditMode ? 'بروزرسانی کاربر' : 'ایجاد کاربر'}
            </Button>
            <Button
              variant="light"
              onPress={() => router.push('/admin/users')}
              className="flex-1"
            >
              انصراف
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

export default AddEditUser
