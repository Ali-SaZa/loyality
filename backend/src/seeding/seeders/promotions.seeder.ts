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

    return [
      // Tehran Mall Promotions
      {
        storeId: this.stores[0]._id,
        title: 'امتیاز ویژه خرید',
        description: 'دریافت 1 امتیاز برای هر 100 هزار تومان خرید',
        price: 100000,
        points: 1,
        status: 'active'
      },
      {
        storeId: this.stores[0]._id,
        title: 'امتیاز دوبرابری',
        description: 'دریافت 2 امتیاز برای هر 100 هزار تومان خرید',
        price: 100000,
        points: 2,
        status: 'active'
      },
      {
        storeId: this.stores[0]._id,
        title: 'امتیاز خریدهای بزرگ',
        description: 'دریافت 5 امتیاز برای هر 500 هزار تومان خرید',
        price: 500000,
        points: 5,
        status: 'active'
      },

      // Isfahan Bazaar Promotions
      {
        storeId: this.stores[1]._id,
        title: 'امتیاز وفاداری',
        description: 'دریافت 1 امتیاز برای هر 150 هزار تومان خرید',
        price: 150000,
        points: 1,
        status: 'active'
      },
      {
        storeId: this.stores[1]._id,
        title: 'امتیاز ویژه مشتریان',
        description: 'دریافت 3 امتیاز برای هر 300 هزار تومان خرید',
        price: 300000,
        points: 3,
        status: 'active'
      },

      // Shiraz Market Promotions
      {
        storeId: this.stores[2]._id,
        title: 'امتیاز خرید مکرر',
        description: 'دریافت 1 امتیاز برای هر 200 هزار تومان خرید',
        price: 200000,
        points: 1,
        status: 'active'
      },
      {
        storeId: this.stores[2]._id,
        title: 'امتیاز خریدهای بزرگ',
        description: 'دریافت 10 امتیاز برای هر 1 میلیون تومان خرید',
        price: 1000000,
        points: 10,
        status: 'active'
      },
      {
        storeId: this.stores[2]._id,
        title: 'امتیاز ویژه آخر هفته',
        description: 'دریافت 2 امتیاز برای هر 100 هزار تومان خرید',
        price: 100000,
        points: 2,
        status: 'active'
      }
    ];
  }

  protected getData(): any[] {
    return this.data;
  }
}
