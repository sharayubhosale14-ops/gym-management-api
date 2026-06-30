export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  timestamp: string;
  path: string;
  method: string;
}

export interface ResponseMetadata {
  message?: string;
}
