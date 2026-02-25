'use client';
import { useState, useEffect, useCallback } from 'react';
import { authClient } from '@/lib/auth-client';
import {
  CompanyData,
  Blog,
  Inbox,
  InboxData,
  ParsedInboxData,
  InboxDataWithParsed,
  Analytics,
  ActivityDataType,
  InfoItemType,
  SharingMemberType,
  CompanyType,
  blogType,
  inboxType,
  User,
  EditRequest,
} from '@/types/schema';

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND || process.env.BACKEND || 'http://localhost:8000';

// Helper function for fetch requests
async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      credentials: 'include',
      ...options.headers,
    },
    ...options,
  });
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
}

// Data transformation utilities for schema compatibility
export function parseInboxDataField(inboxData: InboxData): ParsedInboxData {
  try {
    if (typeof inboxData?.data === 'string') {
      return JSON.parse(inboxData.data);
    }
    return inboxData?.data || {};
  } catch (error) {
    console.error('Error parsing inbox data:', error);
    return {};
  }
}

export function normalizeInboxData(
  inboxDataArray: InboxData[],
): InboxDataWithParsed[] {
  if (!Array.isArray(inboxDataArray)) {
    return [];
  }
  return inboxDataArray.map((item) => ({
    ...item,
    parsedData: parseInboxDataField(item),
  }));
}

// --- Universal Hooks ---

export function useFetch<T = any>(
  endpoint: string | null,
): {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(!!endpoint);
  const [error, setError] = useState<Error | null>(null);
  const [trigger, setTrigger] = useState(0);

  const refetch = useCallback(() => setTrigger((t) => t + 1), []);

  useEffect(() => {
    if (!endpoint) {
      setData(undefined);
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    fetchApi(endpoint)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled)
          setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [endpoint, trigger]);

  return { data, isLoading, error, refetch };
}

function useMutate<T = any, V = any>(
  mutationFn: (variables: V) => Promise<T>,
): {
  mutateAsync: (variables: V) => Promise<T>;
  isLoading: boolean;
  error: Error | null;
} {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutateAsync = useCallback(
    async (variables: V): Promise<T> => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await mutationFn(variables);
        return result;
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [mutationFn],
  );

  return { mutateAsync, isLoading, error };
}

// --- Blogs ---

export function useUserBlogs(companyId: string | undefined | null) {
  return useFetch<Blog[]>(companyId ? `/dashboard/blogs/${companyId}` : null);
}

export function useBlog(
  companyId: string | undefined | null,
  id: string | undefined,
) {
  return useFetch<Blog>(
    companyId && id ? `/dashboard/blogs/${companyId}/${id}` : null,
  );
}

export function useCreateBlog() {
  return useMutate<Blog, Partial<Blog>>((newBlog) =>
    fetchApi('/dashboard/blogs', {
      method: 'POST',
      body: JSON.stringify(newBlog),
    }),
  );
}

export function useUpdateBlog() {
  return useMutate<Blog, { id: string; blog: Partial<Blog> }>(({ id, blog }) =>
    fetchApi(`/dashboard/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(blog),
    }),
  );
}

export function useDeleteBlog() {
  return useMutate<void, string>((id) =>
    fetchApi(`/dashboard/blogs/${id}`, {
      method: 'DELETE',
    }),
  );
}

// --- Inbox ---

export function useUserInboxes(companyId: string | undefined | null) {
  return useFetch<Inbox[]>(companyId ? `/dashboard/inbox/${companyId}` : null);
}

export function useCreateInbox() {
  return useMutate<Inbox, Partial<Inbox>>((newInbox) =>
    fetchApi('/dashboard/inbox', {
      method: 'POST',
      body: JSON.stringify(newInbox),
    }),
  );
}

export function useDeleteInbox() {
  return useMutate<void, string>((id) =>
    fetchApi(`/dashboard/inbox/${id}`, {
      method: 'DELETE',
    }),
  );
}

export function useInboxData(id: string | undefined) {
  return useFetch<InboxData[]>(id ? `/dashboard/inbox/data/${id}` : null);
}

export function useDeleteInboxData() {
  return useMutate<void, string>((id) =>
    fetchApi(`/dashboard/inbox/data/${id}`, {
      method: 'DELETE',
    }),
  );
}

export function useLatestMessages(
  companyId: string | undefined | null,
  limit: number = 4,
): {
  data: any[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const {
    data: inboxes,
    isLoading: inboxesLoading,
    error: inboxesError,
    refetch: refetchInboxes,
  } = useUserInboxes(companyId);

  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [trigger, setTrigger] = useState(0);

  const refetch = useCallback(() => {
    refetchInboxes();
    setTrigger((t) => t + 1);
  }, [refetchInboxes]);

  useEffect(() => {
    if (!inboxes || inboxes.length === 0) {
      setMessages([]);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    Promise.all(
      inboxes.map((inbox: Inbox) =>
        fetchApi(`/dashboard/inbox/data/${inbox.id}`)
          .then((data: InboxData[]) => ({ inbox, data }))
          .catch(() => ({ inbox, data: [] })),
      ),
    )
      .then((results) => {
        if (cancelled) return;
        const aggregated = results
          .map(({ inbox, data }) => {
            if (!Array.isArray(data) || data.length === 0) return null;
            const lastMessage = data[data.length - 1];
            const parsedData = parseInboxDataField(lastMessage);
            return { ...lastMessage, inbox, parsedData };
          })
          .filter((msg): msg is NonNullable<typeof msg> => msg !== null)
          .sort((a, b) => {
            const dateA = new Date((a.createdAt as any) || 0).getTime();
            const dateB = new Date((b.createdAt as any) || 0).getTime();
            return dateB - dateA;
          })
          .slice(0, limit);
        setMessages(aggregated);
      })
      .catch((err) => {
        if (!cancelled)
          setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [inboxes, limit, trigger]);

  return {
    data: messages,
    isLoading: inboxesLoading || isLoading,
    error: inboxesError || error,
    refetch,
  };
}

// --- Company ---

export function useCompany(companyId: string | undefined | null): {
  data: CompanyData | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  return useFetch<CompanyData>(
    companyId ? `/dashboard/company/${companyId}` : null,
  );
}

export function useCreateCompany() {
  return useMutate<CompanyData, Partial<CompanyData>>((newCompany) =>
    fetchApi('/dashboard/company', {
      method: 'POST',
      body: JSON.stringify(newCompany),
    }),
  );
}

export function useUpdateCompany() {
  return useMutate<CompanyData, { id: string; company: Partial<CompanyData> }>(
    ({ id, company }) =>
      fetchApi(`/dashboard/company/${id}`, {
        method: 'PUT',
        body: JSON.stringify(company),
      }),
  );
}

// --- Analytics ---

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

export function useAnalytics(
  owner: string | undefined | null,
  event: AnalyticsEvent,
) {
  return useFetch<AnalyticsResponse>(
    owner && event ? `/api/analytics/${owner}?event=${event}` : null,
  );
}

export function useTrackAnalytics() {
  return useMutate<any, any>((data) =>
    fetchApi('/api/analytics', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  );
}

// --- Sharing ---

export interface SharingUser {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export function useCompanyUsers(companyId: string | undefined | null) {
  return useFetch<SharingUser[]>(companyId ? `/dashboard/sharing/${companyId}/users` : null);
}

export function useRemoveUser() {
  return useMutate<{ success: boolean }, { companyId: string; userId: string }>(
    ({ companyId, userId }) =>
      fetchApi(`/dashboard/sharing/${companyId}/users/${userId}`, {
        method: 'DELETE',
      }),
  );
}

export function useChangeUserRole() {
  return useMutate<{ success: boolean }, { companyId: string; userId: string; role: 'user' | 'admin' }>(
    ({ companyId, userId, role }) =>
      fetchApi(`/dashboard/sharing/${companyId}/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      }),
  );
}

// --- Edit Requests ---

export function useUserEditRequests(companyId: string | undefined | null) {
  return useFetch<EditRequest[]>(companyId ? `/dashboard/editRequest/${companyId}` : null);
}

export function useEditRequest(
  companyId: string | undefined | null,
  id: string | undefined,
) {
  return useFetch<EditRequest>(
    companyId && id ? `/dashboard/editRequest/${companyId}/${id}` : null,
  );
}

export function useCreateEditRequest() {
  return useMutate<EditRequest, Partial<EditRequest>>((newEditRequest) =>
    fetchApi('/dashboard/editRequest', {
      method: 'POST',
      body: JSON.stringify(newEditRequest),
    }),
  );
}

export function useUpdateEditRequest() {
  return useMutate<EditRequest, { id: string; editRequest: Partial<EditRequest> }>(
    ({ id, editRequest }) =>
      fetchApi(`/dashboard/editRequest/${id}`, {
        method: 'PUT',
        body: JSON.stringify(editRequest),
      }),
  );
}

export function useDeleteEditRequest() {
  return useMutate<void, string>((id) =>
    fetchApi(`/dashboard/editRequest/${id}`, {
      method: 'DELETE',
    }),
  );
}

// Legacy exports for backward compatibility
export type {
  ActivityDataType,
  InfoItemType,
  SharingMemberType,
  CompanyType,
  blogType,
  inboxType,
};

// Export new schema types
export type {
  CompanyData,
  Blog,
  Inbox,
  InboxData,
  Analytics,
  User,
  Session,
  Account,
  Verification,
  AnalyticsButton,
  AnalyticsPage,
  AnalyticsForm,
  EditRequest,
} from '@/types/schema';
