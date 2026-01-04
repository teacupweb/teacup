import { Route, Routes } from 'react-router';
import App from './App';
import Layout from './Dashboard/Layout';
import Dashboard from './Dashboard/Dashboard';
import Blogs from './Dashboard/Blogs';
import Settings from './Dashboard/Settings';
import Inboxes from './Dashboard/Inboxes';
import NewBlog from './Dashboard/NewBlog';
import AuthPage from './Dashboard/Auth';
import Inbox from './Dashboard/Inbox';
import About from './Pages/About';
import Contact from './Pages/Contact';
import PublicBlogs from './Pages/Blogs';
import BlogPost from './Pages/BlogPost';
import Welcome from './Dashboard/Welcome';
import Analytics from './Dashboard/Analytics/Analytics';
import WebsiteServices from './Dashboard/WebsiteServices';

function Router() {
  return (
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='/about' element={<About />} />
      <Route path='/contact' element={<Contact />} />
      <Route path='/blogs' element={<PublicBlogs />} />
      <Route path='/blogs/:id' element={<BlogPost />} />
      <Route path='/login' element={<AuthPage isLogin />} />
      <Route path='/signup' element={<AuthPage isLogin={false} />} />
      <Route path='/welcome' element={<Welcome />} />
      <Route path='*' element={<App />} />
      <Route path='/Dashboard' element={<Layout />}>
        <Route path='/Dashboard' element={<Dashboard />} />
        <Route path='/Dashboard/inboxes'>
          <Route path='/Dashboard/inboxes' element={<Inboxes />} />
          <Route path='/Dashboard/inboxes/:id' element={<Inbox />} />
        </Route>
        <Route path='/Dashboard/Blogs'>
          <Route path='/Dashboard/Blogs' element={<Blogs />} />
          <Route
            path='/Dashboard/Blogs/edit/:id'
            element={<NewBlog isEditMode />}
          />
          <Route path='/Dashboard/Blogs/new' element={<NewBlog />} />
        </Route>
        <Route path='/Dashboard/Analytics' element={<Analytics />} />
        <Route path='/Dashboard/Services' element={<WebsiteServices />} />
        <Route path='/Dashboard/Settings' element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default Router;
