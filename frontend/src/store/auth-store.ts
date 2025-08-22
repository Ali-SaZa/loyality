import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUser, Role, SendOtpRequest, VerifyOtpRequest, SendOtpResponse, VerifyOtpResponse } from '@/types/auth';
import { normalizePhone, phoneSchema, otpSchema } from '@/lib/validators';
import { setToken, setUser, setRole, clearAuth } from '@/lib/auth';
import api from '@/lib/axios';

// Helper function to set cookie for middleware
const setAuthCookie = (token: string) => {
  // Set cookie for middleware to check
  document.cookie = `app_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
};

// Helper function to clear cookie
const clearAuthCookie = () => {
  document.cookie = 'app_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
};

interface AuthState {
  user: AuthUser | null;
  role: Role | null;
  token: string | null;
  phoneForOtp: string | null;
  loading: boolean;
  error: string | undefined;
  step: 'phone' | 'otp';
}

interface AuthActions {
  setPhoneForOtp: (phone: string) => void;
  sendOtp: (phone: string) => Promise<boolean>;
  verifyOtp: (code: string) => Promise<boolean>;
  logout: () => void;
  hydrateFromStorage: () => void;
  clearError: () => void;
  resetStep: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      role: null,
      token: null,
      phoneForOtp: null,
      loading: false,
      error: undefined,
      step: 'phone',

      // Actions
      setPhoneForOtp: (phone: string) => {
        set({ phoneForOtp: phone });
      },

      sendOtp: async (phone: string): Promise<boolean> => {
        try {
          set({ loading: true, error: undefined });

          // Validate phone
          const validationResult = phoneSchema.safeParse(phone);
          if (!validationResult.success) {
            set({ error: validationResult.error.issues[0].message, loading: false });
            return false;
          }

          // Normalize phone to E.164 format
          const normalizedPhone = normalizePhone(phone);
          
          const requestData: SendOtpRequest = {
            phone: normalizedPhone,
          };

          const response = await api.post<SendOtpResponse>('/otp/send', requestData);
          
          if (response.data.success) {
            set({ 
              phoneForOtp: normalizedPhone, 
              step: 'otp', 
              loading: false, 
              error: undefined 
            });
            return true;
          } else {
            const errorMsg = response.data.error || 'خطا در ارسال کد تایید';
            set({ 
              error: errorMsg, 
              loading: false 
            });
            return false;
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'خطای شبکه. دوباره تلاش کنید.';
          set({ error: errorMessage, loading: false });
          return false;
        }
      },

      verifyOtp: async (code: string): Promise<boolean> => {
        try {
          set({ loading: true, error: undefined });

          // Validate OTP
          const validationResult = otpSchema.safeParse(code);
          if (!validationResult.success) {
            set({ error: validationResult.error.issues[0].message, loading: false });
            return false;
          }

          const { phoneForOtp } = get();
          if (!phoneForOtp) {
            set({ error: 'شماره موبایل یافت نشد', loading: false });
            return false;
          }

          const requestData: VerifyOtpRequest = {
            phone: phoneForOtp,
            code,
          };

          const response = await api.post<VerifyOtpResponse>('/otp/verify', requestData);
          
          if (response.data.success) {
            const { token, role, user } = response.data;
            
            // Store in auth utilities
            setToken(token);
            setUser(user);
            setRole(role);
            
            // Set cookie for middleware
            setAuthCookie(token);
            
            // Update store state
            set({ 
              token, 
              role, 
              user, 
              loading: false, 
              error: undefined,
              step: 'phone' // Reset for next login
            });
            
            return true;
          } else {
            const errorMsg = response.data.error || 'کد تایید اشتباه است';
            set({ 
              error: errorMsg, 
              loading: false 
            });
            return false;
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'خطای شبکه. دوباره تلاش کنید.';
          set({ error: errorMessage, loading: false });
          return false;
        }
      },

      logout: () => {
        clearAuth();
        clearAuthCookie();
        set({ 
          user: null, 
          role: null, 
          token: null, 
          phoneForOtp: null, 
          step: 'phone' 
        });
      },

      hydrateFromStorage: () => {
        // This will be called on app mount to restore state from localStorage
        // The persist middleware handles this automatically
      },

      clearError: () => {
        set({ error: undefined });
      },

      resetStep: () => {
        set({ step: 'phone', error: undefined });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        role: state.role,
        token: state.token,
      }),
    }
  )
);
