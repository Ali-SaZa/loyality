# User Field Migration Guide

## Overview
This migration renames user fields from `firstname`/`lastname` to `firstName`/`lastName` to maintain consistency between frontend and backend, following JavaScript/TypeScript naming conventions.

## What Changed

### Backend Schema Updates
- **User Schema** (`src/schemas/user.schema.ts`): Updated field names
- **DTOs** (`src/dto/user.dto.ts`): Updated CreateUserDto, UpdateUserDto, and UserResponseDto
- **Controllers** (`src/users/users.controller.ts`): Updated response transformation
- **Services** (`src/auth/auth.service.ts`): Updated user object construction
- **Seeders** (`src/seeding/seeders/users.seeder.ts`): Updated sample data

### Database Migration
- **Migration Script**: `src/migrations/rename-user-fields.migration.ts`
- **Runner Script**: `scripts/run-migration.ts`
- **Package Script**: `npm run migrate:user-fields`

## Running the Migration

### Prerequisites
- MongoDB connection string set in `MONGODB_URI` environment variable
- Or MongoDB running locally on default port (27017)

### Steps
1. **Build the project** (if not already built):
   ```bash
   npm run build
   ```

2. **Run the migration**:
   ```bash
   npm run migrate:user-fields
   ```

3. **Verify the migration**:
   The script will output verification counts showing how many documents were updated.

### Rollback (if needed)
If you need to rollback the migration, you can modify the migration script to call `rollbackUserFields(db)` instead of `renameUserFields(db)`.

## What the Migration Does

1. **Finds all user documents** that have `firstname` or `lastname` fields
2. **Creates new fields** `firstName` and `lastName` with the same values
3. **Removes old fields** `firstname` and `lastname`
4. **Verifies the migration** by counting documents with old vs. new fields

## Impact

### Before Migration
- Frontend sends: `firstName`, `lastName`
- Backend expects: `firstname`, `lastname`
- Result: Data loss, API errors

### After Migration
- Frontend sends: `firstName`, `lastName`
- Backend expects: `firstName`, `lastName`
- Result: Perfect data flow, no API errors

## Testing

After running the migration:

1. **Restart your backend server** to ensure all changes are loaded
2. **Test user creation/update** through your API endpoints
3. **Verify data persistence** in MongoDB
4. **Check frontend integration** to ensure no errors

## Notes

- **Existing data**: All existing user data will be preserved and migrated
- **Downtime**: Minimal - only during the migration execution
- **Reversibility**: Migration can be rolled back if needed
- **Performance**: Migration uses MongoDB's efficient update operations

## Troubleshooting

### Common Issues

1. **Connection Error**: Ensure MongoDB is running and accessible
2. **Permission Error**: Ensure database user has write permissions
3. **Field Already Exists**: Migration will handle duplicate fields gracefully

### Logs
The migration script provides detailed logging. Check the console output for any errors or warnings.

## Support

If you encounter issues during migration:
1. Check the migration logs for specific error messages
2. Verify MongoDB connection and permissions
3. Ensure all backend code changes are deployed before running migration
