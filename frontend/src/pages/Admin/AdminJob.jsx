import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  useGetJobsQuery,
  useToggleJobStatusMutation,
  useDeleteJobMutation,
  useGetJobsStatsQuery,
} from '../../redux/api/jobApiSlice';
import { useDeleteImgMutation } from '../../redux/api/imgUploadApiSlise.js';
import ConfirmationDialog from '../../components/ConfirmationDialog.jsx';
import {
  FaBriefcase,
  FaPlus,
  FaEdit,
  FaTrash,
  FaToggleOff,
  FaToggleOn,
  FaSearch,
  FaFilter,
  FaChartLine,
  FaUsers,
  FaMapMarkerAlt,
  FaEye,
  FaCalendarAlt,
  FaGlobe,
  FaExclamationCircle,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminJob = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [deleteImg] = useDeleteImgMutation();

  // Confirmation dialog states
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: null, // 'single' or 'bulk'
    jobId: null,
    jobImage: null,
    message: '',
  });

  const { data: job, isLoading } = useGetJobsQuery();
  const { data: stats = {}, isLoading: statsLoading } = useGetJobsStatsQuery();
  const [toggleJobStatus, { isLoading: toggleLoading }] =
    useToggleJobStatusMutation();
  const [deleteJob, { isLoading: deleteLoading }] = useDeleteJobMutation();

  // Extract jobs array from the response
  const jobs = job || [];

  // Filter jobs based on search and filters
  const filteredJobs = useMemo(() => {
    return jobs.filter((jobItem) => {
      const matchesSearch =
        jobItem.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jobItem.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jobItem.country?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && jobItem.isActive) ||
        (statusFilter === 'inactive' && !jobItem.isActive);

      const matchesCountry =
        countryFilter === 'all' || jobItem.country === countryFilter;

      return matchesSearch && matchesStatus && matchesCountry;
    });
  }, [jobs, searchTerm, statusFilter, countryFilter]);

  const handleToggle = async (id) => {
    try {
      await toggleJobStatus(id).unwrap();
      toast.success('Job status updated successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to toggle status');
    }
  };

  const openDeleteConfirmation = (id, image) => {
    setConfirmDialog({
      isOpen: true,
      type: 'single',
      jobId: id,
      jobImage: image,
      message: 'Are you sure you want to delete this job?',
    });
  };

  const openBulkDeleteConfirmation = () => {
    if (selectedJobs.length === 0) return;

    setConfirmDialog({
      isOpen: true,
      type: 'bulk',
      jobId: null,
      jobImage: null,
      message: `Are you sure you want to delete ${selectedJobs.length} selected jobs?`,
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      isOpen: false,
      type: null,
      jobId: null,
      jobImage: null,
      message: '',
    });
  };

  const handleConfirmDelete = async () => {
    try {
      if (confirmDialog.type === 'single') {
        await deleteJob(confirmDialog.jobId).unwrap();
        if (confirmDialog.jobImage) {
          const filename = confirmDialog.jobImage.split('/').pop();
          await deleteImg(filename);
        }
        toast.success('Job deleted successfully');
      } else if (confirmDialog.type === 'bulk') {
        // Get job details for selected jobs to extract images
        const selectedJobsData = jobs.filter((job) =>
          selectedJobs.includes(job._id)
        );

        for (const job of selectedJobsData) {
          await deleteJob(job._id).unwrap();
          // Delete associated image if it exists
          if (job.image) {
            const filename = job.image.split('/').pop();
            await deleteImg(filename);
          }
        }
        setSelectedJobs([]);
        toast.success(`${selectedJobs.length} jobs deleted successfully`);
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to delete job(s)');
    }
  };

  const handleSelectJob = (jobId) => {
    setSelectedJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleSelectAll = () => {
    if (selectedJobs.length === filteredJobs.length) {
      setSelectedJobs([]);
    } else {
      setSelectedJobs(filteredJobs.map((jobItem) => jobItem._id));
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

  const uniqueCountries = [
    ...new Set(jobs.map((jobItem) => jobItem.country).filter(Boolean)),
  ];

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
        <span className='ml-3 text-gray-600'>Loading jobs...</span>
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
                <FaBriefcase className='text-blue-600' />
                Admin Job Dashboard
              </h2>
              <p className='text-gray-600 mt-1'>
                Manage and monitor all job listings
              </p>
            </div>
            <Link
              to='/admin/createjob'
              className='bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg flex items-center gap-2 transition-colors text-sm md:text-base'
            >
              <FaPlus size={18} />
              Create Job
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        {!statsLoading && stats && (
          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6'>
            <div className='bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs md:text-sm font-medium text-gray-600'>
                    Total Jobs
                  </p>
                  <p className='text-xl md:text-2xl font-bold text-gray-900'>
                    {stats.totalJobs || 0}
                  </p>
                </div>
                <div className='bg-blue-100 p-2 md:p-3 rounded-full'>
                  <FaBriefcase className='text-blue-600' size={20} />
                </div>
              </div>
            </div>

            <div className='bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs md:text-sm font-medium text-gray-600'>
                    Active Jobs
                  </p>
                  <p className='text-xl md:text-2xl font-bold text-green-600'>
                    {stats.activeJobs || 0}
                  </p>
                </div>
                <div className='bg-green-100 p-2 md:p-3 rounded-full'>
                  <FaChartLine className='text-green-600' size={20} />
                </div>
              </div>
            </div>

            <div className='bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs md:text-sm font-medium text-gray-600'>
                    Inactive Jobs
                  </p>
                  <p className='text-xl md:text-2xl font-bold text-red-600'>
                    {stats.inactiveJobs || 0}
                  </p>
                </div>
                <div className='bg-red-100 p-2 md:p-3 rounded-full'>
                  <FaUsers className='text-red-600' size={20} />
                </div>
              </div>
            </div>

            <div className='bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs md:text-sm font-medium text-gray-600'>
                    Schengen Jobs
                  </p>
                  <p className='text-xl md:text-2xl font-bold text-purple-600'>
                    {stats.schengenJobs || 0}
                  </p>
                </div>
                <div className='bg-purple-100 p-2 md:p-3 rounded-full'>
                  <FaGlobe className='text-purple-600' size={20} />
                </div>
              </div>
            </div>

            <div className='bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs md:text-sm font-medium text-gray-600'>
                    Recent Jobs
                  </p>
                  <p className='text-xl md:text-2xl font-bold text-orange-600'>
                    {stats.recentJobs || 0}
                  </p>
                </div>
                <div className='bg-orange-100 p-2 md:p-3 rounded-full'>
                  <FaCalendarAlt className='text-orange-600' size={20} />
                </div>
              </div>
            </div>
          </div>
        )}

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
                  placeholder='Search jobs by title, location, or country...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className='lg:w-48'>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
              >
                <option value='all'>All Status</option>
                <option value='active'>Active Only</option>
                <option value='inactive'>Inactive Only</option>
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

        {/* Jobs Table */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
          <div className='px-4 md:px-6 py-4 border-b border-gray-200 flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Jobs ({filteredJobs.length})
              </h3>
              {selectedJobs.length > 0 && (
                <div className='text-sm text-gray-600'>
                  {selectedJobs.length} selected
                </div>
              )}
            </div>
            {selectedJobs.length > 0 && (
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
                        selectedJobs.length === filteredJobs.length &&
                        filteredJobs.length > 0
                      }
                      onChange={handleSelectAll}
                      className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                    />
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Job Details
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Location
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Category
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Created
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredJobs.map((jobItem) => (
                  <tr key={jobItem._id} className='hover:bg-gray-50'>
                    <td className='px-4 md:px-6 py-4'>
                      <input
                        type='checkbox'
                        checked={selectedJobs.includes(jobItem._id)}
                        onChange={() => handleSelectJob(jobItem._id)}
                        className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                      />
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <div>
                        <div className='flex items-center gap-2'>
                          <h4 className='text-sm font-medium text-gray-900'>
                            {jobItem.title || 'N/A'}
                          </h4>
                          {jobItem.isSchengen && (
                            <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800'>
                              Schengen
                            </span>
                          )}
                        </div>
                        {jobItem.requirements &&
                          jobItem.requirements.length > 0 && (
                            <p className='text-xs text-gray-500 mt-1'>
                              {jobItem.requirements.slice(0, 2).join(', ')}
                              {jobItem.requirements.length > 2 &&
                                ` +${jobItem.requirements.length - 2} more`}
                            </p>
                          )}
                        {jobItem.salary && (
                          <p className='text-xs text-gray-600 mt-1'>
                            {jobItem.salary}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <div className='flex items-center gap-1'>
                        <FaMapMarkerAlt size={14} className='text-gray-400' />
                        <span className='text-sm text-gray-900'>
                          {jobItem.location || 'N/A'}
                        </span>
                      </div>
                      <p className='text-sm text-gray-500'>
                        {jobItem.country || 'N/A'}
                      </p>
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
                        {jobItem.category?.name || 'N/A'}
                      </span>
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <button
                        onClick={() => handleToggle(jobItem._id)}
                        disabled={toggleLoading}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors disabled:opacity-50 ${
                          jobItem.isActive
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {jobItem.isActive ? (
                          <>
                            <FaToggleOn size={14} />
                            Active
                          </>
                        ) : (
                          <>
                            <FaToggleOff size={14} />
                            Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className='px-4 md:px-6 py-4 text-sm text-gray-500'>
                      {formatDate(jobItem.createdAt)}
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <div className='flex items-center gap-2'>
                        <Link
                          to={`/jobs/${jobItem._id}`}
                          className='p-1 text-gray-400 hover:text-blue-600 transition-colors'
                          title='View Job'
                          
                        >
                          <FaEye size={16} />
                        </Link>
                        <Link
                          to={`/admin/job/${jobItem._id}`}
                          className='p-1 text-gray-400 hover:text-green-600 transition-colors'
                          title='Edit Job'
                          
                        >
                          <FaEdit size={16} />
                        </Link>
                        <button
                          className='p-1 text-gray-400 hover:text-red-600 transition-colors'
                          title='Delete Job'
                          onClick={() =>
                            openDeleteConfirmation(jobItem._id, jobItem.image)
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

          {filteredJobs.length === 0 && (
            <div className='text-center py-12'>
              <FaBriefcase className='mx-auto h-12 w-12 text-gray-400' />
              <h3 className='mt-2 text-sm font-medium text-gray-900'>
                No jobs found
              </h3>
              <p className='mt-1 text-sm text-gray-500'>
                {jobs.length === 0
                  ? 'No jobs available.'
                  : 'Try adjusting your search or filter criteria.'}
              </p>
            </div>
          )}
        </div>

        {/* Quick Stats by Country and Category */}
        {stats && (stats.jobsByCountry || stats.jobsByCategory) && (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8'>
            {stats.jobsByCountry && (
              <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  Jobs by Country
                </h3>
                <div className='space-y-3'>
                  {stats.jobsByCountry.slice(0, 5).map((item, index) => (
                    <div
                      key={item._id}
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
                        <span className='text-sm text-gray-700'>
                          {item._id}
                        </span>
                      </div>
                      <span className='text-sm font-medium text-gray-900'>
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {stats.jobsByCategory && (
              <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  Jobs by Category
                </h3>
                <div className='space-y-3'>
                  {stats.jobsByCategory.slice(0, 5).map((item, index) => (
                    <div
                      key={item.categoryName}
                      className='flex items-center justify-between'
                    >
                      <div className='flex items-center gap-3'>
                        <div
                          className={`w-3 h-3 rounded-full ${
                            index === 0
                              ? 'bg-indigo-500'
                              : index === 1
                              ? 'bg-pink-500'
                              : index === 2
                              ? 'bg-orange-500'
                              : index === 3
                              ? 'bg-teal-500'
                              : 'bg-gray-500'
                          }`}
                        ></div>
                        <span className='text-sm text-gray-700'>
                          {item.categoryName}
                        </span>
                      </div>
                      <span className='text-sm font-medium text-gray-900'>
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
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

export default AdminJob;
