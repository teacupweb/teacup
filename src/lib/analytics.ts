const API_URL = process.env.NEXT_PUBLIC_BACKEND || process.env.BACKEND || 'http://localhost:8000';

export type AnalyticsEvent = 'page' | 'form' | 'button';

export interface AnalyticsDataPoint {
  date: string;
  primary: number;
  secondary: number;
}

export interface AnalyticsResponse {
  message: string;
  uniqueSets: string[] | null;
  data: {
    [identifier: string]: AnalyticsDataPoint[];
  };
}

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
}

export async function getAnalytics(owner: string, event: AnalyticsEvent): Promise<AnalyticsResponse> {
  return fetchApi(`/api/analytics/${owner}?event=${event}`);
}

export async function trackAnalytics(data: any): Promise<any> {
  return fetchApi('/api/analytics', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
