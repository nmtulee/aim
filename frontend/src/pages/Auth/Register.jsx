import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate,  Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LiaEyeSlashSolid, LiaEyeSolid } from 'react-icons/lia';

import { useCreateUserMutation,useSendVerificationCodeMutation } from '../../redux/api/usersApiSlice.js';
import { setCredentials } from '../../redux/features/auth/authSlice.js';
const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const [createUser, { isLoading }] = useCreateUserMutation();
  const [sendVerificationCode] = useSendVerificationCodeMutation();



  useEffect(() => {
    if (userInfo) {
      navigate('/verify');
    }
  }, [userInfo,  navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const res = await createUser({ name, email, password, phone }).unwrap();
      dispatch(setCredentials({ ...res }));
      const getMessage = await sendVerificationCode({ email: res.email }).unwrap();
      toast.success(getMessage.message);
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className='flex justify-center items-center w-full min-h-screen'>
      <form
        onSubmit={submitHandler}
        className='shadow-whites p-6 md:p-8 rounded-lg w-full max-w-sm md:max-w-md m-20 md:mt-0'
      >
        <h2 className='text-2xl font-bold mb-6 text-center'>Register</h2>

        <div className='mb-4'>
          <label htmlFor='name' className='block mb-1 font-medium'>
            Name
          </label>
          <input
            type='text'
            id='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder='Your name'
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500'
          />
        </div>

        <div className='mb-4'>
          <label htmlFor='email' className='block mb-1 font-medium'>
            Email
          </label>
          <input
            type='email'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete='email'
            placeholder='Enter your email'
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500'
          />
        </div>

        <div className='mb-4'>
          <label htmlFor='phone' className='block mb-1 font-medium'>
            Phone
          </label>
          <input
            type='text'
            id='phone'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder='Enter your phone'
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500'
          />
        </div>

        <div className='mb-4 relative'>
          <label htmlFor='password' className='block mb-1 font-medium'>
            Password
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder='Enter password'
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500'
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

        <div className='mb-6 relative'>
          <label htmlFor='confirmPassword' className='block mb-1 font-medium'>
            Confirm Password
          </label>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id='confirmPassword'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder='Confirm your password'
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500'
          />
          {confirmPassword.trim().length > 0 && (
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className='absolute right-4 top-10 cursor-pointer'
            >
              {showConfirmPassword ? (
                <LiaEyeSlashSolid size={22} />
              ) : (
                <LiaEyeSolid size={22} />
              )}
            </span>
          )}
        </div>

        <button
          type='submit'
          disabled={isLoading}
          className='w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200'
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>

        <div className='mt-4 text-center text-sm'>
          Already have an account?{' '}
          <Link to='/login' className='text-blue-600 hover:underline'>
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
