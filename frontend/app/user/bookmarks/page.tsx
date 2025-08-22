'use client'
import React, { useEffect, useState } from 'react'

import EmptyListPlaceholder from '@/components/utils/EmptyListPlaceholder'
import { GET_ALL_SIMULATIONS } from '@/services/simulations'
import useLoading from '@/hooks/useLoading'
import SimulatorCard from '@/components/card/SimulatorCard'

const Bookmarks = () => {
  const { setLoading } = useLoading()
  const [simulations, setSimulations] = useState([])
  const [bookmarkIds, setBookmarkIds] = useState([])

  useEffect(() => {
    // دریافت بوکمارک‌ها از localStorage فقط در مرورگر
    if (typeof window !== 'undefined') {
      const storedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]')

      setBookmarkIds(storedBookmarks)
    }
  }, [])

  const fetchSimulations = async () => {
    try {
      setLoading(true)

      const response = await GET_ALL_SIMULATIONS({
        filters: {
          id: bookmarkIds.join(','),
        },
      })

      setSimulations(response.data.data)
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (bookmarkIds.length) {
      fetchSimulations()
    }
  }, [bookmarkIds])

  return (
    <section className="w-full bg-white py-6 rounded-xl">
      {simulations.length ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {simulations.map((simulator: any) => (
            <SimulatorCard
              key={simulator!.id}
              simulator={simulator}
            />
          ))}
        </div>
      ) : (
        <EmptyListPlaceholder description="شما هیچ آیتمی را نشان نکرده اید" />
      )}
    </section>
  )
}

export default Bookmarks
