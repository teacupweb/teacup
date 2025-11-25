import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { useParams, Link } from 'react-router';

// Demo blog data (same as in Blogs.tsx)
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
    content: `
      <h2>Introduction</h2>
      <p>Welcome to Teacupnet! In this comprehensive guide, we'll walk you through everything you need to know to create your first professional website in just 5 minutes.</p>
      
      <h2>Step 1: Sign Up</h2>
      <p>Getting started is simple. Just head to our signup page and create your free account. No credit card required!</p>
      
      <h2>Step 2: Choose Your Template</h2>
      <p>Browse our collection of beautiful, professionally designed templates. Whether you're building an e-commerce store, a portfolio, or a business website, we have the perfect template for you.</p>
      
      <h2>Step 3: Customize Your Design</h2>
      <p>Use our intuitive drag-and-drop editor to customize your website. Change colors, fonts, images, and content with just a few clicks.</p>
      
      <h2>Step 4: Add Your Content</h2>
      <p>Fill in your website with your own text, images, and media. Our editor makes it easy to create engaging content that resonates with your audience.</p>
      
      <h2>Step 5: Publish!</h2>
      <p>Once you're happy with your website, hit the publish button and your site will be live on the internet instantly!</p>
      
      <h2>Conclusion</h2>
      <p>That's it! You've just created your first website with Teacupnet. Now you can focus on growing your business while we handle all the technical details.</p>
    `,
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
    content: `
      <h2>Why Landing Pages Matter</h2>
      <p>Landing pages are crucial for converting visitors into customers. A well-designed landing page can dramatically increase your conversion rates and grow your business.</p>
      
      <h2>Tip 1: Clear Value Proposition</h2>
      <p>Make sure your headline clearly communicates the value you're offering. Visitors should understand what you do within 5 seconds.</p>
      
      <h2>Tip 2: Strong Call-to-Action</h2>
      <p>Use compelling CTAs that tell visitors exactly what to do next. Make your buttons stand out with contrasting colors.</p>
      
      <h2>Tip 3: Social Proof</h2>
      <p>Include testimonials, reviews, and case studies to build trust with your visitors.</p>
      
      <p><em>This is demo content. The full article would contain all 10 tips with detailed explanations.</em></p>
    `,
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
    content: `
      <h2>The No-Code Revolution</h2>
      <p>No-code development is transforming the tech industry, enabling anyone to build sophisticated applications without writing code.</p>
      
      <h2>Democratizing Technology</h2>
      <p>No-code platforms are making technology accessible to everyone, not just developers. This democratization is empowering entrepreneurs and businesses worldwide.</p>
      
      <h2>The Future is Bright</h2>
      <p>As no-code platforms continue to evolve, we'll see even more powerful tools that enable rapid innovation and digital transformation.</p>
      
      <p><em>This is demo content showcasing a blog post about industry trends.</em></p>
    `,
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
    content: `
      <h2>Understanding SEO</h2>
      <p>Search Engine Optimization (SEO) is essential for driving organic traffic to your website. Let's explore the best practices.</p>
      
      <h2>Keyword Research</h2>
      <p>Start by identifying the keywords your target audience is searching for. Use tools like Google Keyword Planner to find relevant terms.</p>
      
      <h2>On-Page Optimization</h2>
      <p>Optimize your page titles, meta descriptions, headers, and content with your target keywords.</p>
      
      <p><em>This is demo content about SEO strategies.</em></p>
    `,
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
    content: `
      <h2>Meet Jane</h2>
      <p>Jane is a small business owner who was struggling to establish an online presence. Her old website was outdated and difficult to manage.</p>
      
      <h2>The Challenge</h2>
      <p>Jane needed a professional website that could showcase her products and accept online orders, but she didn't have the budget for a developer.</p>
      
      <h2>The Solution</h2>
      <p>Jane discovered Teacupnet and built her new website in just one weekend. The results were immediate and impressive.</p>
      
      <h2>The Results</h2>
      <p>Within 6 months, Jane's revenue increased by 300%. She now processes orders online and has expanded her customer base significantly.</p>
      
      <p><em>This is a demo success story showcasing customer results.</em></p>
    `,
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
    content: `
      <h2>Looking Ahead</h2>
      <p>As we approach 2026, several exciting design trends are emerging that will shape the future of web design.</p>
      
      <h2>Trend 1: Immersive 3D Elements</h2>
      <p>3D graphics and animations are becoming more accessible and will create more engaging user experiences.</p>
      
      <h2>Trend 2: Dark Mode Everything</h2>
      <p>Dark mode is no longer optional. Users expect it, and it's becoming a standard feature.</p>
      
      <h2>Trend 3: Micro-Interactions</h2>
      <p>Subtle animations and interactions make websites feel more alive and responsive.</p>
      
      <p><em>This is demo content about design trends.</em></p>
    `,
  },
];

function BlogPost() {
  const { id } = useParams();
  const post = demoBlogPosts.find((p) => p.id === Number(id));

  if (!post) {
    return (
      <>
        <div>
          <div className='mx-auto container bg-linear-30'>
            <Navbar />
            <div className='min-h-[70vh] py-12 px-4 flex items-center justify-center'>
              <div className='text-center'>
                <h1 className='text-4xl ubuntu-font mb-4'>Blog Post Not Found</h1>
                <Link
                  to='/blogs'
                  className='text-rose-600 hover:text-rose-700 underline'
                >
                  ← Back to Blogs
                </Link>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <div>
        <div className='mx-auto container bg-linear-30'>
          <Navbar />
          <div className='min-h-[70vh] py-12 px-4'>
            <div className='max-w-4xl mx-auto'>
              {/* Back Link */}
              <Link
                to='/blogs'
                className='text-rose-600 hover:text-rose-700 mb-6 inline-block'
              >
                ← Back to Blogs
              </Link>

              {/* Blog Header */}
              <div className='mb-8'>
                <div className='flex items-center gap-3 mb-4'>
                  <span className='text-sm font-semibold text-rose-600 bg-rose-50 px-3 py-1 rounded-full'>
                    {post.category}
                  </span>
                  <span className='text-sm text-gray-500'>{post.readTime}</span>
                </div>

                <h1 className='text-5xl ubuntu-font mb-4'>{post.title}</h1>

                <div className='flex items-center gap-4 text-gray-600'>
                  <span>By {post.author}</span>
                  <span>•</span>
                  <span>{post.date}</span>
                </div>
              </div>

              {/* Blog Image */}
              <div className='bg-gradient-to-br from-rose-100 to-rose-50 h-96 rounded-2xl flex items-center justify-center text-9xl mb-8'>
                {post.image}
              </div>

              {/* Blog Content */}
              <div
                className='prose prose-lg max-w-none'
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Author Bio */}
              <div className='mt-12 p-6 bg-gray-50 rounded-2xl'>
                <h3 className='text-xl font-bold mb-2'>About the Author</h3>
                <p className='text-gray-700'>
                  <strong>{post.author}</strong> is a content writer at Teacupnet,
                  passionate about helping businesses succeed online.
                </p>
              </div>

              {/* Back Link */}
              <div className='mt-8 text-center'>
                <Link
                  to='/blogs'
                  className='text-rose-600 hover:text-rose-700 underline'
                >
                  ← Back to All Blogs
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default BlogPost;
