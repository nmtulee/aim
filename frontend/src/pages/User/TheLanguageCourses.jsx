import React, { useState } from 'react';
import { useGetLanguageCourseByIdQuery } from '../../redux/api/languageCourseApiSlice.js';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  HiArrowLeft as ArrowLeft,
  HiLocationMarker as MapPin,
  HiTranslate as Translate,
  HiCalendar as Calendar,
  HiAcademicCap as AcademicCap,
  HiCurrencyDollar as DollarSign,
  HiClock as Clock,
  HiStar as Star,
  HiExclamationCircle as AlertCircle,
  HiCheckCircle as CheckCircle,
  HiPhotograph as Photo,
  HiBookOpen as BookOpen,
  HiUserGroup as UserGroup,
} from 'react-icons/hi';

import {
  useCreateEnrollMutation,
  useGetEnrollByUserQuery,
} from '../../redux/api/enrollApiSlice.js';
import { toast } from 'react-toastify';

const TheLanguageCourses = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [level1, setLevel1] = useState(null);

  const [createEnroll] = useCreateEnrollMutation();
  const { data: Enroll } = useGetEnrollByUserQuery(id);

  const handleCreateEnroll = async (e) => {
    e.preventDefault();

    if (Enroll) {
      toast.error('You have already enrolled');
      return;
    }
    if (!level1) {
      toast.error('please select a Level');
      return;
    }
    try {
      await createEnroll({ course: id, level:level1 }).unwrap();
      toast.success('congratulations you have successfully enrolled');
      navigate('/LanguageCourses');
    } catch (error) {
      console.error(error?.data?.message || error.error);
    }
  };


  const {
    data: courseData,
    isLoading,
    error,
    refetch,
  } = useGetLanguageCourseByIdQuery(id);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (priceString) => {
    // Extract number from price string for display
    const match = priceString.match(/\d+/);
    if (match) {
      return `$${parseInt(match[0])}`;
    }
    return priceString;
  };

  const getPriceRange = (levels) => {
    if (!levels || levels.length === 0) return 'Contact for pricing';

    const prices = levels
      .map((level) => {
        const fee = level.CourseFee;
        const match = fee.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
      })
      .filter((price) => price > 0);

    if (prices.length === 0) return 'Contact for pricing';

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    if (minPrice === maxPrice) {
      return `$${minPrice}`;
    }
    return `$${minPrice} - $${maxPrice}`;
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
          {Array.from({ length: 3 }).map((_, i) => (
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
            Course Not Found
          </h2>
          <p className='text-red-600 mb-6'>
            {error?.data?.message ||
              'The language course you are looking for could not be found.'}
          </p>
          <div className='space-x-4'>
            <button
              onClick={() => navigate('/courses')}
              className='bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors'
            >
              Back to Courses
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

  if (!courseData) {
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        <h2 className='text-2xl font-bold text-gray-800'>Course not found</h2>
        <Link
          to='/courses'
          className='text-blue-600 hover:text-blue-800 mt-4 inline-block'
        >
          Back to Courses
        </Link>
      </div>
    );
  }

  const course = courseData;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'levels', label: 'Course Levels', icon: AcademicCap },
    { id: 'details', label: 'Course Details', icon: Star },
  ];

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Hero Banner */}
      <div className='relative h-80 bg-gradient-to-r from-blue-600 to-indigo-600'>
        {course.image ? (
          <img
            src={course.image}
            alt={course.couresName}
            className='w-full h-full object-cover'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600'>
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
              Back to Courses
            </button>

            <h1 className='text-4xl md:text-5xl font-bold text-white mb-2'>
              {course.couresName}
            </h1>
            <div className='flex items-center text-xl text-white/90 mb-4'>
              <Translate className='w-6 h-6 mr-2' />
              {course.shortName} Language Course
            </div>

            <div className='flex items-center text-white/80 space-x-6 flex-wrap'>
              <div className='flex items-center'>
                <MapPin className='w-5 h-5 mr-2' />
                {course.country}
              </div>
              <div className='flex items-center'>
                <AcademicCap className='w-5 h-5 mr-2' />
                {course.levels.length} Level
                {course.levels.length !== 1 ? 's' : ''}
              </div>
              <div className='flex items-center'>
                <DollarSign className='w-5 h-5 mr-2' />
                {getPriceRange(course.levels)}
              </div>
              <div className='flex items-center'>
                <Calendar className='w-5 h-5 mr-2' />
                {formatDate(course.createdAt)}
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
              Learn {course.shortName} in {course.country}
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              <div className='md:col-span-2'>
                <div className='prose max-w-none'>
                  <p className='text-lg text-gray-600 leading-relaxed mb-6'>
                    {course.description}
                  </p>

                  {/* Quick Stats */}
                  <div className='grid grid-cols-2 gap-4 mb-6'>
                    <div className='bg-blue-50 p-4 rounded-lg'>
                      <div className='flex items-center mb-2'>
                        <AcademicCap className='w-5 h-5 text-blue-600 mr-2' />
                        <span className='font-semibold text-blue-900'>
                          Course Levels
                        </span>
                      </div>
                      <span className='text-2xl font-bold text-blue-600'>
                        {course.levels.length}
                      </span>
                    </div>

                    <div className='bg-green-50 p-4 rounded-lg'>
                      <div className='flex items-center mb-2'>
                        <DollarSign className='w-5 h-5 text-green-600 mr-2' />
                        <span className='font-semibold text-green-900'>
                          Price Range
                        </span>
                      </div>
                      <span className='text-lg font-bold text-green-600'>
                        {getPriceRange(course.levels)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className='bg-gray-50 p-6 rounded-lg'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  Course Highlights
                </h3>
                <ul className='space-y-3'>
                  <li className='flex items-start'>
                    <CheckCircle className='w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
                    <span className='text-gray-600'>
                      Structured learning progression
                    </span>
                  </li>
                  <li className='flex items-start'>
                    <CheckCircle className='w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
                    <span className='text-gray-600'>
                      Multiple proficiency levels available
                    </span>
                  </li>
                  <li className='flex items-start'>
                    <CheckCircle className='w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
                    <span className='text-gray-600'>
                      Flexible course duration options
                    </span>
                  </li>
                  <li className='flex items-start'>
                    <CheckCircle className='w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
                    <span className='text-gray-600'>
                      Cultural immersion opportunities
                    </span>
                  </li>
                </ul>

                <div className='mt-6 pt-4 border-t'>
                  <h4 className='font-semibold text-gray-900 mb-2'>Location</h4>
                  <div className='flex items-center text-gray-600'>
                    <MapPin className='w-4 h-4 mr-2' />
                    {course.country}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'levels' && (
          <div className='space-y-6'>
            <div className='bg-white rounded-lg shadow-md p-8'>
              <div className='flex items-center mb-6'>
                <AcademicCap className='w-8 h-8 text-blue-500 mr-3' />
                <h2 className='text-2xl font-bold text-gray-900'>
                  Available Course Levels
                </h2>
              </div>

              <p className='text-lg text-gray-600 mb-8'>
                Choose the level that best matches your current proficiency.
                Each level is designed to build upon previous knowledge and
                skills.
              </p>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {course.levels.map((level, index) => (
                  <div
                    key={index}
                    className='border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow'
                  >
                    <div className='flex items-center justify-between mb-4'>
                      <h3 className='text-xl font-semibold text-gray-900'>
                        {level.level}
                      </h3>
                      <div className='text-right'>
                        <div className='text-2xl font-bold text-blue-600'>
                          {formatPrice(level.CourseFee)}
                        </div>
                      </div>
                    </div>

                    <div className='flex items-center mb-4 text-gray-600'>
                      <Clock className='w-4 h-4 mr-2' />
                      <span>{level.duration}</span>
                    </div>

                    <p className='text-gray-600 mb-6 leading-relaxed'>
                      {level.description}
                    </p>

                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-gray-500'>
                        Level {index + 1} of {course.levels.length}
                      </span>
                      <button
                        onClick={() => setLevel1(level.level)}
                        disabled={level1 === level.level  || Enroll}
                        className='bg-blue-600 text-white px-4 disabled:bg-gray-500 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm'>
                        Select Level
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div className='bg-white rounded-lg shadow-md p-8'>
            <div className='flex items-center mb-6'>
              <Star className='w-8 h-8 text-yellow-500 mr-3' />
              <h2 className='text-2xl font-bold text-gray-900'>
                Course Details
              </h2>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              {/* Course Information */}
              <div>
                <h3 className='text-xl font-semibold text-gray-900 mb-4'>
                  Course Information
                </h3>
                <div className='space-y-4'>
                  <div className='flex items-start'>
                    <BookOpen className='w-5 h-5 text-blue-500 mr-3 mt-0.5' />
                    <div>
                      <div className='font-medium text-gray-900'>
                        Course Name
                      </div>
                      <div className='text-gray-600'>{course.couresName}</div>
                    </div>
                  </div>

                  <div className='flex items-start'>
                    <Translate className='w-5 h-5 text-green-500 mr-3 mt-0.5' />
                    <div>
                      <div className='font-medium text-gray-900'>Language</div>
                      <div className='text-gray-600'>{course.shortName}</div>
                    </div>
                  </div>

                  <div className='flex items-start'>
                    <MapPin className='w-5 h-5 text-purple-500 mr-3 mt-0.5' />
                    <div>
                      <div className='font-medium text-gray-900'>Location</div>
                      <div className='text-gray-600'>{course.country}</div>
                    </div>
                  </div>

                  <div className='flex items-start'>
                    <Calendar className='w-5 h-5 text-indigo-500 mr-3 mt-0.5' />
                    <div>
                      <div className='font-medium text-gray-900'>
                        Date Added
                      </div>
                      <div className='text-gray-600'>
                        {formatDate(course.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Learning Benefits */}
              <div>
                <h3 className='text-xl font-semibold text-gray-900 mb-4'>
                  Learning Benefits
                </h3>
                <div className='space-y-3'>
                  <div className='flex items-start p-3 bg-blue-50 rounded-lg'>
                    <CheckCircle className='w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0' />
                    <span className='text-gray-700'>
                      Comprehensive language skills development
                    </span>
                  </div>
                  <div className='flex items-start p-3 bg-green-50 rounded-lg'>
                    <CheckCircle className='w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0' />
                    <span className='text-gray-700'>
                      Cultural immersion experience
                    </span>
                  </div>
                  <div className='flex items-start p-3 bg-purple-50 rounded-lg'>
                    <CheckCircle className='w-5 h-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0' />
                    <span className='text-gray-700'>
                      Internationally recognized certification
                    </span>
                  </div>
                  <div className='flex items-start p-3 bg-yellow-50 rounded-lg'>
                    <CheckCircle className='w-5 h-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0' />
                    <span className='text-gray-700'>
                      Career advancement opportunities
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Description */}
            <div className='mt-8 pt-6 border-t'>
              <h3 className='text-xl font-semibold text-gray-900 mb-4'>
                About This Course
              </h3>
              <div className='prose max-w-none'>
                <p className='text-gray-600 leading-relaxed'>
                  {course.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className='mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white text-center'>
          <h3 className='text-2xl font-bold mb-2'>
            Ready to Learn {course.shortName}?
          </h3>
          <p className='text-blue-100 mb-6'>
            Start your language learning journey in {course.country} today.
            Choose from {course.levels.length} different proficiency levels.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              to='/contact'
              className='bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors'
            >
              Get More Info
            </Link>
            <button onClick={handleCreateEnroll} disabled={!level1 || Enroll} className='bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors disabled:hidden '>
              Enroll Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheLanguageCourses;
