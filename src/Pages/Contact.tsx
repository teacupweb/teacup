import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

function Contact() {
  return (
    <>
      <div>
        <div className='mx-auto container bg-linear-30'>
          <Navbar />
          <div className='min-h-[70vh] py-12 px-4'>
            <div className='max-w-4xl mx-auto'>
              <h1 className='text-5xl ubuntu-font mb-8 text-center'>
                Contact Us
              </h1>

              <div className='grid md:grid-cols-2 gap-12'>
                {/* Contact Form */}
                <div>
                  <h2 className='text-3xl ubuntu-font mb-6 text-gray-900'>
                    Send us a Message
                  </h2>
                  <form className='space-y-4'>
                    <div>
                      <label
                        htmlFor='name'
                        className='block text-sm font-medium text-gray-700 mb-2'
                      >
                        Name
                      </label>
                      <input
                        type='text'
                        id='name'
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent'
                        placeholder='Your name'
                      />
                    </div>

                    <div>
                      <label
                        htmlFor='email'
                        className='block text-sm font-medium text-gray-700 mb-2'
                      >
                        Email
                      </label>
                      <input
                        type='email'
                        id='email'
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent'
                        placeholder='your.email@example.com'
                      />
                    </div>

                    <div>
                      <label
                        htmlFor='subject'
                        className='block text-sm font-medium text-gray-700 mb-2'
                      >
                        Subject
                      </label>
                      <input
                        type='text'
                        id='subject'
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent'
                        placeholder='How can we help?'
                      />
                    </div>

                    <div>
                      <label
                        htmlFor='message'
                        className='block text-sm font-medium text-gray-700 mb-2'
                      >
                        Message
                      </label>
                      <textarea
                        id='message'
                        rows={5}
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent'
                        placeholder='Tell us more about your inquiry...'
                      ></textarea>
                    </div>

                    <button
                      type='submit'
                      className='w-full bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700 transition font-medium'
                    >
                      Send Message
                    </button>
                  </form>
                </div>

                {/* Contact Information */}
                <div>
                  <h2 className='text-3xl ubuntu-font mb-6 text-gray-900'>
                    Get in Touch
                  </h2>
                  <div className='space-y-6'>
                    <div>
                      <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                        Email
                      </h3>
                      <p className='text-gray-700'>support@teacupnet.com</p>
                      <p className='text-gray-700'>sales@teacupnet.com</p>
                    </div>

                    <div>
                      <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                        Phone
                      </h3>
                      <p className='text-gray-700'>+1 (555) 123-4567</p>
                      <p className='text-gray-700'>Mon-Fri, 9am-6pm EST</p>
                    </div>

                    <div>
                      <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                        Office
                      </h3>
                      <p className='text-gray-700'>
                        123 Tech Street
                        <br />
                        Suite 456
                        <br />
                        San Francisco, CA 94102
                        <br />
                        United States
                      </p>
                    </div>

                    <div>
                      <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                        Social Media
                      </h3>
                      <div className='flex gap-4'>
                        <a
                          href='#'
                          className='text-rose-600 hover:text-rose-700 transition'
                        >
                          Twitter
                        </a>
                        <a
                          href='#'
                          className='text-rose-600 hover:text-rose-700 transition'
                        >
                          LinkedIn
                        </a>
                        <a
                          href='#'
                          className='text-rose-600 hover:text-rose-700 transition'
                        >
                          Facebook
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Contact;
