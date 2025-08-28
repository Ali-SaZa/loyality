# Generic List Architecture

This document describes the architecture for implementing paginated, sortable, and filterable list endpoints across all entities in the application.

## Overview

The architecture provides a single, reusable service pattern that handles:
- **Pagination**: Page-based navigation with configurable page sizes
- **Sorting**: Multi-field sorting with direction control
- **Filtering**: Dynamic filtering on any field with various operators
- **Search**: Text search across multiple fields
- **Role-based Access Control**: Automatic filtering based on user permissions

## Architecture Components

### 1. GenericListService (Base Class)
Located at: `src/common/services/generic-list.service.ts`

This is an abstract base class that provides:
- Standardized list operations
- Built-in pagination logic
- Dynamic query building
- Performance optimizations (parallel queries, lean documents)

### 2. QueryBuilder (Utility)
Located at: `src/common/utils/query-builder.ts`

Handles the construction of MongoDB queries from request parameters:
- Filter query building
- Sort query building
- Search query building
- Pagination calculations

### 3. Standardized DTOs
Located at: `src/common/dto/list.dto.ts`

Provides consistent request/response structures:
- `ListRequestDto`: Standard request parameters
- `ListResponseDto<T>`: Standardized response wrapper
- `SortDto`: Sorting configuration
- `FilterDto`: Filtering configuration

## Usage Examples

### Basic Implementation

```typescript
@Injectable()
export class YourEntityService extends GenericListService<YourEntityDocument> {
  constructor(
    @InjectModel(YourEntity.name) private yourEntityModel: Model<YourEntityDocument>,
  ) {
    super(yourEntityModel);
  }

  // Optional: Override findAll for custom logic
  async findAll(request: ListRequestDto, additionalFilters: any = {}): Promise<ListResponseDto<YourEntityDocument>> {
    // Add custom filters here
    if (additionalFilters.someCondition) {
      additionalFilters['customField'] = 'customValue';
    }

    return super.findAll(request, additionalFilters);
  }
}
```

### Controller Implementation

```typescript
@Controller('your-entity')
export class YourEntityController {
  constructor(private readonly yourEntityService: YourEntityService) {}

  @Get()
  async findAll(
    @Query() listRequest: ListRequestDto,
    @CurrentUser() currentUser: any
  ): Promise<ListResponseDto<YourEntityResponseDto>> {
    const response = await this.yourEntityService.findAll(listRequest, { 
      requestingUser: currentUser 
    });
    
    // Transform the response data
    const transformedData = response.data.map(item => this.transformToResponse(item));
    
    return {
      ...response,
      data: transformedData
    };
  }

  @Get('filter-options')
  async getFilterOptions() {
    return this.yourEntityService.getFilterOptions();
  }
}
```

## Request Parameters

### Pagination
```typescript
{
  "page": 1,        // Page number (1-based)
  "limit": 20       // Items per page (1-100)
}
```

### Sorting
```typescript
{
  "sort": [
    { "field": "createdAt", "direction": "desc" },
    { "field": "name", "direction": "asc" }
  ]
}
```

### Filtering
```typescript
{
  "filters": [
    { "field": "status", "operator": "eq", "value": "active" },
    { "field": "createdAt", "operator": "gte", "value": "2024-01-01" },
    { "field": "role", "operator": "in", "value": ["admin", "user"] }
  ]
}
```

### Search
```typescript
{
  "search": "john",
  "searchFields": ["firstName", "lastName", "email"]
}
```

## Available Filter Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `eq` | Equal | `{ "field": "status", "operator": "eq", "value": "active" }` |
| `ne` | Not equal | `{ "field": "status", "operator": "ne", "value": "deleted" }` |
| `gt` | Greater than | `{ "field": "age", "operator": "gt", "value": 18 }` |
| `gte` | Greater than or equal | `{ "field": "age", "operator": "gte", "value": 18 }` |
| `lt` | Less than | `{ "field": "age", "operator": "lt", "value": 65 }` |
| `lte` | Less than or equal | `{ "field": "age", "operator": "lte", "value": 65 }` |
| `in` | In array | `{ "field": "role", "operator": "in", "value": ["admin", "user"] }` |
| `nin` | Not in array | `{ "field": "role", "operator": "nin", "value": ["deleted"] }` |
| `regex` | Regular expression | `{ "field": "name", "operator": "regex", "value": "john" }` |

## Response Structure

```typescript
{
  "data": [...],           // Array of items
  "total": 150,            // Total count
  "page": 1,               // Current page
  "limit": 20,             // Items per page
  "totalPages": 8,         // Total pages
  "hasNextPage": true,     // Has next page
  "hasPrevPage": false,    // Has previous page
  "appliedFilters": {      // Applied filters for reference
    "search": "john",
    "searchFields": ["firstName", "lastName"],
    "sort": [...],
    "filters": [...]
  }
}
```

## Performance Features

1. **Parallel Queries**: Count and data queries run simultaneously
2. **Lean Documents**: Uses `lean()` for better performance when full Mongoose documents aren't needed
3. **Indexed Queries**: Proper use of MongoDB indexes for sorting and filtering
4. **Query Optimization**: Efficient query building with minimal database calls

## Security Features

1. **Role-based Filtering**: Automatic filtering based on user permissions
2. **Input Validation**: Comprehensive validation of all input parameters
3. **Query Injection Protection**: Safe query building without injection vulnerabilities
4. **Access Control**: Built-in permission checking

## Best Practices

### 1. Always Override findAll for Custom Logic
```typescript
async findAll(request: ListRequestDto, additionalFilters: any = {}): Promise<ListResponseDto<YourEntityDocument>> {
  // Add your custom filters here
  if (additionalFilters.requestingUser?.role === 'store') {
    additionalFilters['storeId'] = additionalFilters.requestingUser.storeId;
  }

  return super.findAll(request, additionalFilters);
}
```

### 2. Use Filter Options for Frontend
```typescript
@Get('filter-options')
async getFilterOptions() {
  return this.yourEntityService.getFilterOptions();
}
```

### 3. Transform Response Data
```typescript
const response = await this.yourEntityService.findAll(listRequest, additionalFilters);
const transformedData = response.data.map(item => this.transformToResponse(item));

return {
  ...response,
  data: transformedData
};
```

### 4. Handle Role-based Access
```typescript
// In your service
if (additionalFilters.requestingUser?.role === 'store') {
  additionalFilters['storeId'] = additionalFilters.requestingUser.storeId;
}
```

## Migration Guide

### From Simple findAll to GenericListService

**Before:**
```typescript
async findAll(): Promise<YourEntity[]> {
  return this.yourEntityModel.find().exec();
}
```

**After:**
```typescript
// Extend GenericListService
export class YourEntityService extends GenericListService<YourEntityDocument> {
  constructor(
    @InjectModel(YourEntity.name) private yourEntityModel: Model<YourEntityDocument>,
  ) {
    super(yourEntityModel);
  }
}

// Update controller
async findAll(
  @Query() listRequest: ListRequestDto,
  @CurrentUser() currentUser: any
): Promise<ListResponseDto<YourEntityResponseDto>> {
  const response = await this.yourEntityService.findAll(listRequest, { 
    requestingUser: currentUser 
  });
  
  const transformedData = response.data.map(item => this.transformToResponse(item));
  
  return {
    ...response,
    data: transformedData
  };
}
```

## Testing

### Unit Tests
```typescript
describe('YourEntityService', () => {
  it('should return paginated results', async () => {
    const request: ListRequestDto = {
      page: 1,
      limit: 10,
      sort: [{ field: 'createdAt', direction: 'desc' }]
    };

    const result = await service.findAll(request);
    
    expect(result.data).toHaveLength(10);
    expect(result.total).toBeGreaterThan(0);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
  });
});
```

### Integration Tests
```typescript
describe('YourEntityController (e2e)', () => {
  it('should handle pagination parameters', async () => {
    const response = await request(app.getHttpServer())
      .get('/your-entity?page=2&limit=5')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body.page).toBe(2);
    expect(response.body.limit).toBe(5);
    expect(response.body.data).toHaveLength(5);
  });
});
```

## Troubleshooting

### Common Issues

1. **Type Errors**: Ensure your entity extends `Document` from Mongoose
2. **Performance Issues**: Check if you have proper indexes on sorted/filtered fields
3. **Permission Errors**: Verify role-based filtering is implemented correctly
4. **Validation Errors**: Check that all required DTO fields are properly decorated

### Debug Tips

1. **Log Queries**: Add logging to see generated MongoDB queries
2. **Check Indexes**: Use MongoDB explain() to verify query performance
3. **Validate Input**: Ensure all request parameters are properly validated
4. **Test Permissions**: Verify role-based filtering works as expected

## Future Enhancements

1. **Caching**: Add Redis caching for frequently accessed lists
2. **Real-time Updates**: WebSocket support for live data updates
3. **Advanced Aggregations**: Support for complex aggregation pipelines
4. **Export Functionality**: CSV/Excel export for list data
5. **Audit Logging**: Track all list operations for compliance
