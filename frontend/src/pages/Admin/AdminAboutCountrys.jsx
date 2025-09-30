import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  useDeleteStudyWorkMutation,
  useGetStudyWorksQuery,
} from '../../redux/api/studyWorkApiSlice.js';
import { useDeleteImgMutation } from '../../redux/api/imgUploadApiSlise.js';
import ConfirmationDialog from '../../components/ConfirmationDialog.jsx';
import {
  FaGlobeAmericas,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaChartLine,
  FaEye,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaUsers,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminAboutCountrys = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [deleteImg] = useDeleteImgMutation();

  // Confirmation dialog states
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: null, // 'single' or 'bulk'
    entryId: null,
    entryImage: null,
    message: '',
  });

  const { data: studyWorksData, isLoading } = useGetStudyWorksQuery();
  const [deleteStudyWork, { isLoading: deleteLoading }] =
    useDeleteStudyWorkMutation();

  // Extract study works array from the response
  const studyWorks = studyWorksData?.data || [];

  // Calculate stats
  const stats = useMemo(() => {
    if (!studyWorks.length) return {};

    const totalEntries = studyWorks.length;
    const countriesCount = new Set(studyWorks.map((entry) => entry.country))
      .size;

    // Recent entries (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentEntries = studyWorks.filter(
      (entry) => new Date(entry.createdAt) > thirtyDaysAgo
    ).length;

    // Entries by country
    const entriesByCountry = studyWorks.reduce((acc, entry) => {
      acc[entry.country] = (acc[entry.country] || 0) + 1;
      return acc;
    }, {});

    const topCountries = Object.entries(entriesByCountry)
      .map(([country, count]) => ({ _id: country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Average services per entry
    const totalServices = studyWorks.reduce(
      (acc, entry) => acc + (entry.howWeHelp?.services?.length || 0),
      0
    );
    const avgServices = Math.round(totalServices / totalEntries) || 0;

    return {
      totalEntries,
      countriesCount,
      recentEntries,
      avgServices,
      entriesByCountry: topCountries,
    };
  }, [studyWorks]);

  // Filter study works based on search and filters
  const filteredStudyWorks = useMemo(() => {
    return studyWorks.filter((entry) => {
      const matchesSearch =
        entry.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.subtitle?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCountry =
        countryFilter === 'all' || entry.country === countryFilter;

      return matchesSearch && matchesCountry;
    });
  }, [studyWorks, searchTerm, countryFilter]);

  const openDeleteConfirmation = (id, bannerImage) => {
    setConfirmDialog({
      isOpen: true,
      type: 'single',
      entryId: id,
      entryImage: bannerImage,
      message: 'Are you sure you want to delete this study work entry?',
    });
  };

  const openBulkDeleteConfirmation = () => {
    if (selectedEntries.length === 0) return;

    setConfirmDialog({
      isOpen: true,
      type: 'bulk',
      entryId: null,
      entryImage: null,
      message: `Are you sure you want to delete ${selectedEntries.length} selected entries?`,
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      isOpen: false,
      type: null,
      entryId: null,
      entryImage: null,
      message: '',
    });
  };

  const handleConfirmDelete = async () => {
    try {
      if (confirmDialog.type === 'single') {
        await deleteStudyWork(confirmDialog.entryId).unwrap();
        if (confirmDialog.entryImage) {
          const filename = confirmDialog.entryImage.split('/').pop();
          await deleteImg(filename);
        }
        toast.success('Study work entry deleted successfully');
      } else if (confirmDialog.type === 'bulk') {
        // Get entry details for selected entries to extract images
        const selectedEntriesData = studyWorks.filter((entry) =>
          selectedEntries.includes(entry._id)
        );

        for (const entry of selectedEntriesData) {
          await deleteStudyWork(entry._id).unwrap();
          // Delete associated image if it exists
          if (entry.bannerImage) {
            const filename = entry.bannerImage.split('/').pop();
            await deleteImg(filename);
          }
        }
        setSelectedEntries([]);
        toast.success(`${selectedEntries.length} entries deleted successfully`);
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to delete entry/entries');
    }
    closeConfirmDialog();
  };

  const handleSelectEntry = (entryId) => {
    setSelectedEntries((prev) =>
      prev.includes(entryId)
        ? prev.filter((id) => id !== entryId)
        : [...prev, entryId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEntries.length === filteredStudyWorks.length) {
      setSelectedEntries([]);
    } else {
      setSelectedEntries(filteredStudyWorks.map((entry) => entry._id));
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
    ...new Set(studyWorks.map((entry) => entry.country).filter(Boolean)),
  ];

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
        <span className='ml-3 text-gray-600'>
          Loading study work entries...
        </span>
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
                <FaGlobeAmericas className='text-blue-600' />
                Admin Study & Work Dashboard
              </h2>
              <p className='text-gray-600 mt-1'>
                Manage and monitor all study & work abroad programs
              </p>
            </div>
            <Link
              to='/admin/create-AboutCountry'
              className='bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg flex items-center gap-2 transition-colors text-sm md:text-base'
            >
              <FaPlus size={18} />
              Create Entry
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6'>
          <div className='bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs md:text-sm font-medium text-gray-600'>
                  Total Entries
                </p>
                <p className='text-xl md:text-2xl font-bold text-gray-900'>
                  {stats.totalEntries || 0}
                </p>
              </div>
              <div className='bg-blue-100 p-2 md:p-3 rounded-full'>
                <FaGlobeAmericas className='text-blue-600' size={20} />
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs md:text-sm font-medium text-gray-600'>
                  Countries
                </p>
                <p className='text-xl md:text-2xl font-bold text-green-600'>
                  {stats.countriesCount || 0}
                </p>
              </div>
              <div className='bg-green-100 p-2 md:p-3 rounded-full'>
                <FaMapMarkerAlt className='text-green-600' size={20} />
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs md:text-sm font-medium text-gray-600'>
                  Recent Entries
                </p>
                <p className='text-xl md:text-2xl font-bold text-orange-600'>
                  {stats.recentEntries || 0}
                </p>
              </div>
              <div className='bg-orange-100 p-2 md:p-3 rounded-full'>
                <FaCalendarAlt className='text-orange-600' size={20} />
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs md:text-sm font-medium text-gray-600'>
                  Avg Services
                </p>
                <p className='text-xl md:text-2xl font-bold text-purple-600'>
                  {stats.avgServices || 0}
                </p>
              </div>
              <div className='bg-purple-100 p-2 md:p-3 rounded-full'>
                <FaGraduationCap className='text-purple-600' size={20} />
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs md:text-sm font-medium text-gray-600'>
                  This Month
                </p>
                <p className='text-xl md:text-2xl font-bold text-indigo-600'>
                  {stats.recentEntries || 0}
                </p>
              </div>
              <div className='bg-indigo-100 p-2 md:p-3 rounded-full'>
                <FaChartLine className='text-indigo-600' size={20} />
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
                  placeholder='Search by title, country, or subtitle...'
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
          </div>
        </div>

        {/* Entries Table */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
          <div className='px-4 md:px-6 py-4 border-b border-gray-200 flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Study Work Entries ({filteredStudyWorks.length})
              </h3>
              {selectedEntries.length > 0 && (
                <div className='text-sm text-gray-600'>
                  {selectedEntries.length} selected
                </div>
              )}
            </div>
            {selectedEntries.length > 0 && (
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
                        selectedEntries.length === filteredStudyWorks.length &&
                        filteredStudyWorks.length > 0
                      }
                      onChange={handleSelectAll}
                      className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                    />
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Program Details
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Country
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Services
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Requirements
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
                {filteredStudyWorks.map((entry) => (
                  <tr key={entry._id} className='hover:bg-gray-50'>
                    <td className='px-4 md:px-6 py-4'>
                      <input
                        type='checkbox'
                        checked={selectedEntries.includes(entry._id)}
                        onChange={() => handleSelectEntry(entry._id)}
                        className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                      />
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <div className='flex items-start gap-3'>
                        {entry.bannerImage && (
                          <img
                            src={entry.bannerImage}
                            alt={entry.title}
                            className='w-16 h-12 object-cover rounded-lg flex-shrink-0'
                          />
                        )}
                        <div className='flex-1 min-w-0'>
                          <h4 className='text-sm font-medium text-gray-900 truncate'>
                            {entry.title || 'N/A'}
                          </h4>
                          <p className='text-xs text-gray-500 mt-1 line-clamp-2'>
                            {entry.subtitle || 'No subtitle provided'}
                          </p>
                          {entry.whyCountry?.points && (
                            <div className='flex items-center mt-1'>
                              <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800'>
                                {entry.whyCountry.points.length} advantages
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <div className='flex items-center gap-1'>
                        <FaMapMarkerAlt size={14} className='text-gray-400' />
                        <span className='text-sm text-gray-900 text-nowrap '>
                          {entry.country || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <span className='inline-flex text-nowrap items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                        {entry.howWeHelp?.services?.length || 0} services
                      </span>
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
                        {entry.whoCanApply?.requirements?.length || 0}{' '}
                        requirements
                      </span>
                    </td>
                    <td className='px-4 md:px-6 py-4 text-sm text-gray-500'>
                      {formatDate(entry.createdAt)}
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <div className='flex items-center gap-2'>
                        <Link
                          to={`/country/${entry._id}`}
                          className='p-1 text-gray-400 hover:text-blue-600 transition-colors'
                          title='View Entry'
                        >
                          <FaEye size={16} />
                        </Link>
                        <Link
                          to={`/admin/updateCountry/${entry._id}`}
                          className='p-1 text-gray-400 hover:text-green-600 transition-colors'
                          title='Edit Entry'
                        >
                          <FaEdit size={16} />
                        </Link>
                        <button
                          className='p-1 text-gray-400 hover:text-red-600 transition-colors'
                          title='Delete Entry'
                          onClick={() =>
                            openDeleteConfirmation(entry._id, entry.bannerImage)
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

          {filteredStudyWorks.length === 0 && (
            <div className='text-center py-12'>
              <FaGlobeAmericas className='mx-auto h-12 w-12 text-gray-400' />
              <h3 className='mt-2 text-sm font-medium text-gray-900'>
                No study work entries found
              </h3>
              <p className='mt-1 text-sm text-gray-500'>
                {studyWorks.length === 0
                  ? 'No entries available.'
                  : 'Try adjusting your search or filter criteria.'}
              </p>
            </div>
          )}
        </div>

        {/* Quick Stats by Country */}
        {stats.entriesByCountry && stats.entriesByCountry.length > 0 && (
          <div className='mt-8'>
            <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                <FaChartLine className='text-blue-600' />
                Entries by Country
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
                {stats.entriesByCountry.map((item, index) => (
                  <div
                    key={item._id}
                    className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'
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
                        {item._id}
                      </span>
                    </div>
                    <span className='text-sm font-medium text-gray-900 ml-2'>
                      {item.count}
                    </span>
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

export default AdminAboutCountrys;
