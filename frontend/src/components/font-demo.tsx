'use client';

import React from 'react';

export const FontDemo: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto" dir="rtl">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-center" style={{ fontFamily: 'Sans Web' }}>
        نمایش فونت Sans Web
      </h1>
      
      <div className="space-y-6 sm:space-y-8">
        {/* Font Weights */}
        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4" style={{ fontFamily: 'Sans Web' }}>
            وزن‌های مختلف فونت
          </h2>
          <div className="space-y-2">
            <p className="text-sm sm:text-lg" style={{ fontFamily: 'Sans Web', fontWeight: 300 }}>
              وزن Light (300) - این متن با وزن سبک نمایش داده می‌شود
            </p>
            <p className="text-sm sm:text-lg" style={{ fontFamily: 'Sans Web', fontWeight: 400 }}>
              وزن Regular (400) - این متن با وزن معمولی نمایش داده می‌شود
            </p>
            <p className="text-sm sm:text-lg" style={{ fontFamily: 'Sans Web', fontWeight: 700 }}>
              وزن Bold (700) - این متن با وزن ضخیم نمایش داده می‌شود
            </p>
          </div>
        </section>

        {/* Font Sizes */}
        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4" style={{ fontFamily: 'Sans Web' }}>
            اندازه‌های مختلف فونت
          </h2>
          <div className="space-y-2">
            <p className="text-xs" style={{ fontFamily: 'Sans Web' }}>
              اندازه XS (0.75rem) - متن بسیار کوچک
            </p>
            <p className="text-sm" style={{ fontFamily: 'Sans Web' }}>
              اندازه SM (0.875rem) - متن کوچک
            </p>
            <p className="text-base" style={{ fontFamily: 'Sans Web' }}>
              اندازه Base (1rem) - متن پایه
            </p>
            <p className="text-lg" style={{ fontFamily: 'Sans Web' }}>
              اندازه LG (1.125rem) - متن بزرگ
            </p>
            <p className="text-xl" style={{ fontFamily: 'Sans Web' }}>
              اندازه XL (1.25rem) - متن خیلی بزرگ
            </p>
            <p className="text-2xl" style={{ fontFamily: 'Sans Web' }}>
              اندازه 2XL (1.5rem) - عنوان کوچک
            </p>
            <p className="text-3xl" style={{ fontFamily: 'Sans Web' }}>
              اندازه 3XL (1.875rem) - عنوان متوسط
            </p>
            <p className="text-4xl" style={{ fontFamily: 'Sans Web' }}>
              اندازه 4XL (2.25rem) - عنوان بزرگ
            </p>
            <p className="text-5xl" style={{ fontFamily: 'Sans Web' }}>
              اندازه 5XL (3rem) - عنوان خیلی بزرگ
            </p>
          </div>
        </section>

        {/* Sample Content */}
        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4" style={{ fontFamily: 'Sans Web' }}>
            نمونه محتوا
          </h2>
          <div className="space-y-3 sm:space-y-4">
            <p className="text-sm sm:text-lg leading-relaxed" style={{ fontFamily: 'Sans Web' }}>
              این یک پاراگراف نمونه است که نشان می‌دهد فونت Sans Web چگونه در متن‌های طولانی نمایش داده می‌شود. 
              این فونت برای خوانایی بهتر طراحی شده و در اندازه‌های مختلف به خوبی کار می‌کند.
            </p>
            <p className="text-xs sm:text-base leading-normal" style={{ fontFamily: 'Sans Web' }}>
              فونت Sans Web یک فونت مدرن و خوانا است که برای استفاده در وب‌سایت‌ها و اپلیکیشن‌ها بهینه شده است. 
              این فونت از سه وزن مختلف پشتیبانی می‌کند و در تمام مرورگرهای مدرن به خوبی کار می‌کند.
            </p>
          </div>
        </section>

        {/* Numbers and English Text */}
        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4" style={{ fontFamily: 'Sans Web' }}>
            اعداد و متن انگلیسی
          </h2>
          <div className="space-y-2">
            <p className="text-sm sm:text-lg" style={{ fontFamily: 'Sans Web' }}>
              شماره تلفن: 09123456789
            </p>
            <p className="text-sm sm:text-lg" style={{ fontFamily: 'Sans Web' }}>
              کد پستی: 12345-67890
            </p>
            <p className="text-sm sm:text-lg" style={{ fontFamily: 'Sans Web' }}>
              تاریخ: 1403/01/01
            </p>
            <p className="text-sm sm:text-lg" style={{ fontFamily: 'Sans Web' }}>
              Email: user@example.com
            </p>
            <p className="text-sm sm:text-lg" style={{ fontFamily: 'Sans Web' }}>
              URL: https://example.com
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
