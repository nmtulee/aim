import { useState, useEffect } from 'react';
import {
  useUpdateUserProfileMutation,
  useUserProfileQuery,
} from '../../redux/api/usersApiSlice';
import { toast } from 'react-toastify';
import { LiaEyeSlashSolid, LiaEyeSolid } from 'react-icons/lia';

const Profile = () => {
  const { data: user, isLoading } = useUserProfileQuery();
  const [updateUser, { isLoading: updating }] = useUpdateUserProfileMutation();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const res = await updateUser({ name, phone, password }).unwrap();
      toast.success('Profile updated successfully');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update profile');
    }
  };

  if (isLoading) return <p className='text-center pt-10'>Loading profile...</p>;

  return (
    <div className='h-[100svh] flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 px-4'>
      <div className='w-full max-w-md p-6 bg-white shadow-2xl rounded-2xl'>
        <h2 className='text-3xl font-bold text-center text-blue-700 mb-6'>
          Update Profile
        </h2>
        <form onSubmit={submitHandler} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium'>Name</label>
            <input
              type='text'
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
          </div>
          <div>
            <label className='block text-sm font-medium'>Phone</label>
            <input
              type='text'
              value={phone}
              required
              onChange={(e) => setPhone(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
          </div>
          <div className='relative'>
            <label className='block text-sm font-medium'>New Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
            <button
              type='button'
              className='absolute right-3 top-9 text-xl text-gray-500'
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <LiaEyeSlashSolid /> : <LiaEyeSolid />}
            </button>
          </div>
          <div className='relative'>
            <label className='block text-sm font-medium'>
              Confirm Password
            </label>
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
            <button
              type='button'
              className='absolute right-3 top-9 text-xl text-gray-500'
              onClick={() => setShowConfirm((prev) => !prev)}
            >
              {showConfirm ? <LiaEyeSlashSolid /> : <LiaEyeSolid />}
            </button>
          </div>
          <button
            type='submit'
            disabled={updating}
            className='w-full bg-blue-600 hover:bg-blue-700 transition-all text-white py-2 px-4 rounded-md shadow-md hover:shadow-lg font-semibold'
          >
            {updating ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
