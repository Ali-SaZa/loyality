export const PERSIAN_ERROR_MESSAGES = {
  // Common error messages
  NOT_FOUND: 'was not found',
  ALREADY_EXISTS: 'already exists',
  INVALID_CREDENTIALS: 'Invalid credentials',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  VALIDATION_FAILED: 'Validation failed',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  BAD_REQUEST: 'Bad request',
  
  // User related messages
  USER_NOT_FOUND: 'User was not found',
  USER_ALREADY_EXISTS: 'User already exists',
  INVALID_PHONE_NUMBER: 'Invalid phone number format',
  INVALID_OTP: 'Invalid OTP code',
  OTP_EXPIRED: 'OTP code has expired',
  OTP_ALREADY_SENT: 'OTP code already sent',
  INSUFFICIENT_POINTS: 'Insufficient loyalty points',
  
  // Store related messages
  STORE_NOT_FOUND: 'Store was not found',
  STORE_ALREADY_EXISTS: 'Store already exists',
  STORE_PHONE_EXISTS: 'Store with this phone number already exists',
  
  // Scratch card related messages
  SCRATCH_CARD_NOT_FOUND: 'Scratch card was not found',
  SCRATCH_CARD_ALREADY_USED: 'Scratch card already used',
  SCRATCH_CARD_EXPIRED: 'Scratch card has expired',
  INVALID_CARD_VALUE: 'Invalid card value',
  
  // Transaction related messages
  TRANSACTION_NOT_FOUND: 'Transaction was not found',
  TRANSACTION_FAILED: 'Transaction failed',
  INVALID_TRANSACTION_TYPE: 'Invalid transaction type',
  
  // Admin related messages
  ADMIN_NOT_FOUND: 'Admin was not found',
  ADMIN_ALREADY_EXISTS: 'Admin already exists',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
  
  // OTP related messages
  OTP_NOT_FOUND: 'OTP was not found',
  OTP_GENERATION_FAILED: 'OTP generation failed',
  OTP_VERIFICATION_FAILED: 'OTP verification failed',
  
  // Authentication related messages
  TOKEN_EXPIRED: 'Authentication token expired',
  TOKEN_INVALID: 'Invalid authentication token',
  LOGIN_REQUIRED: 'Login required',
  
  // Database related messages
  DATABASE_CONNECTION_ERROR: 'Database connection error',
  DATABASE_OPERATION_FAILED: 'Database operation failed',
  
  // File related messages
  FILE_NOT_FOUND: 'File was not found',
  FILE_UPLOAD_FAILED: 'File upload failed',
  INVALID_FILE_TYPE: 'Invalid file type',
  FILE_TOO_LARGE: 'File size too large',
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded, please try again later',
  
  // Business logic errors
  INSUFFICIENT_BALANCE: 'Insufficient balance',
  OPERATION_NOT_ALLOWED: 'Operation not allowed',
  MAINTENANCE_MODE: 'System is under maintenance',
  
  // External service errors
  EXTERNAL_SERVICE_ERROR: 'External service error',
  PAYMENT_GATEWAY_ERROR: 'Payment gateway error',
  SMS_SERVICE_ERROR: 'SMS service error',
} as const;

export type ErrorMessageKey = keyof typeof PERSIAN_ERROR_MESSAGES;
export type ErrorMessageValue = typeof PERSIAN_ERROR_MESSAGES[ErrorMessageKey];
