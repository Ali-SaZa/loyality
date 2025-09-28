import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Store, StoreDocument } from "../../schemas/store.schema";
import { UserDocument } from "../../schemas/user.schema";
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
      (user) => user.phoneNumber === "09387114120",
    ); // Doris Accessories
    const storeUser2 = this.users.find(
      (user) => user.phoneNumber === "09215501953",
    ); // Mashhad Mall

    if (!storeUser1) {
      throw new Error("Store user (09387114120) not found");
    }
    if (!storeUser2) {
      throw new Error("Store user (09215501953) not found");
    }

    return [
      {
        name: "Doris Accessories",
        phoneNumber: "09387114120",
        userId: storeUser1._id,
        address: {
          province: "Mashhad",
          city: "Mashhad",
          fullAddress: "Valiasr Street, Mashhad, Iran",
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
        name: "Mashhad Mall",
        phoneNumber: "09215501953",
        userId: storeUser2._id,
        address: {
          province: "Mashhad",
          city: "Mashhad",
          fullAddress: "Mashhad Mall, Mashhad, Iran",
        },
        status: "active",
        planExpiryDate: new Date("2025-06-30"),
        logoUrl: "https://example.com/Mashhad-mall-logo.jpg",
        description:
          "Premium shopping mall in Mashhad with comprehensive features",
        socialLinks: {
          website: "https://Mashhadmall.ir",
          instagram: "@Mashhadmall",
          telegram: "@Mashhadmall",
        },
        workingHours: {
          open: "10:00",
          close: "22:00",
        },
        smsBalance: 200,
        lastSmsSentAt: null,
        totalSmsSent: 0,
      },
    ];
  }

  protected getData(): any[] {
    return this.data;
  }
}
