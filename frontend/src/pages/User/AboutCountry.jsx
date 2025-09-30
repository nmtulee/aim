import React, { useState, useMemo } from 'react';
import { useGetAllStudyWorksQuery } from '../../redux/api/studyWorkApiSlice.js';
import { useNavigate, Link } from 'react-router-dom';
import {
  HiLocationMarker as MapPin,
  HiGlobeAlt as Globe,
  HiCalendar as Calendar,
  HiSearch as Search,
  HiFilter as Filter,
  HiChevronLeft as ChevronLeft,
  HiChevronRight as ChevronRight,
  HiAcademicCap as AcademicCap,
  HiPhotograph as Photo,
} from 'react-icons/hi';

const AboutCountry = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    country: '',
    search: '',
  });

  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: studyWorksData,
    isLoading,
    error,
    refetch,
  } = useGetAllStudyWorksQuery(filters);

  // Extract unique countries
  const uniqueCountries = useMemo(() => {
    const countries =
      studyWorksData?.studyWorks?.map((work) => work.country) || [];
    return [...new Set(countries.filter(Boolean))];
  }, [studyWorksData]);

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
      country: '',
      search: '',
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

  const StudyWorkCardSkeleton = () => (
    <div className='bg-white rounded-lg shadow-md overflow-hidden animate-pulse'>
      <div className='h-48 bg-gray-200'></div>
      <div className='p-6'>
        <div className='flex items-start justify-between mb-4'>
          <div className='flex-1'>
            <div className='h-6 bg-gray-200 rounded w-3/4 mb-2'></div>
            <div className='h-4 bg-gray-200 rounded w-1/2'></div>
          </div>
        </div>
        <div className='space-y-2 mb-4'>
          <div className='h-4 bg-gray-200 rounded w-full'></div>
          <div className='h-4 bg-gray-200 rounded w-2/3'></div>
        </div>
        <div className='flex items-center justify-between'>
          <div className='h-4 bg-gray-200 rounded w-1/3'></div>
          <div className='h-8 bg-gray-200 rounded w-20'></div>
        </div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-6 text-center'>
          <h2 className='text-2xl font-bold text-red-800 mb-2'>
            Error Loading Study & Work Programs
          </h2>
          <p className='text-red-600 mb-4'>
            {error?.data?.message ||
              'Failed to load programs. Please try again.'}
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
          Study & Work Abroad Programs
        </h1>
        <p className='text-gray-600'>
          Discover amazing opportunities to study and work in countries around
          the world
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
              placeholder='Search by country or program title...'
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
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
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

              {/* Items per page */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Items per page
                </label>
                <select
                  value={filters.limit}
                  onChange={(e) =>
                    handleFilterChange('limit', parseInt(e.target.value))
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                >
                  <option value={6}>6 per page</option>
                  <option value={12}>12 per page</option>
                  <option value={24}>24 per page</option>
                </select>
              </div>
            </div>

            <div className='mt-4'>
              <button
                onClick={clearFilters}
                className='bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors'
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      {studyWorksData && (
        <div className='mb-6'>
          <p className='text-gray-600'>
            Showing {studyWorksData.studyWorks.length} of{' '}
            {studyWorksData.pagination.total} programs
            {filters.search && ` for "${filters.search}"`}
            {filters.country && ` in ${filters.country}`}
          </p>
        </div>
      )}

      {/* Study Works Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <StudyWorkCardSkeleton key={index} />
            ))
          : studyWorksData?.studyWorks?.map((studyWork) => (
              <div
                key={studyWork._id}
                onClick={() => navigate(`/country/${studyWork._id}`)}
                className='bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer'
              >
                {/* Banner Image */}
                <div className='relative h-48 bg-gray-200'>
                  {studyWork.bannerImage ? (
                    <img
                      src={studyWork.bannerImage}
                      alt={studyWork.title}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600'>
                      <Photo className='w-16 h-16 text-white opacity-50' />
                    </div>
                  )}
                  <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent'></div>
                  <div className='absolute bottom-4 left-4 right-4'>
                    <h3 className='text-white text-xl font-semibold mb-1'>
                      {studyWork.title}
                    </h3>
                    <div className='flex items-center text-white/90 text-sm'>
                      <Globe className='w-4 h-4 mr-1' />
                      {studyWork.country}
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className='p-6'>
                  <p className='text-gray-600 mb-4 line-clamp-3'>
                    {studyWork.subtitle}
                  </p>

                  <div className='space-y-2 mb-4'>
                    {/* Why Country Preview */}
                    {studyWork.whyCountry?.points?.length > 0 && (
                      <div className='text-sm text-gray-500'>
                        <AcademicCap className='inline w-4 h-4 mr-1' />
                        {studyWork.whyCountry.points.length} key advantages
                      </div>
                    )}

                    {/* Requirements Preview */}
                    {studyWork.whoCanApply?.requirements?.length > 0 && (
                      <div className='text-sm text-gray-500'>
                        <MapPin className='inline w-4 h-4 mr-1' />
                        {studyWork.whoCanApply.requirements.length} requirements
                      </div>
                    )}

                    {/* Services Preview */}
                    {studyWork.howWeHelp?.services?.length > 0 && (
                      <div className='text-sm text-gray-500'>
                        <Calendar className='inline w-4 h-4 mr-1' />
                        {studyWork.howWeHelp.services.length} services provided
                      </div>
                    )}
                  </div>

                  <div className='flex items-center justify-between pt-4 border-t'>
                    <span className='text-sm text-gray-500'>
                      {formatDate(studyWork.createdAt)}
                    </span>
                    <button className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium'>
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* Empty State */}
      {!isLoading && studyWorksData?.studyWorks?.length === 0 && (
        <div className='text-center py-12'>
          <AcademicCap className='w-16 h-16 text-gray-300 mx-auto mb-4' />
          <h3 className='text-xl font-semibold text-gray-900 mb-2'>
            No Programs Found
          </h3>
          <p className='text-gray-600 mb-4'>
            {filters.search || filters.country
              ? 'Try adjusting your search criteria or filters.'
              : 'No study and work programs are currently available.'}
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
      {studyWorksData?.pagination?.totalPages > 1 && (
        <div className='flex justify-center items-center space-x-2'>
          <button
            onClick={() =>
              handlePageChange(studyWorksData.pagination.currentPage - 1)
            }
            disabled={!studyWorksData.pagination.hasPrevPage}
            className='p-2 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <ChevronLeft className='w-5 h-5' />
          </button>

          {Array.from(
            { length: studyWorksData.pagination.totalPages },
            (_, i) => i + 1
          )
            .filter((page) => {
              const current = studyWorksData.pagination.currentPage;
              return (
                page === 1 ||
                page === studyWorksData.pagination.totalPages ||
                (page >= current - 1 && page <= current + 1)
              );
            })
            .map((page, index, array) => {
              // Add ellipsis if there's a gap
              const prevPage = array[index - 1];
              const showEllipsis = prevPage && page - prevPage > 1;

              return (
                <React.Fragment key={page}>
                  {showEllipsis && (
                    <span className='px-3 py-1 text-gray-500'>...</span>
                  )}
                  <button
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded transition-colors ${
                      page === studyWorksData.pagination.currentPage
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-200 border'
                    }`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              );
            })}

          <button
            onClick={() =>
              handlePageChange(studyWorksData.pagination.currentPage + 1)
            }
            disabled={!studyWorksData.pagination.hasNextPage}
            className='p-2 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <ChevronRight className='w-5 h-5' />
          </button>
        </div>
      )}
    </div>
  );
};

export default AboutCountry;
