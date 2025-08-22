'use client'
import React from 'react'
import { useDisclosure } from '@heroui/modal'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'

import Input from '../formElements/Input'

import { ChangePasswordFormValidation } from '@/validation/changePassword'
import { CHANGE_USER_PASSWORD } from '@/services/auth'
import Modal from '@/components/modals/Modal'

interface SimulatorSortModalProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ChangePasswordDefaultValues = {
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
}

const ChangePasswordModal = ({ isOpen, setIsOpen }: SimulatorSortModalProps) => {
  const { onOpenChange } = useDisclosure()

  const changePasswordForm = useForm<z.infer<typeof ChangePasswordFormValidation>>({
    resolver: zodResolver(ChangePasswordFormValidation),
    defaultValues: {
      ...ChangePasswordDefaultValues,
    },
  })

  const handleChangePassword = async (data: z.infer<typeof ChangePasswordFormValidation>) => {
    try {
      await CHANGE_USER_PASSWORD({ oldPassword: data.oldPassword, newPassword: data.newPassword })
      toast.success('رمز عبور با موفقیت تغییر یافت.')
      setIsOpen(false)
    } catch (error) {
      console.log('error: ', error)
    }
  }

  return (
    <Modal
      acceptBtnText="تغییر رمز عبور"
      headerClassName="border-none font-semibold"
      isLoading={changePasswordForm.formState.isSubmitting}
      isOpen={isOpen}
      title="تغییر رمز عبور"
      onAccept={changePasswordForm.handleSubmit(handleChangePassword)}
      onClose={() => setIsOpen(false)}
      onOpenChange={onOpenChange}
    >
      <FormProvider {...changePasswordForm}>
        <form
          className="flex flex-col gap-4 md:gap-6 py-4"
          onSubmit={changePasswordForm.handleSubmit(handleChangePassword)}
        >
          <Input
            required
            description="رمز عبور فعلی باید حداقل 6 کاراکتر باشد."
            generalType="input"
            inputType="password"
            label="رمز عبور فعلی"
            name="oldPassword"
            placeholder="رمز عبور فعلی"
            size="lg"
          />
          <Input
            required
            description="رمز عبور جدید باید حداقل 6 کاراکتر باشد."
            generalType="input"
            inputType="password"
            label="رمز عبور جدید"
            name="newPassword"
            placeholder="رمز عبور جدید"
            size="lg"
          />
          <Input
            required
            description="تکرار رمز عبور جدید باید حداقل 6 کاراکتر باشد."
            generalType="input"
            inputType="password"
            label="تکرار رمز عبور جدید"
            name="confirmPassword"
            placeholder="تکرار رمز عبور جدید"
            size="lg"
          />
        </form>
      </FormProvider>
    </Modal>
  )
}

export default ChangePasswordModal
