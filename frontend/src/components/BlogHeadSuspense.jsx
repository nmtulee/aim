const BlogHeadSuspense = () => {
  return (
    <div className='flex flex-col lg:flex-row justify-between gap-6 p-4 animate-pulse'>
      {/* Left Side Skeleton */}
      <div className='bg-white shadow-md p-4 rounded-lg flex-1 max-w-2xl'>
        <div className='w-full h-64 bg-gray-300 rounded-md mb-4' />
        <div className='flex flex-col sm:flex-row justify-between gap-4'>
          <div className='h-4 bg-gray-300 rounded w-32' />
          <div className='h-4 bg-gray-300 rounded w-24' />
        </div>
      </div>

      {/* Right Side Skeleton */}
      <div className='bg-white shadow-md p-6 rounded-lg flex-1 max-w-3xl'>
        <div className='space-y-6'>
          <div className='h-8 bg-gray-300 rounded w-3/4' />
          <div className='space-y-3'>
            <div className='h-4 bg-gray-300 rounded w-full' />
            <div className='h-4 bg-gray-300 rounded w-full' />
            <div className='h-4 bg-gray-300 rounded w-4/5' />
          </div>
        </div>
        <div className='mt-6 pt-6 border-t border-gray-200'>
          <div className='flex justify-between items-center'>
            <div className='h-10 bg-gray-300 rounded w-24' />
            <div className='h-4 bg-gray-300 rounded w-20' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogHeadSuspense;
