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
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, PurchaseDto, UserResponseDto } from '../dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private transformUserToResponse(user: any): UserResponseDto {
    return {
      id: user._id.toString(),
      phoneNumber: user.phoneNumber,
      name: user.name,
      totalPoints: user.totalPoints,
      purchases: user.purchases.map(purchase => ({
        storeId: purchase.storeId.toString(),
        amount: purchase.amount,
        date: purchase.date,
        scratchCode: purchase.scratchCode,
        entryMethod: purchase.entryMethod,
        rewardApplied: purchase.rewardApplied,
      })),
      consents: user.consents,
      role: user.role,
      lastActivity: user.lastActivity,
      tags: user.tags,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new customer user' })
  @ApiResponse({ 
    status: 201, 
    description: 'User created successfully',
    type: UserResponseDto 
  })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.create(createUserDto);
    return this.transformUserToResponse(user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all users',
    type: [UserResponseDto] 
  })
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersService.findAll();
    return users.map(user => this.transformUserToResponse(user));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'User found',
    type: UserResponseDto 
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.findOne(id);
    return this.transformUserToResponse(user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user information' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'User updated successfully',
    type: UserResponseDto 
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.update(id, updateUserDto);
    return this.transformUserToResponse(user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }

  @Post(':id/purchases')
  @ApiOperation({ summary: 'Add a purchase to user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Purchase added successfully',
    type: UserResponseDto 
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async addPurchase(
    @Param('id') id: string,
    @Body() purchaseDto: PurchaseDto,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.addPurchase(id, purchaseDto);
    return this.transformUserToResponse(user);
  }

  @Patch(':id/consents')
  @ApiOperation({ summary: 'Update user consent preferences' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Consents updated successfully',
    type: UserResponseDto 
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateConsents(
    @Param('id') id: string,
    @Body() consents: { dataCollection: boolean; marketing: boolean },
  ): Promise<UserResponseDto> {
    const user = await this.usersService.updateConsents(
      id,
      consents.dataCollection,
      consents.marketing,
    );
    return this.transformUserToResponse(user);
  }
}
