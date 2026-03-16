const getApiBaseUrl = () => {
  // Server-side: use environment variable or default to localhost
  if (typeof window === 'undefined') {
    // Use SERVER_BACKEND_URL for server-side (set in Vercel environment variables)
    // Falls back to NEXT_PUBLIC_BACKEND for compatibility, then localhost
    const baseUrl =
      process.env.SERVER_BACKEND_URL ||
      process.env.NEXT_PUBLIC_BACKEND ||
      'http://localhost:8000';
    // Ensure the base URL ends with /api/v1 for server-side calls
    return baseUrl.endsWith('/api/v1') ? baseUrl : `${baseUrl}/api/v1`;
  }
  // Client-side: always use relative URL to go through Next.js rewrites
  return '/api/v1';
};

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

export async function getDashboardAccessStatus(
  cookie?: string,
): Promise<DashboardAccessStatus> {
  const isServer = typeof window === 'undefined';
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Only add cookie header if explicitly provided (server-side)
  if (cookie) {
    headers['cookie'] = cookie;
  }

  const response = await fetch(`${getApiBaseUrl()}/orders/dashboard-access`, {
    method: 'GET',
    headers,
    credentials: isServer ? 'same-origin' : 'include',
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
