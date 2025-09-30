import { Suspense, useState, useEffect } from 'react';
import { useGetBlogsQuery } from '../../redux/api/blogApiSlice.js';
import {
  HiChevronLeft as ChevronLeft,
  HiChevronRight as ChevronRight,
  HiExclamationCircle as AlertCircle,
} from 'react-icons/hi';
import BlogSuspense from '../../components/BlogSuspense.jsx';
import BlogCard from '../../components/BlogCard.jsx';

const Blogs = () => {
  const [page, setPage] = useState(1);
  const {
    data: blogData,
    isLoading,
    error,
    refetch,
  } = useGetBlogsQuery({ page, limit: 12 });
  const totalPages = blogData?.totalPages || 1;

  useEffect(() => {
    if (page > 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [page]);

  if (error) {
    return (
      <div className='mt-[60px] flex flex-col items-center'>
        <div className='bg-white shadow-xl p-6 md:p-10 rounded-2xl w-[90%] mx-auto my-10'>
          <div className='text-center py-12'>
            <AlertCircle className='w-16 h-16 text-red-400 mx-auto mb-4' />
            <h2 className='text-2xl font-bold text-red-800 mb-2'>
              Error Loading Blogs
            </h2>
            <p className='text-red-600 mb-6'>
              {error?.data?.message ||
                'Failed to load blogs. Please try again.'}
            </p>
            <button
              onClick={refetch}
              className='bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors'
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='pt-[80px] flex flex-col items-center'>
        {/* Hero Section */}
        <div className='bg-white shadow-xl p-6 md:p-10 rounded-2xl w-[90%] max-w-7xl mx-auto my-10 flex items-center space-x-5'>
          <div className='space-y-4 flex-1'>
            <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900'>
              Discover Our Blog
            </h1>
            <p className='text-gray-600 text-base sm:text-lg leading-relaxed'>
              Stay updated with the latest insights, tips, and stories about
              international recruitment and career opportunities.
            </p>
          </div>
          <img
            src='/news.png'
            alt='News and blog illustration'
            loading='lazy'
            className='max-h-[200px] md:max-h-[300px] xl:max-h-[350px] hidden lg:block'
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>

        {/* All Blogs Heading */}
        <div className='flex flex-col w-full max-w-7xl px-4 mb-8'>
          <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 text-center sm:text-left'>
            All Blogs ({blogData?.total || 0})
          </h2>
        </div>

        {/* Blog Grid */}
        <div className='flex flex-col w-full max-w-7xl px-4'>
          {isLoading ? (
            <div className='flex justify-center items-start flex-row flex-wrap gap-10 md:p-8'>
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className='w-full max-w-sm'>
                  <BlogSuspense />
                </div>
              ))}
            </div>
          ) : blogData?.blogs?.length === 0 ? (
            <div className='text-center py-12'>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                No blogs available
              </h3>
              <p className='text-gray-600 mb-4'>
                Check back later for new blog posts.
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8'>
              {blogData.blogs.map((blog) => (
                <Suspense key={blog._id} fallback={<BlogSuspense />}>
                  <BlogCard blog={blog} />
                </Suspense>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className='flex justify-center items-center gap-2 sm:gap-4 mt-8 flex-wrap mb-5'>
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className={`p-2 rounded-md transition-all duration-200 ${
                  page === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 shadow-md'
                }`}
              >
                <ChevronLeft className='w-5 h-5' />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (num) => (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`px-3 py-2 rounded-md transition-all duration-200 font-medium ${
                      page === num
                        ? 'bg-blue-600 text-white shadow-lg scale-105'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800 hover:scale-105 shadow-sm'
                    }`}
                  >
                    {num}
                  </button>
                )
              )}
              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page === totalPages}
                className={`p-2 rounded-md transition-all duration-200 ${
                  page === totalPages
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 shadow-md'
                }`}
              >
                <ChevronRight className='w-5 h-5' />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
