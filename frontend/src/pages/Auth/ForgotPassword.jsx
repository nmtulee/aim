import { useState, useEffect } from 'react';
import {
  useSendVerificationPassMutation,
  useVerifyPassMutation,
} from '../../redux/api/usersApiSlice.js';
import { toast } from 'react-toastify';
import { useSelector,useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { setCredentials } from '../../redux/features/auth/authSlice.js';


const ForgotPassword = () => {

  const { userInfo } = useSelector((state) => state.auth);
  
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  const [sendVerification, { isLoading: isSending }] =
    useSendVerificationPassMutation();
  const [verifyCode, { isLoading: isVerifying }] = useVerifyPassMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();



  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';
  useEffect(() => {
    if (userInfo?.isVarify) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const handleSendCode = async (e) => {
    e.preventDefault();
    try {
         await sendVerification({ email }).unwrap();
        toast.success('Verification code sent to your email');
      setStep(2);
    } catch (err) {
      
      toast.error(err?.data?.message || 'Failed to send code');
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    try {
      
      
      const userData = await verifyCode({ email, code }).unwrap();
      dispatch(setCredentials({ ...userData }));
      toast.success("Code verified! You're logged in.");
      console.log(userData);
    } catch (err) {
      console.log(err);

      toast.error(err?.data?.message || 'Verification failed');
    }
  };

  return (
    <div className='pt-10 min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='w-full max-w-md bg-white shadow-lg rounded-xl p-6'>
        <h2 className='text-2xl font-bold mb-4 text-center text-blue-600'>
          {step === 1 ? 'Forgot Password' : 'Verify Code'}
        </h2>

        {step === 1 ? (
          <form onSubmit={handleSendCode} className='space-y-4'>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700'
              >
                Enter your email
              </label>
              <input
                type='email'
                id='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300'
              />
            </div>
            <button
              type='submit'
              disabled={isSending}
              className='w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50'
            >
              {isSending ? 'Sending...' : 'Send Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className='space-y-4'>
            <div>
              <label
                htmlFor='code'
                className='block text-sm font-medium text-gray-700'
              >
                Enter the 6-digit code
              </label>
              <input
                type='text'
                id='code'
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className='mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300'
              />
            </div>
            <button
              type='submit'
              disabled={isVerifying}
              className='w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50'
            >
              {isVerifying ? 'Verifying...' : 'Verify Code'}
            </button>
            <button
              type='button'
              onClick={() => setStep(1)}
              className='text-sm text-gray-500 hover:underline block text-center mt-2'
            >
              Go back to Email
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
