'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardBody, CardHeader } from '@heroui/react';
import { Button } from '@heroui/react';
import { PhoneInput } from '@/components/phone-input';
import { OtpInput } from '@/components/otp-input';
import { useAuthStore } from '@/store/auth-store';
import { maskPhone } from '@/lib/validators';

export const AuthCard: React.FC = () => {
  const { step, phoneForOtp, loading, error, sendOtp, verifyOtp, clearError, resetStep } = useAuthStore();
  
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [showResend, setShowResend] = useState(false);

  // Countdown timer for resend
  useEffect(() => {
    if (step === 'otp' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && step === 'otp') {
      setShowResend(true);
    }
  }, [countdown, step]);

  const handleSendOtp = async () => {
    if (!phone.trim()) return;
    
    clearError();
    const success = await sendOtp(phone);
    if (success) {
      setCountdown(60);
      setShowResend(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 4) return;
    
    clearError();
    const success = await verifyOtp(otp);
    if (success) {
      // Redirect will be handled by the store
      window.location.href = '/';
    }
  };

  const handleResend = async () => {
    if (!phoneForOtp) return;
    
    clearError();
    const success = await sendOtp(phoneForOtp);
    if (success) {
      setCountdown(60);
      setShowResend(false);
    }
  };

  const handleBackToPhone = () => {
    resetStep();
    setPhone('');
    setOtp('');
    setCountdown(0);
    setShowResend(false);
    clearError();
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto" style={{ backgroundColor: '#e9ebf4' }}>
      <Card className="shadow-lg">
        <CardHeader className="text-center pb-3 sm:pb-4 px-4 sm:px-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Sans Web' }}>
            ورود / ثبت‌نام
          </h3>
          <p className="text-sm sm:text-base text-gray-600 px-2 sm:px-0" style={{ fontFamily: 'Sans Web' }}>
            {step === 'phone' ? 'شماره موبایل خود را وارد کنید' : 'کد تایید ارسال شد'}
          </p>
        </CardHeader>

        <CardBody className="space-y-4 sm:space-y-6 px-4 sm:px-6">
          <AnimatePresence mode="wait">
            {step === 'phone' ? (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <PhoneInput
                  value={phone}
                  onChange={setPhone}
                  onEnter={handleSendOtp}
                  error={error}
                  disabled={loading}
                />
                
                <Button
                  onClick={handleSendOtp}
                  disabled={loading || !phone.trim()}
                  className="w-full h-12 sm:h-14 text-base sm:text-lg font-medium"
                >
                  {loading ? 'در حال ارسال...' : 'ارسال کد تایید'}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="text-center space-y-2">
                  <p className="text-xs sm:text-sm text-gray-600 px-2 sm:px-0">
                    کد ارسال شده به {phoneForOtp ? maskPhone(phoneForOtp) : ''} را وارد کنید
                  </p>
                </div>

                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  onComplete={handleVerifyOtp}
                  error={error}
                  disabled={loading}
                />

                <div className="space-y-3">
                  <Button
                    onClick={handleVerifyOtp}
                    disabled={loading || otp.length !== 4}
                    className="w-full h-12 sm:h-14 text-base sm:text-lg font-medium"
                  >
                    {loading ? 'در حال تایید...' : 'تایید'}
                  </Button>

                  <div className="flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm space-y-2 sm:space-y-0">
                    <button
                      type="button"
                      onClick={handleBackToPhone}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      disabled={loading}
                    >
                      تغییر شماره موبایل
                    </button>

                    <div className="flex items-center space-x-2 space-x-reverse">
                      {!showResend ? (
                        <span className="text-gray-500">
                          ارسال مجدد در {formatCountdown(countdown)}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResend}
                          disabled={loading}
                          className="text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50"
                        >
                          ارسال مجدد کد
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardBody>
      </Card>
    </div>
  );
};
