import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import { Link } from 'react-router';
import { useEffect } from 'react';
// import { useContext } from 'react';
// import { authContext } from './AuthProvider';

function App() {
  // const { login } = useContext(authContext);
  // login();
  
  // Force light theme on the main page
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
  }, []);
  
  return (
    <>
      <div className='bg-background text-foreground transition-colors duration-300'>
        <div className='mx-auto container'>
          <Navbar />
          <div className='min-h-[70vh] flex flex-col items-center justify-center'>
            <div className='flex flex-col gap-6 max-w-4xl text-center px-4'>
              <span className='bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-1 rounded-3xl w-fit mx-auto text-sm font-medium'>
                Try Teacup for free for the first time.
              </span>
              <h1 className='text-6xl ubuntu-font text-foreground'>
                Easy use Tech with Teacup
              </h1>
              <p className='text-xl text-muted-foreground'>
                Teacup is a 100% no-code SaaS for retail, ecommerce, and
                service businesses who want a powerful website without technical
                headaches. Launch a fast, professional site that boosts customer
                acquisition automatically, while you focus on growing your
                business. No coding, no staff, no stress – just results.
              </p>
              <div className='flex gap-2 items-center justify-center'>
                <Link to='/login'>
                  <button className='bg-rose-600 cursor-pointer text-white px-6 py-3 rounded-2xl text-lg hover:bg-rose-700 transition'>
                    Get Started
                  </button>
                </Link>

                {/* <button className='border-rose-600 border-3 cursor-pointer text-rose-600 px-6 py-3 rounded-2xl text-lg hover:bg-gray-200 transition'>
                  Demo
                </button> */}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
