/**
 * API Types and Interfaces
 */

// Generic API Response wrapper
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
}

// Paginated response type
export interface PaginatedResponse<T = unknown> {
  data: T[];
  meta: {
    pagination: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      last_page: number;
      links: {
        next?: string;
        previous?: string;
      };
    };
    [key: string]: unknown;
  };
}

// Error response type
export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: unknown;
  timestamp?: string;
}

// Error notification type
export interface ErrorNotification extends ApiError {
  id: string;
  count: number; // How many times this error occurred
}

// Request configuration
export interface ApiRequestConfig {
  timeout?: number;
  retries?: number;
  cache?: boolean;
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
}

// HTTP methods
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

// Upload progress callback
export type UploadProgressCallback = (progress: number) => void;

// File upload configuration
export interface FileUploadConfig extends ApiRequestConfig {
  onProgress?: UploadProgressCallback;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
}
