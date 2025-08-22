'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import useGlobal from '@/hooks/useGlobal'

const User = () => {
  const router = useRouter()
  const { setData } = useGlobal()

  useEffect(() => {
    setData('navbar', { title: 'داشبورد' })

    return router.replace('/user/simulators')
  }, [])

  return <section className="w-full">داشبورد</section>
}

export default User
