import React, { useState, useMemo } from 'react';
import { useGetAllJobsQuery } from '../../redux/api/jobApiSlice';
import { useNavigate } from 'react-router-dom';
import {
  HiLocationMarker as MapPin,
  HiOfficeBuilding as Building,
  HiCalendar as Calendar,
  HiCurrencyDollar as DollarSign,
  HiSearch as Search,
  HiFilter as Filter,
  HiChevronLeft as ChevronLeft,
  HiChevronRight as ChevronRight,
  HiBriefcase as Briefcase,
} from 'react-icons/hi';

const Jobs = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    search: '',
    category: '',
    country: '',
    isSchengen: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: jobsData,
    isLoading,
    error,
    refetch,
  } = useGetAllJobsQuery(filters);

  // Extract unique countries
  const uniqueCountries = useMemo(() => {
    const countries = jobsData?.jobs?.map((job) => job.country) || [];
    return [...new Set(countries.filter(Boolean))];
  }, [jobsData]);

  // Extract unique categories with name + id
  const uniqueCategories = useMemo(() => {
    const map = new Map();
    jobsData?.jobs?.forEach((job) => {
      if (job.category?._id && job.category?.name) {
        map.set(job.category.name, job.category._id);
      }
    });
    return Array.from(map.entries()); // [ [name, id], ... ]
  }, [jobsData]);

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
      category: '',
      country: '',
      isSchengen: '',
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

  const JobCardSkeleton = () => (
    <div className='bg-white rounded-lg shadow-md p-6 animate-pulse'>
      <div className='flex items-start justify-between mb-4'>
        <div className='flex-1'>
          <div className='h-6 bg-gray-200 rounded w-3/4 mb-2'></div>
          <div className='h-4 bg-gray-200 rounded w-1/2'></div>
        </div>
        <div className='w-12 h-12 bg-gray-200 rounded-lg'></div>
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
  );

  if (error) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-6 text-center'>
          <h2 className='text-2xl font-bold text-red-800 mb-2'>
            Error Loading Jobs
          </h2>
          <p className='text-red-600 mb-4'>
            {error?.data?.message || 'Failed to load jobs. Please try again.'}
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
          Find Your Dream Job
        </h1>
        <p className='text-gray-600'>
          Discover amazing job opportunities from around the world
        </p>
      </div>

      {/* Search and Filters */}
      <div className='bg-white rounded-lg shadow-md p-6 mb-8'>
        <form onSubmit={handleSearch} className='grid grid-flow-row md:flex gap-4 mb-4'>
          <div className='flex-1 relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
            <input
              type='text'
              placeholder='Search jobs by title...'
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
            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4'>
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

              {/* Category Dropdown */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange('category', e.target.value)
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                >
                  <option value=''>All Categories</option>
                  {uniqueCategories.map(([name, id]) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Schengen Dropdown */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Schengen Area
                </label>
                <select
                  value={filters.isSchengen}
                  onChange={(e) =>
                    handleFilterChange('isSchengen', e.target.value)
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                >
                  <option value=''>All</option>
                  <option value='true'>Schengen</option>
                  <option value='false'>Non-Schengen</option>
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
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                >
                  <option value='createdAt'>Date Posted</option>
                  <option value='title'>Title</option>
                  <option value='country'>Country</option>
                  <option value='salary'>Salary</option>
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
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                >
                  <option value='desc'>Descending</option>
                  <option value='asc'>Ascending</option>
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

      {jobsData && (
        <div className='mb-6'>
          <p className='text-gray-600'>
            Showing {jobsData.jobs.length} of {jobsData.pagination.totalJobs}{' '}
            jobs
            {filters.search && ` for "${filters.search}"`}
          </p>
        </div>
      )}

      {/* Job Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <JobCardSkeleton key={index} />
            ))
          : jobsData?.jobs?.map((job) => (
              <div
                key={job._id}
                onClick={() => navigate(`/jobs/${job._id}`)}
                className='bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer'
              >
                <div className='flex justify-between mb-4'>
                  <div>
                    <h3 className='text-xl font-semibold mb-1'>{job.title}</h3>
                    <div className='text-sm text-gray-600'>
                      <Building className='inline mr-1 w-4 h-4' />
                      {job.category?.name || 'Uncategorized'}
                    </div>
                  </div>
                  {job.image && (
                    <img
                      src={job.image}
                      alt={job.title}
                      className='w-12 h-12 rounded object-cover'
                    />
                  )}
                </div>
                <div className='text-gray-600 space-y-1'>
                  <div>
                    <MapPin className='inline mr-1 w-4 h-4' />
                    {job.location}, {job.country}
                  </div>
                  <div>
                    <DollarSign className='inline mr-1 w-4 h-4 text-green-600' />
                    {job.salary}
                  </div>
                  <div>
                    <Calendar className='inline mr-1 w-4 h-4' />
                    {formatDate(job.createdAt)}
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* Pagination */}
      {jobsData?.pagination?.totalPages > 1 && (
        <div className='flex justify-center space-x-2'>
          <button
            onClick={() =>
              handlePageChange(jobsData.pagination.currentPage - 1)
            }
            disabled={!jobsData.pagination.hasPrevPage}
            className='p-2 rounded border hover:bg-gray-50 disabled:opacity-50'
          >
            <ChevronLeft className='w-5 h-5' />
          </button>

          {Array.from(
            { length: jobsData.pagination.totalPages },
            (_, i) => i + 1
          )
            .filter((page) => {
              const current = jobsData.pagination.currentPage;
              return (
                page === 1 ||
                page === jobsData.pagination.totalPages ||
                (page >= current - 1 && page <= current + 1)
              );
            })
            .map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded ${
                  page === jobsData.pagination.currentPage
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-200'
                }`}
              >
                {page}
              </button>
            ))}

          <button
            onClick={() =>
              handlePageChange(jobsData.pagination.currentPage + 1)
            }
            disabled={!jobsData.pagination.hasNextPage}
            className='p-2 rounded border hover:bg-gray-50 disabled:opacity-50'
          >
            <ChevronRight className='w-5 h-5' />
          </button>
        </div>
      )}
    </div>
  );
};

export default Jobs;
