// API Configuration for Loyalty Program Frontend
export const API_CONFIG = {
  // Backend API base URL
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "https://api.gardou.ir",
  // BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://0.0.0.0:5555",

  // API endpoints
  ENDPOINTS: {
    AUTH: {
      REQUEST_OTP: "/auth/request-otp",
      VERIFY_OTP: "/auth/verify-otp",
      PROFILE: "/auth/profile",
    },
    USERS: {
      GET_ALL: "/users",
      GET_BY_ID: "/users/:id",
      CREATE: "/users",
      UPDATE: "/users/:id",
      DELETE: "/users/:id",
      GET_CURRENT: "/users/me",
    },
    PROMO_CODES: {
      REGISTER_SEND_OTP: "/promo-codes/register/send-otp",
      REGISTER_VERIFY: "/promo-codes/register/verify",
      REGISTER: "/promo-codes/register",
    },
  },

  // Request timeout (in milliseconds)
  TIMEOUT: 10000,
};
