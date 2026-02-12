/**
 * Common types used across the application
 */

/** ISO 8601 date string (YYYY-MM-DD) */
export type ISODateString = string;

/** ISO 8601 datetime string (YYYY-MM-DDTHH:mm:ssZ) */
export type ISODateTimeString = string;

/** UUID string */
export type UUID = string;

/** Days of the week */
export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

/** Time of day periods */
export type TimeOfDay = 'morning' | 'afternoon' | 'evening';

/** Pagination parameters */
export interface PaginationParams {
  page: number;
  limit: number;
}

/** Paginated response wrapper */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/** API error response */
export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
  timestamp: ISODateTimeString;
  path: string;
}

/** Generic API response wrapper */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
