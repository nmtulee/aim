const BlogCommentSkeleton = () => {
  return (
    <div className='bg-white shadow-sm p-4 rounded-md mb-4 w-full animate-pulse'>
      <div className='flex items-start gap-3 mb-3'>
        <div className='w-10 h-10 bg-gray-300 rounded-full flex-shrink-0' />
        <div className='flex-1 space-y-2'>
          <div className='flex items-center gap-2'>
            <div className='h-4 bg-gray-300 rounded w-24' />
            <div className='h-3 bg-gray-300 rounded w-12' />
          </div>
          <div className='space-y-2'>
            <div className='h-4 bg-gray-300 rounded w-full' />
            <div className='h-4 bg-gray-300 rounded w-4/5' />
            <div className='h-4 bg-gray-300 rounded w-3/5' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCommentSkeleton;
