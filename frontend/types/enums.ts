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

export enum StorePlanType {
  FREE = 'free',
  PREMIUM = 'premium'
}

export enum StoreStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  DELETED = 'deleted',
  SUSPENDED = 'suspended'
}

export enum PromotionType {
  POINTS_BASED = 'pointsBased'
}

export enum PromotionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
  EXPIRED = 'expired'
}

export enum PromoCodeStatus {
  UNUSED = 'unused',
  USED = 'used',
  DELETED = 'deleted'
}

export enum ScratchCardStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  DEPLETED = 'depleted',
  INACTIVE = 'inactive'
}

export enum ScratchCardType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed'
}

export enum ReportStatus {
  COMPLETED = 'completed',
  PROCESSING = 'processing',
  FAILED = 'failed'
}

export enum ReportType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly'
}

export enum TransactionType {
  PURCHASE = 'purchase',
  REDEMPTION = 'redemption',
  BONUS = 'bonus',
  REFUND = 'refund'
}

export enum TransactionStatus {
  COMPLETED = 'completed',
  PENDING = 'pending',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
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

export const STORE_PLAN_CONFIG = {
  [StorePlanType.FREE]: {
    text: 'رایگان',
    color: 'warning' as const
  },
  [StorePlanType.PREMIUM]: {
    text: 'پریمیوم',
    color: 'success' as const
  }
}

export const STORE_STATUS_CONFIG = {
  [StoreStatus.ACTIVE]: {
    text: 'فعال',
    color: 'success' as const
  },
  [StoreStatus.PENDING]: {
    text: 'در انتظار',
    color: 'warning' as const
  },
  [StoreStatus.DELETED]: {
    text: 'حذف شده',
    color: 'danger' as const
  },
  [StoreStatus.SUSPENDED]: {
    text: 'معلق',
    color: 'default' as const
  }
}

export const PROMOTION_TYPE_CONFIG = {
  [PromotionType.POINTS_BASED]: {
    text: 'امتیازی',
    color: 'primary' as const
  }
}

// Full promotion type options for select dropdowns
export const PROMOTION_TYPE_OPTIONS = [
  { code: PromotionType.POINTS_BASED, name: 'تبلیغ امتیازی' }
]

export const PROMOTION_STATUS_CONFIG = {
  [PromotionStatus.ACTIVE]: {
    text: 'فعال',
    color: 'success' as const
  },
  [PromotionStatus.INACTIVE]: {
    text: 'غیرفعال',
    color: 'default' as const
  },
  [PromotionStatus.DELETED]: {
    text: 'حذف شده',
    color: 'danger' as const
  },
  [PromotionStatus.EXPIRED]: {
    text: 'منقضی شده',
    color: 'warning' as const
  }
}

export const PROMO_CODE_STATUS_CONFIG = {
  [PromoCodeStatus.UNUSED]: {
    text: 'استفاده نشده',
    color: 'success' as const
  },
  [PromoCodeStatus.USED]: {
    text: 'استفاده شده',
    color: 'warning' as const
  },
  [PromoCodeStatus.DELETED]: {
    text: 'حذف شده',
    color: 'danger' as const
  }
}

export const SCRATCH_CARD_STATUS_CONFIG = {
  [ScratchCardStatus.ACTIVE]: {
    text: 'فعال',
    color: 'success' as const
  },
  [ScratchCardStatus.EXPIRED]: {
    text: 'منقضی شده',
    color: 'danger' as const
  },
  [ScratchCardStatus.DEPLETED]: {
    text: 'تمام شده',
    color: 'warning' as const
  },
  [ScratchCardStatus.INACTIVE]: {
    text: 'غیرفعال',
    color: 'default' as const
  }
}

export const SCRATCH_CARD_TYPE_CONFIG = {
  [ScratchCardType.PERCENTAGE]: {
    text: 'درصدی',
    color: 'primary' as const
  },
  [ScratchCardType.FIXED]: {
    text: 'مبلغ ثابت',
    color: 'success' as const
  }
}

export const REPORT_STATUS_CONFIG = {
  [ReportStatus.COMPLETED]: {
    text: 'تکمیل شده',
    color: 'success' as const
  },
  [ReportStatus.PROCESSING]: {
    text: 'در حال پردازش',
    color: 'warning' as const
  },
  [ReportStatus.FAILED]: {
    text: 'ناموفق',
    color: 'danger' as const
  }
}

export const REPORT_TYPE_CONFIG = {
  [ReportType.DAILY]: {
    text: 'روزانه',
    color: 'primary' as const
  },
  [ReportType.WEEKLY]: {
    text: 'هفتگی',
    color: 'success' as const
  },
  [ReportType.MONTHLY]: {
    text: 'ماهانه',
    color: 'warning' as const
  },
  [ReportType.QUARTERLY]: {
    text: 'فصلانه',
    color: 'danger' as const
  }
}

export const TRANSACTION_TYPE_CONFIG = {
  [TransactionType.PURCHASE]: {
    text: 'خرید',
    color: 'success' as const
  },
  [TransactionType.REDEMPTION]: {
    text: 'استفاده از تخفیف',
    color: 'warning' as const
  },
  [TransactionType.BONUS]: {
    text: 'امتیاز هدیه',
    color: 'primary' as const
  },
  [TransactionType.REFUND]: {
    text: 'بازگشت وجه',
    color: 'danger' as const
  }
}

export const TRANSACTION_STATUS_CONFIG = {
  [TransactionStatus.COMPLETED]: {
    text: 'تکمیل شده',
    color: 'success' as const
  },
  [TransactionStatus.PENDING]: {
    text: 'در انتظار',
    color: 'warning' as const
  },
  [TransactionStatus.FAILED]: {
    text: 'ناموفق',
    color: 'danger' as const
  },
  [TransactionStatus.CANCELLED]: {
    text: 'لغو شده',
    color: 'default' as const
  }
}

export const getRoleConfig = (role: string) => {
  return ROLE_CONFIG[role as UserRole] || ROLE_CONFIG[UserRole.CUSTOMER]
}

export const getStatusConfig = (status: string) => {
  return STATUS_CONFIG[status as UserStatus] || STATUS_CONFIG[UserStatus.ACTIVE]
}

export const getStorePlanConfig = (planType: string) => {
  return STORE_PLAN_CONFIG[planType as StorePlanType] || STORE_PLAN_CONFIG[StorePlanType.FREE]
}

export const getStoreStatusConfig = (status: string) => {
  return STORE_STATUS_CONFIG[status as StoreStatus] || STORE_STATUS_CONFIG[StoreStatus.ACTIVE]
}

export const getPromotionTypeConfig = (type: string) => {
  return PROMOTION_TYPE_CONFIG[type as PromotionType] || PROMOTION_TYPE_CONFIG[PromotionType.POINTS_BASED]
}

export const getPromotionStatusConfig = (status: string) => {
  return PROMOTION_STATUS_CONFIG[status as PromotionStatus] || PROMOTION_STATUS_CONFIG[PromotionStatus.ACTIVE]
}

export const getPromoCodeStatusConfig = (status: string) => {
  return PROMO_CODE_STATUS_CONFIG[status as PromoCodeStatus] || PROMO_CODE_STATUS_CONFIG[PromoCodeStatus.UNUSED]
}

export const getScratchCardStatusConfig = (status: string) => {
  return SCRATCH_CARD_STATUS_CONFIG[status as ScratchCardStatus] || SCRATCH_CARD_STATUS_CONFIG[ScratchCardStatus.ACTIVE]
}

export const getScratchCardTypeConfig = (type: string) => {
  return SCRATCH_CARD_TYPE_CONFIG[type as ScratchCardType] || SCRATCH_CARD_TYPE_CONFIG[ScratchCardType.FIXED]
}

export const getReportStatusConfig = (status: string) => {
  return REPORT_STATUS_CONFIG[status as ReportStatus] || REPORT_STATUS_CONFIG[ReportStatus.COMPLETED]
}

export const getReportTypeConfig = (type: string) => {
  return REPORT_TYPE_CONFIG[type as ReportType] || REPORT_TYPE_CONFIG[ReportType.DAILY]
}

export const getTransactionTypeConfig = (type: string) => {
  return TRANSACTION_TYPE_CONFIG[type as TransactionType] || TRANSACTION_TYPE_CONFIG[TransactionType.PURCHASE]
}

export const getTransactionStatusConfig = (status: string) => {
  return TRANSACTION_STATUS_CONFIG[status as TransactionStatus] || TRANSACTION_STATUS_CONFIG[TransactionStatus.COMPLETED]
}
