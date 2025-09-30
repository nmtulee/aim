import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetTestimonialByIdQuery } from '../../redux/api/testimonialApiSlice.js';
import {
  HiArrowLeft as ArrowLeft,
  HiUser as UserIcon,
  HiGlobeAlt as Globe,
  HiBriefcase as Briefcase,
  HiStar as Star,
  HiExclamationCircle as AlertCircle,
} from 'react-icons/hi';

const SuccessStory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ Fetch testimonial by ID
  const { data, isLoading, error, refetch } = useGetTestimonialByIdQuery(id);

  const testimonial = data?.data;

  // Format date nicely
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // ✅ Loading skeleton
  const LoadingSkeleton = () => (
    <div className='container mx-auto px-4 py-8 pt-20 max-w-4xl'>
      <div className='animate-pulse'>
        <div className='h-8 bg-gray-200 rounded w-1/4 mb-8'></div>
        <div className='bg-white rounded-lg shadow-md p-8'>
          <div className='flex flex-col md:flex-row gap-6 mb-8'>
            <div className='flex-1'>
              <div className='h-8 bg-gray-200 rounded w-3/4 mb-4'></div>
              <div className='space-y-2'>
                <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                <div className='h-4 bg-gray-200 rounded w-1/3'></div>
              </div>
            </div>
            <div className='w-24 h-24 bg-gray-200 rounded-full'></div>
          </div>
        </div>
      </div>
    </div>
  );

  // ✅ Error state
  if (error) {
    return (
      <div className='container mx-auto px-4 py-8 pt-20 max-w-4xl'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-8 text-center'>
          <AlertCircle className='w-16 h-16 text-red-500 mx-auto mb-4' />
          <h2 className='text-2xl font-bold text-red-800 mb-2'>
            Testimonial Not Found
          </h2>
          <p className='text-red-600 mb-6'>
            {error?.data?.message ||
              'The testimonial you are looking for does not exist or has been removed.'}
          </p>
          <div className='space-x-4'>
            <button
              onClick={() => navigate('/success-stories')}
              className='bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors'
            >
              Browse All Stories
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

  // ✅ Loading state
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className='container mx-auto px-4 py-8 pt-20 max-w-4xl'>
      {/* Back Button */}
      <div className='mb-8'>
        <button
          onClick={() => navigate(-1)}
          className='flex items-center text-gray-600 hover:text-gray-900 transition-colors'
        >
          <ArrowLeft className='w-5 h-5 mr-2' />
          Go Back
        </button>
      </div>

      {/* Story Card */}
      <div className='bg-white rounded-lg shadow-md p-8'>
        <div className='flex flex-col md:flex-row gap-6 mb-8 items-center'>
          {/* Profile Photo */}
          {testimonial?.photo && (
            <img
              src={testimonial.photo}
              alt={testimonial.title}
              className='w-32 h-32 rounded-full object-cover border border-gray-200 shadow'
            />
          )}

          <div className='flex-1 text-center md:text-left'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>
              {testimonial?.title}
            </h1>
            <div className='flex flex-col md:flex-row gap-4 text-gray-600'>
              <div className='flex items-center justify-center md:justify-start'>
                <UserIcon className='w-5 h-5 mr-2 text-blue-600' />
                <span>{testimonial?.user?.name || 'Anonymous'}</span>
              </div>

              <div className='flex items-center justify-center md:justify-start'>
                <Briefcase className='w-5 h-5 mr-2 text-green-600' />
                <span>{testimonial?.jobTitle}</span>
              </div>

              <div className='flex items-center justify-center md:justify-start'>
                <Globe className='w-5 h-5 mr-2 text-purple-600' />
                <span>{testimonial?.country}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Story Message */}
        <div className='prose max-w-none text-gray-700 italic text-lg text-center md:text-left'>
          “{testimonial?.message}”
        </div>

        {/* Extra Info */}
        <div className='mt-6 flex flex-col md:flex-row justify-between text-gray-600 text-sm'>
          <span>Shared on {formatDate(testimonial?.createdAt)}</span>
          {testimonial?.rating > 0 && (
            <span className='flex items-center'>
              <Star className='w-5 h-5 text-yellow-500 mr-1' />
              {testimonial.rating} / 5
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessStory;
