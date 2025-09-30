import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  useGetBlogsQuery,
  useDeleteBlogMutation,
  useGetBlogsStatsQuery,
  useGetAllBlogsNoPaginationQuery,
} from '../../redux/api/blogApiSlice';
import { useDeleteImgMutation } from '../../redux/api/imgUploadApiSlise.js';
import ConfirmationDialog from '../../components/ConfirmationDialog.jsx';
import {
  FaBlog,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaChartLine,
  FaUsers,
  FaEye,
  FaCalendarAlt,
  FaComments,
  FaUser,
  FaExclamationCircle,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminBlog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlogs, setSelectedBlogs] = useState([]);

  // Confirmation dialog states
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: null, // 'single' or 'bulk'
    blogId: null,
    blogImage: null,
    message: '',
  });

  const { data: blogsData, isLoading } = useGetAllBlogsNoPaginationQuery();
  const { data: stats = {}, isLoading: statsLoading } = useGetBlogsStatsQuery();
  const [deleteBlog, { isLoading: deleteLoading }] = useDeleteBlogMutation();
  const [deleteImg] = useDeleteImgMutation();

  // Extract blogs array from the response
  const blogs = blogsData || [];

  // Filter blogs based on search
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch =
        blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [blogs, searchTerm]);

  const openDeleteConfirmation = (id, image) => {
    setConfirmDialog({
      isOpen: true,
      type: 'single',
      blogId: id,
      blogImage: image,
      message: 'Are you sure you want to delete this blog?',
    });
  };

  const openBulkDeleteConfirmation = () => {
    if (selectedBlogs.length === 0) return;

    setConfirmDialog({
      isOpen: true,
      type: 'bulk',
      blogId: null,
      blogImage: null,
      message: `Are you sure you want to delete ${selectedBlogs.length} selected blogs?`,
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      isOpen: false,
      type: null,
      blogId: null,
      blogImage: null,
      message: '',
    });
  };

  const handleConfirmDelete = async () => {
    try {
      if (confirmDialog.type === 'single') {
        await deleteBlog(confirmDialog.blogId).unwrap();
        if (confirmDialog.blogImage) {
          const filename = confirmDialog.blogImage.split('/').pop();
          await deleteImg(filename);
        }
        toast.success('Blog deleted successfully');
      } else if (confirmDialog.type === 'bulk') {
        // Get blog details for selected blogs to extract images
        const selectedBlogsData = blogs.filter((blog) =>
          selectedBlogs.includes(blog._id)
        );

        for (const blog of selectedBlogsData) {
          await deleteBlog(blog._id).unwrap();
          // Delete associated image if it exists
          if (blog.image) {
            const filename = blog.image.split('/').pop();
            await deleteImg(filename);
          }
        }
        setSelectedBlogs([]);
        toast.success(`${selectedBlogs.length} blogs deleted successfully`);
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to delete blog(s)');
    } finally {
      closeConfirmDialog();
    }
  };

  const handleSelectBlog = (blogId) => {
    setSelectedBlogs((prev) =>
      prev.includes(blogId)
        ? prev.filter((id) => id !== blogId)
        : [...prev, blogId]
    );
  };

  const handleSelectAll = () => {
    if (selectedBlogs.length === filteredBlogs.length) {
      setSelectedBlogs([]);
    } else {
      setSelectedBlogs(filteredBlogs.map((blog) => blog._id));
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

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
        <span className='ml-3 text-gray-600'>Loading blogs...</span>
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
                <FaBlog className='text-blue-600' />
                Admin Blog Dashboard
              </h2>
              <p className='text-gray-600 mt-1'>
                Manage and monitor all blog posts
              </p>
            </div>
            <Link
              to='/admin/createblog'
              className='bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg flex items-center gap-2 transition-colors text-sm md:text-base'
            >
              <FaPlus size={18} />
              Create Blog
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        {!statsLoading && stats && (
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6'>
            <div className='bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs md:text-sm font-medium text-gray-600'>
                    Total Blogs
                  </p>
                  <p className='text-xl md:text-2xl font-bold text-gray-900'>
                    {stats.totalBlogs || 0}
                  </p>
                </div>
                <div className='bg-blue-100 p-2 md:p-3 rounded-full'>
                  <FaBlog className='text-blue-600' size={20} />
                </div>
              </div>
            </div>

            <div className='bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs md:text-sm font-medium text-gray-600'>
                    Total Reviews
                  </p>
                  <p className='text-xl md:text-2xl font-bold text-green-600'>
                    {stats.totalReviews || 0}
                  </p>
                </div>
                <div className='bg-green-100 p-2 md:p-3 rounded-full'>
                  <FaComments className='text-green-600' size={20} />
                </div>
              </div>
            </div>

            <div className='bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs md:text-sm font-medium text-gray-600'>
                    Active Authors
                  </p>
                  <p className='text-xl md:text-2xl font-bold text-purple-600'>
                    {stats.activeAuthors || 0}
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
                    Avg Reviews
                  </p>
                  <p className='text-xl md:text-2xl font-bold text-orange-600'>
                    {stats.averageReviews || 0}
                  </p>
                </div>
                <div className='bg-orange-100 p-2 md:p-3 rounded-full'>
                  <FaChartLine className='text-orange-600' size={20} />
                </div>
              </div>
            </div>
          </div>
        )}

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
                  placeholder='Search blogs by title, description, or author...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                />
              </div>
            </div>
          </div>
        </div>

        {/* Blogs Table */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
          <div className='px-4 md:px-6 py-4 border-b border-gray-200 flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Blogs ({filteredBlogs.length})
              </h3>
              {selectedBlogs.length > 0 && (
                <div className='text-sm text-gray-600'>
                  {selectedBlogs.length} selected
                </div>
              )}
            </div>
            {selectedBlogs.length > 0 && (
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
                        selectedBlogs.length === filteredBlogs.length &&
                        filteredBlogs.length > 0
                      }
                      onChange={handleSelectAll}
                      className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                    />
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Blog Details
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Author
                  </th>
                  <th className='px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Reviews
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
                {filteredBlogs.map((blog) => (
                  <tr key={blog._id} className='hover:bg-gray-50'>
                    <td className='px-4 md:px-6 py-4'>
                      <input
                        type='checkbox'
                        checked={selectedBlogs.includes(blog._id)}
                        onChange={() => handleSelectBlog(blog._id)}
                        className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                      />
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <div className='flex items-start gap-3'>
                        {blog.image && (
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className='w-16 h-16 object-cover rounded-lg flex-shrink-0'
                          />
                        )}
                        <div className='min-w-0 flex-1'>
                          <h4 className='text-sm font-medium text-gray-900 mb-1'>
                            {blog.title || 'N/A'}
                          </h4>
                          <p className='text-xs text-gray-500'>
                            {truncateText(blog.description, 80)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <div className='flex items-center gap-2'>
                        <FaUser size={14} className='text-gray-400' />
                        <span className='text-sm text-gray-900'>
                          {blog.user?.name || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <div className='flex items-center gap-1'>
                        <FaComments size={14} className='text-gray-400' />
                        <span className='text-sm text-gray-900'>
                          {blog.reviews?.length || 0}
                        </span>
                      </div>
                    </td>
                    <td className='px-4 md:px-6 py-4 text-sm text-gray-500'>
                      {formatDate(blog.createdAt)}
                    </td>
                    <td className='px-4 md:px-6 py-4'>
                      <div className='flex items-center gap-2'>
                        <Link
                          to={`/blog/${blog._id}`}
                          className='p-1 text-gray-400 hover:text-blue-600 transition-colors'
                          title='View Blog'
                        >
                          <FaEye size={16} />
                        </Link>
                        <Link
                          to={`/admin/updateblog/${blog._id}`}
                          className='p-1 text-gray-400 hover:text-green-600 transition-colors'
                          title='Edit Blog'
                        >
                          <FaEdit size={16} />
                        </Link>
                        <button
                          className='p-1 text-gray-400 hover:text-red-600 transition-colors'
                          title='Delete Blog'
                          onClick={() =>
                            openDeleteConfirmation(blog._id, blog.image)
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

          {filteredBlogs.length === 0 && (
            <div className='text-center py-12'>
              <FaBlog className='mx-auto h-12 w-12 text-gray-400' />
              <h3 className='mt-2 text-sm font-medium text-gray-900'>
                No blogs found
              </h3>
              <p className='mt-1 text-sm text-gray-500'>
                {blogs.length === 0
                  ? 'No blogs available.'
                  : 'Try adjusting your search criteria.'}
              </p>
            </div>
          )}
        </div>

        {/* Blog Stats - Most Reviewed Blogs */}
        {stats && stats.blogsWithMostReviews && (
          <div className='mt-8'>
            <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Most Reviewed Blogs
              </h3>
              <div className='space-y-3'>
                {stats.blogsWithMostReviews.slice(0, 5).map((blog, index) => (
                  <div
                    key={blog._id}
                    className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
                  >
                    <div className='flex items-center gap-3'>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                          index === 0
                            ? 'bg-yellow-500'
                            : index === 1
                            ? 'bg-gray-400'
                            : index === 2
                            ? 'bg-orange-600'
                            : 'bg-blue-500'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <h4 className='text-sm font-medium text-gray-900'>
                          {blog.title}
                        </h4>
                        <p className='text-xs text-gray-500'>
                          by {blog.user?.name}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center gap-1'>
                      <FaComments className='text-gray-400' size={14} />
                      <span className='text-sm font-medium text-gray-900'>
                        {blog.reviews?.length || 0}
                      </span>
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

export default AdminBlog;
