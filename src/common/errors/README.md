# Error Handling System

This directory contains a comprehensive error handling system for the Loyalty Program API with Persian language support.

## Overview

The error handling system provides:
- **Persian error messages** for all common error scenarios
- **Custom exception classes** for different types of errors
- **Global exception filter** for consistent error responses
- **MongoDB error handling** integration
- **Structured error logging** with context

## File Structure

```
src/common/errors/
├── README.md                           # This documentation
├── index.ts                           # Export all error classes and constants
├── persian-error-messages.ts          # Persian error message definitions
├── custom-exceptions.ts               # Custom exception classes
├── error-handling.spec.ts            # Unit tests for error handling
└── ../filters/
    └── global-exception.filter.ts     # Global exception filter
```

## Persian Error Messages

All error messages are defined in `persian-error-messages.ts` and support Persian language requirements. The system uses a key-based approach where:

- **Generic messages** like "was not found" can be combined with entity names
- **Specific messages** like "User was not found" are pre-defined
- **Business logic messages** like "Insufficient loyalty points" are context-specific

### Example Usage

```typescript
import { PERSIAN_ERROR_MESSAGES } from '../common/errors';

// Generic message
const message = `Store ${PERSIAN_ERROR_MESSAGES.NOT_FOUND}`;
// Result: "Store was not found"

// Specific message
const userMessage = PERSIAN_ERROR_MESSAGES.USER_NOT_FOUND;
// Result: "User was not found"
```

## Custom Exception Classes

### Base Exception Classes

- **`CustomNotFoundException`** - For 404 errors with entity names
- **`CustomConflictException`** - For 409 conflicts with entity names
- **`CustomBadRequestException`** - For 400 validation errors
- **`CustomUnauthorizedException`** - For 401 authentication errors
- **`CustomForbiddenException`** - For 403 permission errors
- **`CustomInternalServerErrorException`** - For 500 server errors

### Entity-Specific Exceptions

- **`UserNotFoundException`** - User not found (404)
- **`StoreNotFoundException`** - Store not found (404)
- **`ScratchCardNotFoundException`** - Scratch card not found (404)
- **`TransactionNotFoundException`** - Transaction not found (404)
- **`AdminNotFoundException`** - Admin not found (404)
- **`OTPNotFoundException`** - OTP not found (404)

### Business Logic Exceptions

- **`InsufficientPointsException`** - User doesn't have enough points (400)
- **`ScratchCardAlreadyUsedException`** - Card already redeemed (409)
- **`ScratchCardExpiredException`** - Card has expired (400)
- **`InvalidOTPException`** - Invalid OTP code (400)
- **`OTPExpiredException`** - OTP has expired (400)
- **`StorePhoneExistsException`** - Store phone number conflict (409)

## Usage Examples

### In Services

```typescript
import { Injectable } from '@nestjs/common';
import { 
  UserNotFoundException, 
  CustomConflictException 
} from '../common/errors';

@Injectable()
export class UsersService {
  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({ 
      phoneNumber: createUserDto.phoneNumber 
    });
    
    if (existingUser) {
      throw new CustomConflictException('User', 'USER_ALREADY_EXISTS');
    }
    
    // ... rest of creation logic
  }
}
```

### Custom Entity Exceptions

```typescript
// For a new entity type
export class ProductNotFoundException extends CustomNotFoundException {
  constructor() {
    super('Product', 'PRODUCT_NOT_FOUND');
  }
}

// Usage
if (!product) {
  throw new ProductNotFoundException();
}
```

## Global Exception Filter

The `GlobalExceptionFilter` automatically handles all exceptions and provides:

- **Consistent error response format**
- **Automatic HTTP status codes**
- **MongoDB error handling**
- **Structured logging**
- **Development vs production error details**

### Error Response Format

```json
{
  "statusCode": 404,
  "timestamp": "2024-08-18T18:45:00.000Z",
  "path": "/api/users/123",
  "method": "GET",
  "message": "User was not found",
  "error": "Not Found",
  "details": {
    "code": "USER_NOT_FOUND"
  }
}
```

## Adding New Error Messages

1. **Add to Persian Error Messages**:
```typescript
export const PERSIAN_ERROR_MESSAGES = {
  // ... existing messages
  NEW_ERROR_TYPE: 'New error message in Persian',
} as const;
```

2. **Create Custom Exception** (if needed):
```typescript
export class NewErrorException extends BadRequestException {
  constructor() {
    super(PERSIAN_ERROR_MESSAGES.NEW_ERROR_TYPE);
  }
}
```

3. **Export from index.ts**:
```typescript
export * from './custom-exceptions';
```

## Testing

Run the error handling tests:

```bash
npm test -- src/common/errors/error-handling.spec.ts
```

## Best Practices

1. **Use specific exceptions** when possible (e.g., `UserNotFoundException` instead of generic `NotFoundException`)
2. **Combine entity names with generic messages** for flexibility
3. **Keep error messages clear and actionable** for Persian users
4. **Use appropriate HTTP status codes** for different error types
5. **Log errors with context** for debugging
6. **Test error scenarios** to ensure proper handling

## Integration with Controllers

The global exception filter automatically handles all exceptions thrown in controllers, so no additional error handling is needed in controller methods. Just throw the appropriate exception and the filter will handle the rest.

## Error Message Localization

The system is designed to support Persian language requirements. To add support for additional languages:

1. Create language-specific message files
2. Modify the exception classes to accept language parameters
3. Update the global exception filter to handle language selection

## Troubleshooting

### Common Issues

1. **Import errors**: Ensure you're importing from `../common/errors`
2. **Message not found**: Check that the error key exists in `persian-error-messages.ts`
3. **Status code mismatch**: Verify the exception class extends the correct base exception

### Debug Mode

In development, the global exception filter provides additional error details including stack traces. In production, sensitive information is automatically filtered out.
