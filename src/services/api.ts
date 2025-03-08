// Fix the type recursion issue by constraining the generic parameter T
// The original error was: error TS2589: Type instantiation is excessively deep and possibly infinite.

import { AIInsight, AIRecommendation } from "@/types/ai";
import { QueueMetrics, ServiceRequest } from "@/types/service-queue";

// Define interface with proper type constraints to avoid infinite recursion
interface APIOptions<T = unknown> {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  withAuth?: boolean;
  mockData?: T;
  delay?: number;
}

// Implement the fetch function with constrained types
export async function fetchAPI<T = unknown>({ 
  endpoint, 
  method = 'GET', 
  body, 
  headers = {}, 
  params = {}, 
  withAuth = true,
  mockData,
  delay = 500
}: APIOptions<T>): Promise<T> {
  // Use mock data in development mode
  if (import.meta.env.DEV && mockData) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockData), delay);
    });
  }

  const url = new URL(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

  const allHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (withAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      allHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url.toString(), {
      method,
      headers: allHeaders,
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json() as T;
  } catch (error) {
    console.error("API fetch error:", error);
    throw error;
  }
}

// Example usage (adjust as needed for your specific API)
export const getServiceRequests = async (): Promise<ServiceRequest[]> => {
  return fetchAPI<ServiceRequest[]>({ endpoint: '/service-requests', mockData: [] });
};

export const getQueueMetrics = async (): Promise<QueueMetrics> => {
  return fetchAPI<QueueMetrics>({ endpoint: '/queue-metrics', mockData: {
    activeRequests: 25,
    avgResponseTime: '3m 20s',
    completionRate: 0.95,
    predictedLoad: 70,
    efficiency: 0.88,
  } });
};

export const getAIInsights = async (): Promise<AIInsight[]> => {
  return fetchAPI<AIInsight[]>({ endpoint: '/ai-insights', mockData: [] });
};

export const getAIRecommendations = async (): Promise<AIRecommendation[]> => {
  return fetchAPI<AIRecommendation[]>({ endpoint: '/ai-recommendations', mockData: [] });
};
