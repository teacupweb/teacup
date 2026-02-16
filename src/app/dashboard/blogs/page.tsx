// import { getUserBlogs } from '@/lib/blogs';
import BlogsClient from './BlogsClient';

export default async function DashboardBlogsPage() {
  // const blogs = await getUserBlogs(1); // You'll need to get companyId from auth context

  return <BlogsClient />;
}
