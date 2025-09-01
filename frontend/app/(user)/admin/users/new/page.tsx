'use client'
import { useState } from 'react'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Button } from '@heroui/button'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import UserIcon from '@/components/icons/UserIcon'
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon'
import Input from '@/components/formElements/Input'
import useLoading from '@/hooks/useLoading'
import { CreateUserFormValidation } from '@/validation/user'
import { UserRole, UserStatus } from '@/types/enums'

type CreateUserFormData = {
  firstName: string
  lastName: string
  phoneNumber: string
  role: UserRole
  status: UserStatus
}

const AddUser = () => {
  const router = useRouter()
  const { setLoading } = useLoading()
  const [error, setError] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(CreateUserFormValidation),
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      role: UserRole.CUSTOMER,
      status: UserStatus.ACTIVE
    }
  })

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      setLoading(true)
      setError(null)
      
      // TODO: Implement create user API call
      console.log('Creating user:', data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      router.push('/admin/users')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در ایجاد کاربر')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/admin/users')
  }

  const roleOptions = [
    { code: UserRole.CUSTOMER, name: 'مشتری' },
    { code: UserRole.STORE, name: 'فروشگاه' }
  ]

  const statusOptions = [
    { code: UserStatus.ACTIVE, name: 'فعال' },
    { code: UserStatus.BLOCKED, name: 'مسدود' }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            isIconOnly
            variant="light"
            color="primary"
            onClick={handleCancel}
          >
            <ArrowLeftIcon className="size-5" />
          </Button>
          <div className="flex items-center gap-3">
            <UserIcon className="size-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-text-dark">افزودن کاربر جدید</h1>
              <p className="text-text-light">ایجاد کاربر جدید در سیستم</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="border-1 max-w-2xl">
        <CardHeader className="pb-3">
          <h3 className="text-lg font-semibold text-text-dark">اطلاعات کاربر</h3>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
                <p className="text-danger text-sm">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                generalType="input"
                name="firstName"
                label="نام"
                placeholder="نام کاربر"
                inputType="text"
                control={control}
                errors={errors}
              />
              
              <Input
                generalType="input"
                name="lastName"
                label="نام خانوادگی"
                placeholder="نام خانوادگی کاربر"
                inputType="text"
                control={control}
                errors={errors}
              />
            </div>

            <Input
              generalType="input"
              name="phoneNumber"
              label="شماره تلفن"
              placeholder="09XXXXXXXXX"
              inputType="tel"
              control={control}
              errors={errors}
              description="شماره تلفن باید با 09 شروع شود"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                generalType="select"
                name="role"
                label="نقش کاربر"
                placeholder="نقش کاربر را انتخاب کنید"
                control={control}
                errors={errors}
                selectOptions={roleOptions}
                selectKey="code"
                selectValue="name"
              />

              <Input
                generalType="select"
                name="status"
                label="وضعیت"
                placeholder="وضعیت کاربر را انتخاب کنید"
                control={control}
                errors={errors}
                selectOptions={statusOptions}
                selectKey="code"
                selectValue="name"
              />
            </div>

            <div className="flex items-center justify-end gap-4 pt-6">
              <Button
                variant="flat"
                color="default"
                onClick={handleCancel}
              >
                انصراف
              </Button>
              <Button
                type="submit"
                color="primary"
                startContent={<UserIcon className="size-5" />}
              >
                ایجاد کاربر
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}

export default AddUser
