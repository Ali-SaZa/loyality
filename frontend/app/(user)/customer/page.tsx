'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CustomerIndexPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the use-promotion page
    router.replace('/customer/use-promotion')
  }, [router])

  // Show loading while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-text-light">در حال انتقال...</p>
      </div>
    </div>
  )
}