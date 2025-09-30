import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  useGetJobAplicacionsQuery,
  useDeleteJobAplicacionMutation,
} from '../../redux/api/jobAplicacionApi.js';
import ConfirmationDialog from '../../components/ConfirmationDialog.jsx';
import {
  FaFileAlt,
  FaTrash,
  FaSearch,
  FaEye,
  FaUser,
  FaBriefcase,
  FaCalendarAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaDollarSign,
  FaUserTie,
  FaCheckCircle,
  FaClock,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminJobSubmit = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [jobFilter, setJobFilter] = useState('all');
  const [selectedApplications, setSelectedApplications] = useState([]);

  // Confirmation dialog states
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: null, // 'single' or 'bulk'
    applicationId: null,
    message: '',
  });

  const { data, isLoading } = useGetJobAplicacionsQuery();
  const applications = data?.data || [];
  
  

  const [deleteJobAplicacion, { isLoading: deleteLoading }] =
    useDeleteJobAplicacionMutation();
  
  

  // Generate stats from applications data
  const stats = useMemo(() => {
    if (!applications || applications.length === 0) {
      return {
        totalApplications: 0,
        recentApplications: 0,
        uniqueApplicants: 0,
        uniqueJobs: 0,
      };
    }

    const uniqueUsers = new Set(applications.map((app) => app.user?._id)).size;
    const uniqueJobs = new Set(applications.map((app) => app.job?._id)).size;

    // Consider applications from last 7 days as recent
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentApplications = applications.filter(
      (app) => new Date(app.createdAt) > sevenDaysAgo
    ).length;

    return {
      totalApplications: applications.length,
      recentApplications,
      uniqueApplicants: uniqueUsers,
      uniqueJobs,
    };
  }, [applications]);

  // Filter applications based on search and filters
  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const matchesSearch =
        application.user?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        application.user?.email
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        application.job?.title
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        application.resume?.fullName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        application.resume?.jobTitle
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesJob =
        jobFilter === 'all' || application.job?._id === jobFilter;

      return matchesSearch && matchesJob;
    });
  }, [applications, searchTerm, jobFilter]);

  const openDeleteConfirmation = (id) => {
    setConfirmDialog({
      isOpen: true,
      type: 'single',
      applicationId: id,
      message: 'Are you sure you want to delete this job application?',
    });
  };

  const openBulkDeleteConfirmation = () => {
    if (selectedApplications.length === 0) return;

    setConfirmDialog({
      isOpen: true,
      type: 'bulk',
      applicationId: null,
      message: `Are you sure you want to delete ${selectedApplications.length} selected applications?`,
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      isOpen: false,
      type: null,
      applicationId: null,
      message: '',
    });
  };

  const handleConfirmDelete = async () => {
    try {
      if (confirmDialog.type === 'single') {
        await deleteJobAplicacion(confirmDialog.applicationId).unwrap();
        toast.success('Application deleted successfully');
      } else if (confirmDialog.type === 'bulk') {
        for (const appId of selectedApplications) {
          await deleteJobAplicacion(appId).unwrap();
        }
        setSelectedApplications([]);
        toast.success(
          `${selectedApplications.length} applications deleted successfully`
        );
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to delete application(s)');
    } finally {
      closeConfirmDialog();
    }
  };

  const handleSelectApplication = (appId) => {
    setSelectedApplications((prev) =>
      prev.includes(appId)
        ? prev.filter((id) => id !== appId)
        : [...prev, appId]
    );
  };

  const handleSelectAll = () => {
    if (selectedApplications.length === filteredApplications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(filteredApplications.map((app) => app._id));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const uniqueJobs = [
    ...new Set(applications.map((app) => app.job).filter(Boolean)),
  ];

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
        <span className='ml-3 text-gray-600'>Loading job applications...</span>
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
                <FaFileAlt className='text-blue-600' />
                Job Applications Dashboard
              </h2>
              <p className='text-gray-600 mt-1'>
                Manage and monitor all job applications
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
          <div className='bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs md:text-sm font-medium text-gray-600'>
                  Total Applications
                </p>
                <p className='text-xl md:text-2xl font-bold text-gray-900'>
                  {stats.totalApplications}
                </p>
              </div>
              <div className='bg-blue-100 p-2 md:p-3 rounded-full'>
                <FaFileAlt className='text-blue-600' size={20} />
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs md:text-sm font-medium text-gray-600'>
                  Recent Applications
                </p>
                <p className='text-xl md:text-2xl font-bold text-green-600'>
                  {stats.recentApplications}
                </p>
              </div>
              <div className='bg-green-100 p-2 md:p-3 rounded-full'>
                <FaClock className='text-green-600' size={20} />
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs md:text-sm font-medium text-gray-600'>
                  Unique Applicants
                </p>
                <p className='text-xl md:text-2xl font-bold text-purple-600'>
                  {stats.uniqueApplicants}
                </p>
              </div>
              <div className='bg-purple-100 p-2 md:p-3 rounded-full'>
                <FaUser className='text-purple-600' size={20} />
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs md:text-sm font-medium text-gray-600'>
                  Jobs Applied
                </p>
                <p className='text-xl md:text-2xl font-bold text-orange-600'>
                  {stats.uniqueJobs}
                </p>
              </div>
              <div className='bg-orange-100 p-2 md:p-3 rounded-full'>
                <FaBriefcase className='text-orange-600' size={20} />
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
                  placeholder='Search by applicant name, email, job title, or resume...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                />
              </div>
            </div>

            {/* Job Filter */}
            <div className='lg:w-64'>
              <select
                value={jobFilter}
                onChange={(e) => setJobFilter(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
              >
                <option value='all'>All Jobs</option>
                {uniqueJobs.map((job) => (
                  <option key={job._id} value={job._id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
          <div className='px-4 md:px-6 py-4 border-b border-gray-200 flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Applications ({filteredApplications.length})
              </h3>
              {selectedApplications.length > 0 && (
                <div className='text-sm text-gray-600'>
                  {selectedApplications.length} selected
                </div>
              )}
            </div>
            {selectedApplications.length > 0 && (
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
                        selectedApplications.length ===
                          filteredApplications.length &&
                        filteredApplications.length > 0
                      }
                      onChange={handleSelectAll}
                      className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                    />
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Applicant
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Job Applied
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Resume Details
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Applied Date
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredApplications.map((application) => (
                  <tr key={application._id} className='hover:bg-gray-50'>
                    <td className='px-4 md:px-6 py-4'>
                      <input
                        type='checkbox'
                        checked={selectedApplications.includes(application._id)}
                        onChange={() =>
                          handleSelectApplication(application._id)
                        }
                        className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                      />
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <div>
                        <div className='flex items-center gap-2'>
                          <FaUser className='text-gray-400' size={16} />
                          <h4 className='text-sm font-medium text-gray-900'>
                            {application.user?.name || 'N/A'}
                          </h4>
                        </div>
                        <div className='flex items-center gap-1 mt-1'>
                          <FaEnvelope className='text-gray-400' size={12} />
                          <p className='text-xs text-gray-500'>
                            {application.user?.email || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <div>
                        <h4 className='text-sm font-medium text-gray-900'>
                          {application.job?.title || 'N/A'}
                        </h4>
                        {application.job?.salary && (
                          <div className='flex items-center gap-1 mt-1'>
                            <FaDollarSign className='text-gray-400' size={12} />
                            <p className='text-xs text-gray-500'>
                              {application.job.salary}
                            </p>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <div>
                        {application.resume?.fullName && (
                          <h4 className='text-sm font-medium text-gray-900'>
                            {application.resume.fullName}
                          </h4>
                        )}
                        {application.resume?.jobTitle && (
                          <div className='flex items-center gap-1 mt-1'>
                            <FaUserTie className='text-gray-400' size={12} />
                            <p className='text-xs text-gray-500'>
                              {application.resume.jobTitle}
                            </p>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <div className='flex items-center gap-1'>
                        <FaCalendarAlt className='text-gray-400' size={12} />
                        <span className='text-sm text-gray-500'>
                          {formatDate(application.createdAt)}
                        </span>
                      </div>
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <div className='flex items-center gap-2'>
                        <Link
                          to={`/admin/job-applications/${application._id}`}
                          className='p-1 text-gray-400 hover:text-blue-600 transition-colors'
                          title='View Details'
                        >
                          <FaEye size={16} />
                        </Link>
                        <button
                          className='p-1 text-gray-400 hover:text-red-600 transition-colors'
                          title='Delete Application'
                          onClick={() =>
                            openDeleteConfirmation(application._id)
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

          {filteredApplications.length === 0 && (
            <div className='text-center py-12'>
              <FaFileAlt className='mx-auto h-12 w-12 text-gray-400' />
              <h3 className='mt-2 text-sm font-medium text-gray-900'>
                No applications found
              </h3>
              <p className='mt-1 text-sm text-gray-500'>
                {applications.length === 0
                  ? 'No job applications submitted yet.'
                  : 'Try adjusting your search or filter criteria.'}
              </p>
            </div>
          )}
        </div>

        {/* Application Statistics */}
        {applications.length > 0 && (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8'>
            {/* Top Applied Jobs */}
            <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Most Applied Jobs
              </h3>
              <div className='space-y-3'>
                {Object.entries(
                  applications.reduce((acc, app) => {
                    const jobTitle = app.job?.title || 'Unknown Job';
                    acc[jobTitle] = (acc[jobTitle] || 0) + 1;
                    return acc;
                  }, {})
                )
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([jobTitle, count], index) => (
                    <div
                      key={jobTitle}
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
                        <span className='text-sm text-gray-700 truncate'>
                          {jobTitle}
                        </span>
                      </div>
                      <span className='text-sm font-medium text-gray-900'>
                        {count}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Recent Applications
              </h3>
              <div className='space-y-3'>
                {[...applications] // or applications.slice()
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 5)
                  .map((app) => (
                    <div key={app._id} className='flex items-start gap-3'>
                      <div className='bg-blue-100 p-2 rounded-full'>
                        <FaUser className='text-blue-600' size={12} />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm text-gray-900 truncate'>
                          <span className='font-medium'>{app.user?.name}</span>{' '}
                          applied for{' '}
                          <span className='font-medium'>{app.job?.title}</span>
                        </p>
                        <p className='text-xs text-gray-500'>
                          {formatDate(app.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
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

export default AdminJobSubmit;
