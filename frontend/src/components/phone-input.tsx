'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@heroui/react';
import { phoneSchema } from '@/lib/validators';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  onEnter,
  error,
  disabled = false,
  className,
}) => {
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (value) {
      const validation = phoneSchema.safeParse(value);
      setIsValid(validation.success);
    } else {
      setIsValid(true);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    
    // Only allow digits, +, and -
    inputValue = inputValue.replace(/[^\d+\-]/g, '');
    
    // Ensure it starts with +98 or 09
    if (inputValue && !inputValue.startsWith('+98') && !inputValue.startsWith('09')) {
      if (inputValue.startsWith('98')) {
        inputValue = '+' + inputValue;
      } else if (inputValue.startsWith('9')) {
        inputValue = '09' + inputValue.slice(1);
      }
    }
    
    onChange(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onEnter && isValid && value) {
      onEnter();
    }
  };

  return (
    <Input
      type="tel"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder="09xxxxxxxxx"
      isDisabled={disabled}
      isInvalid={!!error || (!isValid && !!value)}
      errorMessage={error || (!isValid && value ? 'فرمت صحیح: 09xxxxxxxxx' : undefined)}
      description="شماره موبایل خود را با فرمت 09xxxxxxxxx وارد کنید"
      label="شماره موبایل"
      labelPlacement="outside"
      className={`text-sm sm:text-base ${className || ''}`}
      dir="ltr"
      size="lg"
    />
  );
};
