import { useState, useRef, useEffect } from 'react';
import JoditEditor from 'jodit-react';
import {
  getUserBlogById,
  postBlog,
  updateUserBlog,
  type blogType,
} from '@/backendProvider';
import { useAuth } from '@/AuthProvider';
import { useParams } from 'react-router';
import Swal from 'sweetalert2';

const NewBlog = ({ isEditMode }: { isEditMode?: boolean }) => {
  // const [blogData, setBlogData] = useState<blogType | null>(null);
  const { id } = useParams();
  // console.log(id);
  // const isEditMode =
  const { user } = useAuth();
  // console.log(user);
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    data: '',
    created_by: user && typeof user === 'object' && user?.email,
  } as blogType);
  const editor = useRef(null);
  useEffect(() => {
    if (isEditMode) {
      getUserBlogById(Number(id)).then((data) => {
        if (data) {
          // setBlogData(data);
          setFormData(data);
        }
      });
    }
  }, [isEditMode, location]);

  const config = {
    readonly: false,
    placeholder: 'Start typing your content...',
    height: 400,
    toolbarAdaptive: false,
    toolbarSticky: true,
    buttons: [
      'bold',
      'italic',
      'underline',
      'strikethrough',
      '|',
      'ul',
      'ol',
      '|',
      'outdent',
      'indent',
      '|',
      'font',
      'fontsize',
      'brush',
      '|',
      'image',
      'link',
      '|',
      'align',
      '|',
      'undo',
      'redo',
      '|',
      'preview',
      'fullsize',
    ],
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // console.log('Form Data:', formData);
    Swal.fire({
      title: isEditMode ? 'Update Article?' : 'Publish Article?',
      text: isEditMode
        ? 'Do you want to update this article?'
        : 'Do you want to publish this article?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: isEditMode ? 'Yes, update it!' : 'Yes, publish it!',
    }).then((result) => {
      if (result.isConfirmed) {
        if (isEditMode) {
          updateUserBlog(Number(id), formData).then(() => {
            Swal.fire('Updated!', 'Your article has been updated.', 'success');
          });
        } else {
          postBlog(formData).then(() => {
            Swal.fire(
              'Published!',
              'Your article has been published.',
              'success'
            );
            setFormData({
              title: '',
              image: '',
              data: '',
              created_by: user && typeof user === 'object' && user?.email,
            } as blogType);
          });
        }
      }
    });
  };

  return (
    <div className='min-h-screen bg-gray-100 py-10'>
      <div className='max-w-4xl mx-auto p-8 rounded-2xl shadow-xl border bg-white border-rose-100'>
        <div className='mb-8 text-center'>
          <h1 className='text-3xl font-bold text-rose-600 mb-2 ubuntu-font'>
            Create New Article
          </h1>
          <p className='text-gray-600'>Share your knowledge with the world</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-8'>
          {/* Title */}
          <div className='group'>
            <label className='block text-sm font-semibold text-gray-700 mb-3 transition-all duration-200 group-focus-within:text-rose-600'>
              Article Title *
            </label>
            <input
              type='text'
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className='w-full px-4 py-3 border bg-white border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 hover:border-rose-300 text-lg font-medium'
              placeholder='Enter a compelling title...'
              required
            />
          </div>
          <div className='group'>
            <label className='block text-sm font-semibold text-gray-700 mb-3 transition-all duration-200 group-focus-within:text-rose-600'>
              Image URL *
            </label>
            <input
              type='text'
              value={formData.image}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, image: e.target.value }))
              }
              className='w-full px-4 py-3 border bg-white border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 hover:border-rose-300 text-lg font-medium'
              placeholder='Enter a compelling title...'
              required
            />
          </div>
          {/* Jodit Editor */}
          <div className='group'>
            <label className='block text-sm font-semibold text-gray-700 mb-3 transition-all duration-200 group-focus-within:text-rose-600'>
              Content *
            </label>
            <div className='border border-gray-300 rounded-xl overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md group-focus-within:border-rose-500 group-focus-within:ring-2 group-focus-within:ring-rose-500 group-focus-within:ring-opacity-20'>
              <JoditEditor
                ref={editor}
                value={formData.data}
                config={config}
                onBlur={(newContent) =>
                  setFormData((prev) => ({ ...prev, data: newContent }))
                }
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className='flex gap-4 pt-6 border-t border-gray-200'>
            <button
              type='submit'
              className='px-8 py-3 bg-rose-600 cursor-pointer text-white hover:bg-rose-700 font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2'
            >
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13 10V3L4 14h7v7l9-11h-7z'
                />
              </svg>
              Publish Article
            </button>

            <button
              type='button'
              className='px-6 py-3 bg-transparent cursor-pointer text-gray-500 font-medium rounded-xl hover:bg-gray-100 transition-all duration-200 ml-auto'
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewBlog;
