import React, { useState, useMemo } from 'react';
import { useGetAllLanguageCoursesQuery } from '../../redux/api/languageCourseApiSlice.js';
import { useNavigate } from 'react-router-dom';
import {
  HiLocationMarker as MapPin,
  HiTranslate as Language,
  HiCalendar as Calendar,
  HiCurrencyDollar as DollarSign,
  HiSearch as Search,
  HiFilter as Filter,
  HiChevronLeft as ChevronLeft,
  HiChevronRight as ChevronRight,
  HiAcademicCap as AcademicCap,
  HiClock as Clock,
} from 'react-icons/hi';

const CoursesPage = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    search: '',
    country: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: coursesData,
    isLoading,
    error,
    refetch,
  } = useGetAllLanguageCoursesQuery(filters);

  // Extract unique countries
  const uniqueCountries = useMemo(() => {
    const countries =
      coursesData?.languageCourses?.map((course) => course.country) || [];
    return [...new Set(countries.filter(Boolean))];
  }, [coursesData]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      search: searchTerm,
      page: 1,
    }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      search: '',
      country: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    setSearchTerm('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getLowestPrice = (levels) => {
    if (!levels || levels.length === 0) return 'Contact for pricing';

    const prices = levels
      .map((level) => {
        const fee = level.CourseFee;
        // Extract number from fee string (e.g., "$500" -> 500)
        const match = fee.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
      })
      .filter((price) => price > 0);

    if (prices.length === 0) return 'Contact for pricing';

    const minPrice = Math.min(...prices);
    return `From $${minPrice}`;
  };

  const CourseCardSkeleton = () => (
    <div className='bg-white rounded-lg shadow-md p-6 animate-pulse'>
      <div className='flex items-start justify-between mb-4'>
        <div className='flex-1'>
          <div className='h-6 bg-gray-200 rounded w-3/4 mb-2'></div>
          <div className='h-4 bg-gray-200 rounded w-1/2'></div>
        </div>
        <div className='w-16 h-16 bg-gray-200 rounded-lg'></div>
      </div>
      <div className='space-y-2 mb-4'>
        <div className='h-4 bg-gray-200 rounded w-full'></div>
        <div className='h-4 bg-gray-200 rounded w-2/3'></div>
      </div>
      <div className='flex items-center justify-between mb-4'>
        <div className='h-4 bg-gray-200 rounded w-1/3'></div>
        <div className='h-4 bg-gray-200 rounded w-1/4'></div>
      </div>
      <div className='h-8 bg-gray-200 rounded w-full'></div>
    </div>
  );

  if (error) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-6 text-center'>
          <h2 className='text-2xl font-bold text-red-800 mb-2'>
            Error Loading Courses
          </h2>
          <p className='text-red-600 mb-4'>
            {error?.data?.message ||
              'Failed to load language courses. Please try again.'}
          </p>
          <button
            onClick={() => refetch()}
            className='bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8 pt-10 mt-10'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>
          Learn a New Language
        </h1>
        <p className='text-gray-600'>
          Discover language learning opportunities from around the world
        </p>
      </div>

      {/* Search and Filters */}
      <div className='bg-white rounded-lg shadow-md p-6 mb-8'>
        <form
          onSubmit={handleSearch}
          className='grid grid-flow-row md:flex gap-4 mb-4'
        >
          <div className='flex-1 relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
            <input
              type='text'
              placeholder='Search courses by name or language...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>
          <button
            type='submit'
            className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2'
          >
            <Search className='w-4 h-4' />
            Search
          </button>
          <button
            type='button'
            onClick={() => setShowFilters(!showFilters)}
            className='bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2'
          >
            <Filter className='w-4 h-4' />
            Filters
          </button>
        </form>

        {showFilters && (
          <div className='border-t pt-4'>
            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {/* Country Dropdown */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Country
                </label>
                <select
                  value={filters.country}
                  onChange={(e) =>
                    handleFilterChange('country', e.target.value)
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                >
                  <option value=''>All Countries</option>
                  {uniqueCountries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                >
                  <option value='createdAt'>Date Added</option>
                  <option value='couresName'>Course Name</option>
                  <option value='country'>Country</option>
                  <option value='shortName'>Language</option>
                </select>
              </div>

              {/* Order */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Order
                </label>
                <select
                  value={filters.sortOrder}
                  onChange={(e) =>
                    handleFilterChange('sortOrder', e.target.value)
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                >
                  <option value='desc'>Descending</option>
                  <option value='asc'>Ascending</option>
                </select>
              </div>

              <div className='flex items-end'>
                <button
                  onClick={clearFilters}
                  className='w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors'
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Info */}
      {coursesData && (
        <div className='mb-6'>
          <p className='text-gray-600'>
            Showing {coursesData.languageCourses.length} of{' '}
            {coursesData.pagination.totalCourses} courses
            {filters.search && ` for "${filters.search}"`}
          </p>
        </div>
      )}

      {/* Course Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <CourseCardSkeleton key={index} />
            ))
          : coursesData?.languageCourses?.map((course) => (
              <div
                key={course._id}
                onClick={() => navigate(`/courses/${course._id}`)}
                className='bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer border border-gray-100'
              >
                {/* Course Header */}
                <div className='flex justify-between items-start mb-4'>
                  <div className='flex-1'>
                    <h3 className='text-xl font-semibold mb-1 text-gray-900'>
                      {course.couresName}
                    </h3>
                    <div className='flex items-center text-sm text-blue-600 mb-2'>
                      <Language className='w-4 h-4 mr-1' />
                      {course.shortName} Language
                    </div>
                  </div>
                  {course.image && (
                    <div className='ml-4'>
                      <img
                        src={course.image}
                        alt={course.couresName}
                        className='w-16 h-16 rounded-lg object-cover border'
                      />
                    </div>
                  )}
                </div>

                {/* Course Description */}
                <div className='mb-4'>
                  <p className='text-gray-600 text-sm line-clamp-2'>
                    {course.description}
                  </p>
                </div>

                {/* Course Info */}
                <div className='space-y-2 mb-4 text-sm'>
                  <div className='flex items-center text-gray-600'>
                    <MapPin className='w-4 h-4 mr-2' />
                    {course.country}
                  </div>
                  <div className='flex items-center text-gray-600'>
                    <AcademicCap className='w-4 h-4 mr-2' />
                    {course.levels.length} Level
                    {course.levels.length !== 1 ? 's' : ''} Available
                  </div>
                  <div className='flex items-center text-green-600'>
                    <DollarSign className='w-4 h-4 mr-2' />
                    {getLowestPrice(course.levels)}
                  </div>
                  <div className='flex items-center text-gray-500'>
                    <Calendar className='w-4 h-4 mr-2' />
                    Added {formatDate(course.createdAt)}
                  </div>
                </div>

                {/* Course Levels Preview */}
                {course.levels.length > 0 && (
                  <div className='border-t pt-4'>
                    <div className='flex items-center justify-between text-sm'>
                      <span className='text-gray-600'>Sample Levels:</span>
                      <span className='text-blue-600 font-medium'>
                        View Details →
                      </span>
                    </div>
                    <div className='mt-2 flex flex-wrap gap-1'>
                      {course.levels.slice(0, 3).map((level, index) => (
                        <span
                          key={index}
                          className='inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs'
                        >
                          {level.level}
                        </span>
                      ))}
                      {course.levels.length > 3 && (
                        <span className='inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs'>
                          +{course.levels.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
      </div>

      {/* No Results */}
      {!isLoading && coursesData?.languageCourses?.length === 0 && (
        <div className='text-center py-12'>
          <AcademicCap className='w-16 h-16 text-gray-300 mx-auto mb-4' />
          <h3 className='text-xl font-semibold text-gray-900 mb-2'>
            No courses found
          </h3>
          <p className='text-gray-600 mb-4'>
            {filters.search || filters.country
              ? 'Try adjusting your search filters to find more courses.'
              : 'No language courses are available at the moment.'}
          </p>
          {(filters.search || filters.country) && (
            <button
              onClick={clearFilters}
              className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {coursesData?.pagination?.totalPages > 1 && (
        <div className='flex justify-center items-center space-x-2'>
          <button
            onClick={() =>
              handlePageChange(coursesData.pagination.currentPage - 1)
            }
            disabled={!coursesData.pagination.hasPrevPage}
            className='p-2 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <ChevronLeft className='w-5 h-5' />
          </button>

          <div className='flex space-x-1'>
            {Array.from(
              { length: coursesData.pagination.totalPages },
              (_, i) => i + 1
            )
              .filter((page) => {
                const current = coursesData.pagination.currentPage;
                return (
                  page === 1 ||
                  page === coursesData.pagination.totalPages ||
                  (page >= current - 1 && page <= current + 1)
                );
              })
              .map((page, index, array) => {
                const prevPage = array[index - 1];
                const shouldShowEllipsis = prevPage && page - prevPage > 1;

                return (
                  <React.Fragment key={page}>
                    {shouldShowEllipsis && (
                      <span className='px-3 py-2 text-gray-500'>...</span>
                    )}
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded transition-colors ${
                        page === coursesData.pagination.currentPage
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                );
              })}
          </div>

          <button
            onClick={() =>
              handlePageChange(coursesData.pagination.currentPage + 1)
            }
            disabled={!coursesData.pagination.hasNextPage}
            className='p-2 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <ChevronRight className='w-5 h-5' />
          </button>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
