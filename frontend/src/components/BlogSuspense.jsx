

const BlogSuspense = () => {
  return (
    <div className='w-full max-w-sm bg-white shadow-md rounded-lg overflow-hidden flex flex-col gap-2 p-4 mx-auto sm:mx-0'>
      <div className='w-full h-48 rounded-md bg-gray-300 animate-pulse' />
      <div className='h-6 bg-gray-300 rounded w-3/4 animate-pulse' />
      <div className='space-y-2'>
        <div className='h-4 bg-gray-300 rounded animate-pulse' />
        <div className='h-4 bg-gray-300 rounded w-5/6 animate-pulse' />
        <div className='h-4 bg-gray-300 rounded w-2/3 animate-pulse' />
      </div>
      <div className='h-4 bg-gray-300 rounded w-1/4 animate-pulse' />
      <div className='h-4 bg-gray-300 rounded w-1/3 animate-pulse' />
    </div>
  );
};

export default BlogSuspense;
