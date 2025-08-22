// User Types
export interface User {
  id: string;
  phoneNumber: string;
  name?: string;
  totalPoints: number;
  purchases: Purchase[];
  consents: {
    dataCollection: boolean;
    marketing: boolean;
    consentDate?: Date;
  };
  role: string;
  lastActivity?: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  phoneNumber: string;
  name?: string;
  dataCollectionConsent?: boolean;
  marketingConsent?: boolean;
}

export interface UpdateUserRequest {
  name?: string;
  dataCollectionConsent?: boolean;
  marketingConsent?: boolean;
}

export interface Purchase {
  storeId: string;
  amount: number;
  date: Date;
  scratchCode?: string;
  entryMethod: 'sms' | 'qr';
  rewardApplied: {
    type: 'discount' | 'cashback' | 'lottery';
    value: number;
  };
}

export interface PurchaseRequest {
  storeId: string;
  amount: number;
  scratchCode?: string;
  entryMethod: 'sms' | 'qr';
}

// Store Types
export interface Store {
  id: string;
  name: string;
  ownerName: string;
  phoneNumber: string;
  address: {
    city: string;
    street?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  loyaltySettings: {
    tiers: LoyaltyTier[];
    lotteryFrequency: 'weekly' | 'monthly' | 'none';
    defaultCashbackRate: number;
  };
  plan: {
    type: 'free' | 'premium';
    startDate: Date;
    endDate: Date;
  };
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoyaltyTier {
  minAmount: number;
  rewardType: 'discount' | 'cashback' | 'lottery';
  value: number;
  description?: string;
}

export interface CreateStoreRequest {
  name: string;
  ownerName: string;
  phoneNumber: string;
  address: {
    city: string;
    street?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  loyaltySettings: {
    tiers: LoyaltyTier[];
    lotteryFrequency: 'weekly' | 'monthly' | 'none';
    defaultCashbackRate: number;
  };
  plan: {
    type: 'free' | 'premium';
    startDate: Date;
    endDate: Date;
  };
}

// OTP Types
export interface OTPRequest {
  phoneNumber: string;
}

export interface OTPVerification {
  phoneNumber: string;
  code: string;
}

// Scratch Card Types
export interface ScratchCard {
  id: string;
  code: string;
  type: 'discount' | 'cashback' | 'lottery';
  value: number;
  isUsed: boolean;
  usedBy?: string;
  usedAt?: Date;
  expiresAt: Date;
  createdAt: Date;
}

// Transaction Types
export interface Transaction {
  id: string;
  userId: string;
  storeId: string;
  amount: number;
  type: 'purchase' | 'reward' | 'refund';
  status: 'pending' | 'completed' | 'failed';
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// Admin Types
export interface Admin {
  id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: string[];
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Common Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
