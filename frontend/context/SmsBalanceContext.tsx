'use client'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { getCurrentStore } from '@/services/stores'
import useAuth from '@/hooks/useAuth'

interface SmsBalanceContextType {
  smsBalance: number | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

const SmsBalanceContext = createContext<SmsBalanceContextType | undefined>(undefined)

export const SmsBalanceProvider = ({ children }: { children: ReactNode }) => {
  const [smsBalance, setSmsBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const fetchSmsBalance = async () => {
    if (user?.role !== 'store') {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const store = await getCurrentStore()
      setSmsBalance(store.smsBalance)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در دریافت موجودی پیامک')
      setSmsBalance(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSmsBalance()
  }, [user?.role])

  return (
    <SmsBalanceContext.Provider value={{ smsBalance, loading, error, refetch: fetchSmsBalance }}>
      {children}
    </SmsBalanceContext.Provider>
  )
}

export const useSmsBalanceContext = () => {
  const context = useContext(SmsBalanceContext)
  if (context === undefined) {
    throw new Error('useSmsBalanceContext must be used within a SmsBalanceProvider')
  }
  return context
}
