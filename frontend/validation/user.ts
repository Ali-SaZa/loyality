import { z } from 'zod'

import { convertPersianToEnglish } from '@/helpers'
import { UserRole, UserStatus } from '@/types/enums'

// Base validation schema
const UserBaseValidation = z.object({
  firstName: z.string().min(2, 'نام حداقل باید ۲ کاراکتر باشد.').optional(),
  lastName: z.string().min(2, 'نام خانوادگی حداقل باید ۲ کاراکتر باشد.').optional(),
  phoneNumber: z.string().refine((val) => {
    const convertedValue = convertPersianToEnglish(val)
    return /^09\d{9}$/.test(convertedValue)
  }, 'شماره تلفن معتبر نیست'),
  role: z.nativeEnum(UserRole),
  status: z.nativeEnum(UserStatus)
})

// Create validation (for new users)
export const CreateUserFormValidation = UserBaseValidation

// Update validation (for existing users)
export const UpdateUserFormValidation = UserBaseValidation.partial().extend({
  phoneNumber: z.string().refine((val) => {
    const convertedValue = convertPersianToEnglish(val)
    return /^09\d{9}$/.test(convertedValue)
  }, 'شماره تلفن معتبر نیست').optional()
})

// Type definitions
export type UserFormData = z.infer<typeof CreateUserFormValidation>
export type UserUpdateData = z.infer<typeof UpdateUserFormValidation>
