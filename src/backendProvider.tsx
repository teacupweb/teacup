import {
  useQuery,
  useMutation,
  useQueryClient,
  useQueries,
} from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_BACKEND;

// Types
export type blogType = {
  id?: number;
  title: string;
  image: string;
  data: string;
  owner: string;
};

export type inboxType = {
  id?: number;
  owner: string;
  name: string;
};

export type ActivityDataType = {
  day: string;
  visits: number;
};

export type InfoItemType = {
  icon: string;
  title: string;
  data: string[] | number;
  description: string;
};

export type SharingMemberType = {
  name: string;
  email: string;
  status: string;
};

export type CompanyType = {
  id?: string;
  name: string;
  owner: string;
  domain: string;
  activity_data?: ActivityDataType[];
  info?: InfoItemType[];
  sharing?: SharingMemberType[];
  key: string;
};

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
  options?: any
) {
  return useQuery<T>({
    queryKey: key,
    queryFn: () => fetchApi(endpoint),
    ...options,
  });
}

export function useApiMutation<T = any, V = any>(
  mutationFn: (variables: V) => Promise<T>,
  onSuccess?: (data: T, variables: V) => void
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

export function useUserBlogs(companyId: number | undefined | null) {
  return useApiQuery(['blogs', companyId], `/dashboard/blogs/${companyId}`, {
    enabled: !!companyId,
  });
}

export function useBlog(
  companyId: string | undefined | null,
  id: string | undefined
) {
  return useApiQuery(['blog', id], `/dashboard/blogs/${companyId}/${id}`, {
    enabled: !!companyId && !!id,
  });
}

export function useCreateBlog() {
  const queryClient = useQueryClient();
  return useApiMutation(
    (newBlog: blogType) =>
      fetchApi('/dashboard/blogs', {
        method: 'POST',
        body: JSON.stringify(newBlog),
      }),
    (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['blogs', variables.owner],
      });
    }
  );
}

export function useUpdateBlog() {
  const queryClient = useQueryClient();
  return useApiMutation(
    ({ id, blog }: { id: number; blog: blogType }) =>
      fetchApi(`/dashboard/blogs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(blog),
      }),
    (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['blogs', variables.blog.owner],
      });
    }
  );
}

export function useDeleteBlog() {
  const queryClient = useQueryClient();
  return useApiMutation(
    (id: number) =>
      fetchApi(`/dashboard/blogs/${id}`, {
        method: 'DELETE',
      }),

    () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    }
  );
}

// --- Inbox ---

export function useUserInboxes(companyId: number | undefined | null) {
  return useApiQuery(['inboxes', companyId], `/dashboard/inbox/${companyId}`, {
    enabled: !!companyId,
  });
}

export function useCreateInbox() {
  const queryClient = useQueryClient();
  return useApiMutation(
    (newInbox: inboxType) =>
      fetchApi('/dashboard/inbox', {
        method: 'POST',
        body: JSON.stringify(newInbox),
      }),
    (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['inboxes', variables.owner],
      });
    }
  );
}

export function useDeleteInbox() {
  const queryClient = useQueryClient();
  return useApiMutation(
    (id: string) =>
      fetchApi(`/dashboard/inbox/${id}`, {
        method: 'DELETE',
      }),
    () => {
      queryClient.invalidateQueries({ queryKey: ['inboxes'] });
    }
  );
}

export function useInboxData(id: number | undefined) {
  return useApiQuery(['inboxData', id], `/dashboard/inbox/data/${id}`, {
    enabled: !!id,
  });
}

export function useDeleteInboxData() {
  const queryClient = useQueryClient();
  return useApiMutation(
    (id: number) =>
      fetchApi(`/dashboard/inbox/data/${id}`, {
        method: 'DELETE',
      }),
    () => {
      queryClient.invalidateQueries({ queryKey: ['inboxData'] });
    }
  );
}

export function useLatestMessages(
  companyId: number | undefined | null,
  limit: number = 4
) {
  // 1. Fetch all inboxes for the user
  const { data: inboxes, isLoading: inboxesLoading } =
    useUserInboxes(companyId);
  // 2. Fetch data for each inbox
  const inboxQueries = useQueries({
    queries: (inboxes || []).map((inbox: inboxType) => ({
      queryKey: ['inboxData', inbox.id],
      queryFn: () => fetchApi(`/dashboard/inbox/data/${inbox.id}`),
      enabled: !!inboxes,
    })),
  });

  // 3. Aggregate the last message from each inbox
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
        inbox: inbox, // Add inbox details to the message
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

export function useCompany(companyId: number | undefined | null): {
  data: CompanyType | undefined;
  isLoading: boolean;
  error: unknown;
} {
  const data = useApiQuery(
    ['company', companyId],
    `/dashboard/company/${companyId}`,
    {
      enabled: !!companyId,
    }
  );
  return data as {
    data: CompanyType | undefined;
    isLoading: boolean;
    error: unknown;
  };
}

export function useCreateCompany() {
  const queryClient = useQueryClient();
  return useApiMutation(
    (newCompany: CompanyType) =>
      fetchApi('/dashboard/company', {
        method: 'POST',
        body: JSON.stringify(newCompany),
      }),
    () => {
      // Invalidate queries if necessary, e.g., if there's a list of companies
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    }
  );
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  return useApiMutation(
    ({ id, company }: { id: string; company: CompanyType }) =>
      fetchApi(`/dashboard/company/${id}`, {
        method: 'PUT',
        body: JSON.stringify(company),
      }),
    (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['company', variables.id] });
    }
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

// hold my tea

export async function useHoldMyTea(owner: number, question: string) {
  const response = await fetch(`${API_URL}/holdmytea/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ owner, question }),
  });
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
}
