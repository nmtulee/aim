import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  useGetAllTestimonialsAdminQuery,
  useDeleteTestimonialByIdMutation,
  useApproveTestimonialMutation,
  useRejectTestimonialMutation,
} from '../../redux/api/testimonialApiSlice';
import { useDeletePhotoMutation } from '../../redux/api/photoApiSlice';
import ConfirmationDialog from '../../components/ConfirmationDialog.jsx';
import {
  FaQuoteLeft,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaChartLine,
  FaUsers,
  FaMapMarkerAlt,
  FaEye,
  FaCalendarAlt,
  FaStar,
  FaExclamationCircle,
  FaCheckCircle,
  FaTimes,
  FaThumbsUp,
  FaThumbsDown,
  FaUserTie,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminTestimonial = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [approvalFilter, setApprovalFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [selectedTestimonials, setSelectedTestimonials] = useState([]);
  const [deletePhoto] = useDeletePhotoMutation();

  // Confirmation dialog states
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: null, // 'single', 'bulk', 'approve', 'reject'
    testimonialId: null,
    testimonialPhoto: null,
    message: '',
  });

  const { data: testimonials = [], isLoading } =
    useGetAllTestimonialsAdminQuery();
  const [deleteTestimonialById, { isLoading: deleteLoading }] =
    useDeleteTestimonialByIdMutation();
  const [approveTestimonial, { isLoading: approveLoading }] =
    useApproveTestimonialMutation();
  const [rejectTestimonial, { isLoading: rejectLoading }] =
    useRejectTestimonialMutation();

  // Calculate stats
  const stats = useMemo(() => {
    const total = testimonials.length;
    const approved = testimonials.filter((t) => t.approved).length;
    const pending = testimonials.filter((t) => !t.approved).length;
    const averageRating =
      testimonials.length > 0
        ? (
            testimonials.reduce((sum, t) => sum + (t.rating || 0), 0) /
            testimonials.length
          ).toFixed(1)
        : 0;
    const recentTestimonials = testimonials.filter((t) => {
      const createdDate = new Date(t.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return createdDate >= weekAgo;
    }).length;

    const countriesCount = [...new Set(testimonials.map((t) => t.country))]
      .length;

    return {
      totalTestimonials: total,
      approvedTestimonials: approved,
      pendingTestimonials: pending,
      averageRating,
      recentTestimonials,
      countriesCount,
      approvalRate: total > 0 ? ((approved / total) * 100).toFixed(1) : 0,
    };
  }, [testimonials]);

  // Filter testimonials based on search and filters
  const filteredTestimonials = useMemo(() => {
    return testimonials.filter((testimonial) => {
      const matchesSearch =
        testimonial.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.jobTitle
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        testimonial.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.user?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        testimonial.user?.email
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesApproval =
        approvalFilter === 'all' ||
        (approvalFilter === 'approved' && testimonial.approved) ||
        (approvalFilter === 'pending' && !testimonial.approved);

      const matchesRating =
        ratingFilter === 'all' ||
        (ratingFilter === '5' && testimonial.rating === 5) ||
        (ratingFilter === '4' && testimonial.rating === 4) ||
        (ratingFilter === '3' && testimonial.rating === 3) ||
        (ratingFilter === '2' && testimonial.rating === 2) ||
        (ratingFilter === '1' && testimonial.rating === 1);

      const matchesCountry =
        countryFilter === 'all' || testimonial.country === countryFilter;

      return (
        matchesSearch && matchesApproval && matchesRating && matchesCountry
      );
    });
  }, [testimonials, searchTerm, approvalFilter, ratingFilter, countryFilter]);

  const handleApproval = async (id, approve) => {
    try {
      if (approve) {
        await approveTestimonial(id).unwrap();
        toast.success('Testimonial approved successfully');
      } else {
        await rejectTestimonial(id).unwrap();
        toast.success('Testimonial rejected successfully');
      }
    } catch (error) {
      toast.error(
        error?.data?.message ||
          `Failed to ${approve ? 'approve' : 'reject'} testimonial`
      );
    }
  };

  const openDeleteConfirmation = (id, photo) => {
    setConfirmDialog({
      isOpen: true,
      type: 'single',
      testimonialId: id,
      testimonialPhoto: photo,
      message: 'Are you sure you want to delete this testimonial?',
    });
  };

  const openBulkDeleteConfirmation = () => {
    if (selectedTestimonials.length === 0) return;

    setConfirmDialog({
      isOpen: true,
      type: 'bulk',
      testimonialId: null,
      testimonialPhoto: null,
      message: `Are you sure you want to delete ${selectedTestimonials.length} selected testimonials?`,
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      isOpen: false,
      type: null,
      testimonialId: null,
      testimonialPhoto: null,
      message: '',
    });
  };

  const handleConfirmDelete = async () => {
    try {
      if (confirmDialog.type === 'single') {
        await deleteTestimonialById(confirmDialog.testimonialId).unwrap();
        if (confirmDialog.testimonialPhoto) {
          const filename = confirmDialog.testimonialPhoto.split('/').pop();
          await deletePhoto(filename);
        }
        toast.success('Testimonial deleted successfully');
      } else if (confirmDialog.type === 'bulk') {
        const selectedTestimonialsData = testimonials.filter((testimonial) =>
          selectedTestimonials.includes(testimonial._id)
        );

        for (const testimonial of selectedTestimonialsData) {
          await deleteTestimonialById(testimonial._id).unwrap();
          if (testimonial.photo) {
            const filename = testimonial.photo.split('/').pop();
            await deletePhoto(filename);
          }
        }
        setSelectedTestimonials([]);
        toast.success(
          `${selectedTestimonials.length} testimonials deleted successfully`
        );
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to delete testimonial(s)');
    }
  };

  const handleSelectTestimonial = (testimonialId) => {
    setSelectedTestimonials((prev) =>
      prev.includes(testimonialId)
        ? prev.filter((id) => id !== testimonialId)
        : [...prev, testimonialId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTestimonials.length === filteredTestimonials.length) {
      setSelectedTestimonials([]);
    } else {
      setSelectedTestimonials(
        filteredTestimonials.map((testimonial) => testimonial._id)
      );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderStars = (rating) => {
    return (
      <div className='flex items-center'>
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const uniqueCountries = [
    ...new Set(testimonials.map((t) => t.country).filter(Boolean)),
  ].sort();

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
        <span className='ml-3 text-gray-600'>Loading testimonials...</span>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-6 mt-16'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-6'>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div>
              <h2 className='text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3'>
                <FaQuoteLeft className='text-blue-600' />
                Admin Testimonial Dashboard
              </h2>
              <p className='text-gray-600 mt-1'>
                Manage and moderate customer testimonials
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6'>
          <div className='bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs md:text-sm font-medium text-gray-600'>
                  Total Testimonials
                </p>
                <p className='text-xl md:text-2xl font-bold text-gray-900'>
                  {stats.totalTestimonials}
                </p>
              </div>
              <div className='bg-blue-100 p-2 md:p-3 rounded-full'>
                <FaQuoteLeft className='text-blue-600' size={20} />
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs md:text-sm font-medium text-gray-600'>
                  Approved
                </p>
                <p className='text-xl md:text-2xl font-bold text-green-600'>
                  {stats.approvedTestimonials}
                </p>
              </div>
              <div className='bg-green-100 p-2 md:p-3 rounded-full'>
                <FaCheckCircle className='text-green-600' size={20} />
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs md:text-sm font-medium text-gray-600'>
                  Pending
                </p>
                <p className='text-xl md:text-2xl font-bold text-orange-600'>
                  {stats.pendingTestimonials}
                </p>
              </div>
              <div className='bg-orange-100 p-2 md:p-3 rounded-full'>
                <FaExclamationCircle className='text-orange-600' size={20} />
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs md:text-sm font-medium text-gray-600'>
                  Avg Rating
                </p>
                <p className='text-xl md:text-2xl font-bold text-yellow-600'>
                  {stats.averageRating}
                </p>
              </div>
              <div className='bg-yellow-100 p-2 md:p-3 rounded-full'>
                <FaStar className='text-yellow-600' size={20} />
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs md:text-sm font-medium text-gray-600'>
                  Countries
                </p>
                <p className='text-xl md:text-2xl font-bold text-purple-600'>
                  {stats.countriesCount}
                </p>
              </div>
              <div className='bg-purple-100 p-2 md:p-3 rounded-full'>
                <FaMapMarkerAlt className='text-purple-600' size={20} />
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs md:text-sm font-medium text-gray-600'>
                  Recent (7d)
                </p>
                <p className='text-xl md:text-2xl font-bold text-indigo-600'>
                  {stats.recentTestimonials}
                </p>
              </div>
              <div className='bg-indigo-100 p-2 md:p-3 rounded-full'>
                <FaCalendarAlt className='text-indigo-600' size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className='bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 mb-6'>
          <div className='flex flex-col lg:flex-row gap-4'>
            {/* Search */}
            <div className='flex-1'>
              <div className='relative'>
                <FaSearch
                  className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                  size={18}
                />
                <input
                  type='text'
                  placeholder='Search testimonials by title, message, job title, or user...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                />
              </div>
            </div>

            {/* Approval Filter */}
            <div className='lg:w-48'>
              <select
                value={approvalFilter}
                onChange={(e) => setApprovalFilter(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
              >
                <option value='all'>All Status</option>
                <option value='approved'>Approved Only</option>
                <option value='pending'>Pending Only</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div className='lg:w-48'>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
              >
                <option value='all'>All Ratings</option>
                <option value='5'>5 Stars</option>
                <option value='4'>4 Stars</option>
                <option value='3'>3 Stars</option>
                <option value='2'>2 Stars</option>
                <option value='1'>1 Star</option>
              </select>
            </div>

            {/* Country Filter */}
            <div className='lg:w-48'>
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
              >
                <option value='all'>All Countries</option>
                {uniqueCountries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Testimonials Table */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
          <div className='px-4 md:px-6 py-4 border-b border-gray-200 flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Testimonials ({filteredTestimonials.length})
              </h3>
              {selectedTestimonials.length > 0 && (
                <div className='text-sm text-gray-600'>
                  {selectedTestimonials.length} selected
                </div>
              )}
            </div>
            {selectedTestimonials.length > 0 && (
              <div className='flex items-center gap-2'>
                <button
                  onClick={openBulkDeleteConfirmation}
                  disabled={deleteLoading}
                  className='px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 disabled:opacity-50'
                >
                  {deleteLoading ? 'Deleting...' : 'Delete Selected'}
                </button>
              </div>
            )}
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='w-12 px-4 md:px-6 py-3 text-left'>
                    <input
                      type='checkbox'
                      checked={
                        selectedTestimonials.length ===
                          filteredTestimonials.length &&
                        filteredTestimonials.length > 0
                      }
                      onChange={handleSelectAll}
                      className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                    />
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Customer
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Title & Message
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Rating
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Job & Country
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    User
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Submitted
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredTestimonials.map((testimonial) => (
                  <tr key={testimonial._id} className='hover:bg-gray-50'>
                    <td className='px-4 md:px-6 py-4'>
                      <input
                        type='checkbox'
                        checked={selectedTestimonials.includes(testimonial._id)}
                        onChange={() =>
                          handleSelectTestimonial(testimonial._id)
                        }
                        className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                      />
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        {testimonial.photo && (
                          <img
                            src={testimonial.photo}
                            alt={testimonial.user?.name || 'Customer'}
                            className='w-10 h-10 rounded-full object-cover'
                          />
                        )}
                        <div>
                          <h4 className='text-sm font-medium text-gray-900'>
                            {testimonial.user?.name || 'N/A'}
                          </h4>
                        </div>
                      </div>
                    </td>
                    <td className='px-4 md:px-6 py-4 max-w-xs'>
                      <div>
                        <h4 className='text-sm font-medium text-gray-900 truncate'>
                          {testimonial.title}
                        </h4>
                        <p className='text-sm text-gray-500 truncate mt-1'>
                          {testimonial.message}
                        </p>
                      </div>
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <div className='flex items-center gap-2'>
                        {renderStars(testimonial.rating)}
                        <span className='text-sm text-gray-600'>
                          ({testimonial.rating || 0})
                        </span>
                      </div>
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <div>
                        <div className='flex items-center gap-1'>
                          <FaUserTie size={14} className='text-gray-400' />
                          <span className='text-sm text-gray-900'>
                            {testimonial.jobTitle || 'N/A'}
                          </span>
                        </div>
                        <div className='flex items-center gap-1 mt-1'>
                          <FaMapMarkerAlt size={14} className='text-gray-400' />
                          <span className='text-sm text-gray-500'>
                            {testimonial.country || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <div>
                        <p className='text-sm text-gray-900'>
                          {testimonial.user?.name || 'N/A'}
                        </p>
                        <p className='text-xs text-gray-500'>
                          {testimonial.user?.email || 'N/A'}
                        </p>
                      </div>
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          testimonial.approved
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {testimonial.approved ? (
                          <>
                            <FaCheckCircle size={14} />
                            Approved
                          </>
                        ) : (
                          <>
                            <FaExclamationCircle size={14} />
                            Pending
                          </>
                        )}
                      </span>
                    </td>
                    <td className='px-4 md:px-6 py-4 text-sm text-gray-500'>
                      {formatDate(testimonial.createdAt)}
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <div className='flex items-center gap-2'>
                        <Link
                          to={`/admin/testimonial/${testimonial._id}`}
                          className='p-1 text-gray-400 hover:text-blue-600 transition-colors'
                          title='View Details'
                        >
                          <FaEye size={16} />
                        </Link>
                        {!testimonial.approved && (
                          <button
                            onClick={() =>
                              handleApproval(testimonial._id, true)
                            }
                            disabled={approveLoading}
                            className='p-1 text-gray-400 hover:text-green-600 transition-colors'
                            title='Approve'
                          >
                            <FaThumbsUp size={16} />
                          </button>
                        )}
                        {testimonial.approved && (
                          <button
                            onClick={() =>
                              handleApproval(testimonial._id, false)
                            }
                            disabled={rejectLoading}
                            className='p-1 text-gray-400 hover:text-red-600 transition-colors'
                            title='Reject'
                          >
                            <FaThumbsDown size={16} />
                          </button>
                        )}
                        <Link
                          to={`/admin/testimonial/${testimonial._id}/edit`}
                          className='p-1 text-gray-400 hover:text-yellow-600 transition-colors'
                          title='Edit'
                        >
                          <FaEdit size={16} />
                        </Link>
                        <button
                          className='p-1 text-gray-400 hover:text-red-600 transition-colors'
                          title='Delete'
                          onClick={() =>
                            openDeleteConfirmation(
                              testimonial._id,
                              testimonial.photo
                            )
                          }
                          disabled={deleteLoading}
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTestimonials.length === 0 && (
            <div className='text-center py-12'>
              <FaQuoteLeft className='mx-auto h-12 w-12 text-gray-400' />
              <h3 className='mt-2 text-sm font-medium text-gray-900'>
                No testimonials found
              </h3>
              <p className='mt-1 text-sm text-gray-500'>
                {testimonials.length === 0
                  ? 'No testimonials available.'
                  : 'Try adjusting your search or filter criteria.'}
              </p>
            </div>
          )}
        </div>

        {/* Additional Stats */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8'>
          {/* Top Countries */}
          <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
              Top Countries
            </h3>
            <div className='space-y-3'>
              {uniqueCountries.slice(0, 5).map((country, index) => {
                const count = testimonials.filter(
                  (t) => t.country === country
                ).length;
                return (
                  <div
                    key={country}
                    className='flex items-center justify-between'
                  >
                    <div className='flex items-center gap-3'>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          index === 0
                            ? 'bg-blue-500'
                            : index === 1
                            ? 'bg-green-500'
                            : index === 2
                            ? 'bg-yellow-500'
                            : index === 3
                            ? 'bg-red-500'
                            : 'bg-purple-500'
                        }`}
                      ></div>
                      <span className='text-sm text-gray-700'>{country}</span>
                    </div>
                    <span className='text-sm font-medium text-gray-900'>
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rating Distribution */}
          <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
              Rating Distribution
            </h3>
            <div className='space-y-3'>
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = testimonials.filter(
                  (t) => t.rating === rating
                ).length;
                const percentage =
                  testimonials.length > 0
                    ? ((count / testimonials.length) * 100).toFixed(1)
                    : 0;
                return (
                  <div
                    key={rating}
                    className='flex items-center justify-between'
                  >
                    <div className='flex items-center gap-3'>
                      <div className='flex items-center gap-1'>
                        <span className='text-sm font-medium text-gray-700'>
                          {rating}
                        </span>
                        <FaStar className='w-4 h-4 text-yellow-400' />
                      </div>
                      <div className='w-32 bg-gray-200 rounded-full h-2'>
                        <div
                          className='bg-yellow-400 h-2 rounded-full'
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='text-sm text-gray-500'>
                        {percentage}%
                      </span>
                      <span className='text-sm font-medium text-gray-900'>
                        ({count})
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirmDialog}
        onConfirm={handleConfirmDelete}
        message={confirmDialog.message}
        Yes='Yes, delete it!'
        No='No, cancel'
      />
    </div>
  );
};

export default AdminTestimonial;
