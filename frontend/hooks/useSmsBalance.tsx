"use client";
import { useState, useEffect } from "react";
import { getCurrentStore } from "@/services/stores";
import useAuth from "@/hooks/useAuth";

interface UseSmsBalanceReturn {
  smsBalance: number | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useSmsBalance = (): UseSmsBalanceReturn => {
  const [smsBalance, setSmsBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchSmsBalance = async () => {
    if (user?.role !== "store") {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const store = await getCurrentStore();
      setSmsBalance(store.smsBalance);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "خطا در دریافت موجودی پیامک",
      );
      setSmsBalance(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSmsBalance();
  }, [user?.role]);

  return {
    smsBalance,
    loading,
    error,
    refetch: fetchSmsBalance,
  };
};

export default useSmsBalance;
