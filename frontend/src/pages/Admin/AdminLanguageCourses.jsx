import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  useGetLanguageCoursesQuery,
  useDeleteLanguageCourseMutation,
  useGetLanguageCoursesStatsQuery,
} from '../../redux/api/languageCourseApiSlice.js';
import { useDeleteImgMutation } from '../../redux/api/imgUploadApiSlise.js';
import ConfirmationDialog from '../../components/ConfirmationDialog.jsx';
import {
  FaGraduationCap,
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
  FaGlobe,
  FaExclamationCircle,
  FaLanguage,
  FaBook,
  FaLevelUpAlt,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminLanguageCourses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [deleteImg] = useDeleteImgMutation();

  // Confirmation dialog states
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: null, // 'single' or 'bulk'
    courseId: null,
    courseImage: null,
    message: '',
  });

  const { data: courses, isLoading } = useGetLanguageCoursesQuery();
  const { data: stats = {}, isLoading: statsLoading } =
    useGetLanguageCoursesStatsQuery();
  const [deleteLanguageCourse, { isLoading: deleteLoading }] =
    useDeleteLanguageCourseMutation();

  // Extract courses array from the response
  const coursesList = courses || [];

  // Filter courses based on search and filters
  const filteredCourses = useMemo(() => {
    return coursesList.filter((course) => {
      const matchesSearch =
        course.couresName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.shortName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCountry =
        countryFilter === 'all' || course.country === countryFilter;

      const matchesLanguage =
        languageFilter === 'all' || course.shortName === languageFilter;

      return matchesSearch && matchesCountry && matchesLanguage;
    });
  }, [coursesList, searchTerm, countryFilter, languageFilter]);

  const openDeleteConfirmation = (id, image) => {
    setConfirmDialog({
      isOpen: true,
      type: 'single',
      courseId: id,
      courseImage: image,
      message: 'Are you sure you want to delete this language course?',
    });
  };

  const openBulkDeleteConfirmation = () => {
    if (selectedCourses.length === 0) return;

    setConfirmDialog({
      isOpen: true,
      type: 'bulk',
      courseId: null,
      courseImage: null,
      message: `Are you sure you want to delete ${selectedCourses.length} selected courses?`,
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      isOpen: false,
      type: null,
      courseId: null,
      courseImage: null,
      message: '',
    });
  };

  const handleConfirmDelete = async () => {
    try {
      if (confirmDialog.type === 'single') {
        await deleteLanguageCourse(confirmDialog.courseId).unwrap();
        if (confirmDialog.courseImage) {
          const filename = confirmDialog.courseImage.split('/').pop();
          await deleteImg(filename);
        }
        toast.success('Language course deleted successfully');
      } else if (confirmDialog.type === 'bulk') {
        // Get course details for selected courses to extract images
        const selectedCoursesData = coursesList.filter((course) =>
          selectedCourses.includes(course._id)
        );

        for (const course of selectedCoursesData) {
          await deleteLanguageCourse(course._id).unwrap();
          // Delete associated image if it exists
          if (course.image) {
            const filename = course.image.split('/').pop();
            await deleteImg(filename);
          }
        }
        setSelectedCourses([]);
        toast.success(`${selectedCourses.length} courses deleted successfully`);
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to delete course(s)');
    }
  };

  const handleSelectCourse = (courseId) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCourses.length === filteredCourses.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(filteredCourses.map((course) => course._id));
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

  const uniqueCountries = [
    ...new Set(coursesList.map((course) => course.country).filter(Boolean)),
  ];

  const uniqueLanguages = [
    ...new Set(coursesList.map((course) => course.shortName).filter(Boolean)),
  ];

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
        <span className='ml-3 text-gray-600'>Loading language courses...</span>
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
                <FaLanguage className='text-blue-600' />
                Language Courses Dashboard
              </h2>
              <p className='text-gray-600 mt-1'>
                Manage and monitor all language course listings
              </p>
            </div>
            <Link
              to='/admin/create-language-course'
              className='bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg flex items-center gap-2 transition-colors text-sm md:text-base'
            >
              <FaPlus size={18} />
              Create Course
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        {!statsLoading && stats && (
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6'>
            <div className='bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs md:text-sm font-medium text-gray-600'>
                    Total Courses
                  </p>
                  <p className='text-xl md:text-2xl font-bold text-gray-900'>
                    {stats.totalCourses || 0}
                  </p>
                </div>
                <div className='bg-blue-100 p-2 md:p-3 rounded-full'>
                  <FaLanguage className='text-blue-600' size={20} />
                </div>
              </div>
            </div>

            <div className='bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs md:text-sm font-medium text-gray-600'>
                    Recent Courses
                  </p>
                  <p className='text-xl md:text-2xl font-bold text-green-600'>
                    {stats.recentCourses || 0}
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
                    Avg Levels
                  </p>
                  <p className='text-xl md:text-2xl font-bold text-purple-600'>
                    {Number(stats.averageLevelsPerCourse || 0)
                      .toFixed(2)
                      .replace(/\.?0+$/, '')}
                  </p>
                </div>
                <div className='bg-purple-100 p-2 md:p-3 rounded-full'>
                  <FaLevelUpAlt className='text-purple-600' size={20} />
                </div>
              </div>
            </div>

            <div className='bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs md:text-sm font-medium text-gray-600'>
                    Countries
                  </p>
                  <p className='text-xl md:text-2xl font-bold text-orange-600'>
                    {stats.coursesByCountry?.length || 0}
                  </p>
                </div>
                <div className='bg-orange-100 p-2 md:p-3 rounded-full'>
                  <FaGlobe className='text-orange-600' size={20} />
                </div>
              </div>
            </div>

            <div className='bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs md:text-sm font-medium text-gray-600'>
                    Languages
                  </p>
                  <p className='text-xl md:text-2xl font-bold text-indigo-600'>
                    {stats.popularCourseNames?.length || 0}
                  </p>
                </div>
                <div className='bg-indigo-100 p-2 md:p-3 rounded-full'>
                  <FaBook className='text-indigo-600' size={20} />
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
                  placeholder='Search courses by name, language, or country...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                />
              </div>
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

            {/* Language Filter */}
            <div className='lg:w-48'>
              <select
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
              >
                <option value='all'>All Languages</option>
                {uniqueLanguages.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Courses Table */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
          <div className='px-4 md:px-6 py-4 border-b border-gray-200 flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Courses ({filteredCourses.length})
              </h3>
              {selectedCourses.length > 0 && (
                <div className='text-sm text-gray-600'>
                  {selectedCourses.length} selected
                </div>
              )}
            </div>
            {selectedCourses.length > 0 && (
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
                        selectedCourses.length === filteredCourses.length &&
                        filteredCourses.length > 0
                      }
                      onChange={handleSelectAll}
                      className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                    />
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Course Details
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Language & Country
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Levels & Pricing
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
                {filteredCourses.map((course) => (
                  <tr key={course._id} className='hover:bg-gray-50'>
                    <td className='px-4 md:px-6 py-4'>
                      <input
                        type='checkbox'
                        checked={selectedCourses.includes(course._id)}
                        onChange={() => handleSelectCourse(course._id)}
                        className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                      />
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        {course.image && (
                          <img
                            src={course.image}
                            alt={course.couresName}
                            className='w-12 h-12 rounded-lg object-cover border'
                          />
                        )}
                        <div>
                          <h4 className='text-sm font-medium text-gray-900'>
                            {course.couresName || 'N/A'}
                          </h4>
                          <p className='text-xs text-gray-500 mt-1 line-clamp-2'>
                            {course.description || 'No description available'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <div className='flex items-center gap-1 mb-1'>
                        <FaLanguage size={14} className='text-blue-400' />
                        <span className='text-sm font-medium text-gray-900'>
                          {course.shortName || 'N/A'}
                        </span>
                      </div>
                      <div className='flex items-center gap-1'>
                        <FaMapMarkerAlt size={14} className='text-gray-400' />
                        <span className='text-sm text-gray-600'>
                          {course.country || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <div className='flex items-center gap-1 mb-1'>
                        <FaLevelUpAlt size={14} className='text-purple-400' />
                        <span className='text-sm text-gray-900'>
                          {course.levels?.length || 0} Level
                          {course.levels?.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <p className='text-sm text-green-600 font-medium'>
                        {getPriceRange(course.levels)}
                      </p>
                    </td>
                    <td className='px-4 md:px-6 py-4 text-sm text-gray-500'>
                      {formatDate(course.createdAt)}
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <div className='flex items-center gap-2'>
                        <Link
                          to={`/courses/${course._id}`}
                          className='p-1 text-gray-400 hover:text-blue-600 transition-colors'
                          title='View Course'
                        >
                          <FaEye size={16} />
                        </Link>
                        <Link
                          to={`/admin/language-course/${course._id}`}
                          className='p-1 text-gray-400 hover:text-green-600 transition-colors'
                          title='Edit Course'
                        >
                          <FaEdit size={16} />
                        </Link>
                        <button
                          className='p-1 text-gray-400 hover:text-red-600 transition-colors'
                          title='Delete Course'
                          onClick={() =>
                            openDeleteConfirmation(course._id, course.image)
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

          {filteredCourses.length === 0 && (
            <div className='text-center py-12'>
              <FaLanguage className='mx-auto h-12 w-12 text-gray-400' />
              <h3 className='mt-2 text-sm font-medium text-gray-900'>
                No courses found
              </h3>
              <p className='mt-1 text-sm text-gray-500'>
                {coursesList.length === 0
                  ? 'No language courses available.'
                  : 'Try adjusting your search or filter criteria.'}
              </p>
            </div>
          )}
        </div>

        {/* Quick Stats by Country and Languages */}
        {stats && (stats.coursesByCountry || stats.popularCourseNames) && (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8'>
            {stats.coursesByCountry && (
              <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  Courses by Country
                </h3>
                <div className='space-y-3'>
                  {stats.coursesByCountry.slice(0, 5).map((item, index) => (
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

            {stats.popularCourseNames && (
              <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  Popular Languages
                </h3>
                <div className='space-y-3'>
                  {stats.popularCourseNames.slice(0, 5).map((item, index) => (
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

export default AdminLanguageCourses;
