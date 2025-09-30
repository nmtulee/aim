import moment from 'moment';
import { FaComments, FaCalendar, FaUser } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';

const BlogHeader = ({ blog }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  if (!blog) return null;

  const canUpdate = userInfo?.isVarify && userInfo?.isAdmin;

  return (
    <div className='flex flex-col lg:flex-row justify-evenly gap-6 p-4'>
      {/* Left Side - Image */}
      <div className='bg-white shadow-md p-4 rounded-lg flex-1 max-w-2xl'>
        <div className='relative mb-4'>
          {!imageLoaded && !imageError && (
            <div className='w-full h-64 bg-gray-200 animate-pulse rounded-md' />
          )}
          {imageError ? (
            <div className='w-full h-64 bg-gray-200 flex items-center justify-center rounded-md'>
              <span className='text-gray-500'>Image not available</span>
            </div>
          ) : (
            <img
              src={blog.image}
              alt={blog.title}
              loading='lazy'
              className={`w-full h-64 object-cover rounded-md transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}
        </div>

        {/* Metadata */}
        <div className='flex flex-col sm:flex-row justify-between gap-4 text-gray-600 text-sm'>
          <div className='flex items-center gap-2'>
            <FaCalendar className='text-blue-500' />
            <time dateTime={blog.createdAt}>
              {moment(blog.createdAt).format('MMMM Do YYYY')}
            </time>
          </div>
          <div className='flex items-center gap-2'>
            <FaComments className='text-green-500' />
            <span>{blog.reviews?.length || 0} comments</span>
          </div>
        </div>
      </div>

      {/* Right Side - Content */}
      <div className='bg-white shadow-md p-6 rounded-lg flex-1 max-w-3xl flex flex-col justify-between'>
        <div className='space-y-6'>
          <header>
            <h1 className='text-2xl sm:text-3xl font-bold text-gray-800 leading-tight'>
              {blog.title}
            </h1>
          </header>

          <div className='prose prose-gray max-w-none'>
            <p className='text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap'>
              {blog.description}
            </p>
          </div>
        </div>

        <footer className='mt-6 pt-6 border-t border-gray-200'>
          <div className='flex items-center justify-between gap-4 flex-wrap'>
            {canUpdate && (
              <Link
                to={`/admin/updateblog/${blog._id}`}
                className='bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors duration-200'
              >
                Update Blog
              </Link>
            )}

            <div className='flex items-center gap-2 text-gray-600 text-sm'>
              <FaUser className='text-gray-400' />
              <span>By {blog.user?.name || 'Anonymous'}</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default BlogHeader;
