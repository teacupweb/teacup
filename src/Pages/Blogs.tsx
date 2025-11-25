import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { Link } from 'react-router';

// Demo blog data
const demoBlogPosts = [
  {
    id: 1,
    title: 'Getting Started with Teacupnet: A Complete Guide',
    excerpt:
      'Learn how to build your first website with Teacupnet in just 5 minutes. No coding required!',
    author: 'Sarah Johnson',
    date: 'November 20, 2025',
    category: 'Tutorial',
    image: '🚀',
    readTime: '5 min read',
  },
  {
    id: 2,
    title: '10 Tips for Creating High-Converting Landing Pages',
    excerpt:
      'Discover the secrets to creating landing pages that convert visitors into customers.',
    author: 'Michael Chen',
    date: 'November 18, 2025',
    category: 'Marketing',
    image: '💡',
    readTime: '8 min read',
  },
  {
    id: 3,
    title: 'The Future of No-Code Development',
    excerpt:
      'Explore how no-code platforms are revolutionizing the way we build digital products.',
    author: 'Emily Rodriguez',
    date: 'November 15, 2025',
    category: 'Industry Insights',
    image: '🔮',
    readTime: '6 min read',
  },
  {
    id: 4,
    title: 'SEO Best Practices for Your Teacupnet Website',
    excerpt:
      'Optimize your website for search engines and increase your organic traffic.',
    author: 'David Park',
    date: 'November 12, 2025',
    category: 'SEO',
    image: '📈',
    readTime: '10 min read',
  },
  {
    id: 5,
    title: 'Customer Success Story: How Jane Grew Her Business 300%',
    excerpt:
      'Read how one entrepreneur used Teacupnet to triple her revenue in just 6 months.',
    author: 'Lisa Thompson',
    date: 'November 10, 2025',
    category: 'Success Stories',
    image: '⭐',
    readTime: '7 min read',
  },
  {
    id: 6,
    title: 'Design Trends to Watch in 2026',
    excerpt:
      'Stay ahead of the curve with these emerging web design trends for the new year.',
    author: 'Alex Kim',
    date: 'November 8, 2025',
    category: 'Design',
    image: '🎨',
    readTime: '9 min read',
  },
];

function Blogs() {
  return (
    <>
      <div>
        <div className='mx-auto container bg-linear-30'>
          <Navbar />
          <div className='min-h-[70vh] py-12 px-4'>
            <div className='max-w-6xl mx-auto'>
              <div className='text-center mb-12'>
                <h1 className='text-5xl ubuntu-font mb-4'>Our Blog</h1>
                <p className='text-xl text-gray-600'>
                  Insights, tutorials, and stories from the Teacupnet community
                </p>
              </div>

              {/* Blog Grid */}
              <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
                {demoBlogPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blogs/${post.id}`}
                    className='group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1'
                  >
                    {/* Blog Image/Icon */}
                    <div className='bg-gradient-to-br from-rose-100 to-rose-50 h-48 flex items-center justify-center text-6xl'>
                      {post.image}
                    </div>

                    {/* Blog Content */}
                    <div className='p-6'>
                      <div className='flex items-center gap-3 mb-3'>
                        <span className='text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1 rounded-full'>
                          {post.category}
                        </span>
                        <span className='text-xs text-gray-500'>
                          {post.readTime}
                        </span>
                      </div>

                      <h2 className='text-xl font-bold text-gray-900 mb-2 group-hover:text-rose-600 transition'>
                        {post.title}
                      </h2>

                      <p className='text-gray-600 mb-4 line-clamp-2'>
                        {post.excerpt}
                      </p>

                      <div className='flex items-center justify-between text-sm text-gray-500'>
                        <span>{post.author}</span>
                        <span>{post.date}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Blogs;
