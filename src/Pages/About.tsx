import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

function About() {
  return (
    <>
      <div className='bg-background text-foreground transition-colors duration-300'>
        <div className='mx-auto container'>
          <Navbar />
          <div className='min-h-[70vh] py-12 px-4'>
            <div className='max-w-4xl mx-auto'>
              <h1 className='text-5xl ubuntu-font mb-8 text-center text-foreground'>
                About Teacup
              </h1>
              
              <div className='space-y-6 text-lg text-muted-foreground'>
                <p>
                  Welcome to Teacup, your trusted partner in building powerful
                  websites without the technical complexity. We believe that every
                  business deserves a professional online presence, regardless of
                  their technical expertise.
                </p>

                <h2 className='text-3xl ubuntu-font mt-10 mb-4 text-foreground'>
                  Our Mission
                </h2>
                <p>
                  Our mission is to empower retail, ecommerce, and service businesses
                  with a 100% no-code SaaS platform that delivers professional results.
                  We're committed to removing technical barriers so you can focus on
                  what matters most – growing your business.
                </p>

                <h2 className='text-3xl ubuntu-font mt-10 mb-4 text-foreground'>
                  Why Choose Teacup?
                </h2>
                <ul className='list-disc list-inside space-y-3 ml-4'>
                  <li>
                    <strong>100% No-Code:</strong> Build powerful websites without
                    writing a single line of code
                  </li>
                  <li>
                    <strong>Fast & Professional:</strong> Launch quickly with
                    beautiful, conversion-optimized templates
                  </li>
                  <li>
                    <strong>Automated Growth:</strong> Built-in tools to boost
                    customer acquisition automatically
                  </li>
                  <li>
                    <strong>No Technical Headaches:</strong> Focus on your business
                    while we handle the technology
                  </li>
                  <li>
                    <strong>Dedicated Support:</strong> Our team is here to help you
                    succeed every step of the way
                  </li>
                </ul>

                <h2 className='text-3xl ubuntu-font mt-10 mb-4 text-gray-900'>
                  Our Story
                </h2>
                <p>
                  Teacup was born from a simple observation: too many great
                  businesses struggle with their online presence because traditional
                  web development is too complex and expensive. We set out to change
                  that by creating a platform that puts powerful web technology in
                  the hands of everyone.
                </p>

                <p>
                  Today, we're proud to serve businesses of all sizes, helping them
                  create stunning websites that drive real results. No coding, no
                  staff, no stress – just results.
                </p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default About;
