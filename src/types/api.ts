
// API Response type
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  status: number;
  statusText: string;
}
