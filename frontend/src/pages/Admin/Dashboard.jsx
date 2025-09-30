import { Link } from 'react-router-dom';
import { useGetUsersQuery } from '../../redux/api/usersApiSlice.js';
import { useGetAllJobsQuery } from '../../redux/api/jobApiSlice.js';
import { useGetMessagesQuery } from '../../redux/api/messageApiSlice.js';

const Dashboard = () => {

  const { data: userData } = useGetUsersQuery();
  const { data: jobs } = useGetAllJobsQuery()
  const { data: messages } = useGetMessagesQuery()
  
  
  
  
  const menuItems = [
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/job', label: 'Jobs', icon: '💼' },
    { path: '/admin/blogs', label: 'Blogs', icon: '📝' },
    { path: '/admin/resumes', label: 'Resumes', icon: '📄' },
    { path: '/admin/category', label: 'Categories', icon: '📂' },
    { path: '/admin/messages', label: 'User Messages', icon: '💬' },
    { path: '/admin/applications', label: 'Job Applications', icon: '📬' },
    { path: '/admin/aboutCountrys', label: 'About Countrys', icon: '🌍' },
    { path: '/admin/language-course', label: 'Language Courses', icon: '🗣️' },
    { path: '/admin/team', label: 'Team Member', icon: '👤' },
    { path: '/admin/testimonial', label: 'Testimonials', icon: '⭐' },
    { path: '/admin/language-enroll', label: 'Language Enroll', icon: '🎓' },
  ];

  return (
    <div className='min-h-screen bg-gray-50 p-6 pt-20'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='bg-white rounded-lg shadow-md p-6 mb-8'>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>
            Admin Dashboard
          </h1>
          <p className='text-gray-600'>Manage your application from here</p>
        </div>

        {/* Navigation Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 group'
            >
              <div className='flex flex-col items-center text-center'>
                <div className='text-4xl mb-3 group-hover:scale-110 transition-transform duration-200'>
                  {item.icon}
                </div>
                <h3 className='text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200'>
                  {item.label}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Stats Section (Optional) */}
        <div className='mt-8 bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>
            Quick Overview
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='bg-blue-50 p-4 rounded-lg'>
              <h3 className='text-blue-800 font-medium'>Total Users</h3>
              <p className='text-2xl font-bold text-blue-600'>
                {userData?.length}
              </p>
            </div>
            <div className='bg-green-50 p-4 rounded-lg'>
              <h3 className='text-green-800 font-medium'>Active Jobs</h3>
              <p className='text-2xl font-bold text-green-600'>
                {jobs?.pagination.totalJobs || 0}
              </p>
            </div>
            <div className='bg-purple-50 p-4 rounded-lg'>
              <h3 className='text-purple-800 font-medium'>New Messages</h3>
              <p className='text-2xl font-bold text-purple-600'>{ messages?.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
