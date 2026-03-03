const API_URL =
  process.env.NEXT_PUBLIC_BACKEND ||
  process.env.BACKEND ||
  "http://localhost:8000";

export type AnalyticsEvent = "page" | "form" | "button";

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
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API Error: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }

    // Handle empty responses
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error(`Fetch error for ${endpoint}:`, error);
    throw error;
  }
}

export async function getAnalytics(
  owner: string,
  event: AnalyticsEvent,
): Promise<AnalyticsResponse> {
  return fetchApi(`/api/analytics/${owner}?event=${event}`);
}

export async function trackAnalytics(data: any): Promise<any> {
  return fetchApi("/api/analytics", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
