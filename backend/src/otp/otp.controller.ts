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
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { OtpService } from "./otp.service";
import { CreateOtpDto, UpdateOtpDto, OtpResponseDto } from "../dto";

@ApiTags("otp")
@Controller("otp")
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post()
  @ApiOperation({ summary: "Create a new OTP" })
  @ApiResponse({
    status: 201,
    description: "OTP created successfully",
    type: OtpResponseDto,
  })
  async create(@Body() createOtpDto: CreateOtpDto): Promise<OtpResponseDto> {
    return this.otpService.create(createOtpDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all OTPs" })
  @ApiResponse({
    status: 200,
    description: "List of all OTPs",
    type: [OtpResponseDto],
  })
  async findAll(): Promise<OtpResponseDto[]> {
    return this.otpService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get OTP by ID" })
  @ApiParam({ name: "id", description: "OTP ID" })
  @ApiResponse({
    status: 200,
    description: "OTP found",
    type: OtpResponseDto,
  })
  @ApiResponse({ status: 404, description: "OTP not found" })
  async findOne(@Param("id") id: string): Promise<OtpResponseDto> {
    return this.otpService.findOne(id);
  }

  @Get("phone/:phoneNumber")
  @ApiOperation({ summary: "Get OTPs by phone number" })
  @ApiParam({ name: "phoneNumber", description: "Phone number" })
  @ApiResponse({
    status: 200,
    description: "List of OTPs for the phone number",
    type: [OtpResponseDto],
  })
  async findByPhoneNumber(
    @Param("phoneNumber") phoneNumber: string,
  ): Promise<OtpResponseDto[]> {
    return this.otpService.findByPhoneNumber(phoneNumber);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update OTP information" })
  @ApiParam({ name: "id", description: "OTP ID" })
  @ApiResponse({
    status: 200,
    description: "OTP updated successfully",
    type: OtpResponseDto,
  })
  @ApiResponse({ status: 404, description: "OTP not found" })
  async update(
    @Param("id") id: string,
    @Body() updateOtpDto: UpdateOtpDto,
  ): Promise<OtpResponseDto> {
    return this.otpService.update(id, updateOtpDto);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update OTP status" })
  @ApiParam({ name: "id", description: "OTP ID" })
  @ApiResponse({
    status: 200,
    description: "Status updated successfully",
    type: OtpResponseDto,
  })
  @ApiResponse({ status: 404, description: "OTP not found" })
  async updateStatus(
    @Param("id") id: string,
    @Body() body: { status: "sent" | "verified" | "expired" },
  ): Promise<OtpResponseDto> {
    return this.otpService.updateStatus(id, body.status);
  }

  @Post("verify")
  @ApiOperation({ summary: "Verify OTP" })
  @ApiResponse({
    status: 200,
    description: "OTP verified successfully",
    type: OtpResponseDto,
  })
  @ApiResponse({ status: 400, description: "Invalid or expired OTP" })
  async verifyOtp(
    @Body()
    body: {
      phoneNumber: string;
      code: string;
      context: "login" | "scratch";
    },
  ): Promise<OtpResponseDto> {
    return this.otpService.verifyOtp(body.phoneNumber, body.code, body.context);
  }

  @Post(":id/expire")
  @ApiOperation({ summary: "Expire OTP" })
  @ApiParam({ name: "id", description: "OTP ID" })
  @ApiResponse({
    status: 200,
    description: "OTP expired successfully",
    type: OtpResponseDto,
  })
  @ApiResponse({ status: 404, description: "OTP not found" })
  async expireOtp(@Param("id") id: string): Promise<OtpResponseDto> {
    return this.otpService.expireOtp(id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete OTP" })
  @ApiParam({ name: "id", description: "OTP ID" })
  @ApiResponse({ status: 200, description: "OTP deleted successfully" })
  @ApiResponse({ status: 404, description: "OTP not found" })
  @HttpCode(HttpStatus.OK)
  async remove(@Param("id") id: string): Promise<void> {
    return this.otpService.remove(id);
  }

  @Post("cleanup/expired")
  @ApiOperation({ summary: "Clean up expired OTPs" })
  @ApiResponse({
    status: 200,
    description: "Expired OTPs cleaned up successfully",
  })
  async cleanupExpiredOtps(): Promise<void> {
    return this.otpService.cleanupExpiredOtps();
  }
}
