'use client'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'

import BreadcrumbSection from '@/components/layouts/user/BreadcrumbSection'
import Navbar from '@/components/layouts/user/Navbar'
import Sidebar from '@/components/layouts/user/Sidebar'
import useGlobal from '@/hooks/useGlobal'

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const { setData, activeRoute } = useGlobal()
  const pathname = usePathname()

  useEffect(() => {
    setData('navbar', { title: activeRoute.title })
  }, [activeRoute])

  return (
    <section className="flex w-screen">
      <Sidebar />
      <div className="flex flex-col fixed left-0 w-screen md:w-[calc(100vw-230px)] h-[100dvh]">
        <Navbar />
        <BreadcrumbSection />
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            animate={{ x: 0, opacity: 1 }} // حالت نهایی صفحه جدید
            className="py-5 px-5 md:px-10 bg-background-20 h-full overflow-y-auto"
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

export default UserLayout
