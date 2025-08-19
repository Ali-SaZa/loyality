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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { AdminsService } from './admins.service';
import { CreateAdminDto, UpdateAdminDto, AdminResponseDto } from '../dto';
import { AdminAuth } from '../common/security';

@ApiTags('admins')
@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post()
  @AdminAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new admin (Super Admin only)' })
  @ApiResponse({ 
    status: 201, 
    description: 'Admin created successfully',
    type: AdminResponseDto 
  })
  @ApiResponse({ status: 409, description: 'Admin with this phone number already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async create(@Body() createAdminDto: CreateAdminDto): Promise<AdminResponseDto> {
    return this.adminsService.create(createAdminDto);
  }

  @Get()
  @AdminAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all admins (Admin only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all admins',
    type: [AdminResponseDto] 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async findAll(): Promise<AdminResponseDto[]> {
    return this.adminsService.findAll();
  }

  @Get('permission/:permission')
  @AdminAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get admins by permission (Admin only)' })
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
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async findByPermission(
    @Param('permission') permission: 'manage_stores' | 'view_reports' | 'run_lottery' | 'manage_users'
  ): Promise<AdminResponseDto[]> {
    return this.adminsService.findByPermission(permission);
  }

  @Get(':id')
  @AdminAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get admin by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'Admin ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Admin found',
    type: AdminResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async findOne(@Param('id') id: string): Promise<AdminResponseDto> {
    return this.adminsService.findOne(id);
  }

  @Get(':id/has-permission/:permission')
  @AdminAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check if admin has specific permission (Admin only)' })
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
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async hasPermission(
    @Param('id') id: string,
    @Param('permission') permission: 'manage_stores' | 'view_reports' | 'run_lottery' | 'manage_users'
  ): Promise<{ hasPermission: boolean }> {
    const hasPermission = await this.adminsService.hasPermission(id, permission);
    return { hasPermission };
  }

  @Patch(':id')
  @AdminAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update admin information (Admin only)' })
  @ApiParam({ name: 'id', description: 'Admin ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Admin updated successfully',
    type: AdminResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ): Promise<AdminResponseDto> {
    return this.adminsService.update(id, updateAdminDto);
  }

  @Patch(':id/permissions')
  @AdminAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update admin permissions (Admin only)' })
  @ApiParam({ name: 'id', description: 'Admin ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Permissions updated successfully',
    type: AdminResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async updatePermissions(
    @Param('id') id: string,
    @Body() body: { permissions: Array<'manage_stores' | 'view_reports' | 'run_lottery' | 'manage_users'> },
  ): Promise<AdminResponseDto> {
    return this.adminsService.updatePermissions(id, body.permissions);
  }

  @Delete(':id')
  @AdminAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete admin (Admin only)' })
  @ApiParam({ name: 'id', description: 'Admin ID' })
  @ApiResponse({ status: 200, description: 'Admin deleted successfully' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<void> {
    return this.adminsService.remove(id);
  }
}
