import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetTestimonialByIdAdminQuery } from '../../redux/api/testimonialApiSlice.js';
import {
  HiArrowLeft as ArrowLeft,
  HiExclamationCircle as AlertCircle,
} from 'react-icons/hi';

const TestimonialById = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: testimonial,
    isLoading,
    error,
    refetch,
  } = useGetTestimonialByIdAdminQuery(id);

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className='container mx-auto px-4 py-8 pt-20 max-w-4xl'>
      <div className='animate-pulse'>
        <div className='h-8 bg-gray-200 rounded w-1/4 mb-8'></div>
        <div className='bg-white rounded-lg shadow-md p-8 space-y-4'>
          <div className='h-6 bg-gray-200 rounded w-3/4'></div>
          <div className='h-4 bg-gray-200 rounded w-full'></div>
          <div className='h-4 bg-gray-200 rounded w-1/2'></div>
        </div>
      </div>
    </div>
  );

  // Error state
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
              'The testimonial does not exist or has been removed.'}
          </p>
          <div className='space-x-4'>
            <button
              onClick={() => navigate('/admin/testimonial')}
              className='bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors'
            >
              Back to Testimonials
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

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className='container mx-auto px-4 py-8 pt-20 max-w-4xl'>
      {/* Back Button */}
      <div className='mb-8'>
        <button
          onClick={() => navigate(-1)}
          className='flex items-center text-gray-600 hover:text-gray-900 transition-colors'
        >
          <ArrowLeft className='w-5 h-5 mr-2' />
          Back to Testimonials
        </button>
      </div>

      {/* Testimonial Content */}
      <div className='bg-white rounded-lg shadow-md p-8'>
        <div className='flex flex-col md:flex-row gap-6 mb-8'>
          {/* User Info */}
          <div className='flex-1'>
            <h1 className='text-3xl font-bold text-gray-900 mb-4'>
              {testimonial?.data?.title}
            </h1>
            <p className='text-gray-700 mb-4 whitespace-pre-wrap'>
              {testimonial?.data?.message}
            </p>
            <div className='flex flex-wrap gap-4 text-gray-600'>
              <div>
                <strong>By:</strong>{' '}
                {testimonial?.data?.user?.name || 'Unknown'}
              </div>
              <div>
                <strong>Email:</strong>{' '}
                {testimonial?.data?.user?.email || 'N/A'}
              </div>
              <div>
                <strong>Country:</strong> {testimonial?.data?.country || 'N/A'}
              </div>
              <div>
                <strong>Job Title:</strong>{' '}
                {testimonial?.data?.jobTitle || 'N/A'}
              </div>
              <div>
                <strong>Rating:</strong> {testimonial?.data?.rating || 'N/A'} ⭐
              </div>
              <div>
                <strong>Status:</strong>{' '}
                {testimonial?.data?.approved ? 'Approved' : 'Pending'}
              </div>
            </div>
          </div>

          {/* Photo */}
          {testimonial?.data?.photo && (
            <div className='flex-shrink-0 w-24 h-24'>
              <img
                src={testimonial.data.photo}
                alt={testimonial?.data?.title}
                className='w-full h-full object-cover rounded-lg border border-gray-200'
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestimonialById;
