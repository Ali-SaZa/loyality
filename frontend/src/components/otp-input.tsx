'use client';

import React from 'react';
import { InputOtp } from '@heroui/react';
import { OTP_LENGTH } from '@/lib/validators';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
  length?: number;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  onComplete,
  error,
  disabled = false,
  className,
  length = OTP_LENGTH,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleComplete = (value?: string) => {
    if (onComplete && value) {
      onComplete(value);
    }
  };

  return (
    <InputOtp
      value={value}
      onChange={handleChange}
      onComplete={handleComplete}
      length={length}
      isDisabled={disabled}
      isInvalid={!!error}
      errorMessage={error}
      description={`کد ${length} رقمی ارسال شده را وارد کنید`}
      className={`text-sm sm:text-base ${className || ''}`}
      textAlign="center"
      autoFocus
      size="lg"
    />
  );
};
