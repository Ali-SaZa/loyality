import { FilterQuery, SortOrder } from "mongoose";
import { ListRequestDto, FilterDto, SortDto } from "../dto/list.dto";

export class QueryBuilder {
  /**
   * Builds a MongoDB filter query from the request parameters
   */
  static buildFilterQuery<T>(
    request: ListRequestDto,
    additionalFilters: FilterQuery<T> = {},
  ): FilterQuery<T> {
    const filterQuery: FilterQuery<T> = { ...additionalFilters };

    // Add search query if provided
    if (
      request.search &&
      request.searchFields &&
      request.searchFields.length > 0
    ) {
      const searchQuery = this.buildSearchQuery(
        request.search,
        request.searchFields,
      );
      if (searchQuery) {
        filterQuery.$or = searchQuery;
      }
    }

    // Add custom filters
    if (request.filters && request.filters.length > 0) {
      request.filters.forEach((filter) => {
        const fieldFilter = this.buildFieldFilter(filter);
        if (fieldFilter) {
          Object.assign(filterQuery, fieldFilter);
        }
      });
    }

    return filterQuery;
  }

  /**
   * Builds a search query using $or with $regex for text search
   */
  private static buildSearchQuery<T>(
    searchTerm: string,
    searchFields: string[],
  ): any[] | null {
    if (!searchTerm || !searchFields.length) return null;

    const searchQueries = searchFields.map((field) => ({
      [field]: { $regex: searchTerm, $options: "i" },
    }));

    return searchQueries;
  }

  /**
   * Builds a filter for a specific field based on the operator
   */
  private static buildFieldFilter(
    filter: FilterDto,
  ): Record<string, any> | null {
    const { field, operator, value } = filter;

    switch (operator) {
      case "eq":
        return { [field]: value };

      case "ne":
        return { [field]: { $ne: value } };

      case "gt":
        return { [field]: { $gt: value } };

      case "gte":
        return { [field]: { $gte: value } };

      case "lt":
        return { [field]: { $lt: value } };

      case "lte":
        return { [field]: { $lte: value } };

      case "in":
        return { [field]: { $in: Array.isArray(value) ? value : [value] } };

      case "nin":
        return { [field]: { $nin: Array.isArray(value) ? value : [value] } };

      case "regex":
        return { [field]: { $regex: value, $options: "i" } };

      default:
        return null;
    }
  }

  /**
   * Builds a MongoDB sort object from the sort parameters
   */
  static buildSortQuery(sort?: SortDto[]): Record<string, SortOrder> {
    if (!sort || !sort.length) {
      return { createdAt: -1 }; // Default sort by creation date descending
    }

    const sortQuery: Record<string, SortOrder> = {};

    sort.forEach((sortItem) => {
      const direction = sortItem.direction === "asc" ? 1 : -1;
      sortQuery[sortItem.field] = direction;
    });

    return sortQuery;
  }

  /**
   * Calculates pagination parameters
   */
  static calculatePagination(page: number, limit: number) {
    const skip = (page - 1) * limit;
    return { skip, limit };
  }

  /**
   * Builds the complete query options for MongoDB operations
   */
  static buildQueryOptions(request: ListRequestDto) {
    const { skip, limit } = this.calculatePagination(
      request.page || 1,
      request.limit || 20,
    );
    const sort = this.buildSortQuery(request.sort);

    return {
      skip,
      limit,
      sort,
      lean: true, // For better performance when you don't need Mongoose documents
    };
  }
}
