import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AdminsService } from './admins.service';
import { CreateAdminDto, UpdateAdminDto, AdminResponseDto } from '../dto';

@ApiTags('admins')
@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new admin' })
  @ApiResponse({ 
    status: 201, 
    description: 'Admin created successfully',
    type: AdminResponseDto 
  })
  @ApiResponse({ status: 409, description: 'Admin with this phone number already exists' })
  async create(@Body() createAdminDto: CreateAdminDto): Promise<AdminResponseDto> {
    return this.adminsService.create(createAdminDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all admins' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all admins',
    type: [AdminResponseDto] 
  })
  async findAll(): Promise<AdminResponseDto[]> {
    return this.adminsService.findAll();
  }

  @Get('permission/:permission')
  @ApiOperation({ summary: 'Get admins by permission' })
  @ApiParam({ 
    name: 'permission', 
    description: 'Permission type',
    enum: ['manage_stores', 'view_reports', 'run_lottery', 'manage_users']
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of admins with the specified permission',
    type: [AdminResponseDto] 
  })
  async findByPermission(
    @Param('permission') permission: 'manage_stores' | 'view_reports' | 'run_lottery' | 'manage_users'
  ): Promise<AdminResponseDto[]> {
    return this.adminsService.findByPermission(permission);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get admin by ID' })
  @ApiParam({ name: 'id', description: 'Admin ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Admin found',
    type: AdminResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  async findOne(@Param('id') id: string): Promise<AdminResponseDto> {
    return this.adminsService.findOne(id);
  }

  @Get(':id/has-permission/:permission')
  @ApiOperation({ summary: 'Check if admin has specific permission' })
  @ApiParam({ name: 'id', description: 'Admin ID' })
  @ApiParam({ 
    name: 'permission', 
    description: 'Permission to check',
    enum: ['manage_stores', 'view_reports', 'run_lottery', 'manage_users']
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Permission check result',
    schema: { type: 'boolean' }
  })
  async hasPermission(
    @Param('id') id: string,
    @Param('permission') permission: 'manage_stores' | 'view_reports' | 'run_lottery' | 'manage_users'
  ): Promise<{ hasPermission: boolean }> {
    const hasPermission = await this.adminsService.hasPermission(id, permission);
    return { hasPermission };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update admin information' })
  @ApiParam({ name: 'id', description: 'Admin ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Admin updated successfully',
    type: AdminResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  async update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ): Promise<AdminResponseDto> {
    return this.adminsService.update(id, updateAdminDto);
  }

  @Patch(':id/permissions')
  @ApiOperation({ summary: 'Update admin permissions' })
  @ApiParam({ name: 'id', description: 'Admin ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Permissions updated successfully',
    type: AdminResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  async updatePermissions(
    @Param('id') id: string,
    @Body() body: { permissions: Array<'manage_stores' | 'view_reports' | 'run_lottery' | 'manage_users'> },
  ): Promise<AdminResponseDto> {
    return this.adminsService.updatePermissions(id, body.permissions);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete admin' })
  @ApiParam({ name: 'id', description: 'Admin ID' })
  @ApiResponse({ status: 200, description: 'Admin deleted successfully' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<void> {
    return this.adminsService.remove(id);
  }
}
