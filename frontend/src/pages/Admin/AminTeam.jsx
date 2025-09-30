import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  useGetAllTeamMembersQuery,
  useDeleteTeamMemberMutation,
} from '../../redux/api/teamApiSlice';
import { useDeletePhotoMutation } from '../../redux/api/photoApiSlice.js';
import ConfirmationDialog from '../../components/ConfirmationDialog.jsx';
import {
  FaUsers,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaEye,
  FaCalendarAlt,
  FaUserTie,
  FaIdBadge,
  FaExclamationCircle,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminTeam = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteImg] = useDeletePhotoMutation()

  // Confirmation dialog states
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: null, // 'single' or 'bulk'
    memberId: null,
    memberImage: null,
    message: '',
  });

  const {
    data: teamData,
    isLoading,
    refetch,
  } = useGetAllTeamMembersQuery({
    page: currentPage,
    limit: 10,
  });

  const [deleteTeamMember, { isLoading: deleteLoading }] =
    useDeleteTeamMemberMutation();

  // Extract team members array from the response
  const teamMembers = teamData?.teamMembers || [];
  const totalPages = teamData?.totalPages || 1;
  const total = teamData?.total || 0;

  // Filter team members based on search
  const filteredTeamMembers = useMemo(() => {
    return teamMembers.filter((member) => {
      const matchesSearch =
        member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.description?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [teamMembers, searchTerm]);

  const openDeleteConfirmation = (id, image) => {
    setConfirmDialog({
      isOpen: true,
      type: 'single',
      memberId: id,
      memberImage: image,
      message: 'Are you sure you want to delete this team member?',
    });
  };

  const openBulkDeleteConfirmation = () => {
    if (selectedTeamMembers.length === 0) return;

    setConfirmDialog({
      isOpen: true,
      type: 'bulk',
      memberId: null,
      memberImage: null,
      message: `Are you sure you want to delete ${selectedTeamMembers.length} selected team members?`,
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      isOpen: false,
      type: null,
      memberId: null,
      memberImage: null,
      message: '',
    });
  };

  const handleConfirmDelete = async () => {
    try {
      if (confirmDialog.type === 'single') {
        await deleteTeamMember(confirmDialog.memberId).unwrap();
        if (confirmDialog.memberImage) {
          const filename = confirmDialog.memberImage.split('/').pop();
          await deleteImg(filename);
        }
        toast.success('Team member deleted successfully');
      } else if (confirmDialog.type === 'bulk') {
        // Get team member details for selected members to extract images
        const selectedMembersData = teamMembers.filter((member) =>
          selectedTeamMembers.includes(member._id)
        );

        for (const member of selectedMembersData) {
          await deleteTeamMember(member._id).unwrap();
          // Delete associated image if it exists
          if (member.image) {
            const filename = member.image.split('/').pop();
            await deleteImg(filename);
          }
        }
        setSelectedTeamMembers([]);
        toast.success(
          `${selectedTeamMembers.length} team members deleted successfully`
        );
      }
      closeConfirmDialog();
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to delete team member(s)');
      closeConfirmDialog();
    }
  };

  const handleSelectTeamMember = (memberId) => {
    setSelectedTeamMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTeamMembers.length === filteredTeamMembers.length) {
      setSelectedTeamMembers([]);
    } else {
      setSelectedTeamMembers(filteredTeamMembers.map((member) => member._id));
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

  const truncateText = (text, maxLength = 100) => {
    if (!text) return 'N/A';
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedTeamMembers([]); // Clear selections when changing page
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
        <span className='ml-3 text-gray-600'>Loading team members...</span>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-6 my-16'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-6'>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div>
              <h2 className='text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3'>
                <FaUsers className='text-blue-600' />
                Admin Team Dashboard
              </h2>
              <p className='text-gray-600 mt-1'>
                Manage and monitor all team members
              </p>
            </div>
            <Link
              to='/admin/create-team'
              className='bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg flex items-center gap-2 transition-colors text-sm md:text-base'
            >
              <FaPlus size={18} />
              Add Team Member
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
          <div className='bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs md:text-sm font-medium text-gray-600'>
                  Total Members
                </p>
                <p className='text-xl md:text-2xl font-bold text-gray-900'>
                  {total}
                </p>
              </div>
              <div className='bg-blue-100 p-2 md:p-3 rounded-full'>
                <FaUsers className='text-blue-600' size={20} />
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs md:text-sm font-medium text-gray-600'>
                  Current Page
                </p>
                <p className='text-xl md:text-2xl font-bold text-green-600'>
                  {currentPage}
                </p>
              </div>
              <div className='bg-green-100 p-2 md:p-3 rounded-full'>
                <FaCalendarAlt className='text-green-600' size={20} />
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs md:text-sm font-medium text-gray-600'>
                  Total Pages
                </p>
                <p className='text-xl md:text-2xl font-bold text-purple-600'>
                  {totalPages}
                </p>
              </div>
              <div className='bg-purple-100 p-2 md:p-3 rounded-full'>
                <FaIdBadge className='text-purple-600' size={20} />
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs md:text-sm font-medium text-gray-600'>
                  Selected
                </p>
                <p className='text-xl md:text-2xl font-bold text-orange-600'>
                  {selectedTeamMembers.length}
                </p>
              </div>
              <div className='bg-orange-100 p-2 md:p-3 rounded-full'>
                <FaUserTie className='text-orange-600' size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className='bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 mb-6'>
          <div className='flex flex-col lg:flex-row gap-4'>
            <div className='flex-1'>
              <div className='relative'>
                <FaSearch
                  className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                  size={18}
                />
                <input
                  type='text'
                  placeholder='Search team members by name, role, or description...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                />
              </div>
            </div>
          </div>
        </div>

        {/* Team Members Table */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
          <div className='px-4 md:px-6 py-4 border-b border-gray-200 flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Team Members ({filteredTeamMembers.length})
              </h3>
              {selectedTeamMembers.length > 0 && (
                <div className='text-sm text-gray-600'>
                  {selectedTeamMembers.length} selected
                </div>
              )}
            </div>
            {selectedTeamMembers.length > 0 && (
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
                        selectedTeamMembers.length ===
                          filteredTeamMembers.length &&
                        filteredTeamMembers.length > 0
                      }
                      onChange={handleSelectAll}
                      className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                    />
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Member Details
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Role
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Description
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
                {filteredTeamMembers.map((member) => (
                  <tr key={member._id} className='hover:bg-gray-50'>
                    <td className='px-4 md:px-6 py-4'>
                      <input
                        type='checkbox'
                        checked={selectedTeamMembers.includes(member._id)}
                        onChange={() => handleSelectTeamMember(member._id)}
                        className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                      />
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        {member.image && (
                          <img
                            src={member.image}
                            alt={member.name}
                            className='w-10 h-10 rounded-full object-cover'
                          />
                        )}
                        <div>
                          <h4 className='text-sm font-medium text-gray-900'>
                            {member.name || 'N/A'}
                          </h4>
                          <p className='text-xs text-gray-500'>
                            ID: {member._id.slice(-8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                        {member.role || 'N/A'}
                      </span>
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <p className='text-sm text-gray-900 max-w-xs'>
                        {truncateText(member.description, 80)}
                      </p>
                    </td>
                    <td className='px-4 md:px-6 py-4 text-sm text-gray-500'>
                      {formatDate(member.createdAt)}
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <div className='flex items-center gap-2'>
                        {/* <Link
                          to={`/team/${member._id}`}
                          className='p-1 text-gray-400 hover:text-blue-600 transition-colors'
                          title='View Member'
                        >
                          <FaEye size={16} />
                        </Link> */}
                        <Link
                          to={`/admin/team/${member._id}`}
                          className='p-1 text-gray-400 hover:text-green-600 transition-colors'
                          title='Edit Member'
                        >
                          <FaEdit size={16} />
                        </Link>
                        <button
                          className='p-1 text-gray-400 hover:text-red-600 transition-colors'
                          title='Delete Member'
                          onClick={() =>
                            openDeleteConfirmation(member._id, member.image)
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className='px-4 md:px-6 py-4 border-t border-gray-200 flex items-center justify-between'>
              <div className='text-sm text-gray-700'>
                Showing page {currentPage} of {totalPages} ({total} total
                members)
              </div>
              <div className='flex items-center gap-2'>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className='px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Previous
                </button>

                {/* Page numbers */}
                <div className='flex gap-1'>
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = Math.max(1, currentPage - 2) + i;
                    if (pageNum > totalPages) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 text-sm border rounded-md ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className='px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {filteredTeamMembers.length === 0 && (
            <div className='text-center py-12'>
              <FaUsers className='mx-auto h-12 w-12 text-gray-400' />
              <h3 className='mt-2 text-sm font-medium text-gray-900'>
                No team members found
              </h3>
              <p className='mt-1 text-sm text-gray-500'>
                {teamMembers.length === 0
                  ? 'No team members available.'
                  : 'Try adjusting your search criteria.'}
              </p>
            </div>
          )}
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

export default AdminTeam;
