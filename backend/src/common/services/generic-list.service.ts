import { Injectable, Type } from '@nestjs/common';
import { Model, Document, FilterQuery } from 'mongoose';
import { ListRequestDto, ListResponseDto } from '../dto/list.dto';
import { QueryBuilder } from '../utils/query-builder';

export interface IGenericListService<T extends Document> {
  findAll(request: ListRequestDto, additionalFilters?: FilterQuery<T>): Promise<ListResponseDto<T>>;
  findByIds(ids: string[]): Promise<T[]>;
  count(additionalFilters?: FilterQuery<T>): Promise<number>;
}

@Injectable()
export abstract class GenericListService<T extends Document> implements IGenericListService<T> {
  constructor(protected readonly model: Model<T>) {}

  /**
   * Find all documents with pagination, sorting, and filtering
   */
  async findAll(
    request: ListRequestDto, 
    additionalFilters: FilterQuery<T> = {}
  ): Promise<ListResponseDto<T>> {
    const page = request.page || 1;
    const limit = request.limit || 20;

    // Build filter query
    const filterQuery = QueryBuilder.buildFilterQuery<T>(request, additionalFilters);
    
    // Build query options
    const queryOptions = QueryBuilder.buildQueryOptions(request);

    // Execute queries in parallel for better performance
    const [data, total] = await Promise.all([
      this.model
        .find(filterQuery)
        .sort(queryOptions.sort)
        .skip(queryOptions.skip)
        .limit(queryOptions.limit)
        .lean()
        .exec(),
      this.model.countDocuments(filterQuery).exec()
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      data,
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
        filters: request.filters
      }
    };
  }

  /**
   * Find documents by their IDs
   */
  async findByIds(ids: string[]): Promise<T[]> {
    if (!ids.length) return [];
    
    return this.model
      .find({ _id: { $in: ids } })
      .lean()
      .exec();
  }

  /**
   * Count documents matching the filter
   */
  async count(additionalFilters: FilterQuery<T> = {}): Promise<number> {
    return this.model.countDocuments(additionalFilters).exec();
  }

  /**
   * Get distinct values for a field (useful for filter dropdowns)
   */
  async getDistinctValues(field: string, additionalFilters: FilterQuery<T> = {}): Promise<any[]> {
    return this.model.distinct(field, additionalFilters).exec();
  }

  /**
   * Get aggregation results (useful for statistics, charts, etc.)
   */
  async aggregate(pipeline: any[]): Promise<any[]> {
    return this.model.aggregate(pipeline).exec();
  }

  /**
   * Build a simple search query across multiple fields
   */
  protected buildSimpleSearchQuery(searchTerm: string, searchFields: string[]): FilterQuery<T> {
    if (!searchTerm || !searchFields.length) return {};

    const searchQueries = searchFields.map(field => ({
      [field]: { $regex: searchTerm, $options: 'i' }
    }));

    return { $or: searchQueries };
  }

  /**
   * Validate if a field exists in the schema (optional safety check)
   */
  protected isValidField(field: string): boolean {
    try {
      // This is a basic check - you might want to implement more sophisticated validation
      return field && typeof field === 'string' && field.trim().length > 0;
    } catch {
      return false;
    }
  }
}
