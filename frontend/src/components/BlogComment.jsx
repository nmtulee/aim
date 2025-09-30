import moment from 'moment';
import { useDeleteReviewMutation } from '../redux/api/blogApiSlice.js';
import { AiOutlineUser, AiFillDelete } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { useState, useCallback, useMemo } from 'react';
import ConfirmationDialog from './ConfirmationDialog.jsx';
import { useSelector } from 'react-redux';

const BlogComment = ({ review, blog }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [deleteReview] = useDeleteReviewMutation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Early return for invalid review
  if (!review?.user) return null;

  const openDialog = useCallback(() => {
    setIsDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  const handleDelete = useCallback(async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      const res = await deleteReview({
        blogId: blog._id,
        reviewId: review._id,
      }).unwrap();
      toast.success(res.message);
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    } finally {
      setIsDeleting(false);
    }
  }, [deleteReview, blog._id, review._id, isDeleting]);

  // Memoize permission check
  const canDelete = useMemo(
    () => userInfo?.isVarify && userInfo?.isAdmin,
    [userInfo?.isVarify, userInfo?.isAdmin]
  );

  // Memoize formatted date
  const formattedDate = useMemo(
    () => moment(review.createdAt).fromNow(),
    [review.createdAt]
  );

  return (
    <div className='bg-white shadow-sm p-4 relative rounded-md mb-4 w-full mx-auto'>
      <div className='flex items-start gap-3 mb-3'>
        <div className='flex-shrink-0'>
          <div className='w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center'>
            <AiOutlineUser className='text-gray-600' />
          </div>
        </div>

        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2 mb-1'>
            <h3 className='font-semibold text-sm sm:text-base text-gray-800 truncate'>
              {review?.user?.name || 'Anonymous'}
            </h3>
            <span className='text-xs text-gray-500'>•</span>
            <time className='text-xs text-gray-500' dateTime={review.createdAt}>
              {formattedDate}
            </time>
          </div>

          {canDelete && review?.user?.email && (
            <p className='text-gray-500 text-xs mb-2 break-all'>
              {review.user.email}
            </p>
          )}

          <p className='text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words'>
            {review.comment}
          </p>
        </div>
      </div>

      {canDelete && (
        <button
          onClick={openDialog}
          disabled={isDeleting}
          className='absolute top-3 right-3 p-2 bg-gray-100 hover:bg-red-500 hover:text-white rounded-md transition-colors duration-200 disabled:opacity-50'
          aria-label='Delete comment'
        >
          <AiFillDelete className='text-sm' />
        </button>
      )}

      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        onConfirm={handleDelete}
        message='Are you sure you want to delete this comment?'
        isLoading={isDeleting}
      />
    </div>
  );
};

export default BlogComment;
