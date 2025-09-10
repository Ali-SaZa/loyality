import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Sms, SmsDocument } from "../../schemas/sms.schema";
import { User, UserDocument } from "../../schemas/user.schema";
import { BaseSeeder } from "./base.seeder";

@Injectable()
export class SmsSeeder extends BaseSeeder<SmsDocument> {
  private users: UserDocument[] = [];

  constructor(@InjectModel(Sms.name) private smsModel: Model<SmsDocument>) {
    super();
  }

  setUsers(users: UserDocument[]) {
    this.users = users;
  }

  protected get model(): Model<SmsDocument> {
    return this.smsModel;
  }

  protected get data(): any[] {
    if (this.users.length === 0) {
      throw new Error("Users must be set before seeding SMS records");
    }

    // Find users for SMS records
    const adminUser = this.users.find(
      (user) => user.phoneNumber === "09121111111",
    ); // Admin
    const storeUser = this.users.find(
      (user) => user.phoneNumber === "09122222222",
    ); // Store user
    const customer1 = this.users.find(
      (user) => user.phoneNumber === "09123333333",
    ); // Customer
    const customer2 = this.users.find(
      (user) => user.phoneNumber === "09111111111",
    ); // Ali Ahmadi
    const customer3 = this.users.find(
      (user) => user.phoneNumber === "09133333333",
    ); // Reza Mohammadi

    if (!adminUser || !storeUser || !customer1 || !customer2 || !customer3) {
      throw new Error("Required users not found for SMS seeding");
    }

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return [
      // Recent SMS from store to customers
      {
        userId: customer1._id,
        text: "Welcome to Doris Accessories! Use code WELCOME10 for 10% off your first purchase.",
        providerResponse: "SMS sent successfully (mock provider)",
        createdBy: storeUser._id,
        createdAt: oneDayAgo,
        updatedAt: oneDayAgo,
      },
      {
        userId: customer2._id,
        text: "Your loyalty points have been updated! You now have 150 points. Visit us soon!",
        providerResponse: "SMS sent successfully (mock provider)",
        createdBy: storeUser._id,
        createdAt: twoDaysAgo,
        updatedAt: twoDaysAgo,
      },
      {
        userId: customer3._id,
        text: "Special offer just for you! 20% off all accessories this weekend. Don't miss out!",
        providerResponse: "SMS sent successfully (mock provider)",
        createdBy: storeUser._id,
        createdAt: oneWeekAgo,
        updatedAt: oneWeekAgo,
      },

      // Admin SMS to customers
      {
        userId: customer1._id,
        text: "System maintenance scheduled for tonight 2-4 AM. Our services will be temporarily unavailable.",
        providerResponse: "SMS sent successfully (admin - no balance deducted)",
        createdBy: adminUser._id,
        createdAt: oneDayAgo,
        updatedAt: oneDayAgo,
      },
      {
        userId: customer2._id,
        text: "Thank you for being a valued customer! Your feedback helps us improve our services.",
        providerResponse: "SMS sent successfully (admin - no balance deducted)",
        createdBy: adminUser._id,
        createdAt: twoDaysAgo,
        updatedAt: twoDaysAgo,
      },

      // Promotional SMS
      {
        userId: customer3._id,
        text: "Flash sale alert! 50% off selected items for the next 2 hours. Shop now!",
        providerResponse: "SMS sent successfully (mock provider)",
        createdBy: storeUser._id,
        createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
        updatedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
      },
      {
        userId: customer1._id,
        text: "Your order #12345 has been shipped! Track your package with tracking number: TRK789456123",
        providerResponse: "SMS sent successfully (mock provider)",
        createdBy: storeUser._id,
        createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000), // 6 hours ago
        updatedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
      },

      // Customer service SMS
      {
        userId: customer2._id,
        text: "We received your inquiry about our return policy. Our customer service team will contact you within 24 hours.",
        providerResponse: "SMS sent successfully (mock provider)",
        createdBy: storeUser._id,
        createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000), // 12 hours ago
        updatedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000),
      },

      // Birthday/Anniversary SMS
      {
        userId: customer3._id,
        text: "Happy Birthday! 🎉 Enjoy a special 25% discount on your birthday purchase. Valid until end of month.",
        providerResponse: "SMS sent successfully (mock provider)",
        createdBy: storeUser._id,
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      },

      // System notification
      {
        userId: customer1._id,
        text: "Your account security has been updated. If you didn't make this change, please contact support immediately.",
        providerResponse: "SMS sent successfully (admin - no balance deducted)",
        createdBy: adminUser._id,
        createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
        updatedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      },
    ];
  }

  protected getData(): any[] {
    return this.data;
  }
}
