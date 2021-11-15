export interface ApiResponse<T> {
  status: 'ok' | 'error';
  result?: T;
  message?: string;
}
