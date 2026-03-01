const API_URL = process.env.NEXT_PUBLIC_BACKEND || process.env.BACKEND || 'http://localhost:8000';

export type blogType = {
  id?: string;
  title: string;
  image: string;
  data: string;
  ownerId: string;
};

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        credentials: 'include',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return null;
    }
    
    return response.json();
  } catch (error) {
    console.error(`Fetch error for ${endpoint}:`, error);
    throw error;
  }
}

export async function getUserBlogs(companyId: string): Promise<blogType[]> {
  console.log(companyId);
  return fetchApi(`/dashboard/blogs/${companyId}`);
}

export async function getBlog(
  companyId: string,
  id: string,
): Promise<blogType> {
  return fetchApi(`/dashboard/blogs/${companyId}/${id}`);
}

export async function createBlog(blog: blogType): Promise<blogType> {
  return fetchApi('/dashboard/blogs', {
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
