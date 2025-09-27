import axiosInstance, { handleApiError } from "@/config/axios";
import { API_CONFIG } from "@/config/api";

// Types for promo code registration
export interface PromoCodeRegistrationRequest {
  phoneNumber: string;
  promoCode: string;
}

// Types for direct promo code registration (without OTP)
export interface DirectPromoCodeRegistrationRequest {
  phoneNumber: string;
  code: string;
}

export interface PromoCodeRegistrationResponse {
  message: string;
  otpId: string;
}

export interface PromoCodeVerificationRequest {
  phoneNumber: string;
  promoCode: string;
  otpCode: string;
}

export interface StoreInfo {
  id: string;
  name: string;
  phoneNumber: string;
  address: {
    province: string;
    city: string;
    fullAddress: string;
  };
  logoUrl?: string;
  description?: string;
  socialLinks?: {
    website?: string;
    instagram?: string;
    telegram?: string;
  };
  workingHours?: {
    open: string;
    close: string;
  };
}

export interface PromotionInfo {
  id: string;
  title: string;
  description?: string;
  price: number;
  points: number;
  status: string;
}

export interface PromoCodeInfo {
  id: string;
  code: string;
  status: string;
  registeredAt: string;
  notes?: string;
}

export interface TransactionInfo {
  id: string;
  createdAt: string;
}

export interface UserInfo {
  id: string;
  phoneNumber: string;
  firstName?: string;
  lastName?: string;
  role: string;
  createdAt: string;
}

export interface PromoCodeVerificationResponse {
  message: string;
  accessToken: string;
  user: UserInfo;
  store: StoreInfo;
  promotion: PromotionInfo;
  promoCode: PromoCodeInfo;
  transaction: TransactionInfo;
}

export interface UsePromotionResponse {
  success: boolean;
  message: string;
  promoCode?: {
    id: string;
    code: string;
    status: string;
    promotion?: {
      id: string;
      title: string;
      price: number;
      points: number;
    };
  };
}

// Promo code registration service functions
export const promoCodeRegistrationService = {
  // Send OTP for promo code registration
  async sendOtpForPromoRegistration(
    data: PromoCodeRegistrationRequest,
  ): Promise<PromoCodeRegistrationResponse> {
    try {
      const response = await axiosInstance.post<PromoCodeRegistrationResponse>(
        API_CONFIG.ENDPOINTS.PROMO_CODES.REGISTER_SEND_OTP,
        data,
      );
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  },

  // Verify OTP and complete promo code registration
  async verifyPromoRegistration(
    data: PromoCodeVerificationRequest,
  ): Promise<PromoCodeVerificationResponse> {
    try {
      const response = await axiosInstance.post<PromoCodeVerificationResponse>(
        API_CONFIG.ENDPOINTS.PROMO_CODES.REGISTER_VERIFY,
        data,
      );
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  },

  // Register promo code for authenticated user (use promotion)
  async registerPromoCode(
    data: DirectPromoCodeRegistrationRequest,
  ): Promise<UsePromotionResponse> {
    try {
      const response = await axiosInstance.post<UsePromotionResponse>(
        API_CONFIG.ENDPOINTS.PROMO_CODES.REGISTER,
        data,
      );
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  },
};

// Export individual functions for convenience
export const sendOtpForPromoRegistration =
  promoCodeRegistrationService.sendOtpForPromoRegistration;
export const verifyPromoRegistration =
  promoCodeRegistrationService.verifyPromoRegistration;
export const registerPromoCode = promoCodeRegistrationService.registerPromoCode;

export default promoCodeRegistrationService;
