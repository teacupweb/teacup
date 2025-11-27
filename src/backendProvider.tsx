import { useQuery, useMutation, useQueryClient, useQueries } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_BACKEND;

// Types
export type blogType = {
  id?: number;
  title: string;
  image: string;
  data: string;
  created_by: string;
};

export type inboxType = {
  id?: number;
  created_by: string;
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

// --- Blogs ---

export function useUserBlogs(email: string | undefined | null) {
  return useQuery({
    queryKey: ['blogs', email],
    queryFn: () => fetchApi(`/dashboard/blogs/${email}`),
    enabled: !!email,
  });
}

export function useBlog(email: string | undefined | null, id: string | undefined) {
  return useQuery({
    queryKey: ['blog', id],
    queryFn: () => fetchApi(`/dashboard/blogs/${email}/${id}`),
    enabled: !!email && !!id,
  });
}

export function useCreateBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newBlog: blogType) =>
      fetchApi('/dashboard/blogs', {
        method: 'POST',
        body: JSON.stringify(newBlog),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blogs', variables.created_by] });
    },
  });
}

export function useUpdateBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, blog }: { id: number; blog: blogType }) =>
      fetchApi(`/dashboard/blogs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(blog),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blogs', variables.blog.created_by] });
    },
  });
}

export function useDeleteBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      fetchApi(`/dashboard/blogs/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });
}

// --- Inbox ---

export function useUserInboxes(email: string | undefined | null) {
  return useQuery({
    queryKey: ['inboxes', email],
    queryFn: () => fetchApi(`/dashboard/inbox/${email}`),
    enabled: !!email,
  });
}

export function useCreateInbox() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newInbox: inboxType) =>
      fetchApi('/dashboard/inbox', {
        method: 'POST',
        body: JSON.stringify(newInbox),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inboxes', variables.created_by] });
    },
  });
}

export function useDeleteInbox() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetchApi(`/dashboard/inbox/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inboxes'] });
    },
  });
}

export function useInboxData(id: string | undefined) {
  return useQuery({
    queryKey: ['inboxData', id],
    queryFn: () => fetchApi(`/dashboard/inbox/data/${id}`),
    enabled: !!id,
  });
}

export function useDeleteInboxData() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetchApi(`/dashboard/inbox/data/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inboxData'] });
    },
  });
}

export function useLatestMessages(email: string | undefined | null, limit: number = 4) {
  // 1. Fetch all inboxes for the user
  const { data: inboxes, isLoading: inboxesLoading } = useUserInboxes(email);

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

export function useCompany(companyId: string | undefined | null) {
  return useQuery({
    queryKey: ['company', companyId],
    queryFn: () => fetchApi(`/dashboard/company/${companyId}`),
    enabled: !!companyId,
  });
}

export function useCreateCompany() {
  return useMutation({
    mutationFn: (newCompany: CompanyType) =>
      fetchApi('/dashboard/company', {
        method: 'POST',
        body: JSON.stringify(newCompany),
      }),
    onSuccess: () => {
      // Invalidate queries if necessary, e.g., if there's a list of companies
    },
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, company }: { id: string; company: CompanyType }) =>
      fetchApi(`/dashboard/company/${id}`, {
        method: 'PUT',
        body: JSON.stringify(company),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['company', variables.id] });
    },
  });
}
