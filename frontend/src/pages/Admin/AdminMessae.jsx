import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  useGetMessagesQuery,
  useDeleteMessageMutation,
  useGetMessageByIdQuery,
} from '../../redux/api/messageApiSlice';
import ConfirmationDialog from '../../components/ConfirmationDialog.jsx';
import {
  FaEnvelope,
  FaEnvelopeOpen,
  FaTrash,
  FaSearch,
  FaEye,
  FaCalendarAlt,
  FaUser,
  FaTag,
  FaExclamationCircle,
  FaInbox,
  FaClock,
  FaReply,
  FaSortAmountDown,
  FaSortAmountUp,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminMessage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, name, email
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);

  // Confirmation dialog states
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: null, // 'single' or 'bulk'
    messageId: null,
    message: '',
  });

  const { data: messages = [], isLoading } = useGetMessagesQuery();
  const [deleteMessage, { isLoading: deleteLoading }] =
    useDeleteMessageMutation();

  // Get message details for modal
  const { data: messageDetails } = useGetMessageByIdQuery(selectedMessage, {
    skip: !selectedMessage,
  });

  // Calculate stats
  const stats = useMemo(() => {
    const total = messages.length;
    const today = new Date();
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const todayCount = messages.filter(
      (msg) => new Date(msg.createdAt) >= todayStart
    ).length;
    const weekCount = messages.filter(
      (msg) => new Date(msg.createdAt) >= weekAgo
    ).length;

    // Get unique senders
    const uniqueSenders = new Set(messages.map((msg) => msg.email)).size;

    return {
      total,
      today: todayCount,
      thisWeek: weekCount,
      uniqueSenders,
    };
  }, [messages]);

  // Filter and sort messages
  const filteredAndSortedMessages = useMemo(() => {
    let filtered = messages.filter((message) => {
      const matchesSearch =
        message.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });

    // Sort messages
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'email':
          return (a.email || '').localeCompare(b.email || '');
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return filtered;
  }, [messages, searchTerm, sortBy]);

  const openDeleteConfirmation = (id) => {
    setConfirmDialog({
      isOpen: true,
      type: 'single',
      messageId: id,
      message: 'Are you sure you want to delete this message?',
    });
  };

  const openBulkDeleteConfirmation = () => {
    if (selectedMessages.length === 0) return;

    setConfirmDialog({
      isOpen: true,
      type: 'bulk',
      messageId: null,
      message: `Are you sure you want to delete ${selectedMessages.length} selected messages?`,
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      isOpen: false,
      type: null,
      messageId: null,
      message: '',
    });
  };

  const handleConfirmDelete = async () => {
    try {
      if (confirmDialog.type === 'single') {
        await deleteMessage(confirmDialog.messageId).unwrap();
        toast.success('Message deleted successfully');
      } else if (confirmDialog.type === 'bulk') {
        for (const messageId of selectedMessages) {
          await deleteMessage(messageId).unwrap();
        }
        setSelectedMessages([]);
        toast.success(
          `${selectedMessages.length} messages deleted successfully`
        );
      }
      closeConfirmDialog();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to delete message(s)');
    }
  };

  const handleSelectMessage = (messageId) => {
    setSelectedMessages((prev) =>
      prev.includes(messageId)
        ? prev.filter((id) => id !== messageId)
        : [...prev, messageId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMessages.length === filteredAndSortedMessages.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(
        filteredAndSortedMessages.map((message) => message._id)
      );
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

  const truncateText = (text, maxLength = 100) => {
    if (!text) return 'N/A';
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  };

  const handleViewMessage = (messageId) => {
    setSelectedMessage(messageId);
    setShowMessageModal(true);
  };

  const closeMessageModal = () => {
    setShowMessageModal(false);
    setSelectedMessage(null);
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
        <span className='ml-3 text-gray-600'>Loading messages...</span>
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
                <FaEnvelope className='text-blue-600' />
                Admin Message Center
              </h2>
              <p className='text-gray-600 mt-1'>
                Manage and respond to customer messages
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
                  Total Messages
                </p>
                <p className='text-xl md:text-2xl font-bold text-gray-900'>
                  {stats.total}
                </p>
              </div>
              <div className='bg-blue-100 p-2 md:p-3 rounded-full'>
                <FaInbox className='text-blue-600' size={20} />
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs md:text-sm font-medium text-gray-600'>
                  Today
                </p>
                <p className='text-xl md:text-2xl font-bold text-green-600'>
                  {stats.today}
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
                  This Week
                </p>
                <p className='text-xl md:text-2xl font-bold text-orange-600'>
                  {stats.thisWeek}
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
                  Unique Senders
                </p>
                <p className='text-xl md:text-2xl font-bold text-purple-600'>
                  {stats.uniqueSenders}
                </p>
              </div>
              <div className='bg-purple-100 p-2 md:p-3 rounded-full'>
                <FaUser className='text-purple-600' size={20} />
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
                  placeholder='Search messages by name, email, subject, or content...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                />
              </div>
            </div>

            {/* Sort */}
            <div className='lg:w-48'>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
              >
                <option value='newest'>Newest First</option>
                <option value='oldest'>Oldest First</option>
                <option value='name'>Sort by Name</option>
                <option value='email'>Sort by Email</option>
              </select>
            </div>
          </div>
        </div>

        {/* Messages Table */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
          <div className='px-4 md:px-6 py-4 border-b border-gray-200 flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Messages ({filteredAndSortedMessages.length})
              </h3>
              {selectedMessages.length > 0 && (
                <div className='text-sm text-gray-600'>
                  {selectedMessages.length} selected
                </div>
              )}
            </div>
            {selectedMessages.length > 0 && (
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
                        selectedMessages.length ===
                          filteredAndSortedMessages.length &&
                        filteredAndSortedMessages.length > 0
                      }
                      onChange={handleSelectAll}
                      className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                    />
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Sender
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Subject
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Message Preview
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Received
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredAndSortedMessages.map((message) => (
                  <tr key={message._id} className='hover:bg-gray-50'>
                    <td className='px-4 md:px-6 py-4'>
                      <input
                        type='checkbox'
                        checked={selectedMessages.includes(message._id)}
                        onChange={() => handleSelectMessage(message._id)}
                        className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                      />
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <div>
                        <div className='flex items-center gap-2'>
                          <FaUser size={14} className='text-gray-400' />
                          <h4 className='text-sm font-medium text-gray-900'>
                            {message.name || 'N/A'}
                          </h4>
                        </div>
                        <p className='text-xs text-gray-500 mt-1'>
                          {message.email || 'N/A'}
                        </p>
                      </div>
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <div className='flex items-center gap-1'>
                        <FaTag size={14} className='text-gray-400' />
                        <span className='text-sm text-gray-900'>
                          {truncateText(message.subject, 50)}
                        </span>
                      </div>
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <p className='text-sm text-gray-600'>
                        {truncateText(message.message, 80)}
                      </p>
                    </td>
                    <td className='px-4 md:px-6 py-4 text-sm text-gray-500'>
                      {formatDate(message.createdAt)}
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <div className='flex items-center gap-2'>
                        <button
                          onClick={() => handleViewMessage(message._id)}
                          className='p-1 text-gray-400 hover:text-blue-600 transition-colors'
                          title='View Message'
                        >
                          <FaEye size={16} />
                        </button>
                        <button
                          className='p-1 text-gray-400 hover:text-red-600 transition-colors'
                          title='Delete Message'
                          onClick={() => openDeleteConfirmation(message._id)}
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

          {filteredAndSortedMessages.length === 0 && (
            <div className='text-center py-12'>
              <FaEnvelope className='mx-auto h-12 w-12 text-gray-400' />
              <h3 className='mt-2 text-sm font-medium text-gray-900'>
                No messages found
              </h3>
              <p className='mt-1 text-sm text-gray-500'>
                {messages.length === 0
                  ? 'No messages available.'
                  : 'Try adjusting your search criteria.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Message Details Modal */}
      {showMessageModal && messageDetails && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='p-6 border-b border-gray-200'>
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  Message Details
                </h3>
                <button
                  onClick={closeMessageModal}
                  className='text-gray-400 hover:text-gray-600'
                >
                  <svg
                    className='w-6 h-6'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className='p-6 space-y-4'>
              <div>
                <label className='text-sm font-medium text-gray-500'>
                  From
                </label>
                <p className='text-gray-900'>{messageDetails.name}</p>
                <p className='text-sm text-gray-500'>{messageDetails.email}</p>
              </div>
              <div>
                <label className='text-sm font-medium text-gray-500'>
                  Subject
                </label>
                <p className='text-gray-900'>{messageDetails.subject}</p>
              </div>
              <div>
                <label className='text-sm font-medium text-gray-500'>
                  Received
                </label>
                <p className='text-gray-900'>
                  {formatDate(messageDetails.createdAt)}
                </p>
              </div>
              <div>
                <label className='text-sm font-medium text-gray-500'>
                  Message
                </label>
                <div className='bg-gray-50 rounded-lg p-4 mt-2'>
                  <p className='text-gray-900 whitespace-pre-wrap'>
                    {messageDetails.message}
                  </p>
                </div>
              </div>
            </div>
            <div className='p-6 border-t border-gray-200 flex justify-end gap-3'>
              <button
                onClick={closeMessageModal}
                className='px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200'
              >
                Close
              </button>
              
            </div>
          </div>
        </div>
      )}

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

export default AdminMessage;
