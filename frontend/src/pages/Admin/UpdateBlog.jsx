import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useUpdateBlogMutation,
  useGetBlogByIdQuery,
} from '../../redux/api/blogApiSlice.js';
import {
  useUploadImgMutation,
  useDeleteImgMutation,
} from '../../redux/api/imgUploadApiSlise.js';
import { toast } from 'react-toastify';

const UpdateBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: BlogData, isLoading: blogLoading } = useGetBlogByIdQuery(id);

  const [title, setTitle] = useState(BlogData?.title || '');
  const [description, setDescription] = useState(BlogData?.description || '');
  const [image, setImage] = useState(BlogData?.image || '');
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [UpdateBlog, { isLoading: BlogLoading }] = useUpdateBlogMutation();
  const [UploadImg] = useUploadImgMutation();
  const [deleteImg] = useDeleteImgMutation();

  useEffect(() => {
    if (BlogData) {
      setTitle(BlogData?.title || '');
      setDescription(BlogData?.description || '');
      setImage(BlogData?.image || '');
    }
  }, [BlogData]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);

    try {
      // Delete old image if exists
      if (image) {
        try {
          const imgname = image.split('/').pop();
          await deleteImg(imgname).unwrap();
        } catch (err) {
          console.warn('Old image delete failed:', err);
        }
      }

      const formData = new FormData();
      formData.append('image', file);

      const res = await UploadImg(formData).unwrap();
      setImage(res.image);
      toast.success(res.message);
      await UpdateBlog({ id: BlogData._id, image: res.image });
    } catch (err) {
      toast.error(err?.data?.message || err.error);
      setImagePreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!description.trim()) {
      toast.error('Description is required');
      return;
    }

    try {
      const res = await UpdateBlog({
        id: BlogData._id,
        title: title.trim(),
        description: description.trim(),
      }).unwrap();
      toast.success(res.message);
      navigate(`/blog/${BlogData._id}`);
    } catch (err) {
      console.log(err);
      
      toast.error(err?.data?.message || err.error);
    }
  };

  const removeImage = async () => {
    if (image) {
      try {
        const imgname = image.split('/').pop();
        await deleteImg(imgname).unwrap();
        setImage('');
        setImagePreview(null);
        await UpdateBlog({ id: BlogData._id, image: '' });
        toast.success('Image removed successfully');
      } catch (err) {
        toast.error('Failed to remove image');
      }
    }
  };

  if (blogLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center '>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading blog data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16 px-4 my-10 '>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4'>
            Update Blog
          </h1>
          <p className='text-gray-600 text-lg'>
            Make your story shine with updated content
          </p>
        </div>

        {/* Main Form Container */}
        <div className='bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden'>
          <div className='p-8 md:p-12'>
            <form onSubmit={submitHandler} className='space-y-8'>
              {/* Title Input */}
              <div className='group'>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Blog Title
                </label>
                <input
                  type='text'
                  placeholder='Enter an engaging title...'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className='w-full bg-white/80 border-2 border-gray-200 px-6 py-4 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-lg placeholder-gray-400 group-hover:border-gray-300'
                  required
                />
                <div className='mt-1 text-right text-sm text-gray-500'>
                  {title.length}/100
                </div>
              </div>

              {/* Description Textarea */}
              <div className='group'>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Blog Content
                </label>
                <textarea
                  placeholder='Share your story, insights, or thoughts...'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className='w-full bg-white/80 border-2 border-gray-200 px-6 py-4 rounded-2xl resize-none focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-lg placeholder-gray-400 group-hover:border-gray-300'
                  rows={8}
                  required
                />
                <div className='mt-1 text-right text-sm text-gray-500'>
                  {description.length} characters
                </div>
              </div>

              {/* Image Upload Section */}
              <div className='space-y-4'>
                <label className='block text-sm font-semibold text-gray-700'>
                  Featured Image
                </label>

                {/* Current/Preview Image */}
                {(image || imagePreview) && (
                  <div className='relative group'>
                    <img
                      src={imagePreview || image}
                      alt='Blog preview'
                      className='w-full h-72 object-cover rounded-2xl border-4 border-white shadow-lg'
                    />
                    <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center'>
                      <button
                        type='button'
                        onClick={removeImage}
                        className='bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors'
                      >
                        Remove Image
                      </button>
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                <div className='relative'>
                  <input
                    type='file'
                    onChange={uploadFileHandler}
                    accept='image/*'
                    className='hidden'
                    id='image-upload'
                    disabled={isUploading}
                  />
                  <label
                    htmlFor='image-upload'
                    className={`block w-full cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-2 border-transparent px-6 py-4 rounded-2xl text-center font-semibold transition-all duration-300 transform hover:scale-105 ${
                      isUploading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isUploading ? (
                      <div className='flex items-center justify-center'>
                        <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3'></div>
                        Uploading...
                      </div>
                    ) : (
                      <div className='flex items-center justify-center'>
                        <svg
                          className='w-5 h-5 mr-2'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                          />
                        </svg>
                        {image ? 'Change Image' : 'Upload Image'}
                      </div>
                    )}
                  </label>
                </div>

                <p className='text-sm text-gray-500 text-center'>
                  Supports JPG, PNG, GIF up to 5MB
                </p>
              </div>

              {/* Action Buttons */}
              <div className='flex flex-col sm:flex-row gap-4 pt-6'>
                <button
                  type='button'
                  onClick={() => navigate(-1)}
                  className='flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={BlogLoading || isUploading}
                  className={`flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    BlogLoading || isUploading
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  {BlogLoading ? (
                    <div className='flex items-center justify-center'>
                      <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3'></div>
                      Updating...
                    </div>
                  ) : (
                    'Update Blog'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Helper Tips */}
        <div className='mt-8 grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20'>
            <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-4'>
              <svg
                className='w-5 h-5 text-blue-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                />
              </svg>
            </div>
            <h3 className='font-semibold text-gray-800 mb-2'>Engaging Title</h3>
            <p className='text-sm text-gray-600'>
              Write a compelling title that captures your reader's attention
            </p>
          </div>

          <div className='bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20'>
            <div className='w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-4'>
              <svg
                className='w-5 h-5 text-purple-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                />
              </svg>
            </div>
            <h3 className='font-semibold text-gray-800 mb-2'>Quality Image</h3>
            <p className='text-sm text-gray-600'>
              Use high-quality images that complement your content
            </p>
          </div>

          <div className='bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20'>
            <div className='w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-4'>
              <svg
                className='w-5 h-5 text-green-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </div>
            <h3 className='font-semibold text-gray-800 mb-2'>Rich Content</h3>
            <p className='text-sm text-gray-600'>
              Create valuable, informative content that provides real value
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateBlog;
