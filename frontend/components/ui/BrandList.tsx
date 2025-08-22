// components/BrandList.tsx
import React, { useEffect, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'

const brands: string[] = [
  '/images/brands/1.png',
  '/images/brands/2.png',
  '/images/brands/3.png',
  '/images/brands/4.png',
  '/images/brands/5.png',
  '/images/brands/6.png',
]

const BrandList = () => {
  const controls = useAnimation()
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current

    if (scrollContainer) {
      const totalScrollWidth = scrollContainer.scrollWidth // کل عرض
      const halfWidth = totalScrollWidth / 2 // عرض نیمی از محتوا

      // شروع انیمیشن برای حرکت به چپ
      controls.start({
        x: `${halfWidth}px`, // حرکت به سمت چپ
        transition: {
          duration: 50, // تنظیم سرعت
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'loop',
        },
      })
    }
  }, [controls])

  return (
    <div className="overflow-hidden">
      <div
        ref={scrollRef}
        className="flex space-x-4 p-4 whitespace-nowrap"
      >
        <motion.div
          animate={controls}
          className="flex space-x-16"
        >
          {brands.map((brand, index) => (
            <div
              key={index}
              className="flex-shrink-0"
            >
              <img
                alt={`Brand ${index}`}
                className="h-32 w-auto"
                src={brand}
              />
            </div>
          ))}
          {brands.map((brand, index) => (
            <div
              key={`duplicate-${index}`}
              className="flex-shrink-0"
            >
              <img
                alt={`Brand ${index}`}
                className="h-32 w-auto"
                src={brand}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default BrandList
