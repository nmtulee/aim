import React, { useState, useEffect } from 'react';
import {
  FaUser,
  FaEdit,
  FaTrash,
  FaUserShield,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
  FaFilter,
  FaEllipsisV,
  FaUserPlus,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaChartLine,
} from 'react-icons/fa';
import {
  useUpdateUserMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetUserByIdQuery,
  useGetUsersStatsQuery,
} from '../../redux/api/usersApiSlice.js';

import {  useSelector } from 'react-redux';



const AdminUsers = () => {

  const { userInfo } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    isAdmin: false,
  });


  // API hooks
  const {
    data: users,
    isLoading: usersLoading,
    refetch: refetchUsers,
  } = useGetUsersQuery();
  const { data: stats, isLoading: statsLoading } = useGetUsersStatsQuery();
  const [updateUser, { isLoading: updateLoading }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: deleteLoading }] = useDeleteUserMutation();

  // Filter and search users
  const filteredUsers =
    users?.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm);

      switch (filterBy) {
        case 'verified':
          return matchesSearch && user.isVarify;
        case 'unverified':
          return matchesSearch && !user.isVarify;
        case 'admin':
          return matchesSearch && user.isAdmin;
        case 'regular':
          return matchesSearch && !user.isAdmin;
        default:
          return matchesSearch;
      }
    }) || [];

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      phone: user.phone,
      isAdmin: user.isAdmin,
    });
    setShowEditModal(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const submitEdit = async () => {
    try {
      await updateUser({
        id: selectedUser._id,
        data: editForm,
      }).unwrap();
      setShowEditModal(false);
      refetchUsers();
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteUser(selectedUser._id).unwrap();
      setShowDeleteModal(false);
      refetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (usersLoading || statsLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  return (
    <div className='p-6 bg-gray-50 min-h-screen mt-16'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>
          User Management
        </h1>
        <p className='text-gray-600'>Manage and monitor all registered users</p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <div className='bg-white rounded-lg shadow-sm p-6 border border-gray-200'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Total Users</p>
              <p className='text-3xl font-bold text-gray-900'>
                {stats?.totalUsers || 0}
              </p>
            </div>
            <div className='bg-blue-100 p-3 rounded-full'>
              <FaUser className='h-6 w-6 text-blue-600' />
            </div>
          </div>
          <div className='mt-4 flex items-center text-sm'>
            <FaChartLine className='h-4 w-4 text-green-500 mr-1' />
            <span className='text-green-600'>
              {stats?.registrationStats?.thisMonth || 0} this month
            </span>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-sm p-6 border border-gray-200'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>
                Verified Users
              </p>
              <p className='text-3xl font-bold text-green-600'>
                {stats?.verifiedUsers || 0}
              </p>
            </div>
            <div className='bg-green-100 p-3 rounded-full'>
              <FaCheckCircle className='h-6 w-6 text-green-600' />
            </div>
          </div>
          <div className='mt-4'>
            <span className='text-sm text-gray-600'>
              {stats?.rates?.verificationRate || '0%'} verification rate
            </span>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-sm p-6 border border-gray-200'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Unverified</p>
              <p className='text-3xl font-bold text-orange-600'>
                {stats?.unverifiedUsers || 0}
              </p>
            </div>
            <div className='bg-orange-100 p-3 rounded-full'>
              <FaTimesCircle className='h-6 w-6 text-orange-600' />
            </div>
          </div>
          <div className='mt-4'>
            <span className='text-sm text-gray-600'>Pending verification</span>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-sm p-6 border border-gray-200'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Admin Users</p>
              <p className='text-3xl font-bold text-purple-600'>
                {stats?.adminUsers || 0}
              </p>
            </div>
            <div className='bg-purple-100 p-3 rounded-full'>
              <FaUserShield className='h-6 w-6 text-purple-600' />
            </div>
          </div>
          <div className='mt-4'>
            <span className='text-sm text-gray-600'>
              {stats?.rates?.adminRate || '0%'} admin rate
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className='bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200'>
        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='flex-1'>
            <div className='relative'>
              <FaSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5' />
              <input
                type='text'
                placeholder='Search by name, email, or phone...'
                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className='sm:w-48'>
            <select
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
            >
              <option value='all'>All Users</option>
              <option value='verified'>Verified</option>
              <option value='unverified'>Unverified</option>
              <option value='admin'>Admins</option>
              <option value='regular'>Regular Users</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  User
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Contact
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Role
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Joined
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {filteredUsers.map((user) => (
                <tr key={user._id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='flex-shrink-0 h-10 w-10'>
                        <div className='h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center'>
                          <FaUser className='h-5 w-5 text-blue-600' />
                        </div>
                      </div>
                      <div className='ml-4'>
                        <div className='text-sm font-medium text-gray-900'>
                          {user.name}
                        </div>
                        <div className='text-sm text-gray-500'>
                          ID: {user._id.slice(-8)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900 flex items-center mb-1'>
                      <FaEnvelope className='h-4 w-4 text-gray-400 mr-2' />
                      {user.email}
                    </div>
                    <div className='text-sm text-gray-500 flex items-center'>
                      <FaPhone className='h-4 w-4 text-gray-400 mr-2' />
                      {user.phone}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isVarify
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {user.isVarify ? (
                        <>
                          <FaCheckCircle className='h-3 w-3 mr-1' />
                          Verified
                        </>
                      ) : (
                        <>
                          <FaTimesCircle className='h-3 w-3 mr-1' />
                          Unverified
                        </>
                      )}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isAdmin
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user.isAdmin ? (
                        <>
                          <FaUserShield className='h-3 w-3 mr-1' />
                          Admin
                        </>
                      ) : (
                        <>
                          <FaUser className='h-3 w-3 mr-1' />
                          User
                        </>
                      )}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    <div className='flex items-center'>
                      <FaCalendarAlt className='h-4 w-4 text-gray-400 mr-2' />
                      {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                    <div className='flex items-center justify-end space-x-2'>
                      <button
                        onClick={() => handleEditUser(user)}
                        disabled={
                          !userInfo.superAdmin || userInfo._id === user._id
                        }
                        className='text-blue-600 hover:text-blue-900 disabled:text-gray-500 p-1 rounded'
                        title='Edit user'
                      >
                        <FaEdit className='h-4 w-4' />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        disabled={
                          !userInfo.superAdmin || userInfo._id === user._id
                        }
                        className='text-red-600 hover:text-red-900 disabled:text-gray-500 p-1 rounded'
                        title='Delete user'
                      >
                        <FaTrash className='h-4 w-4' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className='text-center py-12'>
            <FaUser className='mx-auto h-12 w-12 text-gray-400' />
            <h3 className='mt-2 text-sm font-medium text-gray-900'>
              No users found
            </h3>
            <p className='mt-1 text-sm text-gray-500'>
              {searchTerm || filterBy !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'No users have been registered yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50'>
          <div className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
            <div className='mt-3'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                Edit User
              </h3>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Name
                  </label>
                  <input
                    type='text'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Phone
                  </label>
                  <input
                    type='text'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      className='rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50'
                      checked={editForm.isAdmin}
                      onChange={(e) =>
                        setEditForm({ ...editForm, isAdmin: e.target.checked })
                      }
                    />
                    <span className='ml-2 text-sm text-gray-700'>
                      Admin privileges
                    </span>
                  </label>
                </div>
              </div>
              <div className='flex justify-end space-x-3 mt-6'>
                <button
                  onClick={() => setShowEditModal(false)}
                  className='px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400'
                >
                  Cancel
                </button>
                <button
                  onClick={submitEdit}
                  disabled={updateLoading}
                  className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50'
                >
                  {updateLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50'>
          <div className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
            <div className='mt-3 text-center'>
              <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100'>
                <FaTrash className='h-6 w-6 text-red-600' />
              </div>
              <h3 className='text-lg font-medium text-gray-900 mt-4'>
                Delete User
              </h3>
              <div className='mt-2 px-7 py-3'>
                <p className='text-sm text-gray-500'>
                  Are you sure you want to delete{' '}
                  <strong>{selectedUser?.name}</strong>? This action cannot be
                  undone.
                </p>
              </div>
              <div className='flex justify-center space-x-3 mt-4'>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className='px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400'
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleteLoading}
                  className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50'
                >
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
