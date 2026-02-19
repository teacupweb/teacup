const API_URL = process.env.BACKEND || 'http://localhost:8000';

export type blogType = {
  id?: number;
  title: string;
  image: string;
  data: string;
  owner: string;
};

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

export async function getUserBlogs(companyId: number): Promise<blogType[]> {
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
  id: number,
  blog: blogType,
): Promise<blogType> {
  return fetchApi(`/dashboard/blogs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(blog),
  });
}

export async function deleteBlog(id: number): Promise<void> {
  return fetchApi(`/dashboard/blogs/${id}`, {
    method: 'DELETE',
  });
}
