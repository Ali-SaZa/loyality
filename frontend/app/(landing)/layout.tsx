'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import React from 'react'

import Navbar from '@/components/layouts/Navbar'
import Contact from '@/components/layouts/Contact'
import Footer from '@/components/layouts/Footer'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <section>
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          animate={{ x: 0, opacity: 1 }} // حالت نهایی صفحه جدید
          className="pt-16 -mt-16 w-screen relative"
          exit={{ x: '100%', opacity: 0 }} // صفحه قبلی به سمت راست می‌رود
          initial={{ x: '-100%', opacity: 0 }} // صفحه جدید از سمت چپ می‌آید
          transition={{ duration: 0.3 }} // مدت زمان انیمیشن
        >
          {children}
        </motion.div>
      </AnimatePresence>
      <Contact />
      <Footer />
    </section>
  )
}
