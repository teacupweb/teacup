import { Route, Routes } from 'react-router';
import App from './App';
import Layout from './Dashboard/Layout';
import Dashboard from './Dashboard/Dashboard';
import Blogs from './Dashboard/Blogs';
import Settings from './Dashboard/Settings';
import Inboxes from './Dashboard/Inboxes';
import Naviq from './Dashboard/Naviq';
import NewBlog from './Dashboard/NewBlog';
import AuthPage from './Dashboard/Auth';
import Inbox from './Dashboard/Inbox';

function Router() {
  return (
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='/login' element={<AuthPage isLogin />} />
      <Route path='/signup' element={<AuthPage isLogin={false} />} />
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

        <Route path='/Dashboard/Naviq' element={<Naviq />} />
        <Route path='/Dashboard/Settings' element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default Router;
