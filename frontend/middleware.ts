import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const userCookie = request.cookies.get('accessToken') // فرض بر این است که اطلاعات کاربر در کوکی ذخیره شده است
  let loggedIn = false // متغیر برای بررسی وضعیت لاگین

  // اگر کوکی موجود باشد، اطلاعات کاربر را استخراج می‌کنیم
  if (userCookie?.value) {
    // به value دسترسی پیدا می‌کنیم
    try {
      const accessToken = await JSON.parse(userCookie.value) // تبدیل رشته کوکی به شیء

      loggedIn = !!accessToken // بررسی می‌کند که آیا کاربر لاگین کرده است یا نه
    } catch (error) {
      console.error('Error parsing user cookie:', error)
      // اگر خطایی در پارس وجود داشته باشد، می‌توانید loggedIn را false بگذارید
    }
  }

  const userRoutes = ['/user', '/start-simulator', '/payment', '/start-evaluation-questions'] // روت‌هایی که فقط کاربران لاگین‌شده می‌توانند به آن دسترسی داشته باشند
  const authRoutes = ['/auth'] // روت‌هایی که کاربر لاگین‌شده نباید به آن دسترسی داشته باشد

  const currentPath = request.nextUrl.pathname

  const response = NextResponse.next()

  // شرط اختصاصی برای مسیر '/auth/profile'
  if (currentPath === '/auth/profile') {
    if (!loggedIn) {
      const loginUrl = new URL('/auth?tab=login', request.url)

      loginUrl.searchParams.set('redirect', currentPath) // ذخیره مسیر هدف به عنوان پارامتر redirect

      return NextResponse.redirect(loginUrl) // به صفحه auth یا login هدایت می‌شود
    }

    return response // اجازه ادامه می‌دهد
  }

  // اگر کاربر لاگین نباشد و بخواهد به روت‌های کاربران وارد شود
  if (!loggedIn && userRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
    const loginUrl = new URL('/auth?tab=login', request.url)

    loginUrl.searchParams.set('redirect', currentPath) // ذخیره مسیر هدف به عنوان پارامتر redirect

    return NextResponse.redirect(loginUrl) // به صفحه auth یا login هدایت می‌شود
  }

  // اگر کاربر لاگین کرده باشد و بخواهد به صفحات auth وارد شود
  if (loggedIn && authRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/user/simulators', request.url)) // به صفحه user هدایت می‌شود
  }

  return response // اگر همه چیز درست باشد، درخواست ادامه پیدا می‌کند
}

export const config = {
  matcher: ['/user/:path*', '/auth/:path*', '/start-simulator/:path*', '/payment/:path*', '/start-evaluation-questions/:path*'], // مسیرهایی که میدل‌ویر باید اجرا شود
}
