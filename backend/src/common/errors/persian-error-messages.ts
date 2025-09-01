export const PERSIAN_ERROR_MESSAGES = {
  // Common error messages
  NOT_FOUND: 'یافت نشد', // translated to Persian
  ALREADY_EXISTS: 'قبلاً وجود دارد', // translated to Persian
  INVALID_CREDENTIALS: 'اطلاعات ورود نامعتبر است', // translated to Persian
  UNAUTHORIZED: 'دسترسی غیرمجاز', // translated to Persian
  FORBIDDEN: 'دسترسی ممنوع', // translated to Persian
  VALIDATION_FAILED: 'اعتبارسنجی ناموفق بود', // translated to Persian
  INTERNAL_SERVER_ERROR: 'خطای داخلی سرور', // translated to Persian
  BAD_REQUEST: 'درخواست نامعتبر', // translated to Persian
  
  // User related messages
  USER_NOT_FOUND: 'کاربر یافت نشد', // translated to Persian
  USER_ALREADY_EXISTS: 'کاربر قبلاً وجود دارد', // translated to Persian
  INVALID_PHONE_NUMBER: 'فرمت شماره موبایل نامعتبر است', // translated to Persian
  INVALID_OTP: 'کد تایید نامعتبر است', // translated to Persian
  OTP_EXPIRED: 'کد تایید منقضی شده است', // translated to Persian
  OTP_ALREADY_SENT: 'کد تایید قبلاً ارسال شده است', // translated to Persian
  INSUFFICIENT_POINTS: 'امتیاز وفاداری کافی نیست', // translated to Persian
  
  // Store related messages
  STORE_NOT_FOUND: 'فروشگاه یافت نشد', // translated to Persian
  STORE_ALREADY_EXISTS: 'فروشگاه قبلاً وجود دارد', // translated to Persian
  STORE_PHONE_EXISTS: 'فروشگاه با این شماره موبایل قبلاً وجود دارد', // translated to Persian
  

  

  
  // Admin related messages
  ADMIN_NOT_FOUND: 'مدیر یافت نشد', // translated to Persian
  ADMIN_ALREADY_EXISTS: 'مدیر قبلاً وجود دارد', // translated to Persian
  INSUFFICIENT_PERMISSIONS: 'دسترسی کافی نیست', // translated to Persian
  
  // OTP related messages
  OTP_NOT_FOUND: 'کد تایید یافت نشد', // translated to Persian
  OTP_GENERATION_FAILED: 'تولید کد تایید ناموفق بود', // translated to Persian
  OTP_VERIFICATION_FAILED: 'تایید کد تایید ناموفق بود', // translated to Persian
  
  // Authentication related messages
  TOKEN_EXPIRED: 'توکن احراز هویت منقضی شده است', // translated to Persian
  TOKEN_INVALID: 'توکن احراز هویت نامعتبر است', // translated to Persian
  LOGIN_REQUIRED: 'ورود به سیستم الزامی است', // translated to Persian
  
  // Database related messages
  DATABASE_CONNECTION_ERROR: 'خطای اتصال به پایگاه داده', // translated to Persian
  DATABASE_OPERATION_FAILED: 'عملیات پایگاه داده ناموفق بود', // translated to Persian
  
  // File related messages
  FILE_NOT_FOUND: 'فایل یافت نشد', // translated to Persian
  FILE_UPLOAD_FAILED: 'آپلود فایل ناموفق بود', // translated to Persian
  INVALID_FILE_TYPE: 'نوع فایل نامعتبر است', // translated to Persian
  FILE_TOO_LARGE: 'حجم فایل بسیار بزرگ است', // translated to Persian
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED: 'محدودیت نرخ درخواست، لطفاً بعداً تلاش کنید', // translated to Persian
  
  // Business logic errors
  INSUFFICIENT_BALANCE: 'موجودی کافی نیست', // translated to Persian
  OPERATION_NOT_ALLOWED: 'عملیات مجاز نیست', // translated to Persian
  MAINTENANCE_MODE: 'سیستم در حال تعمیر و نگهداری است', // translated to Persian
  
  // External service errors
  EXTERNAL_SERVICE_ERROR: 'خطای سرویس خارجی', // translated to Persian
  PAYMENT_GATEWAY_ERROR: 'خطای درگاه پرداخت', // translated to Persian
  SMS_SERVICE_ERROR: 'خطای سرویس پیامک', // translated to Persian
} as const;

export type ErrorMessageKey = keyof typeof PERSIAN_ERROR_MESSAGES;
export type ErrorMessageValue = typeof PERSIAN_ERROR_MESSAGES[ErrorMessageKey];
