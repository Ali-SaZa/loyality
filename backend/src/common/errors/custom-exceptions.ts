import { 
  NotFoundException, 
  ConflictException, 
  BadRequestException, 
  UnauthorizedException, 
  ForbiddenException, 
  InternalServerErrorException 
} from '@nestjs/common';
import { PERSIAN_ERROR_MESSAGES, ErrorMessageKey } from './persian-error-messages';

export class CustomNotFoundException extends NotFoundException {
  constructor(entity: string, messageKey: ErrorMessageKey = 'NOT_FOUND') {
    const message = `${entity} ${PERSIAN_ERROR_MESSAGES[messageKey]}`;
    super(message);
  }
}

export class CustomConflictException extends ConflictException {
  constructor(entity: string, messageKey: ErrorMessageKey = 'ALREADY_EXISTS') {
    const message = `${entity} ${PERSIAN_ERROR_MESSAGES[messageKey]}`;
    super(message);
  }
}

export class CustomBadRequestException extends BadRequestException {
  constructor(messageKey: ErrorMessageKey = 'BAD_REQUEST', customMessage?: string) {
    const message = customMessage || PERSIAN_ERROR_MESSAGES[messageKey];
    super(message);
  }
}

export class CustomUnauthorizedException extends UnauthorizedException {
  constructor(messageKey: ErrorMessageKey = 'UNAUTHORIZED') {
    super(PERSIAN_ERROR_MESSAGES[messageKey]);
  }
}

export class CustomForbiddenException extends ForbiddenException {
  constructor(messageKey: ErrorMessageKey = 'FORBIDDEN') {
    super(PERSIAN_ERROR_MESSAGES[messageKey]);
  }
}

export class CustomInternalServerErrorException extends InternalServerErrorException {
  constructor(messageKey: ErrorMessageKey = 'INTERNAL_SERVER_ERROR') {
    super(PERSIAN_ERROR_MESSAGES[messageKey]);
  }
}

// Specific entity exceptions
export class UserNotFoundException extends CustomNotFoundException {
  constructor() {
    super('User', 'USER_NOT_FOUND');
  }
}

export class StoreNotFoundException extends CustomNotFoundException {
  constructor() {
    super('Store', 'STORE_NOT_FOUND');
  }
}

export class ScratchCardNotFoundException extends CustomNotFoundException {
  constructor() {
    super('Scratch card', 'SCRATCH_CARD_NOT_FOUND');
  }
}

export class TransactionNotFoundException extends CustomNotFoundException {
  constructor() {
    super('Transaction', 'TRANSACTION_NOT_FOUND');
  }
}

export class AdminNotFoundException extends CustomNotFoundException {
  constructor() {
    super('Admin', 'ADMIN_NOT_FOUND');
  }
}

export class OTPNotFoundException extends CustomNotFoundException {
  constructor() {
    super('OTP', 'OTP_NOT_FOUND');
  }
}

// Business logic exceptions
export class InsufficientPointsException extends BadRequestException {
  constructor() {
    super(PERSIAN_ERROR_MESSAGES.INSUFFICIENT_POINTS);
  }
}

export class ScratchCardAlreadyUsedException extends ConflictException {
  constructor() {
    super(PERSIAN_ERROR_MESSAGES.SCRATCH_CARD_ALREADY_USED);
  }
}

export class ScratchCardExpiredException extends BadRequestException {
  constructor() {
    super(PERSIAN_ERROR_MESSAGES.SCRATCH_CARD_EXPIRED);
  }
}

export class InvalidOTPException extends BadRequestException {
  constructor() {
    super(PERSIAN_ERROR_MESSAGES.INVALID_OTP);
  }
}

export class OTPExpiredException extends BadRequestException {
  constructor() {
    super(PERSIAN_ERROR_MESSAGES.OTP_EXPIRED);
  }
}

export class StorePhoneExistsException extends ConflictException {
  constructor() {
    super(PERSIAN_ERROR_MESSAGES.STORE_PHONE_EXISTS);
  }
}
