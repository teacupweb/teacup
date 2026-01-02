import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { Link } from 'react-router';

// Demo blog data
const demoBlogPosts = [
  {
    id: 1,
    title: 'Getting Started with Teacup: A Complete Guide',
    excerpt:
      'Learn how to build your first website with Teacup in just 5 minutes. No coding required!',
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
    title: 'SEO Best Practices for Your Teacup Website',
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
      'Read how one entrepreneur used Teacup to triple her revenue in just 6 months.',
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
      <div className='bg-background text-foreground transition-colors duration-300'>
        <div className='mx-auto container'>
          <Navbar />
          <div className='min-h-[70vh] py-12 px-4'>
            <div className='max-w-6xl mx-auto'>
              <div className='text-center mb-12'>
                <h1 className='text-5xl ubuntu-font mb-4 text-foreground'>Our Blog</h1>
                <p className='text-xl text-muted-foreground'>
                  Insights, tutorials, and stories from the Teacup community
                </p>
              </div>

              {/* Blog Grid */}
              <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
                {demoBlogPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blogs/${post.id}`}
                    className='group bg-card text-card-foreground rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1'
                  >
                    {/* Blog Image/Icon */}
                    <div className='bg-gradient-to-br from-rose-100 to-rose-50 h-48 flex items-center justify-center text-6xl'>
                      {post.image}
                    </div>

                    {/* Blog Content */}
                    <div className='p-6'>
                      <div className='flex items-center gap-3 mb-3'>
                        <span className='text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-900/30 px-3 py-1 rounded-full'>
                          {post.category}
                        </span>
                        <span className='text-xs text-muted-foreground'>
                          {post.readTime}
                        </span>
                      </div>

                      <h2 className='text-xl font-bold text-foreground mb-2 group-hover:text-rose-600 transition'>
                        {post.title}
                      </h2>

                      <p className='text-muted-foreground mb-4 line-clamp-2'>
                        {post.excerpt}
                      </p>

                      <div className='flex items-center justify-between text-sm text-muted-foreground'>
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
