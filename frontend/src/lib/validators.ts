import { z } from 'zod';

export const OTP_LENGTH = parseInt(process.env.NEXT_PUBLIC_OTP_LENGTH || '4');

export const phoneSchema = z
  .string()
  .min(1, 'شماره موبایل الزامی است')
  .refine(
    (phone) => {
      // Remove all non-digit characters
      const cleanPhone = phone.replace(/\D/g, '');
      
      // Check if it's a valid Iranian mobile number
      // Accepts: 09xxxxxxxxx or +989xxxxxxxxx
      if (cleanPhone.startsWith('98') && cleanPhone.length === 12) {
        return true;
      }
      if (cleanPhone.startsWith('09') && cleanPhone.length === 11) {
        return true;
      }
      return false;
    },
    {
      message: 'شماره موبایل معتبر نیست. فرمت صحیح: 09xxxxxxxxx',
    }
  );

export const otpSchema = z
  .string()
  .length(OTP_LENGTH, `کد تایید باید ${OTP_LENGTH} رقم باشد`)
  .regex(/^\d+$/, 'کد تایید باید فقط شامل اعداد باشد');

export function normalizePhone(phone: string): string {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // If it starts with 09, convert to +98
  if (cleanPhone.startsWith('09')) {
    return `+98${cleanPhone.slice(1)}`;
  }
  
  // If it starts with 98, add +
  if (cleanPhone.startsWith('98')) {
    return `+${cleanPhone}`;
  }
  
  return phone;
}

export function maskPhone(phone: string): string {
  const normalized = normalizePhone(phone);
  if (normalized.startsWith('+98')) {
    const number = normalized.slice(3);
    return `+98 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`;
  }
  return phone;
}
