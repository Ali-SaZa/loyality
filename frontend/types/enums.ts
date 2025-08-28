export enum UserRole {
  CUSTOMER = 'customer',
  STORE = 'store',
  ADMIN = 'admin'
}

export enum UserStatus {
  ACTIVE = 'active',
  BLOCKED = 'blocked',
  DELETED = 'deleted'
}

export const ROLE_CONFIG = {
  [UserRole.CUSTOMER]: {
    text: 'مشتری',
    title: 'پنل مشتری',
    description: 'خوش آمدید به پنل مشتری',
    color: 'primary' as const,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800'
  },
  [UserRole.STORE]: {
    text: 'فروشگاه',
    title: 'پنل فروشگاه',
    description: 'خوش آمدید به پنل مدیریت فروشگاه',
    color: 'success' as const,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-800'
  },
  [UserRole.ADMIN]: {
    text: 'ادمین',
    title: 'پنل مدیریت',
    description: 'خوش آمدید به پنل مدیریت سیستم وفاداری',
    color: 'danger' as const,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-800'
  }
}

export const STATUS_CONFIG = {
  [UserStatus.ACTIVE]: {
    text: 'فعال',
    color: 'success' as const
  },
  [UserStatus.BLOCKED]: {
    text: 'مسدود',
    color: 'warning' as const
  },
  [UserStatus.DELETED]: {
    text: 'حذف شده',
    color: 'danger' as const
  }
}

export const getRoleConfig = (role: string) => {
  return ROLE_CONFIG[role as UserRole] || ROLE_CONFIG[UserRole.CUSTOMER]
}

export const getStatusConfig = (status: string) => {
  return STATUS_CONFIG[status as UserStatus] || STATUS_CONFIG[UserStatus.ACTIVE]
}
