import { useState, useRef, useEffect } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import envData from '@/envData';
import {
  useBlog,
  useCreateBlog,
  useUpdateBlog,
  type blogType,
} from '@/backendProvider';
import { useAuth } from '@/AuthProvider';
import { useParams, useNavigate } from 'react-router';
import Swal from 'sweetalert2';

const NewBlog = ({ isEditMode }: { isEditMode?: boolean }) => {
  const { cloudinaryName, cloudinaryPreset } = envData;
  console.log(cloudinaryPreset);
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const userEmail = user !== 'userNotFound' && user ? user.email : null;

  // Mutations
  const createBlogMutation = useCreateBlog();
  const updateBlogMutation = useUpdateBlog();

  // Fetch Blog Data for Edit Mode
  const { data: blogData } = useBlog(userEmail, id);

  // Refs for Quill
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const quillInstanceRef = useRef<Quill | null>(null);
  const isQuillInitialized = useRef(false);

  const [formData, setFormData] = useState({
    title: '',
    image: '',
    data: '',
    created_by: userEmail || '',
  } as blogType);

  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize Quill
  useEffect(() => {
    if (editorContainerRef.current && !isQuillInitialized.current) {
      const modules = {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['link', 'image', 'video'],
          [{ color: [] }, { background: [] }],
          ['clean'],
        ],
      };

      const quill = new Quill(editorContainerRef.current, {
        theme: 'snow',
        modules,
        placeholder: 'Write your article content here...',
      });

      quillInstanceRef.current = quill;
      isQuillInitialized.current = true;

      // Handle text change
      quill.on('text-change', () => {
        setFormData((prev) => ({ ...prev, data: quill.root.innerHTML }));
      });

      // If we have initial data (e.g. from a re-render or if data loaded fast), set it
      if (formData.data && formData.data !== '<p><br></p>') {
        // Check if content is different to avoid cursor jumps or loops
        if (quill.root.innerHTML !== formData.data) {
          quill.clipboard.dangerouslyPasteHTML(formData.data);
        }
      }
    }
  }, []); // Run once on mount

  // Update form data when blogData is fetched
  useEffect(() => {
    if (isEditMode && blogData) {
      setFormData(blogData);
      if (blogData.image) {
        setPreviewUrl(blogData.image);
      }

      // Update Quill content if initialized
      if (quillInstanceRef.current && blogData.data) {
        quillInstanceRef.current.clipboard.dangerouslyPasteHTML(blogData.data);
      }
    }
  }, [isEditMode, blogData]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      Swal.fire('Error', 'Please select a valid image file', 'error');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire('Error', 'Image size should be less than 5MB', 'error');
      return;
    }

    setSelectedFile(file);

    // Create preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const uploadImageToServer = async (file: File): Promise<string> => {
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('upload_preset', cloudinaryPreset);
      uploadFormData.append('cloud_name', cloudinaryName);
      uploadFormData.append('file', file);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryName}/image/upload`,
        {
          method: 'POST',
          body: uploadFormData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      const imageUrl = result.secure_url || result.url;

      if (!imageUrl) {
        throw new Error('No image URL returned from Cloudinary');
      }

      return imageUrl;
    } catch (error) {
      console.error('Upload error details:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if we have either a file or an existing image URL
    if (!formData.image && !selectedFile) {
      Swal.fire(
        'Error',
        'Please provide an image by uploading a file',
        'error'
      );
      return;
    }

    // Basic form validation
    if (
      !formData.title.trim() ||
      !formData.data.trim() ||
      formData.data === '<p><br></p>'
    ) {
      Swal.fire('Error', 'Please fill in all required fields', 'error');
      return;
    }

    setIsUploading(true);

    try {
      let finalImageUrl = formData.image;

      // If a file is selected, upload it first
      if (selectedFile) {
        finalImageUrl = await uploadImageToServer(selectedFile);
      }

      const submitData = {
        ...formData,
        image: finalImageUrl,
        // Ensure created_by is set if it wasn't already
        created_by: formData.created_by || userEmail || '',
      };

      const result = await Swal.fire({
        title: isEditMode ? 'Update Article?' : 'Publish Article?',
        text: isEditMode
          ? 'Do you want to update this article?'
          : 'Do you want to publish this article?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#e11d48', // rose-600
        cancelButtonColor: '#6b7280', // gray-500
        confirmButtonText: isEditMode ? 'Yes, update it!' : 'Yes, publish it!',
      });

      if (result.isConfirmed) {
        if (isEditMode) {
          await updateBlogMutation.mutateAsync({
            id: Number(id),
            blog: submitData as blogType,
          });
          await Swal.fire(
            'Updated!',
            'Your article has been updated.',
            'success'
          );
        } else {
          await createBlogMutation.mutateAsync(submitData as blogType);
          await Swal.fire(
            'Published!',
            'Your article has been published.',
            'success'
          );
        }
        navigate('/dashboard/Blogs');
      }
    } catch (error) {
      console.error('Submission error:', error);
      Swal.fire(
        'Error',
        `Failed to process your request: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        'error'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const clearFileSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(formData.image || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/Blogs');
  };

  return (
    <div className='min-h-screen bg-white py-10'>
      <div className='max-w-5xl mx-auto p-8 rounded-2xl shadow-sm border bg-white border-gray-100'>
        <div className='mb-8 flex items-center justify-between border-b border-gray-100 pb-6'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 mb-2 ubuntu-font'>
              {isEditMode ? 'Edit Article' : 'Create New Article'}
            </h1>
            <p className='text-gray-500'>Share your knowledge with the world</p>
          </div>
          <button
            onClick={handleCancel}
            className='text-gray-400 hover:text-gray-600 transition-colors'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className='space-y-8'>
          {/* Title */}
          <div className='group'>
            <label className='block text-sm font-semibold text-gray-700 mb-2 transition-all duration-200 group-focus-within:text-rose-600'>
              Article Title <span className='text-rose-500'>*</span>
            </label>
            <input
              type='text'
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className='w-full px-4 py-3 border bg-gray-50 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all duration-200 text-lg font-medium placeholder-gray-400'
              placeholder='Enter a compelling title...'
              required
            />
          </div>

          {/* Image Section */}
          <div className='space-y-4'>
            <label className='block text-sm font-semibold text-gray-700 mb-2 transition-all duration-200 group-focus-within:text-rose-600'>
              Cover Image <span className='text-rose-500'>*</span>
            </label>

            <div className='border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-rose-400 transition-colors bg-gray-50/50 text-center relative group'>
              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                onChange={handleFileSelect}
                className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10'
                id='image-upload'
              />

              {previewUrl ? (
                <div className='relative inline-block max-h-64 rounded-lg overflow-hidden shadow-md'>
                  <img
                    src={previewUrl}
                    alt='Preview'
                    className='max-h-64 w-auto object-cover'
                  />
                  <div className='absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                    <p className='text-white font-medium'>
                      Click to change image
                    </p>
                  </div>
                  <button
                    type='button'
                    onClick={(e) => {
                      e.preventDefault();
                      clearFileSelection();
                    }}
                    className='absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 z-20'
                    title='Remove image'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-4 w-4'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className='py-8'>
                  <div className='mx-auto h-12 w-12 text-gray-400 mb-3'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={1.5}
                        d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                      />
                    </svg>
                  </div>
                  <p className='text-gray-600 font-medium'>
                    Click to upload or drag and drop
                  </p>
                  <p className='text-sm text-gray-400 mt-1'>
                    SVG, PNG, JPG or GIF (max. 5MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Editor */}
          <div className='group'>
            <label className='block text-sm font-semibold text-gray-700 mb-2 transition-all duration-200 group-focus-within:text-rose-600'>
              Content <span className='text-rose-500'>*</span>
            </label>
            <div className='bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md focus-within:ring-2 focus-within:ring-rose-500/20 focus-within:border-rose-500'>
              <div
                ref={editorContainerRef}
                style={{ minHeight: '400px', height: '500px', border: 'none' }}
              ></div>
            </div>
          </div>

          {/* Form Actions */}
          <div className='flex gap-4 pt-6 border-t border-gray-100'>
            <button
              type='button'
              onClick={handleCancel}
              className='px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 shadow-sm'
            >
              Cancel
            </button>

            <button
              type='submit'
              disabled={isUploading}
              className={`px-8 py-3 bg-rose-600 text-white hover:bg-rose-700 font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-rose-500/30 transform hover:-translate-y-0.5 flex items-center gap-2 ml-auto ${
                isUploading ? 'opacity-70 cursor-wait' : 'cursor-pointer'
              }`}
            >
              {isUploading ? (
                <>
                  <div className='animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent'></div>
                  <span>{isEditMode ? 'Updating...' : 'Publishing...'}</span>
                </>
              ) : (
                <>
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
                  <span>
                    {isEditMode ? 'Update Article' : 'Publish Article'}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewBlog;
