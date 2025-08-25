'use client'
import React from 'react'

import AngleDoubleLeftIcon from '../icons/AngleDoubleLeftIcon'

import Button from '@/components/formElements/Button'
import useWindowSize from '@/hooks/useWindowSize'

const Header = () => {
  const { width } = useWindowSize()

  return (
    <header className="bg-primary w-full h-[100vh] relative ">
      <img
        alt="header vector"
        className="absolute w-[257px] h-[116px] left-[300px]"
        height={1000}
        src="/images/header-vector1.png"
        width={1000}
      />
      <img
        alt="header vector"
        className="absolute -right-20 bottom-[200px] rotate-90"
        height={width < 768 ? 100 : 116}
        src="/images/header-vector1.png"
        width={width < 768 ? 200 : 257}
      />
      <img
        alt="header vector"
        className="
          absolute right-0 top-0
          w-[150px] sm:w-[200px] md:w-[300px] lg:w-[400px] xl:w-[485px]
          h-[80px] sm:h-[120px] md:h-[200px] lg:h-[250px] xl:h-[315px]
        "
        src="/images/header-vector2.png"
      />
      <img
        alt="header vector"
        className="
          absolute top-0 right-0 hidden md:block
          w-[200px] sm:w-[200px] md:w-[300px] lg:w-[373px] xl:w-[500px]
          h-[120px] sm:h-[120px] md:h-[140px] lg:h-[162px] xl:h-[250px]
        "
        src="/images/header-vector4.png"
      />
      <img
        alt="header vector"
        className="
          absolute left-0 bottom-0
          w-[150px] sm:w-[200px] md:w-[300px] lg:w-[300px] xl:w-[562px]
          h-[200px] sm:h-[200px] md:h-[300px] lg:h-[300px] xl:h-[503px]
        "
        src="/images/header-vector3.png"
      />
      <img
        alt="header vector"
        className="
          absolute
          left-[50px] sm:left-[80px] md:left-[150px] lg:left-[200px] xl:left-[180px] 2xl:left-[300px]
          bottom-[50px] sm:bottom-[40px] md:bottom-[60px] lg:bottom-[50px] xl:bottom-[80px] 2xl:bottom-[120px]
          w-[250px] sm:w-[300px] md:w-[300px] lg:w-[300px] xl:w-[400px] 2xl:w-[500px]
          h-[250px] sm:h-[300px] md:h-[300px] lg:h-[300px] xl:h-[400px] 2xl:h-[500px]
        "
        src="/images/Frame2.webp"
      />
      <div className="z-10 top-28 md:top-[150px] md:right-[100px] lg:top-[300px] lg:right-[200px] text-center md:text-right text-white absolute px-4">
        <h1 className="font-medium md:font-bold text-3xl md:text-4xl leading-10 md:leading-[68px] text-center md:text-right">
          برنامه وفاداری، هوشمندانه پاداش بگیر
        </h1>
        <p className=" max-w-[400px] mt-6 text-medium md:text-lg font-normal leading-7 text-center md:text-right">
          با برنامه وفاداری ما، امتیازات خود را جمع کنید و از کارت‌های جایزه و پاداش‌های ویژه بهره‌مند شوید{' '}
        </p>
        <Button
          className="mt-6 w-full md:w-fit text-white"
          color="default"
          iconEnd={<AngleDoubleLeftIcon />}
          size="lg"
          to="/auth"
          variant="bordered"
        >
          ورود به سیستم
        </Button>
      </div>
    </header>
  )
}

export default Header
