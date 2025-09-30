import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  useGetAllEnrollsQuery,
  useDeleteEnrollMutation,
} from '../../redux/api/enrollApiSlice.js';
import ConfirmationDialog from '../../components/ConfirmationDialog.jsx';
import {
  FaGraduationCap,
  FaTrash,
  FaSearch,
  FaUser,
  FaBook,
  FaCalendarAlt,
  FaEnvelope,
  FaGlobe,
  FaLevelUpAlt,
  FaClock,
  FaUsers,
} from 'react-icons/fa';
import { toast } from 'react-toastify';



const AdminEnroll = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [selectedEnrollments, setSelectedEnrollments] = useState([]);
  const [card, setCard] = useState(null)
  const [isCardActiv,setIsCardActiv]= useState(false)

  // Confirmation dialog states
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: null, // 'single' or 'bulk'
    enrollmentId: null,
    message: '',
  });

  const { data, isLoading } = useGetAllEnrollsQuery();
  const enrollments = data?.data || [];

  const [deleteEnroll, { isLoading: deleteLoading }] =
    useDeleteEnrollMutation();

  // Generate stats from enrollments data
  const stats = useMemo(() => {
    if (!enrollments || enrollments.length === 0) {
      return {
        totalEnrollments: 0,
        recentEnrollments: 0,
        uniqueStudents: 0,
        uniqueCourses: 0,
      };
    }

    const uniqueUsers = new Set(enrollments.map((enroll) => enroll.user?._id))
      .size;
    const uniqueCourses = new Set(
      enrollments.map((enroll) => enroll.course?._id)
    ).size;

    // Consider enrollments from last 7 days as recent
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentEnrollments = enrollments.filter(
      (enroll) => new Date(enroll.createdAt) > sevenDaysAgo
    ).length;

    return {
      totalEnrollments: enrollments.length,
      recentEnrollments,
      uniqueStudents: uniqueUsers,
      uniqueCourses,
    };
  }, [enrollments]);

  // Filter enrollments based on search and filters
  const filteredEnrollments = useMemo(() => {
    return enrollments.filter((enrollment) => {
      const matchesSearch =
        enrollment.user?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        enrollment.user?.email
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        enrollment.course?.couresName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        enrollment.course?.shortName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        enrollment.course?.country
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        enrollment.selectedLevel
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesCourse =
        courseFilter === 'all' || enrollment.course?._id === courseFilter;

      const matchesLevel =
        levelFilter === 'all' || enrollment.selectedLevel === levelFilter;

      return matchesSearch && matchesCourse && matchesLevel;
    });
  }, [enrollments, searchTerm, courseFilter, levelFilter]);

  const openDeleteConfirmation = (id) => {
    setConfirmDialog({
      isOpen: true,
      type: 'single',
      enrollmentId: id,
      message: 'Are you sure you want to delete this enrollment?',
    });
  };

  const handleUserData = (data) => {
    if (data) {
      setCard(data)
      setIsCardActiv(true)
      
    }
  }
  const handleClearUserData = () => {
    setCard(null)
    setIsCardActiv(false)
  }

  const openBulkDeleteConfirmation = () => {
    if (selectedEnrollments.length === 0) return;

    setConfirmDialog({
      isOpen: true,
      type: 'bulk',
      enrollmentId: null,
      message: `Are you sure you want to delete ${selectedEnrollments.length} selected enrollments?`,
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      isOpen: false,
      type: null,
      enrollmentId: null,
      message: '',
    });
  };

  const handleConfirmDelete = async () => {
    try {
      if (confirmDialog.type === 'single') {
        await deleteEnroll(confirmDialog.enrollmentId).unwrap();
        toast.success('Enrollment deleted successfully');
      } else if (confirmDialog.type === 'bulk') {
        for (const enrollId of selectedEnrollments) {
          await deleteEnroll(enrollId).unwrap();
        }
        setSelectedEnrollments([]);
        toast.success(
          `${selectedEnrollments.length} enrollments deleted successfully`
        );
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to delete enrollment(s)');
    } finally {
      closeConfirmDialog();
    }
  };

  const handleSelectEnrollment = (enrollId) => {
    setSelectedEnrollments((prev) =>
      prev.includes(enrollId)
        ? prev.filter((id) => id !== enrollId)
        : [...prev, enrollId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEnrollments.length === filteredEnrollments.length) {
      setSelectedEnrollments([]);
    } else {
      setSelectedEnrollments(filteredEnrollments.map((enroll) => enroll._id));
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

  const uniqueCourses = [
    ...new Set(enrollments.map((enroll) => enroll.course).filter(Boolean)),
  ];

  const uniqueLevels = [
    ...new Set(
      enrollments.map((enroll) => enroll.selectedLevel).filter(Boolean)
    ),
  ];

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
        <span className='ml-3 text-gray-600'>Loading enrollments...</span>
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
                <FaGraduationCap className='text-blue-600' />
                Language Course Enrollments
              </h2>
              <p className='text-gray-600 mt-1'>
                Manage and monitor all course enrollments
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
                  Total Enrollments
                </p>
                <p className='text-xl md:text-2xl font-bold text-gray-900'>
                  {stats.totalEnrollments}
                </p>
              </div>
              <div className='bg-blue-100 p-2 md:p-3 rounded-full'>
                <FaGraduationCap className='text-blue-600' size={20} />
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs md:text-sm font-medium text-gray-600'>
                  Recent Enrollments
                </p>
                <p className='text-xl md:text-2xl font-bold text-green-600'>
                  {stats.recentEnrollments}
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
                  Unique Students
                </p>
                <p className='text-xl md:text-2xl font-bold text-purple-600'>
                  {stats.uniqueStudents}
                </p>
              </div>
              <div className='bg-purple-100 p-2 md:p-3 rounded-full'>
                <FaUsers className='text-purple-600' size={20} />
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs md:text-sm font-medium text-gray-600'>
                  Active Courses
                </p>
                <p className='text-xl md:text-2xl font-bold text-orange-600'>
                  {stats.uniqueCourses}
                </p>
              </div>
              <div className='bg-orange-100 p-2 md:p-3 rounded-full'>
                <FaBook className='text-orange-600' size={20} />
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
                  placeholder='Search by student name, email, course name, country, or level...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                />
              </div>
            </div>

            {/* Course Filter */}
            <div className='lg:w-64'>
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
              >
                <option value='all'>All Courses</option>
                {uniqueCourses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.couresName} ({course.shortName})
                  </option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            <div className='lg:w-48'>
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
              >
                <option value='all'>All Levels</option>
                {uniqueLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Enrollments Table */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
          <div className='px-4 md:px-6 py-4 border-b border-gray-200 flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Enrollments ({filteredEnrollments.length})
              </h3>
              {selectedEnrollments.length > 0 && (
                <div className='text-sm text-gray-600'>
                  {selectedEnrollments.length} selected
                </div>
              )}
            </div>
            {selectedEnrollments.length > 0 && (
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
                        selectedEnrollments.length ===
                          filteredEnrollments.length &&
                        filteredEnrollments.length > 0
                      }
                      onChange={handleSelectAll}
                      className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                    />
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Student
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Course
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Level
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Enrolled Date
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredEnrollments.map((enrollment) => (
                  <tr key={enrollment._id} className='hover:bg-gray-50'>
                    <td className='px-4 md:px-6 py-4'>
                      <input
                        type='checkbox'
                        checked={selectedEnrollments.includes(enrollment._id)}
                        onChange={() => handleSelectEnrollment(enrollment._id)}
                        className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                      />
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <div>
                        <div className='flex items-center gap-2'>
                          <FaUser className='text-gray-400' size={16} />
                          <h4 className='text-sm font-medium text-gray-900'>
                            {enrollment.user?.name || 'N/A'}
                          </h4>
                        </div>
                        <div className='flex items-center gap-1 mt-1'>
                          <FaEnvelope className='text-gray-400' size={12} />
                          <p className='text-xs text-gray-500'>
                            {enrollment.user?.email || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <div>
                        <h4 className='text-sm font-medium text-gray-900'>
                          {enrollment.course?.couresName || 'N/A'}
                        </h4>
                        <div className='flex items-center gap-2 mt-1'>
                          <div className='flex items-center gap-1'>
                            <FaBook className='text-gray-400' size={12} />
                            <p className='text-xs text-gray-500'>
                              {enrollment.course?.shortName || 'N/A'}
                            </p>
                          </div>
                          {enrollment.course?.country && (
                            <div className='flex items-center gap-1'>
                              <FaGlobe className='text-gray-400' size={12} />
                              <p className='text-xs text-gray-500'>
                                {enrollment.course.country}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <div className='flex items-center gap-1'>
                        <FaLevelUpAlt className='text-gray-400' size={12} />
                        <span className='text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md'>
                          {enrollment.selectedLevel || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <div className='flex items-center gap-1'>
                        <FaCalendarAlt className='text-gray-400' size={12} />
                        <span className='text-sm text-gray-500'>
                          {formatDate(enrollment.createdAt)}
                        </span>
                      </div>
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <div className='flex items-center gap-2'>
                        <button
                          onClick={()=> handleUserData(enrollment.user)}
                          className='p-1 text-gray-400 hover:text-blue-600 transition-colors'
                          title='View Details'
                        >
                          <FaUser size={16} />
                        </button>
                        <button
                          className='p-1 text-gray-400 hover:text-red-600 transition-colors'
                          title='Delete Enrollment'
                          onClick={() => openDeleteConfirmation(enrollment._id)}
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

          {filteredEnrollments.length === 0 && (
            <div className='text-center py-12'>
              <FaGraduationCap className='mx-auto h-12 w-12 text-gray-400' />
              <h3 className='mt-2 text-sm font-medium text-gray-900'>
                No enrollments found
              </h3>
              <p className='mt-1 text-sm text-gray-500'>
                {enrollments.length === 0
                  ? 'No course enrollments submitted yet.'
                  : 'Try adjusting your search or filter criteria.'}
              </p>
            </div>
          )}
        </div>

        {/* Enrollment Statistics */}
        {enrollments.length > 0 && (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8'>
            {/* Most Popular Courses */}
            <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Most Popular Courses
              </h3>
              <div className='space-y-3'>
                {Object.entries(
                  enrollments.reduce((acc, enroll) => {
                    const courseName =
                      enroll.course?.couresName || 'Unknown Course';
                    acc[courseName] = (acc[courseName] || 0) + 1;
                    return acc;
                  }, {})
                )
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([courseName, count], index) => (
                    <div
                      key={courseName}
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
                          {courseName}
                        </span>
                      </div>
                      <span className='text-sm font-medium text-gray-900'>
                        {count}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Recent Enrollments */}
            <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Recent Enrollments
              </h3>
              <div className='space-y-3'>
                {[...enrollments]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 5)
                  .map((enroll) => (
                    <div key={enroll._id} className='flex items-start gap-3'>
                      <div className='bg-blue-100 p-2 rounded-full'>
                        <FaUser className='text-blue-600' size={12} />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm text-gray-900 truncate'>
                          <span className='font-medium'>
                            {enroll.user?.name}
                          </span>{' '}
                          enrolled in{' '}
                          <span className='font-medium'>
                            {enroll.course?.couresName}
                          </span>
                          {enroll.selectedLevel && (
                            <span className='text-blue-600'>
                              {' '}
                              ({enroll.selectedLevel})
                            </span>
                          )}
                        </p>
                        <p className='text-xs text-gray-500'>
                          {formatDate(enroll.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div onClick={handleClearUserData} className={` fixed justify-center indent-0 z-[999] items-center w-full h-screen bg-gray-900/70 backdrop-blur-sm text-center top-0  left-0 ${
        isCardActiv ? "flex" : "hidden"
      }`}>
        
        <div className='text-black flex flex-col gap-4 text-xl font-bold' >
          <h3> Name: {card?.name}</h3>
          <h3>Email: {card?.email}</h3>
          <h3>phone: { card?.phone}</h3>

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

export default AdminEnroll;
