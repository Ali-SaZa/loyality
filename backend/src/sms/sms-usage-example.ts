// Example usage of SMS service
// This shows how to integrate SMS logging into existing services

import { Injectable } from '@nestjs/common';
import { SmsService } from '../sms/sms.service';

@Injectable()
export class ExampleUsageService {
  constructor(private readonly smsService: SmsService) {}

  // Example: Send SMS when user registers for promo code
  async sendPromoCodeSms(userId: string, promoCode: string, requestedBy: string) {
    const smsText = `کد تخفیف شما: ${promoCode}. از این کد در فروشگاه استفاده کنید.`;
    
    return this.smsService.sendSms({
      userId,
      text: smsText,
      createdBy: requestedBy,
    });
  }

  // Example: Send notification SMS
  async sendNotificationSms(userId: string, message: string, adminId: string) {
    return this.smsService.sendSms({
      userId,
      text: message,
      createdBy: adminId,
    });
  }

  // Example: Get SMS history for a user
  async getUserSmsHistory(userId: string) {
    return this.smsService.findByUserId(userId);
  }

  // Example: Get SMS statistics
  async getSmsAnalytics() {
    return this.smsService.getSmsStats();
  }
}
