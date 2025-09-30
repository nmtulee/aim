import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useGetTestimonialByIdAdminQuery,
  useUpdateTestimonialByIdMutation,
} from '../../redux/api/testimonialApiSlice.js';
import {
  useUploadPhotoMutation,
  useDeletePhotoMutation,
} from '../../redux/api/photoApiSlice.js';

const UpdateTestimonialById = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // States
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [country, setCountry] = useState('');
  const [rating, setRating] = useState('');
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  // Queries & Mutations
  const { data: testimonial } = useGetTestimonialByIdAdminQuery(id);
  const [uploadPhoto] = useUploadPhotoMutation();
  const [deletePhoto] = useDeletePhotoMutation();
  const [updateTestimonial] = useUpdateTestimonialByIdMutation();

  // Prefill form with testimonial data
  useEffect(() => {
    if (testimonial?.data) {
      setTitle(testimonial.data.title || '');
      setMessage(testimonial.data.message || '');
      setCountry(testimonial.data.country || '');
      setRating(testimonial.data.rating || '');
      setPhoto(testimonial.data.photo || null);
    }
  }, [testimonial]);

  // Check if form changed
  const isChanged =
    title !== (testimonial?.data?.title || '') ||
    message !== (testimonial?.data?.message || '') ||
    country !== (testimonial?.data?.country || '') ||
    rating !== (testimonial?.data?.rating || '') ||
    photo !== (testimonial?.data?.photo || null);

  // Photo upload
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (photo) {
      const photoName = photo.split('/').pop();
      await deletePhoto(photoName).unwrap();
      setPhoto(null);
      toast.success('Previous photo deleted');
    }

    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await uploadPhoto(formData).unwrap();
      setPhoto(res.image);
      toast.success('Photo uploaded');
    } catch (err) {
      toast.error(err?.data?.message || 'Photo upload failed');
    }
  };

  // Remove photo
  const removePhoto = async () => {
    if (!photo) return;
    const photoName = photo.split('/').pop();
    await deletePhoto(photoName).unwrap();
    setPhoto(null);
    toast.success('Photo removed');
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !message || !country || !rating) {
      toast.error('Please fill out all fields');
      return;
    }

    setLoading(true);
    try {
      await updateTestimonial({
        id,
        title,
        message,
        country,
        rating,
        photo,
      }).unwrap();

      toast.success('Testimonial updated successfully');
      navigate('/admin/testimonial');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update testimonial');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 pt-10 sm:pt-0 my-20'>
      <div className='w-full max-w-xl px-4 sm:px-6 py-8 mx-auto bg-white shadow-lg rounded-2xl'>
        <h2 className='text-2xl font-semibold text-gray-800 mb-6 text-center'>
          Update Testimonial
        </h2>
        <form onSubmit={handleSubmit} className='space-y-5'>
          {/* Title */}
          <div>
            <label className='block mb-1 font-medium text-gray-700'>
              Title
            </label>
            <input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base'
            />
          </div>

          {/* Message */}
          <div>
            <label className='block mb-1 font-medium text-gray-700'>
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows='4'
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base'
            />
          </div>

          {/* Country */}
          <div>
            <label className='block mb-1 font-medium text-gray-700'>
              Country
            </label>
            <input
              type='text'
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base'
            />
          </div>

          {/* Rating */}
          <div>
            <label className='block mb-1 font-medium text-gray-700'>
              Rating (1–5)
            </label>
            <input
              type='number'
              min='1'
              max='5'
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base'
            />
          </div>

          {/* Photo */}
          <div>
            <label className='block mb-1 font-medium text-gray-700'>
              Upload Photo
            </label>
            <input
              type='file'
              accept='image/*'
              onChange={handlePhotoUpload}
              className='w-full cursor-pointer border border-gray-300 rounded-lg p-2'
            />
            {photo && (
              <div className='flex items-center gap-4 mt-2'>
                <img
                  src={photo}
                  alt='Uploaded'
                  className='w-20 h-20 object-cover rounded-md border'
                />
                <button
                  type='button'
                  onClick={removePhoto}
                  className='text-sm text-red-600 underline'
                >
                  Remove photo
                </button>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type='submit'
            disabled={loading || !isChanged}
            className={`w-full py-3 rounded-2xl font-semibold text-white transform transition-all ${
              !isChanged
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105'
            }`}
          >
            {loading ? 'Updating...' : 'Update Testimonial'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateTestimonialById;
