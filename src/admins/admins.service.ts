import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from '../schemas/admin.schema';
import { CreateAdminDto, UpdateAdminDto, AdminResponseDto } from '../dto';

@Injectable()
export class AdminsService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
  ) {}

  private transformAdminToResponse(admin: AdminDocument): AdminResponseDto {
    return {
      id: admin._id.toString(),
      phoneNumber: admin.phoneNumber,
      name: admin.name,
      role: admin.role,
      permissions: admin.permissions,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    };
  }

  async create(createAdminDto: CreateAdminDto): Promise<AdminResponseDto> {
    // Check if admin with same phone number already exists
    const existingAdmin = await this.adminModel.findOne({
      phoneNumber: createAdminDto.phoneNumber,
    });
    
    if (existingAdmin) {
      throw new ConflictException('Admin with this phone number already exists');
    }

    const admin = new this.adminModel(createAdminDto);
    const savedAdmin = await admin.save();
    return this.transformAdminToResponse(savedAdmin);
  }

  async findAll(): Promise<AdminResponseDto[]> {
    const admins = await this.adminModel.find().exec();
    return admins.map(admin => this.transformAdminToResponse(admin));
  }

  async findOne(id: string): Promise<AdminResponseDto> {
    const admin = await this.adminModel.findById(id).exec();
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }
    return this.transformAdminToResponse(admin);
  }

  async findByPhoneNumber(phoneNumber: string): Promise<AdminResponseDto | null> {
    const admin = await this.adminModel.findOne({ phoneNumber }).exec();
    return admin ? this.transformAdminToResponse(admin) : null;
  }

  async update(id: string, updateAdminDto: UpdateAdminDto): Promise<AdminResponseDto> {
    const admin = await this.adminModel
      .findByIdAndUpdate(id, updateAdminDto, { new: true })
      .exec();
    
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }
    
    return this.transformAdminToResponse(admin);
  }

  async updatePermissions(id: string, permissions: Array<'manage_stores' | 'view_reports' | 'run_lottery' | 'manage_users'>): Promise<AdminResponseDto> {
    const admin = await this.adminModel
      .findByIdAndUpdate(id, { permissions }, { new: true })
      .exec();
    
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }
    
    return this.transformAdminToResponse(admin);
  }

  async remove(id: string): Promise<void> {
    const result = await this.adminModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Admin not found');
    }
  }

  async hasPermission(adminId: string, permission: 'manage_stores' | 'view_reports' | 'run_lottery' | 'manage_users'): Promise<boolean> {
    const admin = await this.adminModel.findById(adminId).exec();
    if (!admin) {
      return false;
    }
    return admin.permissions.includes(permission);
  }

  async findByPermission(permission: 'manage_stores' | 'view_reports' | 'run_lottery' | 'manage_users'): Promise<AdminResponseDto[]> {
    const admins = await this.adminModel.find({ permissions: permission }).exec();
    return admins.map(admin => this.transformAdminToResponse(admin));
  }
}
