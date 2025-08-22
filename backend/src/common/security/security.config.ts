export const SECURITY_CONFIG = {
  // JWT Configuration
  JWT: {
    ALGORITHM: 'HS256',
    ISSUER: 'loyalty-api',
    AUDIENCE: 'loyalty-users',
    DEFAULT_EXPIRES_IN: '7d',
    REFRESH_EXPIRES_IN: '30d',
    MIN_SECRET_LENGTH: 32,
  },
  
  // OTP Configuration
  OTP: {
    LENGTH: 6,
    EXPIRES_IN_MS: 5 * 60 * 1000, // 5 minutes
    RATE_LIMIT_WINDOW_MS: 2 * 60 * 1000, // 2 minutes
    MAX_ATTEMPTS: 3,
  },
  
  // Rate Limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100,
    OTP_WINDOW_MS: 2 * 60 * 1000, // 2 minutes
    OTP_MAX_REQUESTS: 3,
  },
  
  // Password Policy (for future admin features)
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: true,
  },
  
  // Session Security
  SESSION: {
    MAX_AGE_MS: 24 * 60 * 60 * 1000, // 24 hours
    REFRESH_THRESHOLD_MS: 5 * 60 * 1000, // 5 minutes
  },
  
  // CORS Configuration
  CORS: {
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    ALLOWED_METHODS: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    ALLOWED_HEADERS: ['Content-Type', 'Authorization'],
    CREDENTIALS: true,
  },
  
  // Security Headers
  HEADERS: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  },
  
  // Input Validation
  VALIDATION: {
    PHONE_REGEX: /^09[0-9]{9}$/,
    OTP_REGEX: /^\d{6}$/,
    MAX_NAME_LENGTH: 100,
    MAX_DESCRIPTION_LENGTH: 500,
  },
  
  // Database Security
  DATABASE: {
    MAX_QUERY_RESULTS: 1000,
    TIMEOUT_MS: 30000,
    MAX_CONNECTIONS: 10,
  },
} as const;

export type SecurityConfig = typeof SECURITY_CONFIG;
