import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Promotion, PromotionDocument } from '../../schemas/promotion.schema';
import { Store, StoreDocument } from '../../schemas/store.schema';
import { BaseSeeder } from './base.seeder';

@Injectable()
export class PromotionsSeeder extends BaseSeeder<PromotionDocument> {
  private stores: StoreDocument[] = [];

  constructor(
    @InjectModel(Promotion.name) private promotionsModel: Model<PromotionDocument>
  ) {
    super();
  }

  setStores(stores: StoreDocument[]) {
    this.stores = stores;
  }

  protected get model(): Model<PromotionDocument> {
    return this.promotionsModel;
  }

  protected get data(): any[] {
    if (this.stores.length === 0) {
      throw new Error('Stores must be set before seeding promotions');
    }

    if (this.stores.length < 3) {
      throw new Error('Need at least 3 stores to seed promotions');
    }

    const now = new Date();
    const oneMonthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const twoMonthsFromNow = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

    return [
      // Tehran Mall Promotions
      {
        storeId: this.stores[0]._id,
        type: 'percentage',
        title: 'تخفیف ویژه 20 درصدی',
        description: 'تخفیف 20 درصدی برای خریدهای بالای 500 هزار تومان',
        value: 20,
        minPurchaseAmount: 500000,
        maxDiscountAmount: 100000,
        startDate: now,
        endDate: oneMonthFromNow,
        status: 'active',
        usageLimit: 100,
        currentUsageCount: 0,
        maxUsagePerCustomer: 2,
        isStackable: false,
        termsAndConditions: 'این تخفیف فقط برای خریدهای بالای 500 هزار تومان اعمال می‌شود',
        requiresApproval: false
      },
      {
        storeId: this.stores[0]._id,
        type: 'cashback',
        title: 'کش‌بک 5 درصدی',
        description: 'دریافت 5 درصد کش‌بک از کل خرید',
        value: 5,
        startDate: now,
        endDate: twoMonthsFromNow,
        status: 'active',
        usageLimit: 500,
        currentUsageCount: 0,
        maxUsagePerCustomer: 5,
        isStackable: true,
        stackableWith: ['loyaltyPoints', 'referral'],
        termsAndConditions: 'کش‌بک به صورت امتیاز به حساب کاربری اضافه می‌شود',
        requiresApproval: false
      },
      {
        storeId: this.stores[0]._id,
        type: 'loyaltyPoints',
        title: 'امتیاز دوبرابری',
        description: 'دریافت دوبرابر امتیاز وفاداری',
        points: 2,
        startDate: now,
        endDate: oneMonthFromNow,
        status: 'active',
        usageLimit: 1000,
        currentUsageCount: 0,
        maxUsagePerCustomer: 10,
        isStackable: true,
        stackableWith: ['cashback', 'percentage'],
        termsAndConditions: 'امتیاز دوبرابر برای تمام خریدها اعمال می‌شود',
        requiresApproval: false
      },
      {
        storeId: this.stores[0]._id,
        type: 'coupon',
        title: 'کوپن تخفیف 50 هزار تومانی',
        description: 'کوپن تخفیف 50 هزار تومانی برای خریدهای بالای 200 هزار تومان',
        code: 'TEHRAN50K',
        value: 50000,
        minPurchaseAmount: 200000,
        startDate: now,
        endDate: oneMonthFromNow,
        status: 'active',
        usageLimit: 50,
        currentUsageCount: 0,
        maxUsagePerCustomer: 1,
        isStackable: false,
        termsAndConditions: 'کوپن فقط یکبار قابل استفاده است',
        requiresApproval: false
      },

      // Isfahan Bazaar Promotions
      {
        storeId: this.stores[1]._id,
        type: 'fixed',
        title: 'تخفیف ثابت 30 هزار تومانی',
        description: 'تخفیف ثابت 30 هزار تومانی برای خریدهای بالای 150 هزار تومان',
        value: 30000,
        minPurchaseAmount: 150000,
        startDate: now,
        endDate: oneMonthFromNow,
        status: 'active',
        usageLimit: 200,
        currentUsageCount: 0,
        maxUsagePerCustomer: 3,
        isStackable: false,
        termsAndConditions: 'تخفیف ثابت برای خریدهای بالای 150 هزار تومان',
        requiresApproval: false
      },
      {
        storeId: this.stores[1]._id,
        type: 'referral',
        title: 'پاداش معرفی دوستان',
        description: 'دریافت 10 هزار تومان برای هر معرفی موفق',
        value: 10000,
        startDate: now,
        endDate: twoMonthsFromNow,
        status: 'active',
        usageLimit: 100,
        currentUsageCount: 0,
        maxUsagePerCustomer: 10,
        isStackable: true,
        stackableWith: ['cashback', 'loyaltyPoints'],
        termsAndConditions: 'پاداش پس از اولین خرید دوست معرفی شده پرداخت می‌شود',
        requiresApproval: true
      },
      {
        storeId: this.stores[1]._id,
        type: 'conditional',
        title: 'تخفیف پلکانی',
        description: 'تخفیف بر اساس مبلغ خرید',
        value: 15,
        minPurchaseAmount: 100000,
        maxDiscountAmount: 75000,
        startDate: now,
        endDate: oneMonthFromNow,
        status: 'active',
        usageLimit: 300,
        currentUsageCount: 0,
        maxUsagePerCustomer: 5,
        isStackable: false,
        termsAndConditions: 'تخفیف بر اساس مبلغ خرید محاسبه می‌شود',
        requiresApproval: false
      },

      // Shiraz Market Promotions
      {
        storeId: this.stores[2]._id,
        type: 'flashSale',
        title: 'فروش فلش 50 درصدی',
        description: 'تخفیف 50 درصدی برای مدت محدود',
        value: 50,
        startDate: now,
        endDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
        status: 'active',
        usageLimit: 100,
        currentUsageCount: 0,
        maxUsagePerCustomer: 2,
        isStackable: false,
        termsAndConditions: 'فروش فلش فقط برای 7 روز اعتبار دارد',
        requiresApproval: false
      },
      {
        storeId: this.stores[2]._id,
        type: 'behavioral',
        title: 'پاداش خرید مکرر',
        description: 'پاداش ویژه برای مشتریان وفادار',
        value: 25,
        applicableEvents: ['purchase', 'visit', 'review'],
        startDate: now,
        endDate: twoMonthsFromNow,
        status: 'active',
        usageLimit: 50,
        currentUsageCount: 0,
        maxUsagePerCustomer: 3,
        isStackable: true,
        stackableWith: ['loyaltyPoints'],
        termsAndConditions: 'پاداش برای مشتریان با حداقل 3 خرید در ماه',
        requiresApproval: false
      },
      {
        storeId: this.stores[2]._id,
        type: 'freeShipping',
        title: 'ارسال رایگان',
        description: 'ارسال رایگان برای خریدهای بالای 100 هزار تومان',
        minPurchaseAmount: 100000,
        startDate: now,
        endDate: oneMonthFromNow,
        status: 'active',
        usageLimit: 500,
        currentUsageCount: 0,
        maxUsagePerCustomer: 10,
        isStackable: true,
        stackableWith: ['percentage', 'cashback', 'loyaltyPoints'],
        termsAndConditions: 'ارسال رایگان فقط برای خریدهای بالای 100 هزار تومان',
        requiresApproval: false
      },
      {
        storeId: this.stores[2]._id,
        type: 'stackable',
        title: 'ترکیب تخفیفات',
        description: 'امکان ترکیب چندین تخفیف با هم',
        value: 10,
        isStackable: true,
        stackableWith: ['percentage', 'cashback', 'loyaltyPoints', 'referral'],
        startDate: now,
        endDate: oneMonthFromNow,
        status: 'active',
        usageLimit: 200,
        currentUsageCount: 0,
        maxUsagePerCustomer: 5,
        termsAndConditions: 'این تخفیف با سایر تخفیفات قابل ترکیب است',
        requiresApproval: false
      }
    ];
  }

  protected getData(): any[] {
    return this.data;
  }
}
