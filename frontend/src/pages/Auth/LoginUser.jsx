import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLoginUserMutation } from '../../redux/api/usersApiSlice.js';
import { LiaEyeSlashSolid, LiaEyeSolid } from 'react-icons/lia';
import { toast } from 'react-toastify';
import { setCredentials } from '../../redux/features/auth/authSlice.js';
const LoginUser = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const [loginUser, { isLoading: loginLoading }] = useLoginUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(userInfo?.isVarify ? redirect : '/verify');
    }
  }, [navigate, redirect, userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className='flex justify-center items-center w-full min-h-screen'>
      <form
        onSubmit={handleSubmit}
        className='  shadow-whites p-6 md:p-8 rounded-lg  w-full max-w-sm md:max-w-md  mt-20 md:mt-0'
      >
        <h2 className='text-2xl font-bold mb-6 text-center'>Login</h2>

        <div className='mb-4'>
          <label htmlFor='email' className='block mb-1 font-medium'>
            Email
          </label>
          <input
            type='email'
            id='email'
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete='email'
            placeholder='Enter your email'
          />
        </div>

        <div className='mb-6 relative'>
          <label htmlFor='password' className='flex  mb-1 font-medium'>
            Password
          </label>
          <input
            type={`${showPassword ? 'text' : 'password'}`}
            id='password'
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder='Enter your password'
          />
          {password.trim().length > 0 && (
            <span
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-4 top-10 cursor-pointer'
            >
              {showPassword ? (
                <LiaEyeSlashSolid size={22} />
              ) : (
                <LiaEyeSolid size={22} />
              )}
            </span>
          )}
        </div>
        <div className='mb-4 text-right'>
          <Link
            to='/forgot-password'
            className='text-sm text-blue-600 hover:underline'
          >
            Forgot password?
          </Link>
        </div>

        <button
          type='submit'
          disabled={loginLoading}
          className='w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200'
        >
          {loginLoading ? 'Logging in...' : 'Login'}
        </button>

        <div className='mt-4 text-center text-sm'>
          Don’t have an account?{' '}
          <Link to='/register' className='text-blue-600 hover:underline'>
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginUser;
