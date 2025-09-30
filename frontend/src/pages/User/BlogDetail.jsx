import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import moment from 'moment';
import {
  useGetBlogByIdQuery,
  useCreateReviewMutation,
  useDeleteReviewMutation,
} from '../../redux/api/blogApiSlice.js';
import {
  HiArrowLeft as ArrowLeft,
  HiCalendar as Calendar,
  HiUser as User,
  HiChat as Chat,
  HiShare as Share,
  HiHeart as Heart,
  HiOutlineHeart as HeartOutline,
  HiPencil as Edit,
  HiEye as Eye,
  HiClock as Clock,
  HiInformationCircle as Info,
  HiExclamationCircle as AlertCircle,
  HiTrash as Trash,
} from 'react-icons/hi';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const textareaRef = useRef(null);

  // State management
  const [comment, setComment] = useState('');
  const [focused, setFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [deleteReviewId, setDeleteReviewId] = useState(null);

  // API hooks
  const {
    data: blog,
    isLoading,
    error,
    refetch,
  } = useGetBlogByIdQuery(id, {
    skip: !id,
  });
  const [createReview] = useCreateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  // Memoized values
  const isCommentValid = useMemo(() => comment.trim().length > 0, [comment]);
  const canUpdate = useMemo(
    () => userInfo?.isVarify && userInfo?.isAdmin,
    [userInfo?.isVarify, userInfo?.isAdmin]
  );
  const canComment = useMemo(() => userInfo?.isVarify, [userInfo?.isVarify]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [comment]);

  // Image handlers
  const handleImageLoad = useCallback(() => setImageLoaded(true), []);
  const handleImageError = useCallback(() => setImageError(true), []);

  // Comment handlers
  const handleCommentChange = useCallback((e) => {
    const value = e.target.value;
    if (value.length <= 1000) {
      setComment(value);
    }
  }, []);

  const handleFocus = useCallback(() => setFocused(true), []);

  const handleCancel = useCallback(() => {
    setFocused(false);
    setComment('');
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!isCommentValid || isSubmitting) return;

      setIsSubmitting(true);
      try {
        const res = await createReview({
          id: blog._id,
          review: { comment: comment.trim() },
        }).unwrap();

        toast.success(res.message);
        setComment('');
        setFocused(false);
        setTimeout(() => textareaRef.current?.focus(), 100);
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [comment, isCommentValid, isSubmitting, createReview, blog?._id]
  );

  const handleDeleteComment = useCallback(
    async (reviewId) => {
      if (!reviewId) return;

      try {
        const res = await deleteReview({
          blogId: blog._id,
          reviewId,
        }).unwrap();
        toast.success(res.message);
        setDeleteReviewId(null);
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    },
    [deleteReview, blog?._id]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        handleCancel();
      } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        handleSubmit(e);
      }
    },
    [handleCancel, handleSubmit]
  );

  // Share handler
  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: blog?.title,
        text: `Check out this blog post: ${blog?.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Blog link copied to clipboard!');
    }
  }, [blog?.title]);

  // Format date
  const formatDate = (dateString) => {
    return moment(dateString).format('MMMM Do, YYYY');
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className='container mx-auto px-4 py-8 pt-20 max-w-6xl'>
      <div className='animate-pulse'>
        <div className='h-8 bg-gray-200 rounded w-1/4 mb-8'></div>
        <div className='bg-white rounded-lg shadow-md p-8'>
          <div className='flex flex-col lg:flex-row gap-8 mb-8'>
            <div className='flex-1'>
              <div className='h-10 bg-gray-200 rounded w-3/4 mb-4'></div>
              <div className='space-y-2 mb-6'>
                <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                <div className='h-4 bg-gray-200 rounded w-1/3'></div>
              </div>
              <div className='space-y-3'>
                <div className='h-4 bg-gray-200 rounded w-full'></div>
                <div className='h-4 bg-gray-200 rounded w-full'></div>
                <div className='h-4 bg-gray-200 rounded w-3/4'></div>
              </div>
            </div>
            <div className='w-full lg:w-80 h-64 bg-gray-200 rounded-lg'></div>
          </div>
        </div>
      </div>
    </div>
  );

  // Error state
  if (error) {
    return (
      <div className='container mx-auto px-4 py-8 pt-20 max-w-6xl'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-8 text-center'>
          <AlertCircle className='w-16 h-16 text-red-500 mx-auto mb-4' />
          <h2 className='text-2xl font-bold text-red-800 mb-2'>
            Blog Not Found
          </h2>
          <p className='text-red-600 mb-6'>
            {error?.data?.message ||
              'The blog post you are looking for does not exist or has been removed.'}
          </p>
          <div className='space-x-4'>
            <button
              onClick={() => navigate('/blogs')}
              className='bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors'
            >
              Browse All Blogs
            </button>
            <button
              onClick={() => refetch()}
              className='bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors'
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className='container mx-auto px-4 py-8 pt-20 max-w-6xl'>
      {/* Back Button */}
      <div className='mb-8'>
        <button
          onClick={() => navigate('/blogs')}
          className='flex items-center text-gray-600 hover:text-gray-900 transition-colors'
        >
          <ArrowLeft className='w-5 h-5 mr-2' />
          Back to Blogs
        </button>
      </div>

      {/* Blog Header */}
      <div className='bg-white rounded-lg shadow-md p-8 mb-8'>
        <div className='flex flex-col lg:flex-row gap-8 mb-8'>
          <div className='flex-1'>
            <h1 className='text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight'>
              {blog?.title}
            </h1>

            {/* Meta Information */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 mb-6'>
              <div className='flex items-center'>
                <User className='w-5 h-5 mr-2 text-blue-600' />
                <span>By {blog?.user?.name || 'Anonymous'}</span>
              </div>

              <div className='flex items-center'>
                <Calendar className='w-5 h-5 mr-2 text-green-600' />
                <span>{formatDate(blog?.createdAt)}</span>
              </div>

              <div className='flex items-center'>
                <Chat className='w-5 h-5 mr-2 text-purple-600' />
                <span>{blog?.reviews?.length || 0} comments</span>
              </div>

              <div className='flex items-center'>
                <Clock className='w-5 h-5 mr-2 text-orange-600' />
                <span>{moment(blog?.createdAt).fromNow()}</span>
              </div>
            </div>

            {/* Description Preview */}
            <div className='prose max-w-none text-gray-700 leading-relaxed'>
              <p className='text-lg'>
                {blog?.description?.substring(0, 200)}
                {blog?.description?.length > 200 && '...'}
              </p>
            </div>
          </div>

          {/* Blog Image */}
          <div className='w-full lg:w-80 flex-shrink-0'>
            <div className='relative'>
              {!imageLoaded && !imageError && (
                <div className='w-full h-64 bg-gray-200 animate-pulse rounded-lg' />
              )}
              {imageError ? (
                <div className='w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg'>
                  <span className='text-gray-500'>Image not available</span>
                </div>
              ) : (
                <img
                  src={blog?.image}
                  alt={blog?.title}
                  loading='lazy'
                  className={`w-full h-64 object-cover rounded-lg transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-wrap gap-4 pt-6 border-t'>
          {canUpdate && (
            <button
              onClick={() => navigate(`/admin/updateblog/${blog._id}`)}
              className='flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold'
            >
              <Edit className='w-5 h-5 mr-2' />
              Edit Blog
            </button>
          )}

          <button
            onClick={handleShare}
            className='flex items-center bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors'
          >
            <Share className='w-5 h-5 mr-2' />
            Share
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Blog Content */}
        <div className='lg:col-span-2 space-y-8'>
          {/* Full Description */}
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4 flex items-center'>
              <Info className='w-6 h-6 mr-2 text-blue-600' />
              Full Article
            </h2>
            <div className='prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap'>
              {blog?.description}
            </div>
          </div>

          {/* Comments Section */}
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center'>
              <Chat className='w-6 h-6 mr-2 text-green-600' />
              Comments ({blog?.reviews?.length || 0})
            </h2>

            {/* Comment Form */}
            {canComment && (
              <div className='mb-8 p-4 border rounded-lg bg-gray-50'>
                <form onSubmit={handleSubmit} className='w-full'>
                  <div className='relative'>
                    <textarea
                      ref={textareaRef}
                      rows={1}
                      placeholder='Add a comment...'
                      className='w-full resize-none overflow-hidden outline-none border-b border-gray-300 p-2 focus:border-gray-800 focus:border-b-2 transition text-sm sm:text-base bg-transparent'
                      onFocus={handleFocus}
                      value={comment}
                      onChange={handleCommentChange}
                      onKeyDown={handleKeyDown}
                      disabled={isSubmitting}
                      maxLength={1000}
                      aria-label='Write a comment'
                    />
                    {comment.length > 800 && (
                      <div className='absolute right-2 bottom-2 text-xs text-gray-500'>
                        {comment.length}/1000
                      </div>
                    )}
                  </div>

                  {focused && (
                    <div className='flex justify-between items-center mt-4'>
                      <div className='text-xs text-gray-500'>
                        Press Ctrl+Enter to submit, Escape to cancel
                      </div>
                      <div className='space-x-4'>
                        <button
                          type='button'
                          onClick={handleCancel}
                          disabled={isSubmitting}
                          className='bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50'
                        >
                          Cancel
                        </button>
                        <button
                          type='submit'
                          disabled={!isCommentValid || isSubmitting}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            isCommentValid && !isSubmitting
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                          }`}
                        >
                          {isSubmitting ? 'Posting...' : 'Comment'}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* Comments List */}
            <div className='space-y-4'>
              {blog?.reviews?.length > 0 ? (
                blog.reviews.map((review) => (
                  <div
                    key={review._id}
                    className='bg-gray-50 rounded-lg p-4 relative'
                  >
                    <div className='flex items-start gap-3'>
                      <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0'>
                        <User className='w-5 h-5 text-blue-600' />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2 mb-1'>
                          <h4 className='font-semibold text-gray-900'>
                            {review.user?.name || 'Anonymous'}
                          </h4>
                          <span className='text-xs text-gray-500'>•</span>
                          <time className='text-xs text-gray-500'>
                            {moment(review.createdAt).fromNow()}
                          </time>
                        </div>
                        {canUpdate && review.user?.email && (
                          <p className='text-xs text-gray-500 mb-2'>
                            {review.user.email}
                          </p>
                        )}
                        <p className='text-gray-700 whitespace-pre-wrap'>
                          {review.comment}
                        </p>
                      </div>
                    </div>
                    {canUpdate && (
                      <button
                        onClick={() => handleDeleteComment(review._id)}
                        className='absolute top-3 right-3 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors'
                      >
                        <Trash className='w-4 h-4' />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className='text-center py-8 text-gray-500'>
                  <Chat className='w-12 h-12 mx-auto mb-4 text-gray-300' />
                  <p>No comments yet. Be the first to comment!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          {/* Quick Info */}
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
              Quick Info
            </h3>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Published</span>
                <span className='font-medium'>
                  {formatDate(blog?.createdAt)}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Author</span>
                <span className='font-medium'>
                  {blog?.user?.name || 'Anonymous'}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Comments</span>
                <span className='font-medium'>
                  {blog?.reviews?.length || 0}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Reading Time</span>
                <span className='font-medium'>
                  {Math.ceil((blog?.description?.length || 0) / 200)} min
                </span>
              </div>
            </div>
          </div>

          {/* Author Info */}
          <div className='bg-blue-50 rounded-lg p-6'>
            <h3 className='text-lg font-semibold text-blue-900 mb-3'>
              About the Author
            </h3>
            <div className='flex items-center gap-3 mb-3'>
              <div className='w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center'>
                <User className='w-6 h-6 text-blue-600' />
              </div>
              <div>
                <h4 className='font-semibold text-blue-900'>
                  {blog?.user?.name || 'Anonymous'}
                </h4>
                <p className='text-sm text-blue-700'>Blog Author</p>
              </div>
            </div>
          </div>

          {/* Related Blogs CTA */}
          <div className='bg-gray-50 rounded-lg p-6 text-center'>
            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              More From This Author
            </h3>
            <p className='text-gray-600 mb-4 text-sm'>
              Discover more insightful articles and stories
            </p>
            <button
              onClick={() => navigate('/blogs')}
              className='w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition-colors'
            >
              Browse All Blogs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
