import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../../schemas/user.schema";
import { BaseSeeder } from "./base.seeder";

@Injectable()
export class UsersSeeder extends BaseSeeder<UserDocument> {
  constructor(@InjectModel(User.name) private usersModel: Model<UserDocument>) {
    super();
  }

  protected get model(): Model<UserDocument> {
    return this.usersModel;
  }

  protected get data(): any[] {
    return [
      // Required users with specific phone numbers for testing
      {
        phoneNumber: "09368024951",
        firstName: "Ali",
        lastName: "Sagheb",
        role: "admin",
      },
      {
        phoneNumber: "09387114120",
        firstName: "Saeid",
        lastName: "Kargaran",
        role: "store",
      },
      {
        phoneNumber: "09215501953",
        firstName: "Saza",
        lastName: "Miri",
        role: "store",
      },
      {
        phoneNumber: "09051455365",
        firstName: "مشتری",
        lastName: "تستی",
        role: "customer",
      },
    ];
  }

  protected getData(): any[] {
    return this.data;
  }
}
