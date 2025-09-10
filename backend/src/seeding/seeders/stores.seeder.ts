import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Store, StoreDocument } from "../../schemas/store.schema";
import { User, UserDocument } from "../../schemas/user.schema";
import { BaseSeeder } from "./base.seeder";

@Injectable()
export class StoresSeeder extends BaseSeeder<StoreDocument> {
  private users: UserDocument[] = [];

  constructor(
    @InjectModel(Store.name) private storesModel: Model<StoreDocument>,
  ) {
    super();
  }

  setUsers(users: UserDocument[]) {
    this.users = users;
  }

  protected get model(): Model<StoreDocument> {
    return this.storesModel;
  }

  protected get data(): any[] {
    if (this.users.length === 0) {
      throw new Error("Users must be set before seeding stores");
    }

    // Find the store users
    const storeUser1 = this.users.find(
      (user) => user.phoneNumber === "09122222222",
    ); // Doris Accessories
    const storeUser2 = this.users.find(
      (user) => user.phoneNumber === "09166666666",
    ); // Tehran Mall
    const storeUser3 = this.users.find(
      (user) => user.phoneNumber === "09177777777",
    ); // Isfahan Bazaar
    const storeUser4 = this.users.find(
      (user) => user.phoneNumber === "09221234567",
    ); // Shiraz Market

    if (!storeUser1) {
      throw new Error("Store user (09122222222) not found");
    }
    if (!storeUser2) {
      throw new Error("Store user (09166666666) not found");
    }
    if (!storeUser3) {
      throw new Error("Store user (09177777777) not found");
    }
    if (!storeUser4) {
      throw new Error("Store user (09221234567) not found");
    }

    return [
      {
        name: "Doris Accessories",
        phoneNumber: "09122222222",
        userId: storeUser1._id,
        address: {
          province: "Tehran",
          city: "Tehran",
          fullAddress: "Valiasr Street, Tehran, Iran",
        },
        status: "active",
        planExpiryDate: new Date("2024-12-31"),
        logoUrl: "https://example.com/doris-accessories-logo.jpg",
        description:
          "Premium accessories store with comprehensive loyalty program",
        socialLinks: {
          website: "https://dorisaccessories.ir",
          instagram: "@dorisaccessories",
          telegram: "@dorisaccessories",
        },
        workingHours: {
          open: "09:00",
          close: "21:00",
        },
        smsBalance: 100,
        lastSmsSentAt: null,
        totalSmsSent: 0,
      },
      {
        name: "Tehran Mall",
        phoneNumber: "09166666666",
        userId: storeUser2._id,
        address: {
          province: "Tehran",
          city: "Tehran",
          fullAddress: "Tehran Mall, Tehran, Iran",
        },
        status: "active",
        planExpiryDate: new Date("2025-06-30"),
        logoUrl: "https://example.com/tehran-mall-logo.jpg",
        description:
          "Premium shopping mall in Tehran with comprehensive features",
        socialLinks: {
          website: "https://tehranmall.ir",
          instagram: "@tehranmall",
          telegram: "@tehranmall",
        },
        workingHours: {
          open: "10:00",
          close: "22:00",
        },
        smsBalance: 200,
        lastSmsSentAt: null,
        totalSmsSent: 0,
      },
      {
        name: "Isfahan Bazaar",
        phoneNumber: "09177777777",
        userId: storeUser3._id,
        address: {
          province: "Isfahan",
          city: "Isfahan",
          fullAddress: "Isfahan Bazaar, Isfahan, Iran",
        },
        status: "active",
        planExpiryDate: new Date("2024-11-15"),
        logoUrl: "https://example.com/isfahan-bazaar-logo.jpg",
        description:
          "Traditional bazaar in Isfahan with basic loyalty features",
        socialLinks: {
          website: "https://isfahanbazaar.ir",
          instagram: "@isfahanbazaar",
          telegram: "@isfahanbazaar",
        },
        workingHours: {
          open: "08:00",
          close: "20:00",
        },
        smsBalance: 50,
        lastSmsSentAt: null,
        totalSmsSent: 0,
      },
      {
        name: "Shiraz Market",
        phoneNumber: "09221234567",
        userId: storeUser4._id,
        address: {
          province: "Fars",
          city: "Shiraz",
          fullAddress: "Shiraz Market, Shiraz, Iran",
        },
        status: "active",
        planExpiryDate: new Date("2025-03-20"),
        logoUrl: "https://example.com/shiraz-market-logo.jpg",
        description:
          "Modern market in Shiraz with premium features and lottery system",
        socialLinks: {
          website: "https://shirazmarket.ir",
          instagram: "@shirazmarket",
          telegram: "@shirazmarket",
        },
        workingHours: {
          open: "09:30",
          close: "21:30",
        },
        smsBalance: 150,
        lastSmsSentAt: null,
        totalSmsSent: 0,
      },
    ];
  }

  protected getData(): any[] {
    return this.data;
  }
}
