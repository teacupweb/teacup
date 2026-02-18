import {
  useQuery,
  useMutation,
  useQueryClient,
  useQueries,
} from '@tanstack/react-query';
import { 
  CompanyData, 
  Blog, 
  Inbox, 
  InboxData, 
  Analytics,
  ActivityDataType,
  InfoItemType,
  SharingMemberType,
  CompanyType,
  blogType,
  inboxType
} from '@/types/schema';

const API_URL = process.env.BACKEND || 'http://localhost:8000';

// Helper function for fetch requests
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

// --- Universal Hooks ---

export function useApiQuery<T = any>(
  key: any[],
  endpoint: string,
  options?: any,
) {
  return useQuery<T>({
    queryKey: key,
    queryFn: () => fetchApi(endpoint),
    ...options,
  });
}

export function useApiMutation<T = any, V = any>(
  mutationFn: (variables: V) => Promise<T>,
  onSuccess?: (data: T, variables: V) => void,
) {
  return useMutation({
    mutationFn,
    onSuccess: (data, variables) => {
      if (onSuccess) onSuccess(data, variables);
      // Optional: Invalidate queries if needed
    },
  });
}

// --- Blogs ---

export function useUserBlogs(companyId: string | undefined | null) {
  return useApiQuery<Blog[]>(['blogs', companyId], `/dashboard/blogs/${companyId}`, {
    enabled: !!companyId,
  });
}

export function useBlog(
  companyId: string | undefined | null,
  id: string | undefined,
) {
  return useApiQuery<Blog>(['blog', id], `/dashboard/blogs/${companyId}/${id}`, {
    enabled: !!companyId && !!id,
  });
}

export function useCreateBlog() {
  const queryClient = useQueryClient();
  return useApiMutation<Blog, Partial<Blog>>(
    (newBlog) =>
      fetchApi('/dashboard/blogs', {
        method: 'POST',
        body: JSON.stringify(newBlog),
      }),
    (_, variables) => {
      if (variables.ownerId) {
        queryClient.invalidateQueries({
          queryKey: ['blogs', variables.ownerId],
        });
      }
    },
  );
}

export function useUpdateBlog() {
  const queryClient = useQueryClient();
  return useApiMutation<Blog, { id: string; blog: Partial<Blog> }>(
    ({ id, blog }) =>
      fetchApi(`/dashboard/blogs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(blog),
      }),
    (_, variables) => {
      if (variables.blog.ownerId) {
        queryClient.invalidateQueries({
          queryKey: ['blogs', variables.blog.ownerId],
        });
      }
    },
  );
}

export function useDeleteBlog() {
  const queryClient = useQueryClient();
  return useApiMutation<void, string>(
    (id) =>
      fetchApi(`/dashboard/blogs/${id}`, {
        method: 'DELETE',
      }),
    () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  );
}

// --- Inbox ---

export function useUserInboxes(companyId: string | undefined | null) {
  return useApiQuery<Inbox[]>(['inboxes', companyId], `/dashboard/inbox/${companyId}`, {
    enabled: !!companyId,
  });
}

export function useCreateInbox() {
  const queryClient = useQueryClient();
  return useApiMutation<Inbox, Partial<Inbox>>(
    (newInbox) =>
      fetchApi('/dashboard/inbox', {
        method: 'POST',
        body: JSON.stringify(newInbox),
      }),
    (_, variables) => {
      if (variables.ownerId) {
        queryClient.invalidateQueries({
          queryKey: ['inboxes', variables.ownerId],
        });
      }
    },
  );
}

export function useDeleteInbox() {
  const queryClient = useQueryClient();
  return useApiMutation<void, number>(
    (id) =>
      fetchApi(`/dashboard/inbox/${id}`, {
        method: 'DELETE',
      }),
    () => {
      queryClient.invalidateQueries({ queryKey: ['inboxes'] });
    },
  );
}

export function useInboxData(id: number | undefined) {
  return useApiQuery<InboxData[]>(['inboxData', id], `/dashboard/inbox/data/${id}`, {
    enabled: !!id,
  });
}

export function useDeleteInboxData() {
  const queryClient = useQueryClient();
  return useApiMutation<void, number>(
    (id) =>
      fetchApi(`/dashboard/inbox/data/${id}`, {
        method: 'DELETE',
      }),
    () => {
      queryClient.invalidateQueries({ queryKey: ['inboxData'] });
    },
  );
}

export function useLatestMessages(
  companyId: string | undefined | null,
  limit: number = 4,
) {
  // 1. Fetch all inboxes for the user
  const { data: inboxes, isLoading: inboxesLoading } =
    useUserInboxes(companyId);
  // 2. Fetch data for each inbox
  const inboxQueries = useQueries({
    queries: (inboxes || []).map((inbox: Inbox) => ({
      queryKey: ['inboxData', inbox.id],
      queryFn: () => fetchApi(`/dashboard/inbox/data/${inbox.id}`),
      enabled: !!inboxes,
    })),
  });

  // 3. Aggregate last message from each inbox
  const messages = inboxQueries
    .map((query, index) => {
      const inbox = inboxes ? inboxes[index] : null;
      const data = query.data;

      if (!data || !Array.isArray(data) || data.length === 0) return null;

      // Get the last item (length - 1)
      const lastMessage = data[data.length - 1];

      // Attach inbox info if needed
      return {
        ...lastMessage,
        inbox: inbox, // Add inbox details to message
      };
    })
    .filter((msg) => msg !== null) // Remove nulls (empty inboxes or loading)
    // Sort by created_at if available, otherwise keep order or use ID
    .sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return dateB - dateA; // Descending order
    })
    .slice(0, limit); // Take only the requested limit

  const loading = inboxesLoading || inboxQueries.some((q) => q.isLoading);
  const error = inboxQueries.find((q) => q.error)?.error || null;

  return { data: messages, isLoading: loading, error };
}

// --- Company ---

export function useCompany(companyId: string | undefined | null): {
  data: CompanyData | undefined;
  isLoading: boolean;
  error: unknown;
} {
  const data = useApiQuery<CompanyData>(
    ['company', companyId],
    `/dashboard/company/${companyId}`,
    {
      enabled: !!companyId,
    },
  );
  return data as {
    data: CompanyData | undefined;
    isLoading: boolean;
    error: unknown;
  };
}

export function useCreateCompany() {
  const queryClient = useQueryClient();
  return useApiMutation<CompanyData, Partial<CompanyData>>(
    (newCompany) =>
      fetchApi('/dashboard/company', {
        method: 'POST',
        body: JSON.stringify(newCompany),
      }),
    () => {
      // Invalidate queries if necessary, e.g., if there's a list of companies
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  );
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  return useApiMutation<CompanyData, { id: string; company: Partial<CompanyData> }>(
    ({ id, company }) =>
      fetchApi(`/dashboard/company/${id}`, {
        method: 'PUT',
        body: JSON.stringify(company),
      }),
    (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['company', variables.id] });
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

export function useAnalytics(owner: string | undefined, event: AnalyticsEvent) {
  return useQuery<AnalyticsResponse>({
    queryKey: ['analytics', owner, event],
    queryFn: () => fetchApi(`/api/analytics/${owner}?event=${event}`),
    enabled: !!owner && !!event,
  });
}

export function useTrackAnalytics() {
  return useMutation({
    mutationFn: (data: any) =>
      fetchApi('/api/analytics', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  });
}

// Legacy exports for backward compatibility
export type { 
  ActivityDataType, 
  InfoItemType, 
  SharingMemberType, 
  CompanyType, 
  blogType, 
  inboxType 
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
  AnalyticsForm
} from '@/types/schema';
