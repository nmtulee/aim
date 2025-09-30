import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {  useNavigate } from 'react-router-dom';
import {
  useGetMyResumeQuery,
  
} from '../../redux/api/resumeApiSlice.js';
import gsap from 'gsap';


const MyResume = () => {

  
  
 
  const navigate = useNavigate();
  const { data: resume, isLoading, isError, error } = useGetMyResumeQuery()
  
  
  
  const containerRef = useRef(null);
  const [imageError, setImageError] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  useEffect(() => {
    if (!isLoading && (isError || !resume)) {
      navigate('/createResume');
    }
  }, [isLoading, isError, resume, navigate]);

  useEffect(() => {
    if (resume) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );
    }
  }, [resume]);

  const LoadingSpinner = () => (
    <div className='flex justify-center items-center min-h-[400px]'>
      <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600'></div>
      <span className='ml-3 text-gray-600'>Loading resume...</span>
    </div>
  );

  const ErrorMessage = ({ message, showRetry = false }) => (
    <div className='min-h-screen flex justify-center items-center py-20' >
    <div className='max-w-md mx-auto  p-6 bg-red-50 border border-red-200 rounded-lg  '>
      <div className='flex items-center'>
        <svg
          className='w-6 h-6 text-red-500 mr-3'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
        <div>
          <h3 className='text-red-800 font-semibold'>Error Loading Resume</h3>
          <p className='text-red-600 mt-1'>{message}</p>
        </div>
      </div>
      {showRetry && (
        <div className='mt-4 flex gap-3'>
          <button
            onClick={() => window.location.reload()}
            className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition'
          >
            Try Again
          </button>
          <button
            onClick={() => navigate("/")}
            className='px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition'
          >
            Go Back
          </button>
        </div>
      )}
    </div>
    </div>
  );

  const DefaultAvatar = ({ name }) => (
    <div className='w-32 h-32 rounded-full bg-indigo-100 border-4 border-indigo-500 shadow-lg flex items-center justify-center'>
      <span className='text-2xl font-bold text-indigo-600'>
        {name ? name.charAt(0).toUpperCase() : '?'}
      </span>
    </div>
  );

  const PDFViewerFallback = ({ fileUrl, fileName }) => (
    <div className='w-full h-[400px] sm:h-[500px] lg:h-[600px] bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center'>
      <svg
        className='w-16 h-16 text-gray-400 mb-4'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
        />
      </svg>
      <p className='text-gray-600 text-center mb-4'>
        PDF preview not available in this browser
      </p>
      <a
        href={fileUrl}
        target='_blank'
        rel='noopener noreferrer'
        className='px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition'
      >
        Download PDF
      </a>
    </div>
  );

  if (isLoading) return <LoadingSpinner />;
  if (isError) {
    const errorMessage =
      error?.data?.message || error?.message || 'Resume not found';
    return <ErrorMessage message={errorMessage} showRetry={true} />;
  }

  if (!resume) {
    return (
      <ErrorMessage message='Resume data not available' showRetry={true} />
    );
  }
  

  return (
    <div
      ref={containerRef}
      className='max-w-5xl mx-auto mt-8 px-4 sm:px-6 lg:px-8 pb-12 pt-10'
    >
      <button
        onClick={() => navigate('/')}
        className='flex items-center text-indigo-600 hover:text-indigo-800 mb-6 transition'
      >
        <svg
          className='w-5 h-5 mr-2'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M10 19l-7-7m0 0l7-7m-7 7h18'
          />
        </svg>
        Back to Resumes
      </button>

      <div className='bg-white shadow-lg rounded-xl border border-gray-200 p-6 flex flex-col sm:flex-row gap-8 items-center sm:items-start'>
        {/* Profile Section */}
        <div className='flex flex-col items-center sm:items-start sm:w-1/3 gap-4'>
          {resume.photo && !imageError ? (
            <img
              src={resume.photo}
              alt={`${resume.fullName}'s profile`}
              className='w-32 h-32 rounded-full object-cover border-4 border-indigo-500 shadow-lg'
              onError={() => setImageError(true)}
              loading='lazy'
            />
          ) : (
            <DefaultAvatar name={resume.fullName} />
          )}

          <div className='text-center sm:text-left'>
            <h1 className='text-2xl font-bold text-indigo-700 mb-2'>
              {resume.fullName}
            </h1>
            <p className='text-gray-600 text-lg mb-2'>{resume.jobTitle}</p>
            {resume.category && (
              <span className='inline-block text-xs text-white bg-indigo-500 px-3 py-1 rounded-full mb-2'>
                {resume.category.name || resume.category}
              </span>
            )}
            {resume.user && (
              <p className='text-gray-500 text-sm select-text'>
                <span className='font-medium'>User:</span> {resume.user.name} (
                {resume.user.email})
              </p>
            )}
          </div>
        </div>

        {/* Resume Preview Section */}
        <div className='w-full sm:w-2/3'>
          <h2 className='text-xl font-semibold mb-4 text-indigo-600'>
            Resume Preview
          </h2>

          <div className='w-full h-[400px] sm:h-[500px] lg:h-[600px]'>
            {resume.file && !iframeError ? (
              <iframe
                src={resume.file}
                title={`${resume.fullName}'s Resume`}
                className='w-full h-full rounded-lg border shadow-inner'
                frameBorder='0'
                onError={() => setIframeError(true)}
              />
            ) : (
              <PDFViewerFallback
                fileUrl={resume.file}
                fileName={`${resume.fullName}_Resume.pdf`}
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className='mt-6 flex flex-wrap gap-3 justify-center sm:justify-start'>
            <a
              href={resume.file}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition'
            >
              <svg
                className='w-4 h-4 mr-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                />
              </svg>
              Open in New Tab
            </a>

            <a
              href={resume.file}
              download={`${resume.fullName}_Resume.pdf`}
              className='inline-flex items-center px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition'
            >
              <svg
                className='w-4 h-4 mr-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
              Download PDF
            </a>
            <button
              onClick={() => navigate('/update-MyResume')}
              className='inline-flex items-center px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition'
            >
              Update Resume
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyResume;
