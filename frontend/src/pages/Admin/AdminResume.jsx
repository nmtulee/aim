import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  useGetAllResumesNoPaginationQuery,
  useToggleResumeHireStatusMutation,
  useDeleteResumeByIdMutation,
  useGetResumeStatsQuery,
} from '../../redux/api/resumeApiSlice';
import { useDeletePhotoMutation } from '../../redux/api/photoApiSlice';
import ConfirmationDialog from '../../components/ConfirmationDialog.jsx';
import {
  FaFileAlt,
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
  FaGraduationCap,
  FaExclamationCircle,
  FaCheckCircle,
  FaTimes,
  FaDownload,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useDeletePDFMutation } from '../../redux/api/fileUploadApiSlice.js';

const AdminResume = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedResumes, setSelectedResumes] = useState([]);
  const [deletePhoto] = useDeletePhotoMutation();
  const [deletePDF] = useDeletePDFMutation();

  // Confirmation dialog states
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: null, // 'single' or 'bulk'
    resumeId: null,
    resumeImage: null,
    message: '',
  });

  const { data: resumes = [], isLoading } = useGetAllResumesNoPaginationQuery();
  const { data: stats = {}, isLoading: statsLoading } =
    useGetResumeStatsQuery();
  const [toggleResumeHireStatus, { isLoading: toggleLoading }] =
    useToggleResumeHireStatusMutation();
  const [deleteResumeById, { isLoading: deleteLoading }] =
    useDeleteResumeByIdMutation();

  // Filter resumes based on search and filters
  const filteredResumes = useMemo(() => {
    return resumes.filter((resume) => {
      const matchesSearch =
        resume.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resume.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resume.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resume.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'hired' && resume.isHired) ||
        (statusFilter === 'available' && !resume.isHired);

      const matchesCategory =
        categoryFilter === 'all' ||
        resume.category?._id === categoryFilter ||
        resume.category?.name === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [resumes, searchTerm, statusFilter, categoryFilter]);

  const handleToggleHireStatus = async (id) => {
    try {
      await toggleResumeHireStatus(id).unwrap();
      toast.success('Resume hire status updated successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to toggle hire status');
    }
  };

  const openDeleteConfirmation = (id, image) => {
    setConfirmDialog({
      isOpen: true,
      type: 'single',
      resumeId: id,
      resumeImage: image,
      message: 'Are you sure you want to delete this resume?',
    });
  };

  const openBulkDeleteConfirmation = () => {
    if (selectedResumes.length === 0) return;

    setConfirmDialog({
      isOpen: true,
      type: 'bulk',
      resumeId: null,
      resumeImage: null,
      message: `Are you sure you want to delete ${selectedResumes.length} selected resumes?`,
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      isOpen: false,
      type: null,
      resumeId: null,
      resumeImage: null,
      message: '',
    });
  };

  
  const handleConfirmDelete = async () => {
    try {
      if (confirmDialog.type === 'single') {
        await deleteResumeById(confirmDialog.resumeId).unwrap();
        if (confirmDialog.resumeImage) {
          const filename = confirmDialog.resumeImage.split('/').pop();
          await deletePhoto(filename);
        }
        const resumeToDelete = resumes.find(
          (r) => r._id === confirmDialog.resumeId
        );
        if (resumeToDelete?.file) {
          const pdfName = resumeToDelete.file.split('/').pop();
          await deletePDF(pdfName).unwrap();
        }
        toast.success('Resume deleted successfully');
      } else if (confirmDialog.type === 'bulk') {
        // Get resume details for selected resumes to extract images
        const selectedResumesData = resumes.filter((resume) =>
          selectedResumes.includes(resume._id)
        );

        for (const resume of selectedResumesData) {
          await deleteResumeById(resume._id).unwrap();
          // Delete associated photo if it exists
          if (resume.photo) {
            const filename = resume.photo.split('/').pop();
            await deletePhoto(filename);
          }
          if (resume.file) {
            const pdfName = resume.file.split('/').pop();
            console.log(pdfName);
            await deletePDF(pdfName).unwrap();
          }
        }
        setSelectedResumes([]);
        toast.success(`${selectedResumes.length} resumes deleted successfully`);
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to delete resume(s)');
    }
  };

  const handleSelectResume = (resumeId) => {
    setSelectedResumes((prev) =>
      prev.includes(resumeId)
        ? prev.filter((id) => id !== resumeId)
        : [...prev, resumeId]
    );
  };
  
  

  const handleSelectAll = () => {
    if (selectedResumes.length === filteredResumes.length) {
      setSelectedResumes([]);
    } else {
      setSelectedResumes(filteredResumes.map((resume) => resume._id));
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

  const uniqueCategories = [
    ...new Set(
      resumes
        .map((resume) => resume.category)
        .filter(Boolean)
        .map((cat) => ({ _id: cat._id, name: cat.name }))
    ),
  ].filter(
    (category, index, self) =>
      index === self.findIndex((c) => c._id === category._id)
  );

  const handleDownloadResume = (fileUrl, fileName) => {
    if (!fileUrl) {
      toast.error('Resume file not available');
      return;
    }

    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName || 'resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
        <span className='ml-3 text-gray-600'>Loading resumes...</span>
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
                Admin Resume Dashboard
              </h2>
              <p className='text-gray-600 mt-1'>
                Manage and monitor all resume submissions
              </p>
            </div>
            
          </div>
        </div>

        {/* Stats Cards */}
        {!statsLoading && stats && (
          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6'>
            <div className='bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs md:text-sm font-medium text-gray-600'>
                    Total Resumes
                  </p>
                  <p className='text-xl md:text-2xl font-bold text-gray-900'>
                    {stats.totalResumes || 0}
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
                    Hired
                  </p>
                  <p className='text-xl md:text-2xl font-bold text-green-600'>
                    {stats.hiredResumes || 0}
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
                    Available
                  </p>
                  <p className='text-xl md:text-2xl font-bold text-orange-600'>
                    {stats.availableResumes || 0}
                  </p>
                </div>
                <div className='bg-orange-100 p-2 md:p-3 rounded-full'>
                  <FaUsers className='text-orange-600' size={20} />
                </div>
              </div>
            </div>

            <div className='bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs md:text-sm font-medium text-gray-600'>
                    Hire Rate
                  </p>
                  <p className='text-xl md:text-2xl font-bold text-purple-600'>
                    {stats.hireRate || 0}%
                  </p>
                </div>
                <div className='bg-purple-100 p-2 md:p-3 rounded-full'>
                  <FaChartLine className='text-purple-600' size={20} />
                </div>
              </div>
            </div>

            <div className='bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs md:text-sm font-medium text-gray-600'>
                    Recent Resumes
                  </p>
                  <p className='text-xl md:text-2xl font-bold text-indigo-600'>
                    {stats.recentResumes || 0}
                  </p>
                </div>
                <div className='bg-indigo-100 p-2 md:p-3 rounded-full'>
                  <FaCalendarAlt className='text-indigo-600' size={20} />
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
                  placeholder='Search resumes by name, job title, or user email...'
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
                <option value='available'>Available Only</option>
                <option value='hired'>Hired Only</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className='lg:w-48'>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
              >
                <option value='all'>All Categories</option>
                {uniqueCategories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Resumes Table */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
          <div className='px-4 md:px-6 py-4 border-b border-gray-200 flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Resumes ({filteredResumes.length})
              </h3>
              {selectedResumes.length > 0 && (
                <div className='text-sm text-gray-600'>
                  {selectedResumes.length} selected
                </div>
              )}
            </div>
            {selectedResumes.length > 0 && (
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
                        selectedResumes.length === filteredResumes.length &&
                        filteredResumes.length > 0
                      }
                      onChange={handleSelectAll}
                      className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                    />
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Candidate
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Job Title
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Category
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
                {filteredResumes.map((resume) => (
                  <tr key={resume._id} className='hover:bg-gray-50'>
                    <td className='px-4 md:px-6 py-4'>
                      <input
                        type='checkbox'
                        checked={selectedResumes.includes(resume._id)}
                        onChange={() => handleSelectResume(resume._id)}
                        className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                      />
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        {resume.photo && (
                          <img
                            src={resume.photo}
                            alt={resume.fullName}
                            className='w-10 h-10 rounded-full object-cover'
                          />
                        )}
                        <div>
                          <h4 className='text-sm font-medium text-gray-900'>
                            {resume.fullName || 'N/A'}
                          </h4>
                        </div>
                      </div>
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <div className='flex items-center gap-1'>
                        <FaGraduationCap size={14} className='text-gray-400' />
                        <span className='text-sm text-gray-900'>
                          {resume.jobTitle || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
                        {resume.category?.name || 'N/A'}
                      </span>
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <div>
                        <p className='text-sm text-gray-900'>
                          {resume.user?.name || 'N/A'}
                        </p>
                        <p className='text-xs text-gray-500'>
                          {resume.user?.email || 'N/A'}
                        </p>
                      </div>
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <button
                        onClick={() => handleToggleHireStatus(resume._id)}
                        disabled={toggleLoading}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors disabled:opacity-50 ${
                          resume.isHired
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                        }`}
                      >
                        {resume.isHired ? (
                          <>
                            <FaCheckCircle size={14} />
                            Hired
                          </>
                        ) : (
                          <>
                            <FaTimes size={14} />
                            Available
                          </>
                        )}
                      </button>
                    </td>
                    <td className='px-4 md:px-6 py-4 text-sm text-gray-500'>
                      {formatDate(resume.createdAt)}
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <div className='flex items-center gap-2'>
                        <Link
                          to={`/admin/resume/${resume._id}`}
                          className='p-1 text-gray-400 hover:text-blue-600 transition-colors'
                          title='View Resume'
                        >
                          <FaEye size={16} />
                        </Link>
                        {resume.file && (
                          <button
                            onClick={() =>
                              handleDownloadResume(
                                resume.file,
                                `${resume.fullName}-resume.pdf`
                              )
                            }
                            className='p-1 text-gray-400 hover:text-green-600 transition-colors'
                            title='Download Resume'
                          >
                            <FaDownload size={16} />
                          </button>
                        )}
                        
                        <button
                          className='p-1 text-gray-400 hover:text-red-600 transition-colors'
                          title='Delete Resume'
                          onClick={() =>
                            openDeleteConfirmation(resume._id, resume.photo)
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

          {filteredResumes.length === 0 && (
            <div className='text-center py-12'>
              <FaFileAlt className='mx-auto h-12 w-12 text-gray-400' />
              <h3 className='mt-2 text-sm font-medium text-gray-900'>
                No resumes found
              </h3>
              <p className='mt-1 text-sm text-gray-500'>
                {resumes.length === 0
                  ? 'No resumes available.'
                  : 'Try adjusting your search or filter criteria.'}
              </p>
            </div>
          )}
        </div>

        {/* Quick Stats by Category and Top Job Titles */}
        {stats && (stats.resumesByCategory || stats.topJobTitles) && (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8'>
            {stats.resumesByCategory && (
              <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  Resumes by Category
                </h3>
                <div className='space-y-3'>
                  {stats.resumesByCategory.slice(0, 5).map((item, index) => (
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

            {stats.topJobTitles && (
              <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  Top Job Titles
                </h3>
                <div className='space-y-3'>
                  {stats.topJobTitles.slice(0, 5).map((item, index) => (
                    <div
                      key={item._id}
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

export default AdminResume;
