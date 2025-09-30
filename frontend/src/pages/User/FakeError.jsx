// src/pages/ErrorPage.jsx
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const ErrorPage = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-50 px-4 text-center'>
      <FaExclamationTriangle className='text-red-500 text-6xl mb-6' />
      <h1 className='text-5xl font-bold text-gray-900 mb-4'>404</h1>
      <p className='text-xl text-gray-700 mb-6'>
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <Link
        to='/'
        className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
      >
        Go Home
      </Link>
    </div>
  );
};

export default ErrorPage;
