'use client'
import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'

import Modal from './Modal'
import Input from '@/components/formElements/Input'
import useLoading from '@/hooks/useLoading'
import useAuth from '@/hooks/useAuth'
import { getCurrentStore } from '@/services/stores'
import axiosInstance, { handleApiError } from '@/config/axios'
import {
  CreateCustomerValidation,
  CreateCustomerData,
} from '@/validation/customer'

interface AddCustomerModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onSuccess?: () => void
}

const AddCustomerModal = ({
  isOpen,
  onOpenChange,
  onSuccess,
}: AddCustomerModalProps) => {
  const { setLoading } = useLoading()
  const { user } = useAuth()
  const [currentStore, setCurrentStore] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const methods = useForm<CreateCustomerData>({
    resolver: zodResolver(CreateCustomerValidation),
    defaultValues: {
      phoneNumber: '',
      firstName: '',
      lastName: '',
    },
  })

  const onSubmit = async (data: CreateCustomerData) => {
    try {
      setIsSubmitting(true)
      setError(null)

      // Get current store if not already fetched
      let store = currentStore
      if (!store && user?.role === 'store') {
        store = await getCurrentStore()
        setCurrentStore(store)
      }

      // Validate that we have a store ID
      if (!store?.id) {
        throw new Error('فروشگاه یافت نشد. لطفاً دوباره تلاش کنید.')
      }

      // Step 1: Create customer (or get existing customer)
      const createCustomerResponse = await axiosInstance.post('/users/customers', {
        phoneNumber: data.phoneNumber,
        firstName: data.firstName,
        lastName: data.lastName,
      })

      const customerId = createCustomerResponse.data.id
      const isExistingCustomer = createCustomerResponse.data.error
      const isAlreadyInStore = createCustomerResponse.data.isAlreadyInStore

      // Handle case where customer is already in this store
      if (isAlreadyInStore) {
        toast.error('این مشتری قبلاً در فروشگاه شما ثبت شده است')
        onOpenChange(false)
        methods.reset()
        return
      }

      // Show appropriate message if customer already exists but not in store
      if (isExistingCustomer) {
        toast.success('مشتری با این شماره تلفن قبلاً ثبت شده است. در حال اضافه کردن به فروشگاه...')
      }

      // Step 2: Add customer to store (whether new or existing)
      const addDirectCustomerResponse = await axiosInstance.post(
        '/transactions/direct-customer',
        {
          customerId,
          storeId: store.id, // Use the validated store ID
          // notes is optional and can be added later if needed
        }
      )

      // Show success message
      const successMessage = isExistingCustomer 
        ? 'مشتری موجود با موفقیت به فروشگاه اضافه شد'
        : addDirectCustomerResponse.data.message || 'مشتری جدید با موفقیت اضافه شد'
      
      toast.success(successMessage)

      // Close modal and reset form
      onOpenChange(false)
      methods.reset()
      onSuccess?.()
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setError(null)
    methods.reset()
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={handleClose}
      onAccept={methods.handleSubmit(onSubmit)}
      onReject={handleClose}
      title="افزودن مشتری جدید"
      acceptBtnText="افزودن مشتری"
      rejectBtnText="انصراف"
      acceptBtnColor="success"
      isLoading={isSubmitting}
      size="md"
    >
      <div className="space-y-6">
        {error && (
          <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
            <p className="text-danger text-sm">{error}</p>
          </div>
        )}

        <FormProvider {...methods}>
          <div className="space-y-4">
            <Input
              generalType="input"
              name="phoneNumber"
              label="شماره تلفن"
              placeholder="09123456789"
              inputType="tel"
              required={true}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                generalType="input"
                name="firstName"
                label="نام"
                placeholder="نام مشتری"
                inputType="text"
                required={true}
              />

              <Input
                generalType="input"
                name="lastName"
                label="نام خانوادگی"
                placeholder="نام خانوادگی مشتری"
                inputType="text"
                required={true}
              />
            </div>
          </div>
        </FormProvider>
      </div>
    </Modal>
  )
}

export default AddCustomerModal
