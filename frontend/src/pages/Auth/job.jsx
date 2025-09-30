import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetJobByIdQuery } from '../../redux/api/jobApiSlice.js';
import { useCreateJobAplicacionMutation, useGetMyJobAplicacionQuery ,useDeleteMyJobAplicacionMutation } from '../../redux/api/jobAplicacionApi.js';
import { useGetMyResumeQuery } from '../../redux/api/resumeApiSlice.js';
import {
  HiLocationMarker as MapPin,
  HiOfficeBuilding as Building,
  HiCalendar as Calendar,
  HiCurrencyDollar as DollarSign,
  HiArrowLeft as ArrowLeft,
  HiCheck as Check,
  HiGlobeAlt as Globe,
  HiClipboardList as ClipboardList,
  HiInformationCircle as Info,
  HiExclamationCircle as AlertCircle,
  HiShare as Share,
  HiHeart as Heart,
  HiOutlineHeart as HeartOutline,
} from 'react-icons/hi';
import { toast } from 'react-toastify';


const JobDetail = () => {
  const { id } = useParams();
  const [submit, setSubmit] = useState('Apply Now');
  
  const navigate = useNavigate();
  const { data: job, isLoading, error, refetch } = useGetJobByIdQuery(id);
  const [createJobAplicacion] = useCreateJobAplicacionMutation();
  const { data: myResume  } = useGetMyResumeQuery();
  const [deleteAplication, {isLoading:deleteLoading}]= useDeleteMyJobAplicacionMutation()
  const { data: myApplications ,isLoading:ApplicationsLoading } = useGetMyJobAplicacionQuery(id);
  const myApplication = myApplications?.data;
  

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  useEffect(() => {
    if (myApplication) {
      setSubmit('cansel Application');
    } else {
      setSubmit("Apply Now")
    }
    
  },[myApplications,navigate])
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApplyClick = async (e) => {
    e.preventDefault();
    if (!myResume) {
      navigate('/createresume');
      return;
    }

    setIsSubmitting(true); // start loading

    try {
      if (!myApplication) {
        const res = await createJobAplicacion({ job: id }).unwrap();
        setSubmit('Cancel Application');
        toast.success(res.message);
      } else {
        await deleteAplication(myApplication._id).unwrap();
        setSubmit('Apply Now');
        toast.success('Successfully deleted');
      }
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }

    setIsSubmitting(false); // end loading
  };
  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: job?.title,
        text: `Check out this job opportunity: ${job?.title}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Job link copied to clipboard!');
    }
  };

  // Loading skeleton
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
                <div className='h-4 bg-gray-200 rounded w-1/4'></div>
              </div>
            </div>
            <div className='w-24 h-24 bg-gray-200 rounded-lg'></div>
          </div>
          <div className='space-y-4'>
            <div className='h-6 bg-gray-200 rounded w-1/4'></div>
            <div className='h-4 bg-gray-200 rounded w-full'></div>
            <div className='h-4 bg-gray-200 rounded w-3/4'></div>
          </div>
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
            Job Not Found
          </h2>
          <p className='text-red-600 mb-6'>
            {error?.data?.message ||
              'The job you are looking for does not exist or has been removed.'}
          </p>
          <div className='space-x-4'>
            <button
              onClick={() => navigate('/jobs')}
              className='bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors'
            >
              Browse All Jobs
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
    <div className='container mx-auto px-4 py-8 pt-20 max-w-4xl'>
      {/* Back Button */}
      <div className='mb-8'>
        <button
          onClick={() => navigate(-1)}
          className='flex items-center text-gray-600 hover:text-gray-900 transition-colors'
        >
          <ArrowLeft className='w-5 h-5 mr-2' />
          Back to Jobs
        </button>
      </div>

      {/* Job Header */}
      <div className='bg-white rounded-lg shadow-md p-8 mb-8'>
        <div className='flex flex-col md:flex-row gap-6 mb-8'>
          <div className='flex-1'>
            <h1 className='text-3xl font-bold text-gray-900 mb-4'>
              {job?.title}
            </h1>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600'>
              <div className='flex items-center'>
                <Building className='w-5 h-5 mr-2 text-blue-600' />
                <span>{job?.category?.name || 'Uncategorized'}</span>
              </div>

              <div className='flex items-center'>
                <MapPin className='w-5 h-5 mr-2 text-green-600' />
                <span>
                  {job?.location}, {job?.country}
                </span>
              </div>

              <div className='flex items-center'>
                <DollarSign className='w-5 h-5 mr-2 text-green-600' />
                <span className='font-semibold'>{job?.salary}</span>
              </div>

              <div className='flex items-center'>
                <Calendar className='w-5 h-5 mr-2 text-purple-600' />
                <span>Posted {formatDate(job?.createdAt)}</span>
              </div>
            </div>

            {/* Schengen Badge */}
            {job?.isSchengen && (
              <div className='mt-4'>
                <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800'>
                  <Globe className='w-4 h-4 mr-1' />
                  Schengen Area
                </span>
              </div>
            )}
          </div>

          {/* Company Logo */}
          {job?.image && (
            <div className='flex-shrink-0'>
              <img
                src={job.image}
                alt={job.title}
                className='w-24 h-24 rounded-lg object-cover border border-gray-200'
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className='flex flex-wrap gap-4 pt-6 border-t'>
          <button
            onClick={handleApplyClick}
            disabled={ApplicationsLoading || isSubmitting}
            className='flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold'
          >
            {isSubmitting ? (
              <span className='animate-pulse'>Processing...</span>
            ) : (
              <>
                <ClipboardList className='w-5 h-5 mr-2' />
                {submit}
              </>
            )}
          </button>

          <button
            onClick={handleShareClick}
            className='flex items-center bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors'
          >
            <Share className='w-5 h-5 mr-2' />
            Share Job
          </button>
        </div>
      </div>

      {/* Job Details */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Main Content */}
        <div className='lg:col-span-2 space-y-8'>
          {/* Job Description */}
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4 flex items-center'>
              <Info className='w-6 h-6 mr-2 text-blue-600' />
              Job Description
            </h2>
            <div className='prose max-w-none text-gray-700 whitespace-pre-wrap'>
              {job?.description}
            </div>
          </div>

          {/* Requirements */}
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4 flex items-center'>
              <ClipboardList className='w-6 h-6 mr-2 text-green-600' />
              Requirements
            </h2>
            <ul className='space-y-3'>
              {job?.requirements?.map((requirement, index) => (
                <li key={index} className='flex items-start'>
                  <Check className='w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0' />
                  <span className='text-gray-700'>{requirement}</span>
                </li>
              ))}
            </ul>
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
                <span className='text-gray-600'>Posted</span>
                <span className='font-medium'>
                  {formatDate(job?.createdAt)}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Category</span>
                <span className='font-medium'>
                  {job?.category?.name || 'N/A'}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Location</span>
                <span className='font-medium'>{job?.country}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Visa Type</span>
                <span className='font-medium'>
                  {job?.isSchengen ? 'Schengen' : 'Non-Schengen'}
                </span>
              </div>
            </div>
          </div>

          {/* Application Tips */}
          <div className='bg-blue-50 rounded-lg p-6'>
            <h3 className='text-lg font-semibold text-blue-900 mb-3'>
              Application Tips
            </h3>
            <ul className='space-y-2 text-sm text-blue-800'>
              <li>• Tailor your CV to match the job requirements</li>
              <li>• Research the company culture and values</li>
              <li>• Prepare for common interview questions</li>
              <li>• Follow up after submitting your application</li>
            </ul>
          </div>

          {/* Similar Jobs CTA */}
          <div className='bg-gray-50 rounded-lg p-6 text-center'>
            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              Find Similar Jobs
            </h3>
            <p className='text-gray-600 mb-4 text-sm'>
              Browse more opportunities in {job?.category?.name}
            </p>
            <button
              onClick={() => navigate(`/jobs?category=${job?.category?._id}`)}
              className='w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition-colors'
            >
              View Similar Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
