import { Test, TestingModule } from "@nestjs/testing";
import {
  CustomNotFoundException,
  CustomConflictException,
  CustomBadRequestException,
  StoreNotFoundException,
  UserNotFoundException,
  AdminNotFoundException,
  OTPNotFoundException,
  InsufficientPointsException,
  InvalidOTPException,
  OTPExpiredException,
  StorePhoneExistsException,
} from "./custom-exceptions";
import { PERSIAN_ERROR_MESSAGES } from "./persian-error-messages";

describe("Custom Exceptions", () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({}).compile();
  });

  afterEach(async () => {
    await module.close();
  });

  describe("CustomNotFoundException", () => {
    it("should create custom not found exception with entity name", () => {
      const exception = new CustomNotFoundException("Store", "NOT_FOUND");
      expect(exception.message).toBe(
        `Store ${PERSIAN_ERROR_MESSAGES.NOT_FOUND}`,
      );
      expect(exception.getStatus()).toBe(404);
    });

    it("should use default NOT_FOUND message when not specified", () => {
      const exception = new CustomNotFoundException("User");
      expect(exception.message).toBe(
        `User ${PERSIAN_ERROR_MESSAGES.NOT_FOUND}`,
      );
      expect(exception.getStatus()).toBe(404);
    });
  });

  describe("CustomConflictException", () => {
    it("should create custom conflict exception with entity name", () => {
      const exception = new CustomConflictException(
        "User",
        "USER_ALREADY_EXISTS",
      );
      expect(exception.message).toBe(
        `User ${PERSIAN_ERROR_MESSAGES.USER_ALREADY_EXISTS}`,
      );
      expect(exception.getStatus()).toBe(409);
    });

    it("should use default ALREADY_EXISTS message when not specified", () => {
      const exception = new CustomConflictException("Store");
      expect(exception.message).toBe(
        `Store ${PERSIAN_ERROR_MESSAGES.ALREADY_EXISTS}`,
      );
      expect(exception.getStatus()).toBe(409);
    });
  });

  describe("CustomBadRequestException", () => {
    it("should create custom bad request exception with default message", () => {
      const exception = new CustomBadRequestException("BAD_REQUEST");
      expect(exception.message).toBe(PERSIAN_ERROR_MESSAGES.BAD_REQUEST);
      expect(exception.getStatus()).toBe(400);
    });

    it("should create custom bad request exception with custom message", () => {
      const customMessage =
        "Please wait 45 seconds before requesting another OTP code";
      const exception = new CustomBadRequestException(
        "OTP_ALREADY_SENT",
        customMessage,
      );
      expect(exception.message).toBe(customMessage);
      expect(exception.getStatus()).toBe(400);
    });
  });

  describe("Entity-specific exceptions", () => {
    it("should create StoreNotFoundException with correct message", () => {
      const exception = new StoreNotFoundException();
      expect(exception.message).toBe(
        `Store ${PERSIAN_ERROR_MESSAGES.STORE_NOT_FOUND}`,
      );
      expect(exception.getStatus()).toBe(404);
    });

    it("should create UserNotFoundException with correct message", () => {
      const exception = new UserNotFoundException();
      expect(exception.message).toBe(
        `User ${PERSIAN_ERROR_MESSAGES.USER_NOT_FOUND}`,
      );
      expect(exception.getStatus()).toBe(404);
    });

    it("should create AdminNotFoundException with correct message", () => {
      const exception = new AdminNotFoundException();
      expect(exception.message).toBe(
        `Admin ${PERSIAN_ERROR_MESSAGES.ADMIN_NOT_FOUND}`,
      );
      expect(exception.getStatus()).toBe(404);
    });

    it("should create OTPNotFoundException with correct message", () => {
      const exception = new OTPNotFoundException();
      expect(exception.message).toBe(
        `OTP ${PERSIAN_ERROR_MESSAGES.OTP_NOT_FOUND}`,
      );
      expect(exception.getStatus()).toBe(404);
    });
  });

  describe("Business logic exceptions", () => {
    it("should create InsufficientPointsException with correct message", () => {
      const exception = new InsufficientPointsException();
      expect(exception.message).toBe(
        PERSIAN_ERROR_MESSAGES.INSUFFICIENT_POINTS,
      );
      expect(exception.getStatus()).toBe(400);
    });

    it("should create InvalidOTPException with correct message", () => {
      const exception = new InvalidOTPException();
      expect(exception.message).toBe(PERSIAN_ERROR_MESSAGES.INVALID_OTP);
      expect(exception.getStatus()).toBe(400);
    });

    it("should create OTPExpiredException with correct message", () => {
      const exception = new OTPExpiredException();
      expect(exception.message).toBe(PERSIAN_ERROR_MESSAGES.OTP_EXPIRED);
      expect(exception.getStatus()).toBe(400);
    });

    it("should create StorePhoneExistsException with correct message", () => {
      const exception = new StorePhoneExistsException();
      expect(exception.message).toBe(PERSIAN_ERROR_MESSAGES.STORE_PHONE_EXISTS);
      expect(exception.getStatus()).toBe(409);
    });
  });
});

describe("Persian Error Messages", () => {
  it("should contain all required error message keys", () => {
    const requiredKeys = [
      "NOT_FOUND",
      "ALREADY_EXISTS",
      "USER_NOT_FOUND",
      "STORE_NOT_FOUND",

      "ADMIN_NOT_FOUND",
      "OTP_NOT_FOUND",
      "INSUFFICIENT_POINTS",

      "INVALID_OTP",
      "OTP_EXPIRED",
      "STORE_PHONE_EXISTS",
    ];

    requiredKeys.forEach((key) => {
      expect(PERSIAN_ERROR_MESSAGES).toHaveProperty(key);
      expect(
        PERSIAN_ERROR_MESSAGES[key as keyof typeof PERSIAN_ERROR_MESSAGES],
      ).toBeTruthy();
    });
  });

  it("should have meaningful error messages", () => {
    expect(PERSIAN_ERROR_MESSAGES.NOT_FOUND).toBe("یافت نشد");
    expect(PERSIAN_ERROR_MESSAGES.ALREADY_EXISTS).toBe("قبلاً وجود دارد");
    expect(PERSIAN_ERROR_MESSAGES.USER_NOT_FOUND).toBe("کاربر یافت نشد");
    expect(PERSIAN_ERROR_MESSAGES.STORE_NOT_FOUND).toBe("فروشگاه یافت نشد");
  });
});
