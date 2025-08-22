export type Role = 'store' | 'admin' | 'customer';

export interface AuthUser {
  id: string;
  phone: string;
  name?: string;
}

export interface VerifyOtpSuccess {
  success: true;
  token: string;
  role: Role;
  user: AuthUser;
}

export interface ApiError {
  success: false;
  error: string;
}

export interface SendOtpRequest {
  phone: string;
}

export interface VerifyOtpRequest {
  phone: string;
  code: string;
}

export interface SendOtpResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export type VerifyOtpResponse = VerifyOtpSuccess | ApiError;
