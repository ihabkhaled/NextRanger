/**
 * Standard shapes for backend-driven pagination. Large datasets paginate
 * server-side — client code never filters big lists in memory.
 */
export interface PaginationParams {
  readonly page: number;
  readonly pageSize: number;
}

/** Catalog-derived public API. @public */
export interface PaginatedResult<TItem> {
  readonly items: readonly TItem[];
  readonly totalCount: number;
  readonly page: number;
  readonly pageSize: number;
}
