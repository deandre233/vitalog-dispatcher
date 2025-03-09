import { type AIInsight } from '@/types/service-queue';

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export class APIClient {
  private baseUrl: string;

  constructor(baseUrl: string = import.meta.env.VITE_API_URL || '/api') {
    this.baseUrl = baseUrl;
  }

  async get<T>(path: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    try {
      return { data: null, error: null };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async post<T>(path: string, data?: any): Promise<ApiResponse<T>> {
    try {
      return { data: null, error: null };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async generateAIInsights(data: any): Promise<AIInsight[]> {
    return [
      {
        type: 'optimization',
        message: 'Route optimization available - potential 10% time savings',
        confidence: 0.85,
        impact: 'medium'
      },
      {
        type: 'warning',
        message: 'Traffic congestion on main route',
        confidence: 0.92,
        impact: 'high'
      },
      {
        type: 'prediction',
        message: 'Expected increase in service requests tomorrow',
        confidence: 0.78,
        impact: 'medium'
      }
    ];
  }
}

export const api = new APIClient();
