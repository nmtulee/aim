import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logout, setCredentials } from '../../redux/features/auth/authSlice.js';
import {
  useSendVerificationCodeMutation,
  useVerifyUserMutation,
} from '../../redux/api/usersApiSlice.js';
import { HiArrowLeft as ArrowLeft } from 'react-icons/hi';

const EmailVerify = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [code, setCode] = useState('');
  const [verifyUser, { isLoading }] = useVerifyUserMutation();
  const [sendVerificationCode] = useSendVerificationCodeMutation();
  const [timeLeft, setTimeLeft] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';
  useEffect(() => {
    if (userInfo?.isVarify) {
      navigate(redirect);
    }
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, redirect, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(1, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code || code.length < 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    } else {
      try {
        const res = await verifyUser({ email: userInfo.email, code }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success(res.message);
        navigate(redirect);
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };
  const handleClearCode = async () => {
    dispatch(logout());
    navigate(-1)
     
   }

  const resendCode = async () => {
    try {
      await sendVerificationCode({ email: userInfo.email }).unwrap();
      toast.success('Verification code resent to your email');
      setTimeLeft(5 * 60); // 5 minutes countdown
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to resend code');
    }
  };
  return (
    <div className='flex justify-center items-center min-h-[100svh] w-full py-16'>
      <div >
        <button
            onClick={handleClearCode}
            className='flex items-center text-gray-400 hover:text-gray-500 mb-4 transition-colors'
          >
            <ArrowLeft className='w-5 h-5 mr-2' />
            Back to Programs
        </button>


      <form
        onSubmit={handleSubmit}
        className='bg-white shadow-md p-8 rounded-lg w-full max-w-sm'
      >
        <h2 className='text-2xl font-bold mb-4 text-center'>
          Email Verification
        </h2>
        <p className='mb-4 text-sm text-gray-600 text-center'>
          A 6-digit code has been sent to your email address.
        </p>

        <div className='mb-4'>
          <label htmlFor='code' className='block mb-1 font-medium'>
            Verification Code
          </label>
          <input
            type='text'
            id='code'
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500'
            placeholder='Enter 6-digit code'
            required
          />
        </div>

        <button
          type='submit'
          disabled={isLoading}
          className='w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200'
        >
          {isLoading ? 'Verifying...' : 'Verify Email'}
        </button>

        <div className='mt-4 text-center'>
          <button
            type='button'
            onClick={resendCode}
            disabled={timeLeft > 0}
            className={`text-sm ${
              timeLeft > 0
                ? `${
                    timeLeft <= 120
                      ? 'text-red-600'
                      : 'text-gray-500 cursor-not-allowed'
                  } `
                : 'text-blue-600 hover:underline'
            } `}
          >
            {timeLeft > 0
              ? `Resend Code (${formatTime(timeLeft)})`
              : 'Resend Code'}
          </button>
        </div>
        
      </form>
      </div>
    </div>
  );
};

export default EmailVerify;
