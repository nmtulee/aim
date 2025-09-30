import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useGetJobAplicacionByIdQuery } from '../../redux/api/jobAplicacionApi.js';
import {
  FaUser,
  FaEnvelope,
  FaBriefcase,
  FaMapMarkerAlt,
  FaDollarSign,
  FaCalendarAlt,
  FaArrowLeft,
  FaExternalLinkAlt,
  FaDownload,
  FaFileAlt,
  FaGlobe,
  FaBuilding,
  FaEye,
  FaUserTie,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';

const ApplicationData = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [resumePreviewError, setResumePreviewError] = useState(false);

  const {
    data: application,
    isLoading,
    isError,
    error,
  } = useGetJobAplicacionByIdQuery(id);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const DefaultAvatar = ({ name }) => (
    <div className='w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center'>
      <span className='text-lg md:text-xl font-bold text-blue-600'>
        {name ? name.charAt(0).toUpperCase() : '?'}
      </span>
    </div>
  );

  const LoadingSpinner = () => (
    <div className='min-h-screen bg-gray-50 p-4 md:p-6 mt-16'>
      <div className='max-w-6xl mx-auto'>
        <div className='flex items-center justify-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
          <span className='ml-3 text-gray-600'>
            Loading application details...
          </span>
        </div>
      </div>
    </div>
  );

  const ErrorMessage = () => (
    <div className='min-h-screen bg-gray-50 p-4 md:p-6 mt-16'>
      <div className='max-w-6xl mx-auto'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-8 text-center'>
          <FaExclamationTriangle className='w-16 h-16 text-red-500 mx-auto mb-4' />
          <h2 className='text-2xl font-bold text-red-800 mb-2'>
            Application Not Found
          </h2>
          <p className='text-red-600 mb-6'>
            {error?.data?.message ||
              'The application you are looking for does not exist.'}
          </p>
          <div className='space-x-4'>
            <button
              onClick={() => navigate('/admin/applications')}
              className='bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors'
            >
              Back to Applications
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage />;
  if (!application?.data) return <ErrorMessage />;

  const app = application.data;

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-6 mt-16'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='mb-6'>
          <button
            onClick={() => navigate(-1)}
            className='flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors'
          >
            <FaArrowLeft className='w-5 h-5 mr-2' />
            Back to Applications
          </button>

          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div>
              <h1 className='text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3'>
                <FaFileAlt className='text-blue-600' />
                Application Details
              </h1>
              <p className='text-gray-600 mt-1'>
                Submitted on {formatDate(app.createdAt)}
              </p>
            </div>
            <div className='flex items-center gap-2'>
              <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800'>
                <FaCheckCircle className='w-4 h-4 mr-1' />
                Active Application
              </span>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Left Column - Applicant & Job Info */}
          <div className='space-y-6'>
            {/* Applicant Information */}
            <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
              <h2 className='text-xl font-semibold text-gray-900 mb-6 flex items-center'>
                <FaUser className='text-blue-600 mr-2' />
                Applicant Information
              </h2>

              <div className='flex items-start gap-4 mb-6'>
                {app.resume?.photo && !imageError ? (
                  <img
                    src={app.resume.photo}
                    alt={app.user?.name}
                    className='w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-blue-500'
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <DefaultAvatar name={app.user?.name} />
                )}

                <div className='flex-1'>
                  <h3 className='text-lg font-semibold text-gray-900'>
                    {app.user?.name || 'N/A'}
                  </h3>
                  <div className='flex items-center gap-1 text-gray-600 mt-1'>
                    <FaEnvelope className='w-4 h-4' />
                    <span className='text-sm'>{app.user?.email || 'N/A'}</span>
                  </div>
                  {app.resume?.jobTitle && (
                    <div className='flex items-center gap-1 text-gray-600 mt-1'>
                      <FaUserTie className='w-4 h-4' />
                      <span className='text-sm'>{app.resume.jobTitle}</span>
                    </div>
                  )}
                </div>
              </div>

              {app.resume?.fullName && (
                <div className='bg-gray-50 rounded-lg p-4'>
                  <h4 className='font-medium text-gray-900 mb-2'>
                    Resume Details
                  </h4>
                  <p className='text-gray-700'>
                    <span className='font-medium'>Full Name:</span>{' '}
                    {app.resume.fullName}
                  </p>
                  {app.resume.category && (
                    <p className='text-gray-700 mt-1'>
                      <span className='font-medium'>Category:</span>{' '}
                      {app.resume.category.name || app.resume.category}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Job Information */}
            <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
              <h2 className='text-xl font-semibold text-gray-900 mb-6 flex items-center'>
                <FaBriefcase className='text-green-600 mr-2' />
                Job Information
              </h2>

              <div className='space-y-4'>
                <div>
                  <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                    {app.job?.title || 'N/A'}
                  </h3>
                  {app.job?.category && (
                    <span className='inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full'>
                      {app.job.category.name}
                    </span>
                  )}
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                  {app.job?.location && (
                    <div className='flex items-center gap-2'>
                      <FaMapMarkerAlt className='text-gray-400' />
                      <span>{app.job.location}</span>
                    </div>
                  )}

                  {app.job?.country && (
                    <div className='flex items-center gap-2'>
                      <FaGlobe className='text-gray-400' />
                      <span>{app.job.country}</span>
                    </div>
                  )}

                  {app.job?.salary && (
                    <div className='flex items-center gap-2'>
                      <FaDollarSign className='text-gray-400' />
                      <span>{app.job.salary}</span>
                    </div>
                  )}

                  {app.job?.isSchengen && (
                    <div className='flex items-center gap-2'>
                      <FaGlobe className='text-blue-500' />
                      <span className='text-blue-600'>Schengen Area</span>
                    </div>
                  )}
                </div>

                <div className='pt-4 border-t'>
                  <Link
                    to={`/jobs/${app.job?._id}`}
                    className='inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors'
                  >
                    <FaEye className='w-4 h-4 mr-1' />
                    View Job Details
                  </Link>
                </div>
              </div>
            </div>

            {/* Application Timeline */}
            <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
              <h2 className='text-xl font-semibold text-gray-900 mb-6 flex items-center'>
                <FaClock className='text-purple-600 mr-2' />
                Application Timeline
              </h2>

              <div className='space-y-4'>
                <div className='flex items-start gap-3'>
                  <div className='w-2 h-2 rounded-full bg-green-500 mt-2'></div>
                  <div>
                    <p className='font-medium text-gray-900'>
                      Application Submitted
                    </p>
                    <p className='text-sm text-gray-600'>
                      {formatDate(app.createdAt)}
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-3'>
                  <div className='w-2 h-2 rounded-full bg-blue-500 mt-2'></div>
                  <div>
                    <p className='font-medium text-gray-900'>Under Review</p>
                    <p className='text-sm text-gray-600'>
                      Application is being processed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Resume Preview */}
          <div className='space-y-6'>
            {/* Resume Preview */}
            <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
              <h2 className='text-xl font-semibold text-gray-900 mb-6 flex items-center'>
                <FaFileAlt className='text-orange-600 mr-2' />
                Resume Preview
              </h2>

              {app.resume?.file ? (
                <div className='space-y-4'>
                  <div className='w-full h-96 border rounded-lg overflow-hidden'>
                    {!resumePreviewError ? (
                      <iframe
                        src={app.resume.file}
                        title={`${
                          app.resume.fullName || app.user?.name
                        }'s Resume`}
                        className='w-full h-full'
                        frameBorder='0'
                        onError={() => setResumePreviewError(true)}
                      />
                    ) : (
                      <div className='w-full h-full bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center'>
                        <FaFileAlt className='w-16 h-16 text-gray-400 mb-4' />
                        <p className='text-gray-600 text-center mb-4'>
                          Resume preview not available
                        </p>
                        <a
                          href={app.resume.file}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                        >
                          <FaExternalLinkAlt className='w-4 h-4 inline mr-2' />
                          Open Resume
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className='flex flex-wrap gap-3'>
                    <a
                      href={app.resume.file}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors'
                    >
                      <FaExternalLinkAlt className='w-4 h-4 mr-2' />
                      Open in New Tab
                    </a>

                    <a
                      href={app.resume.file}
                      download={`${
                        app.resume.fullName || app.user?.name
                      }_Resume.pdf`}
                      className='inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors'
                    >
                      <FaDownload className='w-4 h-4 mr-2' />
                      Download PDF
                    </a>

                    <Link
                      to={`/admin/resume/${app.resume._id}`}
                      className='inline-flex items-center px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors'
                    >
                      <FaEye className='w-4 h-4 mr-2' />
                      View Full Resume
                    </Link>
                  </div>
                </div>
              ) : (
                <div className='text-center py-8'>
                  <FaFileAlt className='w-16 h-16 text-gray-400 mx-auto mb-4' />
                  <p className='text-gray-600'>No resume file available</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
              <h2 className='text-xl font-semibold text-gray-900 mb-6'>
                Quick Actions
              </h2>

              <div className='space-y-3'>
                <Link
                  to={`/admin/resume/${app.resume?._id}`}
                  className='w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors'
                >
                  <FaUser className='w-4 h-4 mr-2' />
                  View Applicant Profile
                </Link>

                <Link
                  to={`/jobs/${app.job?._id}`}
                  className='w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors'
                >
                  <FaBriefcase className='w-4 h-4 mr-2' />
                  View Job Details
                </Link>

                <button
                  onClick={() => window.print()}
                  className='w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors'
                >
                  <FaFileAlt className='w-4 h-4 mr-2' />
                  Print Application
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationData;
