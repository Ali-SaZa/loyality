export const PERSIAN_ERROR_MESSAGES = {
  // Common error messages
  NOT_FOUND: "یافت نشد", // translated to Persian
  ALREADY_EXISTS: "قبلاً وجود دارد", // translated to Persian
  INVALID_CREDENTIALS: "اطلاعات ورود نامعتبر است", // translated to Persian
  UNAUTHORIZED: "دسترسی غیرمجاز", // translated to Persian
  FORBIDDEN: "دسترسی ممنوع", // translated to Persian
  VALIDATION_FAILED: "اعتبارسنجی ناموفق بود", // translated to Persian
  INTERNAL_SERVER_ERROR: "خطای داخلی سرور", // translated to Persian
  BAD_REQUEST: "درخواست نامعتبر", // translated to Persian

  // User related messages
  USER_NOT_FOUND: "کاربر یافت نشد", // translated to Persian
  USER_ALREADY_EXISTS: "کاربر قبلاً وجود دارد", // translated to Persian
  INVALID_PHONE_NUMBER: "فرمت شماره موبایل نامعتبر است", // translated to Persian
  INVALID_OTP: "کد تایید نامعتبر است", // translated to Persian
  OTP_EXPIRED: "کد تایید منقضی شده است", // translated to Persian
  OTP_ALREADY_SENT: "کد تایید قبلاً ارسال شده است", // translated to Persian
  INSUFFICIENT_POINTS: "امتیاز وفاداری کافی نیست", // translated to Persian

  // Store related messages
  STORE_NOT_FOUND: "فروشگاه یافت نشد", // translated to Persian
  STORE_ALREADY_EXISTS: "فروشگاه قبلاً وجود دارد", // translated to Persian
  STORE_PHONE_EXISTS: "فروشگاه با این شماره موبایل قبلاً وجود دارد", // translated to Persian
  STORE_NOT_FOUND_FOR_USER: "فروشگاه برای این کاربر یافت نشد", // translated to Persian
  STORE_ONLY_USERS_ACCESS:
    "فقط کاربران فروشگاه می‌توانند به این نقطه دسترسی داشته باشند", // translated to Persian
  STORE_SMS_HISTORY_ACCESS:
    "فقط کاربران فروشگاه می‌توانند به تاریخچه پیامک دسترسی داشته باشند", // translated to Persian

  // Promotion related messages
  PROMOTION_NOT_FOUND: "پروموشن یافت نشد", // translated to Persian
  PROMOTION_PRICE_INVALID: "قیمت باید بیشتر از 0 باشد", // translated to Persian
  PROMOTION_POINTS_INVALID: "امتیاز باید بیشتر از 0 باشد", // translated to Persian

  // Transaction related messages
  TRANSACTION_NOT_FOUND: "تراکنش یافت نشد", // translated to Persian
  TRANSACTION_ALREADY_EXISTS: "تراکنش قبلاً وجود دارد", // translated to Persian
  TRANSACTION_CUSTOMER_NOT_FOUND: "مشتری یافت نشد", // translated to Persian
  TRANSACTION_STORE_NOT_FOUND: "فروشگاه یافت نشد", // translated to Persian
  TRANSACTION_PROMO_CODE_NOT_FOUND: "کد پروموشن یافت نشد", // translated to Persian
  TRANSACTION_PROMOTION_NOT_FOUND: "پروموشن یافت نشد", // translated to Persian
  TRANSACTION_CUSTOMER_ALREADY_EXISTS: "مشتری قبلاً وجود دارد", // translated to Persian
  TRANSACTION_STORE_NOT_FOUND_FOR_USER: "فروشگاه برای این کاربر یافت نشد", // translated to Persian
  TRANSACTION_ONLY_STORE_USERS_ACCESS:
    "فقط کاربران فروشگاه می‌توانند به این نقطه دسترسی داشته باشند", // translated to Persian
  TRANSACTION_OWN_ACCESS_ONLY:
    "شما فقط می‌توانید به تراکنش‌های خود دسترسی داشته باشید", // translated to Persian

  // Admin related messages
  ADMIN_NOT_FOUND: "مدیر یافت نشد", // translated to Persian
  ADMIN_ALREADY_EXISTS: "مدیر قبلاً وجود دارد", // translated to Persian
  INSUFFICIENT_PERMISSIONS: "دسترسی کافی نیست", // translated to Persian

  // OTP related messages
  OTP_NOT_FOUND: "کد تایید یافت نشد", // translated to Persian
  OTP_GENERATION_FAILED: "تولید کد تایید ناموفق بود", // translated to Persian
  OTP_VERIFICATION_FAILED: "تایید کد تایید ناموفق بود", // translated to Persian

  // Authentication related messages
  TOKEN_EXPIRED: "توکن احراز هویت منقضی شده است", // translated to Persian
  TOKEN_INVALID: "توکن احراز هویت نامعتبر است", // translated to Persian
  LOGIN_REQUIRED: "ورود به سیستم الزامی است", // translated to Persian

  // Database related messages
  DATABASE_CONNECTION_ERROR: "خطای اتصال به پایگاه داده", // translated to Persian
  DATABASE_OPERATION_FAILED: "عملیات پایگاه داده ناموفق بود", // translated to Persian

  // File related messages
  FILE_NOT_FOUND: "فایل یافت نشد", // translated to Persian
  FILE_UPLOAD_FAILED: "آپلود فایل ناموفق بود", // translated to Persian
  INVALID_FILE_TYPE: "نوع فایل نامعتبر است", // translated to Persian
  FILE_TOO_LARGE: "حجم فایل بسیار بزرگ است", // translated to Persian

  // Rate limiting
  RATE_LIMIT_EXCEEDED: "محدودیت نرخ درخواست، لطفاً بعداً تلاش کنید", // translated to Persian

  // Business logic errors
  INSUFFICIENT_BALANCE: "موجودی کافی نیست", // translated to Persian
  OPERATION_NOT_ALLOWED: "عملیات مجاز نیست", // translated to Persian
  MAINTENANCE_MODE: "سیستم در حال تعمیر و نگهداری است", // translated to Persian

  // External service errors
  EXTERNAL_SERVICE_ERROR: "خطای سرویس خارجی", // translated to Persian
  PAYMENT_GATEWAY_ERROR: "خطای درگاه پرداخت", // translated to Persian
  SMS_SERVICE_ERROR: "خطای سرویس پیامک", // translated to Persian

  // SMS related messages
  SMS_INSUFFICIENT_BALANCE: "موجودی پیامک کافی نیست", // translated to Persian
  SMS_INSUFFICIENT_BALANCE_WITH_COUNT:
    "موجودی پیامک کافی نیست. این پیام به {count} واحد پیامک نیاز دارد. لطفاً با مدیر تماس بگیرید تا اعتبار پیامک اضافه شود", // translated to Persian
  SMS_CUSTOMER_RESTRICTION:
    "شما فقط می‌توانید پیامک به مشتریان فروشگاه خود ارسال کنید", // translated to Persian
  SMS_HISTORY_ACCESS_DENIED:
    "شما فقط می‌توانید تاریخچه پیامک فروشگاه خود را مشاهده کنید", // translated to Persian

  // Success messages
  CUSTOMER_ADDED_SUCCESSFULLY: "مشتری با موفقیت به فروشگاه اضافه شد", // translated to Persian
  PROFILE_RETRIEVED_SUCCESSFULLY: "پروفایل با موفقیت دریافت شد", // translated to Persian
  DATABASE_SEEDED_SUCCESSFULLY: "پایگاه داده با موفقیت پر شد", // translated to Persian
  STORES_SEEDED_SUCCESSFULLY: "فروشگاه‌ها با موفقیت پر شدند", // translated to Persian
  ALL_DATA_CLEARED_SUCCESSFULLY: "همه داده‌ها با موفقیت پاک شدند", // translated to Persian
  PROMO_CODE_IS_VALID: "کد پروموشن معتبر است", // translated to Persian
  OTP_SENT_SUCCESSFULLY: "کد تایید با موفقیت ارسال شد", // translated to Persian
  OTP_SENT: "کد تأیید ارسال شد", // translated to Persian
  LOYALTY_REGISTRATION_SUCCESS: "تبریک! کد پروموشن شما با موفقیت ثبت شد", // translated to Persian

  // Customer related messages
  CUSTOMER_ALREADY_IN_STORE: "این مشتری قبلاً در فروشگاه شما ثبت نام کرده است", // translated to Persian
  CUSTOMER_PHONE_EXISTS: "مشتری با این شماره موبایل قبلاً وجود دارد", // translated to Persian

  // Promo code related messages
  PROMO_CODE_NOT_FOUND: "کد پروموشن یافت نشد", // translated to Persian
  PROMO_CODE_DELETED: "کد پروموشن حذف شده است", // translated to Persian
  PROMO_CODE_ALREADY_USED: "کد پروموشن قبلاً استفاده شده است", // translated to Persian
  PROMO_CODE_NOT_REGISTERED: "کد پروموشن باید قبل از استفاده به کاربری ثبت شود", // translated to Persian
  PROMO_CODE_INVALID_STORE: "کد پروموشن برای این فروشگاه معتبر نیست", // translated to Persian
  PROMO_CODE_FORBIDDEN_STORE:
    "شما فقط می‌توانید کدهای پروموشن فروشگاه خود را اعتبارسنجی کنید", // translated to Persian
  PROMO_CODE_ALREADY_EXISTS: "کد پروموشن قبلاً وجود دارد", // translated to Persian
  PROMO_CODE_CANNOT_UPDATE_USED:
    "نمی‌توان کدهای پروموشن استفاده شده را به‌روزرسانی کرد", // translated to Persian
  PROMO_CODE_CANNOT_DELETE_USED:
    "نمی‌توان کدهای پروموشن استفاده شده را حذف کرد", // translated to Persian
  PROMO_CODE_COUNT_INVALID: "تعداد باید بین 1 تا 1000 باشد", // translated to Persian
  PROMO_CODE_USER_NOT_FOUND: "کاربر با این شماره تلفن یافت نشد", // translated to Persian
  PROMO_CODE_NOT_FOUND_AFTER_REGISTRATION: "کد پروموشن پس از ثبت‌نام یافت نشد", // translated to Persian
  PROMO_CODE_STORE_NOT_FOUND_FOR_USER: "فروشگاه برای این کاربر یافت نشد", // translated to Persian
  PROMO_CODE_PROMOTION_INACTIVE: "این پیشنهاد فعال نیست", // translated to Persian
  PROMO_CODE_INVALID_OTP: "کد تأیید نامعتبر یا منقضی شده است", // translated to Persian

  // Additional promo code permission messages
  PROMO_CODE_OWN_PHONE_ONLY: "شما فقط می‌توانید کدها را برای شماره موبایل خود ثبت کنید", // translated to Persian
  PROMO_CODE_CREATE_PERMISSION_DENIED: "شما اجازه ایجاد کد پروموشن برای این پیشنهاد را ندارید", // translated to Persian
  PROMO_CODE_ACCESS_PERMISSION_DENIED: "شما اجازه دسترسی به این کد پروموشن را ندارید", // translated to Persian
  PROMO_CODE_UPDATE_PERMISSION_DENIED: "شما اجازه به‌روزرسانی این کد پروموشن را ندارید", // translated to Persian
  PROMO_CODE_DELETE_PERMISSION_DENIED: "شما اجازه حذف این کد پروموشن را ندارید", // translated to Persian
  PROMO_CODE_CUSTOMER_ACCESS_ONLY: "فقط مشتریان می‌توانند به کدهای پروموشن خود دسترسی داشته باشند", // translated to Persian
  PROMO_CODE_ALREADY_REGISTERED: "کد پروموشن قبلاً به کاربری ثبت شده است", // translated to Persian
  PROMO_CODE_CANNOT_CHANGE_USED_STATUS: "نمی‌توان وضعیت کد پروموشن استفاده شده را تغییر داد", // translated to Persian
  PROMO_CODE_MUST_BE_REGISTERED_FIRST: "کد باید قبل از استفاده به کاربری ثبت شود", // translated to Persian
  PROMO_CODE_USER_ID_MISMATCH: "شناسه کاربر با کاربر ثبت‌شده برای این کد مطابقت ندارد", // translated to Persian
  PROMO_CODE_OWN_STORE_ACCESS_ONLY: "شما فقط می‌توانید به کدهای پروموشن فروشگاه خود دسترسی داشته باشید", // translated to Persian

  // Promotion status messages
  PROMOTION_NOT_ACTIVE: "پیشنهاد فعال نیست", // translated to Persian
  PROMOTION_EXPIRED: "پیشنهاد منقضی شده است", // translated to Persian
  PROMOTION_DELETED: "پیشنهاد حذف شده است", // translated to Persian
  PROMOTION_INACTIVE: "پیشنهاد در حال حاضر غیرفعال است", // translated to Persian

  // Seeding related messages
  PROMOTIONS_SEEDING_REQUIRES_STORES:
    "برای پر کردن پروموشن‌ها، فروشگاه‌های موجود لازم است. از /seeding/seed برای پر کردن کامل استفاده کنید.", // translated to Persian
  PROMO_CODES_SEEDING_REQUIRES_DATA:
    "برای پر کردن کدهای پروموشن، پروموشن‌ها و کاربران موجود لازم است. از /seeding/seed برای پر کردن کامل استفاده کنید.", // translated to Persian
  USERS_SEEDING_REQUIRES_STORES:
    "برای پر کردن کاربران، فروشگاه‌های موجود لازم است. از /seeding/seed برای پر کردن کامل استفاده کنید.", // translated to Persian
} as const;

export type ErrorMessageKey = keyof typeof PERSIAN_ERROR_MESSAGES;
export type ErrorMessageValue =
  (typeof PERSIAN_ERROR_MESSAGES)[ErrorMessageKey];
