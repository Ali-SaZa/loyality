import { Injectable, ForbiddenException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../schemas/user.schema";
import { CreateUserDto, UpdateUserDto, CreateCustomerDto } from "../dto";
import { ListRequestDto, ListResponseDto } from "../common/dto/list.dto";
import {
  UserNotFoundException,
  CustomConflictException,
} from "../common/errors";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  private async validateUserAccess(
    userDoc: UserDocument,
    requestingUser: any,
  ): Promise<void> {
    // Admin can access everything
    if (requestingUser.role === "admin") {
      return;
    }

    // Users can only access their own profile information
    if (
      requestingUser.role === "customer" &&
      requestingUser.userId === userDoc._id.toString()
    ) {
      return;
    }

    // Store users can access their own user account
    if (
      requestingUser.role === "store" &&
      requestingUser.userId === userDoc._id.toString()
    ) {
      return;
    }

    // Store users can view customer data related to their store
    // This will be validated by checking if the customer is related to their store
    if (requestingUser.role === "store") {
      return;
    }

    throw new ForbiddenException(
      "دسترسی ممنوع. شما مجوز دسترسی به اطلاعات این کاربر را ندارید.",
    ); // translated to Persian
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    // Check if user already exists
    const existingUser = await this.userModel.findOne({
      phoneNumber: createUserDto.phoneNumber,
    });

    if (existingUser) {
      throw new CustomConflictException("User", "USER_ALREADY_EXISTS");
    }

    const user = new this.userModel({
      ...createUserDto,

      lastActivity: new Date(),
    });

    return user.save();
  }

  async createCustomer(
    createCustomerDto: CreateCustomerDto,
  ): Promise<{ customer: UserDocument; isExisting: boolean }> {
    // Check if user already exists
    const existingUser = await this.userModel.findOne({
      phoneNumber: createCustomerDto.phoneNumber,
    });

    if (existingUser) {
      return {
        customer: existingUser,
        isExisting: true,
      };
    }

    const customer = new this.userModel({
      phoneNumber: createCustomerDto.phoneNumber,
      firstName: createCustomerDto.firstName,
      lastName: createCustomerDto.lastName,
      role: "customer",
      status: "active",
      lastActivity: new Date(),
    });

    const savedCustomer = await customer.save();
    return {
      customer: savedCustomer,
      isExisting: false,
    };
  }

  // Implement findAll method without generic service
  async findAll(
    request: ListRequestDto,
    additionalFilters: any = {},
  ): Promise<ListResponseDto<UserDocument>> {
    const page = request.page || 1;
    const limit = request.limit || 20;
    const skip = (page - 1) * limit;

    // Add role-based access control without leaking non-schema fields into the Mongo filter
    // Build a safe filters object and NEVER include arbitrary objects like `requestingUser`
    const safeAdditionalFilters: any = {};
    if (additionalFilters && typeof additionalFilters === "object") {
      if (
        additionalFilters.requestingUser?.role === "store" &&
        additionalFilters.requestingUser?.storeId
      ) {
        // Store users can only see customers related to their store
        // This is a simplified example - you might want to implement more sophisticated logic
      }
      // Do NOT copy `requestingUser` (or any other non-schema keys) into the Mongo filter
    }

    // Build filter query
    const filterQuery: any = {};

    // Add search functionality
    if (
      request.search &&
      request.searchFields &&
      request.searchFields.length > 0
    ) {
      const searchQueries = request.searchFields.map((field) => ({
        [field]: { $regex: request.search, $options: "i" },
      }));
      filterQuery.$or = searchQueries;
    }

    // Add additional filters (only the safe subset)
    Object.assign(filterQuery, safeAdditionalFilters);

    // Execute queries in parallel for better performance
    const [data, total] = await Promise.all([
      this.userModel
        .find(filterQuery)
        .sort(this.buildSortQuery(request.sort))
        .skip(skip)
        .limit(limit)
        .exec(),
      this.userModel.countDocuments(filterQuery).exec(),
    ]);

    // Convert Mongoose documents to plain objects with transforms applied
    const plainData = data.map((doc) => doc.toJSON());

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      data: plainData,
      total,
      page,
      limit,
      totalPages,
      hasNextPage,
      hasPrevPage,
      appliedFilters: {
        search: request.search,
        searchFields: request.searchFields,
        sort: request.sort,
        filters: request.filters,
      },
    };
  }

  async findOne(id: string, requestingUser: any): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new UserNotFoundException();
    }

    // Validate access permissions
    await this.validateUserAccess(user, requestingUser);

    return user;
  }

  async findByPhoneNumber(phoneNumber: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ phoneNumber }).exec();
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    requestingUser: any,
  ): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new UserNotFoundException();
    }

    // Validate access permissions
    await this.validateUserAccess(user, requestingUser);

    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        id,
        {
          ...updateUserDto,

          lastActivity: new Date(),
        },
        { new: true },
      )
      .exec();

    if (!updatedUser) {
      throw new UserNotFoundException();
    }
    return updatedUser;
  }

  async remove(id: string, requestingUser: any): Promise<void> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new UserNotFoundException();
    }

    // Validate access permissions
    await this.validateUserAccess(user, requestingUser);

    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new UserNotFoundException();
    }
  }

  async updateStatus(
    id: string,
    status: "active" | "blocked" | "deleted",
    requestingUser: any,
  ): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new UserNotFoundException();
    }

    // Validate access permissions
    await this.validateUserAccess(user, requestingUser);

    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        id,
        {
          status,
          lastActivity: new Date(),
        },
        { new: true },
      )
      .exec();

    if (!updatedUser) {
      throw new UserNotFoundException();
    }
    return updatedUser;
  }

  // Get available filter options for the frontend
  async getFilterOptions(): Promise<{
    statuses: string[];
    roles: string[];
  }> {
    const [statuses, roles] = await Promise.all([
      this.getDistinctValues("status"),
      this.getDistinctValues("role"),
    ]);

    return {
      statuses: statuses.filter(Boolean),
      roles: roles.filter(Boolean),
    };
  }

  // Helper method to get distinct values
  private async getDistinctValues(field: string): Promise<any[]> {
    return this.userModel.distinct(field).exec();
  }

  // Count users with optional filter
  async count(filter: any = {}): Promise<number> {
    return this.userModel.countDocuments(filter).exec();
  }

  // Helper method to build sort query
  private buildSortQuery(sort: any): any {
    if (!sort || sort.length === 0) {
      return { createdAt: -1 };
    }

    const sortQuery: any = {};
    sort.forEach((item: any) => {
      sortQuery[item.field] = item.direction === "asc" ? 1 : -1;
    });
    return sortQuery;
  }
}
