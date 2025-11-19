import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import { Link } from 'react-router';
// import { useContext } from 'react';
// import { authContext } from './AuthProvider';

function App() {
  // const { login } = useContext(authContext);
  // login();
  return (
    <>
      <div>
        <div className='mx-auto container bg-linear-30'>
          <Navbar />
          <div className='min-h-[70vh] flex flex-col items-center justify-center'>
            <div className='flex flex-col gap-6 max-w-4xl text-center px-4'>
              <span className='bg-rose-100 rounded-3xl'>
                Try Teacupnet for free for the first time.
              </span>
              <h1 className='text-6xl ubuntu-font '>
                Easy use Tech with Teacupnet
              </h1>
              <p className='text-xl text-gray-600'>
                Teacupnet is a 100% no-code SaaS for retail, ecommerce, and
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
