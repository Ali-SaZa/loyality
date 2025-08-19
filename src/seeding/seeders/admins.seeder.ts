import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from '../../schemas/admin.schema';
import { BaseSeeder } from './base.seeder';

@Injectable()
export class AdminsSeeder extends BaseSeeder<AdminDocument> {
  constructor(
    @InjectModel(Admin.name) private adminsModel: Model<AdminDocument>
  ) {
    super();
  }

  protected get model(): Model<AdminDocument> {
    return this.adminsModel;
  }

  protected get data(): any[] {
    return [
      {
        phoneNumber: '09100000001',
        name: 'System Administrator',
        permissions: ['manage_stores', 'view_reports', 'run_lottery', 'manage_users']
      },
      {
        phoneNumber: '09100000002',
        name: 'Store Manager',
        permissions: ['manage_stores', 'view_reports']
      },
      {
        phoneNumber: '09100000003',
        name: 'User Manager',
        permissions: ['manage_users', 'view_reports']
      }
    ];
  }

  protected getData(): any[] {
    return this.data;
  }
}
