'use client'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import { usePathname } from 'next/navigation'

import Navbar from '@/components/layouts/user/Navbar'

const PaymentLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()

  return (
    <section className="flex w-screen">
      <div className="flex flex-col w-screen h-[100dvh]">
        <Navbar />
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            animate={{ x: 0, opacity: 1 }} // حالت نهایی صفحه جدید
            className="py-5 md:py-10 px-5 md:px-16 h-full overflow-x-hidden overflow-y-auto "
            initial={{ x: '-100%', opacity: 0 }} // صفحه جدید از سمت چپ می‌آید
            transition={{ duration: 0.3 }} // مدت زمان انیمیشن
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

export default PaymentLayout
