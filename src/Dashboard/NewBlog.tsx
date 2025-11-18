import BlogForm from '@/Components/BlogForm';

function NewBlog() {
  return (
    <div className='flex flex-col h-full my-10'>
      {/* <DashboardHeader /> */}
      <div className='flex flex-col'>
        <BlogForm />
      </div>
    </div>
  );
}

export default NewBlog;
