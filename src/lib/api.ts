const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface DashboardAccessStatus {
  hasOrder: boolean;
  hasCompletedOrder: boolean;
  hasWebsite: boolean;
  canAccessDashboard: boolean;
  order: {
    id: string;
    orderStatus: 'pending' | 'completed' | 'cancelled';
    status: 'pending' | 'running' | 'cancelled';
  } | null;
  company: {
    id: string;
    name: string;
  } | null;
}

export async function getDashboardAccessStatus(cookie?: string): Promise<DashboardAccessStatus> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Only add cookie header if explicitly provided (server-side)
  if (cookie) {
    headers['cookie'] = cookie;
  }

  const response = await fetch(`${API_BASE_URL}/orders/dashboard-access`, {
    method: 'GET',
    headers,
    credentials: 'include', // Important for both client and server (if node-fetch supports it)
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
    throw new Error('Failed to fetch dashboard access status');
  }

  const data = await response.json();
  return data.data;
}
