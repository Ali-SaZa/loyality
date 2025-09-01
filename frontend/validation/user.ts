'use client'
import { z } from 'zod'

import { convertPersianToEnglish } from '@/helpers'
import { UserRole, UserStatus } from '@/types/enums'

export const CreateUserFormValidation = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().refine((val) => {
    const convertedValue = convertPersianToEnglish(val)
    return /^09\d{9}$/.test(convertedValue)
  }, 'شماره تلفن معتبر نیست'),
  role: z.nativeEnum(UserRole),
  status: z.nativeEnum(UserStatus)
})

export const UpdateUserFormValidation = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().refine((val) => {
    const convertedValue = convertPersianToEnglish(val)
    return /^09\d{9}$/.test(convertedValue)
  }, 'شماره تلفن معتبر نیست'),
  role: z.nativeEnum(UserRole),
  status: z.nativeEnum(UserStatus)
})
