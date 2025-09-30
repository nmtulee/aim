import React, { useState, useMemo, useCallback } from 'react';
import {
  useGetAllTestimonialsQuery,
  useGetMyTestimonialQuery,
} from '../../redux/api/testimonialApiSlice';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  HiLocationMarker as MapPin,
  HiOfficeBuilding as Building,
  HiCalendar as Calendar,
  HiStar as Star,
  HiSearch as Search,
  HiFilter as Filter,
  HiChevronLeft as ChevronLeft,
  HiChevronRight as ChevronRight,
  HiUser as User,
  HiEye as Eye,
  HiAdjustments as Adjustments,
  HiSparkles as Sparkles,
  HiTrendingUp as TrendingUp,
} from 'react-icons/hi';

const Testimonials = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  

  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    country: '',
    minRating: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  const { data: testimonialExists , error: err } = useGetMyTestimonialQuery();

  const {
    data: testimonialsData,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useGetAllTestimonialsQuery(filters);

  // Filter testimonials by search query locally
  const filteredTestimonials = useMemo(() => {
    if (!testimonialsData?.data?.testimonials || !searchQuery) {
      return testimonialsData?.data?.testimonials || [];
    }

    return testimonialsData.data.testimonials.filter(
      (testimonial) =>
        testimonial.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        testimonial.message
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        testimonial.country
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        testimonial.jobTitle
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        testimonial.user?.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
  }, [testimonialsData?.data?.testimonials, searchQuery]);

  // Extract unique countries with counts
  const countriesWithCounts = useMemo(() => {
    const countryMap = new Map();
    testimonialsData?.data?.testimonials?.forEach((testimonial) => {
      if (testimonial.country) {
        countryMap.set(
          testimonial.country,
          (countryMap.get(testimonial.country) || 0) + 1
        );
      }
    });
    return Array.from(countryMap.entries()).sort((a, b) => b[1] - a[1]);
  }, [testimonialsData?.data?.testimonials]);

  // Calculate average rating
  const averageRating = useMemo(() => {
    if (!testimonialsData?.data?.testimonials?.length) return 0;
    const sum = testimonialsData.data.testimonials.reduce(
      (acc, t) => acc + (t.rating || 0),
      0
    );
    return (sum / testimonialsData.data.testimonials.length).toFixed(1);
  }, [testimonialsData?.data?.testimonials]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 12,
      country: '',
      minRating: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    setSearchQuery('');
  }, []);

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, []);

  const renderStars = useCallback((rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  }, []);

  const getUserInitials = useCallback((userName) => {
    if (!userName) return 'UN';
    return userName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }, []);

  const truncateMessage = useCallback((message, maxLength = 150) => {
    if (!message || message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  }, []);

  
  const handleTestimonialAction = useCallback(() => {

    if (!testimonialExists) {
      navigate('/create-testimonial');
    } else  {
      navigate('/update-testimonial');
    }
  }, [testimonialExists, navigate]);

  const TestimonialCardSkeleton = () => (
    <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse '>
      <div className='flex items-start justify-between mb-4'>
        <div className='flex-1'>
          <div className='h-6 bg-gray-200 rounded-lg w-3/4 mb-2'></div>
          <div className='h-4 bg-gray-200 rounded w-1/2'></div>
        </div>
        <div className='w-14 h-14 bg-gray-200 rounded-full'></div>
      </div>
      <div className='space-y-3 mb-4'>
        <div className='h-4 bg-gray-200 rounded w-full'></div>
        <div className='h-4 bg-gray-200 rounded w-5/6'></div>
        <div className='h-4 bg-gray-200 rounded w-3/4'></div>
      </div>
      <div className='flex items-center justify-between'>
        <div className='h-4 bg-gray-200 rounded w-1/3'></div>
        <div className='flex space-x-1'>
          {[...Array(5)].map((_, i) => (
            <div key={i} className='w-4 h-4 bg-gray-200 rounded'></div>
          ))}
        </div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 '>
        <div className='bg-white rounded-2xl shadow-xl border border-red-200 p-8 text-center max-w-md'>
          <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg
              className='w-8 h-8 text-red-600'
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
          </div>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>
            Unable to Load Testimonials
          </h2>
          <p className='text-gray-600 mb-6'>
            {error?.data?.message || 'Something went wrong. Please try again.'}
          </p>
          <button
            onClick={() => refetch()}
            className='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-semibold'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 my-10'>
      <div className='container mx-auto px-4 py-12'>
        {/* Enhanced Header */}
        <div className='text-center mb-12'>
          <div className='inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-2 mb-6'>
            <Sparkles className='w-5 h-5 text-blue-600 mr-2' />
            <span className='text-blue-800 font-semibold'>Success Stories</span>
          </div>
          <h1 className='text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4'>
            Client Testimonials
          </h1>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            Discover authentic experiences from our global community of
            successful clients
          </p>
        </div>

        {/* Enhanced Statistics */}
        {testimonialsData?.data && (
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-12'>
            <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg text-center'>
              <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                <User className='w-6 h-6 text-white' />
              </div>
              <div className='text-3xl font-bold text-gray-900 mb-2'>
                {testimonialsData.data.pagination.totalTestimonials}
              </div>
              <div className='text-gray-600 font-medium'>Total Reviews</div>
            </div>

            <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg text-center'>
              <div className='w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Star className='w-6 h-6 text-white' />
              </div>
              <div className='text-3xl font-bold text-gray-900 mb-2'>
                {averageRating}
              </div>
              <div className='text-gray-600 font-medium'>Average Rating</div>
            </div>

            <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg text-center'>
              <div className='w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                <MapPin className='w-6 h-6 text-white' />
              </div>
              <div className='text-3xl font-bold text-gray-900 mb-2'>
                {countriesWithCounts.length}
              </div>
              <div className='text-gray-600 font-medium'>Countries</div>
            </div>

            <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg text-center'>
              <div className='w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                <TrendingUp className='w-6 h-6 text-white' />
              </div>
              <div className='text-3xl font-bold text-gray-900 mb-2'>
                {Math.round(
                  (testimonialsData.data.testimonials?.filter(
                    (t) => t.rating >= 4
                  ).length /
                    testimonialsData.data.testimonials?.length) *
                    100
                ) || 0}
                %
              </div>
              <div className='text-gray-600 font-medium'>4+ Star Rating</div>
            </div>
          </div>
        )}

        {/* Enhanced Search and Filters */}
        <div className='bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8'>
          {/* Search Bar */}
          <div className='relative mb-6'>
            <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
              <Search className='h-5 w-5 text-gray-400' />
            </div>
            <input
              type='text'
              placeholder='Search testimonials by name, title, country, or content...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-lg placeholder-gray-400'
            />
          </div>

          {/* Filter Toggle */}
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-lg font-semibold text-gray-800 flex items-center'>
              <Adjustments className='w-5 h-5 mr-2' />
              Advanced Filters
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className='bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 flex items-center gap-2 font-semibold'
            >
              <Filter className='w-4 h-4' />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {showFilters && (
            <div className='border-t border-gray-200 pt-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {/* Enhanced Country Dropdown */}
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    Country
                  </label>
                  <select
                    value={filters.country}
                    onChange={(e) =>
                      handleFilterChange('country', e.target.value)
                    }
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300'
                  >
                    <option value=''>All Countries</option>
                    {countriesWithCounts.map(([country, count]) => (
                      <option key={country} value={country}>
                        {country} ({count})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Enhanced Rating Filter */}
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    Minimum Rating
                  </label>
                  <select
                    value={filters.minRating}
                    onChange={(e) =>
                      handleFilterChange('minRating', e.target.value)
                    }
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300'
                  >
                    <option value=''>All Ratings</option>
                    <option value='5'>⭐⭐⭐⭐⭐ 5 Stars</option>
                    <option value='4'>⭐⭐⭐⭐ 4+ Stars</option>
                    <option value='3'>⭐⭐⭐ 3+ Stars</option>
                    <option value='2'>⭐⭐ 2+ Stars</option>
                    <option value='1'>⭐ 1+ Stars</option>
                  </select>
                </div>

                {/* Enhanced Sort Options */}
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      handleFilterChange('sortBy', e.target.value)
                    }
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300'
                  >
                    <option value='createdAt'>📅 Date Posted</option>
                    <option value='rating'>⭐ Rating</option>
                    <option value='title'>📝 Title</option>
                    <option value='country'>🌍 Country</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    Order
                  </label>
                  <select
                    value={filters.sortOrder}
                    onChange={(e) =>
                      handleFilterChange('sortOrder', e.target.value)
                    }
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300'
                  >
                    <option value='desc'>⬇️ Newest First</option>
                    <option value='asc'>⬆️ Oldest First</option>
                  </select>
                </div>
              </div>

              <div className='mt-6 flex gap-4'>
                <button
                  onClick={clearFilters}
                  className='bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 font-semibold'
                >
                  Clear All Filters
                </button>
                <div className='text-sm text-gray-600 flex items-center'>
                  Showing {filteredTestimonials.length} testimonials
                  {searchQuery && ` matching "${searchQuery}"`}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Testimonials Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'>
          {isLoading || isFetching
            ? Array.from({ length: 6 }).map((_, index) => (
                <TestimonialCardSkeleton key={index} />
              ))
            : filteredTestimonials?.map((testimonial) => (
                <div
                  key={testimonial._id}
                  onClick={() => navigate(`/success-story/${testimonial._id}`)}
                  className='group bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 p-6 cursor-pointer border border-white/20 hover:border-blue-200 transform hover:-translate-y-2'
                >
                  {/* Enhanced Header */}
                  <div className='flex items-start justify-between mb-6'>
                    <div className='flex-1'>
                      <h3 className='text-xl font-bold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2'>
                        {testimonial.title}
                      </h3>
                      <div className='text-sm text-gray-600 flex items-center mb-1'>
                        <User className='inline mr-2 w-4 h-4' />
                        {testimonial.user?.name || 'Anonymous User'}
                      </div>
                    </div>
                    <div className='flex flex-col items-center'>
                      {testimonial.photo ? (
                        <img
                          src={testimonial.photo}
                          alt={testimonial.user?.name || 'User'}
                          className='w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg group-hover:border-blue-200 transition-all duration-300'
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className='w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg'
                        style={{ display: testimonial.photo ? 'none' : 'flex' }}
                      >
                        {getUserInitials(testimonial.user?.name)}
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Rating */}
                  <div className='flex items-center justify-center mb-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl'>
                    <div className='flex items-center mr-3'>
                      {renderStars(testimonial.rating)}
                    </div>
                    <span className='text-lg font-bold text-gray-800'>
                      {testimonial.rating}/5
                    </span>
                  </div>

                  {/* Enhanced Message */}
                  <div className='mb-6'>
                    <p className='text-gray-700 leading-relaxed text-center italic'>
                      "{truncateMessage(testimonial.message, 120)}"
                    </p>
                  </div>

                  {/* Enhanced Footer */}
                  <div className='space-y-2 text-sm text-gray-600 mb-4'>
                    <div className='flex items-center justify-center'>
                      <Building className='inline mr-2 w-4 h-4 text-blue-500' />
                      <span className='font-medium'>
                        {testimonial.jobTitle}
                      </span>
                    </div>
                    <div className='flex items-center justify-center'>
                      <MapPin className='inline mr-2 w-4 h-4 text-green-500' />
                      <span>{testimonial.country}</span>
                    </div>
                    <div className='flex items-center justify-center'>
                      <Calendar className='inline mr-2 w-4 h-4 text-purple-500' />
                      <span>{formatDate(testimonial.createdAt)}</span>
                    </div>
                  </div>

                  {/* Enhanced Call to Action */}
                  <div className='pt-4 border-t border-gray-200'>
                    <button className='w-full flex items-center justify-center text-blue-600 hover:text-blue-800 font-semibold text-sm transition-all duration-300 group-hover:bg-blue-50 p-3 rounded-xl'>
                      <Eye className='w-4 h-4 mr-2' />
                      Read Full Story
                      <ChevronRight className='w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform' />
                    </button>
                  </div>
                </div>
              ))}
        </div>

        {/* Enhanced Empty State */}
        {!isLoading &&
          !isFetching &&
          (!filteredTestimonials || filteredTestimonials.length === 0) && (
            <div className='text-center py-16'>
              <div className='w-32 h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                <User className='w-16 h-16 text-blue-500' />
              </div>
              <h3 className='text-2xl font-bold text-gray-800 mb-4'>
                {searchQuery || filters.country || filters.minRating
                  ? 'No matching testimonials found'
                  : 'No testimonials available yet'}
              </h3>
              <p className='text-gray-600 mb-8 max-w-md mx-auto'>
                {searchQuery || filters.country || filters.minRating
                  ? 'Try adjusting your search terms or filters to discover more stories.'
                  : 'Be the first to share your success story and inspire others!'}
              </p>
              {(searchQuery || filters.country || filters.minRating) && (
                <button
                  onClick={clearFilters}
                  className='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-semibold'
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}

        {/* Enhanced Pagination */}
        {testimonialsData?.data?.pagination?.totalPages > 1 && (
          <div className='flex justify-center items-center space-x-2 mb-12'>
            <button
              onClick={() =>
                handlePageChange(
                  testimonialsData.data.pagination.currentPage - 1
                )
              }
              disabled={!testimonialsData.data.pagination.hasPreviousPage}
              className='p-3 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300'
            >
              <ChevronLeft className='w-5 h-5' />
            </button>

            {Array.from(
              { length: testimonialsData.data.pagination.totalPages },
              (_, i) => i + 1
            )
              .filter((page) => {
                const current = testimonialsData.data.pagination.currentPage;
                return (
                  page === 1 ||
                  page === testimonialsData.data.pagination.totalPages ||
                  (page >= current - 1 && page <= current + 1)
                );
              })
              .map((page, index, array) => {
                const current = testimonialsData.data.pagination.currentPage;

                return (
                  <React.Fragment key={page}>
                    {index > 0 && page - array[index - 1] > 1 && (
                      <span className='px-4 py-2 text-gray-500'>...</span>
                    )}

                    <button
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        page === current
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                          : 'hover:bg-gray-100 text-gray-700 border-2 border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                );
              })}

            <button
              onClick={() =>
                handlePageChange(
                  testimonialsData.data.pagination.currentPage + 1
                )
              }
              disabled={!testimonialsData.data.pagination.hasNextPage}
              className='p-3 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300'
            >
              <ChevronRight className='w-5 h-5' />
            </button>
          </div>
        )}

        {/* Enhanced Call to Action */}
        <div className='bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-12 text-center text-white shadow-2xl'>
          <div className='max-w-3xl mx-auto'>
            <div className='w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6'>
              <Sparkles className='w-10 h-10 text-white' />
            </div>
            <h3 className='text-3xl md:text-4xl font-bold mb-6'>
              Ready to Share Your Success Story?
            </h3>
            <p className='text-blue-100 text-lg mb-8 leading-relaxed'>
              Join our community of successful clients and inspire others with
              your journey. Your story could be the motivation someone needs to
              take their next big step.
            </p>
            <button
              onClick={handleTestimonialAction}
              className='bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg'
            >
              {testimonialExists
                ? '✏️ Update Your Testimonial'
                : '✨ Create Your Testimonial'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
