import React, { useState } from 'react';
import { useGetStudyWorkByIdQuery } from '../../redux/api/studyWorkApiSlice.js';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  HiArrowLeft as ArrowLeft,
  HiLocationMarker as MapPin,
  HiGlobeAlt as Globe,
  HiCalendar as Calendar,
  HiAcademicCap as AcademicCap,
  HiUserGroup as UserGroup,
  HiSupport as Support,
  HiStar as Star,
  HiExclamationCircle as AlertCircle,
  HiCheckCircle as CheckCircle,
  HiPhotograph as Photo,
} from 'react-icons/hi';


const AboutTheCountry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const {
    data: studyWorkData,
    isLoading,
    error,
    refetch,
  } = useGetStudyWorkByIdQuery(id);

  

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Loading skeleton
  const DetailSkeleton = () => (
    <div className='animate-pulse'>
      {/* Banner Skeleton */}
      <div className='h-80 bg-gray-200 mb-8'></div>

      {/* Content Skeleton */}
      <div className='container mx-auto px-4'>
        <div className='h-8 bg-gray-200 rounded w-1/2 mb-4'></div>
        <div className='h-4 bg-gray-200 rounded w-3/4 mb-8'></div>

        {/* Tabs Skeleton */}
        <div className='flex space-x-4 mb-8'>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className='h-10 bg-gray-200 rounded w-24'></div>
          ))}
        </div>

        {/* Content Areas Skeleton */}
        <div className='space-y-4'>
          <div className='h-4 bg-gray-200 rounded w-full'></div>
          <div className='h-4 bg-gray-200 rounded w-5/6'></div>
          <div className='h-4 bg-gray-200 rounded w-4/6'></div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-8 text-center'>
          <AlertCircle className='w-16 h-16 text-red-400 mx-auto mb-4' />
          <h2 className='text-2xl font-bold text-red-800 mb-2'>
            Program Not Found
          </h2>
          <p className='text-red-600 mb-6'>
            {error?.data?.message ||
              'The study work program you are looking for could not be found.'}
          </p>
          <div className='space-x-4'>
            <button
              onClick={() => navigate('/study-work')}
              className='bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors'
            >
              Back to Programs
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

  if (!studyWorkData?.data) {
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        <h2 className='text-2xl font-bold text-gray-800'>Program not found</h2>
        <Link
          to='/study-work'
          className='text-blue-600 hover:text-blue-800 mt-4 inline-block'
        >
          Back to Programs
        </Link>
      </div>
    );
  }



  const studyWork = studyWorkData.data;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Globe },
    { id: 'why-country', label: 'Why This Country', icon: Star },
    { id: 'eligibility', label: 'Who Can Apply', icon: UserGroup },
    { id: 'services', label: 'How We Help', icon: Support },
  ];

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Hero Banner */}
      <div className='relative h-80 bg-gradient-to-r from-blue-600 to-purple-600'>
        {studyWork.bannerImage ? (
          <img
            src={studyWork.bannerImage}
            alt={studyWork.title}
            className='w-full h-full object-cover'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600'>
            <Photo className='w-24 h-24 text-white opacity-30' />
          </div>
        )}

        {/* Overlay */}
        <div className='absolute inset-0 bg-black bg-opacity-40'></div>

        {/* Content */}
        <div className='absolute inset-0 flex items-center'>
          <div className='container mx-auto px-4'>
            <button
              onClick={() => navigate(-1)}
              className='flex items-center text-white/80 hover:text-white mb-4 transition-colors'
            >
              <ArrowLeft className='w-5 h-5 mr-2' />
              Back to Programs
            </button>

            <h1 className='text-4xl md:text-5xl font-bold text-white mb-2'>
              {studyWork.title}
            </h1>
            <p className='text-xl text-white/90 mb-4'>{studyWork.subtitle}</p>

            <div className='flex items-center text-white/80 space-x-6'>
              <div className='flex items-center'>
                <Globe className='w-5 h-5 mr-2' />
                {studyWork.country}
              </div>
              <div className='flex items-center'>
                <Calendar className='w-5 h-5 mr-2' />
                {formatDate(studyWork.createdAt)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className='bg-white border-b sticky top-0 z-10'>
        <div className='container mx-auto px-4'>
          <nav className='flex space-x-8 overflow-x-auto'>
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className='w-5 h-5 mr-2' />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className='container mx-auto px-4 py-8'>
        {activeTab === 'overview' && (
          <div className='bg-white rounded-lg shadow-md p-8'>
            <h2 className='text-2xl font-bold text-gray-900 mb-6'>
              Study & Work in {studyWork.country}
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              <div className='md:col-span-2'>
                <div className='prose max-w-none'>
                  <p className='text-lg text-gray-600 leading-relaxed mb-6'>
                    {studyWork.subtitle}
                  </p>

                  {/* Quick Stats */}
                  <div className='grid grid-cols-2 gap-4 mb-6'>
                    <div className='bg-blue-50 p-4 rounded-lg'>
                      <div className='flex items-center mb-2'>
                        <Star className='w-5 h-5 text-blue-600 mr-2' />
                        <span className='font-semibold text-blue-900'>
                          Key Benefits
                        </span>
                      </div>
                      <span className='text-2xl font-bold text-blue-600'>
                        {studyWork.whyCountry?.points?.length || 0}
                      </span>
                    </div>

                    <div className='bg-green-50 p-4 rounded-lg'>
                      <div className='flex items-center mb-2'>
                        <Support className='w-5 h-5 text-green-600 mr-2' />
                        <span className='font-semibold text-green-900'>
                          Services
                        </span>
                      </div>
                      <span className='text-2xl font-bold text-green-600'>
                        {studyWork.howWeHelp?.services?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className='bg-gray-50 p-6 rounded-lg'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  Program Highlights
                </h3>
                <ul className='space-y-3'>
                  <li className='flex items-start'>
                    <CheckCircle className='w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
                    <span className='text-gray-600'>
                      Comprehensive support throughout the process
                    </span>
                  </li>
                  <li className='flex items-start'>
                    <CheckCircle className='w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
                    <span className='text-gray-600'>
                      Expert guidance for visa applications
                    </span>
                  </li>
                  <li className='flex items-start'>
                    <CheckCircle className='w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
                    <span className='text-gray-600'>
                      Job placement assistance
                    </span>
                  </li>
                  <li className='flex items-start'>
                    <CheckCircle className='w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
                    <span className='text-gray-600'>
                      Cultural orientation and support
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'why-country' && (
          <div className='bg-white rounded-lg shadow-md p-8'>
            <div className='flex items-center mb-6'>
              <Star className='w-8 h-8 text-yellow-500 mr-3' />
              <h2 className='text-2xl font-bold text-gray-900'>
                Why Choose {studyWork.country}?
              </h2>
            </div>

            <div className='prose max-w-none mb-8'>
              <p className='text-lg text-gray-600 leading-relaxed'>
                {studyWork.whyCountry?.description}
              </p>
            </div>

            {studyWork.whyCountry?.points &&
              studyWork.whyCountry.points.length > 0 && (
                <div>
                  <h3 className='text-xl font-semibold text-gray-900 mb-4'>
                    Key Advantages
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {studyWork.whyCountry.points.map((point, index) => (
                      <div
                        key={index}
                        className='flex items-start p-4 bg-yellow-50 rounded-lg'
                      >
                        <Star className='w-5 h-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0' />
                        <span className='text-gray-700'>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}

        {activeTab === 'eligibility' && (
          <div className='bg-white rounded-lg shadow-md p-8'>
            <div className='flex items-center mb-6'>
              <UserGroup className='w-8 h-8 text-blue-500 mr-3' />
              <h2 className='text-2xl font-bold text-gray-900'>
                Who Can Apply?
              </h2>
            </div>

            <div className='prose max-w-none mb-8'>
              <p className='text-lg text-gray-600 leading-relaxed'>
                {studyWork.whoCanApply?.description}
              </p>
            </div>

            {studyWork.whoCanApply?.requirements &&
              studyWork.whoCanApply.requirements.length > 0 && (
                <div>
                  <h3 className='text-xl font-semibold text-gray-900 mb-4'>
                    Requirements
                  </h3>
                  <div className='space-y-3'>
                    {studyWork.whoCanApply.requirements.map(
                      (requirement, index) => (
                        <div
                          key={index}
                          className='flex items-start p-4 bg-blue-50 rounded-lg'
                        >
                          <CheckCircle className='w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0' />
                          <span className='text-gray-700'>{requirement}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
          </div>
        )}

        {activeTab === 'services' && (
          <div className='bg-white rounded-lg shadow-md p-8'>
            <div className='flex items-center mb-6'>
              <Support className='w-8 h-8 text-green-500 mr-3' />
              <h2 className='text-2xl font-bold text-gray-900'>
                How We Help You
              </h2>
            </div>

            <div className='prose max-w-none mb-8'>
              <p className='text-lg text-gray-600 leading-relaxed'>
                {studyWork.howWeHelp?.description}
              </p>
            </div>

            {studyWork.howWeHelp?.services &&
              studyWork.howWeHelp.services.length > 0 && (
                <div>
                  <h3 className='text-xl font-semibold text-gray-900 mb-4'>
                    Our Services
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {studyWork.howWeHelp.services.map((service, index) => (
                      <div
                        key={index}
                        className='flex items-start p-4 bg-green-50 rounded-lg'
                      >
                        <Support className='w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0' />
                        <span className='text-gray-700'>{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Why Choose Us section if available */}
            {studyWork.whyChooseUs?.points &&
              studyWork.whyChooseUs.points.length > 0 && (
                <div className='mt-8 pt-8 border-t'>
                  <h3 className='text-xl font-semibold text-gray-900 mb-4'>
                    Why Choose Us?
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {studyWork.whyChooseUs.points.map((point, index) => (
                      <div
                        key={index}
                        className='flex items-start p-4 bg-purple-50 rounded-lg'
                      >
                        <AcademicCap className='w-5 h-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0' />
                        <span className='text-gray-700'>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}

        {/* Call to Action */}
        <div className='mt-8 bg-blue-600 rounded-lg p-8 text-white text-center'>
          <h3 className='text-2xl font-bold mb-2'>
            Ready to Start Your Journey?
          </h3>
          <p className='text-blue-100 mb-6'>
            Get in touch with us to learn more about studying and working in{' '}
            {studyWork.country}
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              to='/contact'
              className='bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors'
            >
              Contact Us
            </Link>
            <Link to="/jobs" className='bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors'>
              Apply Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutTheCountry;
