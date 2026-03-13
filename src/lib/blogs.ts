const API_URL =
  process.env.NEXT_PUBLIC_BACKEND ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.BACKEND ||
  'http://localhost:8000/api/v1';

export type blogType = {
  id?: string;
  title: string;
  image: string;
  data: string;
  ownerId: string;
};

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Important: sends cookies for cross-origin requests
      ...options,
    });

    // Handle 401 Unauthorized specifically
    if (response.status === 401) {
      const errorData = await response.text();
      console.error('[Blogs API] 401 Unauthorized:', {
        url,
        endpoint,
        error: errorData,
        hasCookie: document.cookie.includes('better-auth.session_token'),
      });
      throw new Error('Unauthorized: Please log in again');
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Blogs API] Error response:', {
        url,
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
    if (!contentType || !contentType.includes('application/json')) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error(`[Blogs API] Fetch error for ${endpoint}:`, error);
    throw error;
  }
}

export async function getUserBlogs(): Promise<blogType[]> {
  return fetchApi(`/dashboard/blogs`);
}

export async function getBlog(
  id: string,
): Promise<blogType> {
  return fetchApi(`/dashboard/blogs/${id}`);
}

export async function createBlog(blog: blogType): Promise<blogType> {
  return fetchApi(`/dashboard/blogs`, {
    method: 'POST',
    body: JSON.stringify(blog),
  });
}

export async function updateBlog(
  id: string,
  blog: blogType,
): Promise<blogType> {
  return fetchApi(`/dashboard/blogs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(blog),
  });
}

export async function deleteBlog(id: string): Promise<void> {
  return fetchApi(`/dashboard/blogs/${id}`, {
    method: 'DELETE',
  });
}
