'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  CompanyData,
  Blog,
  Inbox,
  InboxData,
  ParsedInboxData,
  InboxDataWithParsed,
  ActivityDataType,
  InfoItemType,
  SharingMemberType,
  CompanyType,
  blogType,
  inboxType,
  EditRequest,
} from '@/types/schema';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND ||
  process.env.BACKEND ||
  'http://localhost:8000';

// --- In-Memory Caching with TTL ---
const CACHE_TTL = 30 * 1000; // 30 seconds for general data
const SHORT_CACHE_TTL = 10 * 1000; // 10 seconds for real-time data

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const responseCache = new Map<string, CacheEntry<any>>();
const pendingRequests = new Map<string, Promise<any>>();

function getCacheKey(endpoint: string, options: RequestInit = {}): string {
  return `${endpoint}:${JSON.stringify(options)}`;
}

function isCacheValid<T>(entry: CacheEntry<T>, ttl: number): boolean {
  return Date.now() - entry.timestamp < ttl;
}

// --- Optimized fetchApi with Caching, Deduplication, and Retry ---
async function fetchApi(
  endpoint: string,
  options: RequestInit = {},
  ttl: number = CACHE_TTL,
  skipCache: boolean = false,
): Promise<any> {
  const cacheKey = getCacheKey(endpoint, options);

  // Check cache first (skip for mutations/non-GET requests)
  if (!skipCache && !options.method) {
    const cached = responseCache.get(cacheKey);
    if (cached && isCacheValid(cached, ttl)) {
      return cached.data;
    }
  }

  // Check for pending request (deduplication)
  const existing = pendingRequests.get(cacheKey);
  if (existing) {
    return existing;
  }

  // Retry logic with exponential backoff
  const maxRetries = 2;
  const baseDelay = 500;

  const executeWithRetry = async (retryCount = 0): Promise<any> => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        credentials: 'include', // Ensure session cookies are sent
        ...options,
      });

      // Handle 401 Unauthorized specifically
      if (response.status === 401) {
        const errorData = await response.text();
        console.error('[API 401] Unauthorized request:', {
          url: `${API_URL}${endpoint}`,
          endpoint,
          error: errorData,
        });
        throw new Error('Unauthorized: Please log in again');
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[API Error] Response error:', {
          url: `${API_URL}${endpoint}`,
          endpoint,
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        });
        throw new Error(
          `API Error: ${response.status} ${response.statusText} - ${errorText}`,
        );
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      let result: any;
      if (!contentType || !contentType.includes('application/json')) {
        result = null;
      } else {
        result = await response.json();
      }

      // Cache successful GET responses
      if (!skipCache && !options.method && result !== null) {
        responseCache.set(cacheKey, { data: result, timestamp: Date.now() });
      }

      return result;
    } catch (error) {
      // Retry with exponential backoff
      if (retryCount < maxRetries) {
        const delay = baseDelay * Math.pow(2, retryCount);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return executeWithRetry(retryCount + 1);
      }
      console.error(`Fetch error for ${endpoint}:`, error);
      throw error;
    } finally {
      // Clean up pending request
      pendingRequests.delete(cacheKey);
    }
  };

  const promise = executeWithRetry();
  pendingRequests.set(cacheKey, promise);
  return promise;
}

// Helper to invalidate cache for specific endpoints
export function invalidateCache(endpointPattern?: string): void {
  if (!endpointPattern) {
    responseCache.clear();
    return;
  }
  for (const key of responseCache.keys()) {
    if (key.includes(endpointPattern)) {
      responseCache.delete(key);
    }
  }
}

// --- React Query Configuration ---
const DEFAULT_QUERY_OPTIONS = {
  staleTime: 30 * 1000, // 30 seconds
  gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
  retry: 2,
  retryDelay: (attemptIndex: number) => 500 * Math.pow(2, attemptIndex),
};

// --- Data transformation utilities for schema compatibility ---
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

// --- Universal Hooks (React Query based with backward compatibility) ---

export function useFetch<T = any>(
  endpoint: string | null,
  options?: {
    staleTime?: number;
    gcTime?: number;
    enabled?: boolean;
    skipCache?: boolean;
  },
): {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const enabled = options?.enabled !== false && endpoint !== null;

  const { data, isLoading, error, refetch } = useQuery<T | null, Error>({
    queryKey: endpoint ? [endpoint] : [],
    queryFn: () =>
      fetchApi(endpoint!, {}, options?.gcTime || CACHE_TTL, options?.skipCache),
    enabled,
    staleTime: options?.staleTime ?? DEFAULT_QUERY_OPTIONS.staleTime,
    gcTime: options?.gcTime ?? DEFAULT_QUERY_OPTIONS.gcTime,
    retry: DEFAULT_QUERY_OPTIONS.retry,
    retryDelay: DEFAULT_QUERY_OPTIONS.retryDelay,
  });

  // Wrap refetch to return void for backward compatibility
  const wrappedRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    data: data ?? undefined,
    isLoading,
    error: error
      ? error instanceof Error
        ? error
        : new Error(String(error))
      : null,
    refetch: wrappedRefetch,
  };
}

// React Query mutation wrapper with backward-compatible API
export function useMutate<T = any, V = any>(
  mutationFn: (variables: V) => Promise<T>,
  options?: {
    onSuccess?: (data: T, variables: V) => void;
    onMutate?: (variables: V) => void;
    onError?: (error: Error, variables: V) => void;
  },
): {
  mutateAsync: (variables: V) => Promise<T>;
  isLoading: boolean;
  error: Error | null;
} {
  const {
    mutateAsync: rqMutateAsync,
    isPending,
    error,
  } = useMutation<T, Error, V>({
    mutationFn,
    onSuccess: options?.onSuccess,
    onMutate: options?.onMutate,
    onError: options?.onError,
  });

  return {
    mutateAsync: rqMutateAsync,
    isLoading: isPending,
    error: error
      ? error instanceof Error
        ? error
        : new Error(String(error))
      : null,
  };
}

// --- Blogs ---

export function useUserBlogs(companyId?: string | undefined | null) {
  // companyId is now ignored as it's handled by the session
  return useFetch<Blog[]>('/dashboard/blogs');
}

export function useBlog(
  _companyId: string | undefined | null,
  id: string | undefined,
) {
  return useFetch<Blog>(id ? `/dashboard/blogs/${id}` : null);
}

export function useCreateBlog() {
  const queryClient = useQueryClient();
  return useMutate<Blog, Partial<Blog>>(
    (newBlog) =>
      fetchApi(
        '/dashboard/blogs',
        {
          method: 'POST',
          body: JSON.stringify(newBlog),
        },
        CACHE_TTL,
        true,
      ), // Skip cache for mutations
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/dashboard/blogs'] });
      },
    },
  );
}

export function useUpdateBlog() {
  const queryClient = useQueryClient();
  return useMutate<Blog, { id: string; blog: Partial<Blog> }>(
    ({ id, blog }) =>
      fetchApi(
        `/dashboard/blogs/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify(blog),
        },
        CACHE_TTL,
        true,
      ),
    {
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries({ queryKey: [`/dashboard/blogs/${id}`] });
        queryClient.invalidateQueries({ queryKey: ['/dashboard/blogs'] });
      },
    },
  );
}

export function useDeleteBlog() {
  const queryClient = useQueryClient();
  return useMutate<void, string>(
    (id) =>
      fetchApi(
        `/dashboard/blogs/${id}`,
        {
          method: 'DELETE',
        },
        CACHE_TTL,
        true,
      ),
    {
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: [`/dashboard/blogs/${id}`] });
        queryClient.invalidateQueries({ queryKey: ['/dashboard/blogs'] });
      },
    },
  );
}

// --- Inbox ---

export function useUserInboxes(_companyId?: string | undefined | null) {
  return useFetch<Inbox[]>('/dashboard/inbox');
}

export function useCreateInbox() {
  const queryClient = useQueryClient();
  return useMutate<Inbox, Partial<Inbox>>(
    (newInbox) =>
      fetchApi(
        '/dashboard/inbox',
        {
          method: 'POST',
          body: JSON.stringify(newInbox),
        },
        CACHE_TTL,
        true,
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/dashboard/inbox'] });
      },
    },
  );
}

export function useDeleteInbox() {
  const queryClient = useQueryClient();
  return useMutate<void, string>(
    (id) =>
      fetchApi(
        `/dashboard/inbox/${id}`,
        {
          method: 'DELETE',
        },
        CACHE_TTL,
        true,
      ),
    {
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: [`/dashboard/inbox/${id}`] });
        queryClient.invalidateQueries({ queryKey: ['/dashboard/inbox'] });
      },
    },
  );
}

export function useInboxData(id: string | undefined) {
  return useFetch<InboxData[]>(id ? `/dashboard/inbox/${id}` : null);
}

export function useDeleteInboxData() {
  const queryClient = useQueryClient();
  return useMutate<void, string>(
    (id) =>
      fetchApi(
        `/dashboard/inbox/data/${id}`,
        {
          method: 'DELETE',
        },
        CACHE_TTL,
        true,
      ),
    {
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({
          queryKey: [`/dashboard/inbox/${id}`],
        });
      },
    },
  );
}

// --- Optimized useLatestMessages Hook ---
export function useLatestMessages(
  _companyId?: string | undefined | null,
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
  } = useUserInboxes();

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

    const EARLY_LIMIT = 2;

    Promise.all(
      inboxes.map((inbox: Inbox) =>
        fetchApi(
          `/dashboard/inbox/${inbox.id}`,
          {},
          SHORT_CACHE_TTL,
        )
          .then((data: InboxData[]) => {
            if (!Array.isArray(data) || data.length === 0) {
              return { inbox, data: [] };
            }
            const limitedData = data.slice(-EARLY_LIMIT);
            return { inbox, data: limitedData };
          })
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

export function useCompany(_companyId?: string | undefined | null) {
  return useFetch<CompanyData>('/dashboard/company');
}

export function useCreateCompany() {
  const queryClient = useQueryClient();
  return useMutate<CompanyData, Partial<CompanyData>>(
    (newCompany) =>
      fetchApi(
        '/dashboard/company',
        {
          method: 'POST',
          body: JSON.stringify(newCompany),
        },
        CACHE_TTL,
        true,
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/dashboard/company'] });
      },
    },
  );
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  return useMutate<CompanyData, { id?: string; company: Partial<CompanyData> }>(
    ({ company }) =>
      fetchApi(
        '/dashboard/company',
        {
          method: 'PUT',
          body: JSON.stringify(company),
        },
        CACHE_TTL,
        true,
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/dashboard/company'] });
      },
    },
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
    owner && event ? `/analytics/${owner}?event=${event}` : null,
  );
}

export function useTrackAnalytics() {
  return useMutate<any, any>((data) =>
    fetchApi(
      '/analytics',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      CACHE_TTL,
      true,
    ),
  );
}

// --- Sharing ---

export interface SharingUser {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export function useCompanyUsers(_companyId?: string | undefined | null) {
  return useFetch<SharingUser[]>('/dashboard/sharing/users');
}

export function useRemoveUser() {
  const queryClient = useQueryClient();
  return useMutate<{ success: boolean }, { userId: string }>(
    ({ userId }) =>
      fetchApi(
        `/dashboard/sharing/users/${userId}`,
        {
          method: 'DELETE',
        },
        CACHE_TTL,
        true,
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['/dashboard/sharing/users'],
        });
      },
    },
  );
}

export function useChangeUserRole() {
  const queryClient = useQueryClient();
  return useMutate<
    { success: boolean },
    { userId: string; role: 'user' | 'admin' }
  >(
    ({ userId, role }) =>
      fetchApi(
        `/dashboard/sharing/users/${userId}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ role }),
        },
        CACHE_TTL,
        true,
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['/dashboard/sharing/users'],
        });
      },
    },
  );
}

// --- Edit Requests ---

export function useUserEditRequests(_companyId?: string | undefined | null) {
  return useFetch<EditRequest[]>('/dashboard/editRequest');
}

export function useEditRequest(
  _companyId: string | undefined | null,
  id: string | undefined,
) {
  return useFetch<EditRequest>(id ? `/dashboard/editRequest/${id}` : null);
}

export function useCreateEditRequest() {
  const queryClient = useQueryClient();
  return useMutate<EditRequest, Partial<EditRequest>>(
    (newEditRequest) =>
      fetchApi(
        '/dashboard/editRequest',
        {
          method: 'POST',
          body: JSON.stringify(newEditRequest),
        },
        CACHE_TTL,
        true,
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['/dashboard/editRequest'],
        });
      },
    },
  );
}

export function useUpdateEditRequest() {
  const queryClient = useQueryClient();
  return useMutate<
    EditRequest,
    { id: string; editRequest: Partial<EditRequest> }
  >(
    ({ id, editRequest }) =>
      fetchApi(
        `/dashboard/editRequest/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify(editRequest),
        },
        CACHE_TTL,
        true,
      ),
    {
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries({
          queryKey: [`/dashboard/editRequest/${id}`],
        });
        queryClient.invalidateQueries({
          queryKey: ['/dashboard/editRequest'],
        });
      },
    },
  );
}

export function useDeleteEditRequest() {
  const queryClient = useQueryClient();
  return useMutate<void, string>(
    (id) =>
      fetchApi(
        `/dashboard/editRequest/${id}`,
        {
          method: 'DELETE',
        },
        CACHE_TTL,
        true,
      ),
    {
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({
          queryKey: [`/dashboard/editRequest/${id}`],
        });
        queryClient.invalidateQueries({
          queryKey: ['/dashboard/editRequest'],
        });
      },
    },
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

// Export utilities
export { responseCache, pendingRequests };
