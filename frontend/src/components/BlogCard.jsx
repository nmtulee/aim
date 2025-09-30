import { AiFillDelete } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { useDeleteBlogMutation } from '../redux/api/blogApiSlice.js';
import { useDeleteImgMutation } from '../redux/api/imgUploadApiSlise.js';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { useState, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import ConfirmationDialog from './ConfirmationDialog.jsx';

const BlogCard = ({ blog }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imgRef = useRef(null);

  const [DeleteBlog] = useDeleteBlogMutation();
  const [DeleteImage] = useDeleteImgMutation();

  const handleDelete = useCallback(async () => {
    try {
      const res = await DeleteBlog(blog._id).unwrap();
      toast.success(res.message);
      if (blog.image) {
        const imgname = blog.image.split('/').pop();
        await DeleteImage(imgname).unwrap();
      }
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  }, [DeleteBlog, DeleteImage, blog._id, blog.image]);

  const openDialog = useCallback(() => {
    setIsDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  const toggleDescription = useCallback(() => {
    setShowFullDesc((prev) => !prev);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  // Memoized description rendering
  const descriptionContent = (() => {
    if (blog.description.length <= 100) {
      return blog.description;
    }

    return (
      <>
        {showFullDesc
          ? blog.description
          : `${blog.description.slice(0, 100)}...`}
        <span
          className='text-gray-500 text-sm font-semibold cursor-pointer ml-1 hover:text-gray-700'
          onClick={toggleDescription}
        >
          {showFullDesc ? 'Show less' : 'See more'}
        </span>
      </>
    );
  })();

  return (
    <div className='w-full max-w-sm bg-white shadow-md rounded-lg overflow-hidden flex flex-col gap-2 p-4 mx-auto sm:mx-0'>
      <div className='relative'>
        {!imageLoaded && !imageError && (
          <div className='w-full h-48 bg-gray-200 animate-pulse rounded-md' />
        )}
        {imageError ? (
          <div className='w-full h-48 bg-gray-200 flex items-center justify-center rounded-md'>
            <span className='text-gray-500'>Image not available</span>
          </div>
        ) : (
          <img
            ref={imgRef}
            src={blog.image}
            alt={blog.title}
            loading='lazy'
            className={`w-full h-48 object-cover rounded-md transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
      </div>

      <h2 className='text-lg sm:text-xl font-semibold line-clamp-2'>
        {blog.title}
      </h2>

      <p className='text-sm text-gray-700 line-clamp-3'>{descriptionContent}</p>

      <p className='text-sm text-gray-500'>
        {moment(blog?.createdAt).format('MMMM Do YYYY')}
      </p>

      <p className='text-sm text-gray-600'>
        Written by {blog.user?.name || 'AIM'}
      </p>

      <div className='mt-2 flex justify-between items-center gap-3 flex-wrap'>
        <Link
          to={`/blog/${blog?._id}`}
          className='bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md shadow-md transition-colors duration-300'
        >
          Learn more
        </Link>

        {userInfo?.isVarify && userInfo?.isAdmin && (
          <>
            <button
              onClick={openDialog}
              className='hover:scale-110 hover:bg-red-500 bg-blue-500 px-4 py-2 rounded-md text-white transition-all duration-300'
              aria-label='Delete blog'
            >
              <AiFillDelete className='hover:scale-110' />
            </button>

            <ConfirmationDialog
              isOpen={isDialogOpen}
              onClose={closeDialog}
              onConfirm={handleDelete}
              message='Are you sure you want to delete this Blog?'
            />
          </>
        )}
      </div>
    </div>
  );
};

export default BlogCard;
