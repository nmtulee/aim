import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
  useDeletePhotoMutation,
  useUploadPhotoMutation,
} from '../../redux/api/photoApiSlice.js';
import {
  useCreateTestimonialMutation,
  useGetMyTestimonialQuery,
} from '../../redux/api/testimonialApiSlice.js';

const CreateTestimonial = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    photo: '',
    country: '',
    jobTitle: '',
    rating: 5,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const { data: testimonial, isLoading: isCheckingExisting } =
    useGetMyTestimonialQuery();
  const [uploadImg] = useUploadPhotoMutation();
  const [deleteImg] = useDeletePhotoMutation();
  const [createTestimonial, { isLoading: isCreating }] =
    useCreateTestimonialMutation();

  // Redirect if testimonial already exists
  useEffect(() => {
    if (testimonial) {
      toast.info(
        'You already have a testimonial. Redirecting to update page...'
      );
      navigate('/update-testimonial');
    }
  }, [testimonial, navigate]);

  // Real-time validation
  const validateField = (name, value) => {
    const errors = {};

    switch (name) {
      case 'title':
        if (!value.trim()) errors.title = 'Title is required';
        else if (value.trim().length < 3)
          errors.title = 'Title must be at least 3 characters';
        else if (value.length > 100)
          errors.title = 'Title cannot exceed 100 characters';
        break;

      case 'message':
        if (!value.trim()) errors.message = 'Message is required';
        else if (value.trim().length < 10)
          errors.message = 'Message must be at least 10 characters';
        else if (value.length > 1000)
          errors.message = 'Message cannot exceed 1000 characters';
        break;

      case 'country':
        if (!value.trim()) errors.country = 'Country is required';
        else if (value.trim().length < 2)
          errors.country = 'Country must be at least 2 characters';
        break;

      case 'jobTitle':
        if (!value.trim()) errors.jobTitle = 'Job title is required';
        else if (value.trim().length < 2)
          errors.jobTitle = 'Job title must be at least 2 characters';
        break;

      case 'photo':
        if (!value) errors.photo = 'Profile photo is required';
        break;
    }

    return errors;
  };

  // Handle input changes with validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Real-time validation for better UX
    const fieldErrors = validateField(name, value);
    if (Object.keys(fieldErrors).length > 0) {
      setValidationErrors((prev) => ({ ...prev, ...fieldErrors }));
    }
  };

  // Handle rating change
  const handleRatingChange = (rating) => {
    setFormData((prev) => ({
      ...prev,
      rating,
    }));
  };

  // Enhanced image upload handler
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file (JPG, PNG, GIF)');
      e.target.value = null; // Reset input
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      e.target.value = null; // Reset input
      return;
    }

    setIsUploading(true);

    try {
      // Delete old image if exists
      if (formData.photo) {
        const photoName = formData.photo.split('/').pop();
        await deleteImg(photoName).unwrap();
        toast.success('Previous photo deleted');
      }

      // Upload new image
      const formDataImg = new FormData();
      formDataImg.append('image', file);

      const res = await uploadImg(formDataImg).unwrap();
      const photoUrl = res.image || res.imageUrl || res.data?.url || res.url;

      setFormData((prev) => ({
        ...prev,
        photo: photoUrl,
      }));

      // Clear photo validation error
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.photo;
        return newErrors;
      });

      toast.success(res.message || 'Photo uploaded successfully');
    } catch (err) {
      console.error('Photo upload error:', err);
      toast.error(err?.data?.message || 'Failed to upload photo');
    } finally {
      setIsUploading(false);
      e.target.value = null; // Reset input so next upload works
    }
  };
  // Enhanced image removal (like in resume)
  const removePhoto = async () => {
    if (!formData.photo) return;

    try {
      const photoName = formData.photo.split('/').pop();
      await deleteImg(photoName).unwrap();

      setFormData((prev) => ({ ...prev, photo: '' }));
      setValidationErrors((prev) => ({
        ...prev,
        photo: 'Profile photo is required',
      }));

      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = null;

      toast.success('Photo removed successfully');
    } catch (err) {
      console.error('Photo removal error:', err);
      toast.error('Failed to remove photo');
    }
  };
  

  // Enhanced form validation
  const validateForm = () => {
    const errors = {};

    // Validate all fields
    Object.keys(formData).forEach((key) => {
      if (key !== 'rating') {
        // Skip rating as it always has a default value
        const fieldErrors = validateField(key, formData[key]);
        Object.assign(errors, fieldErrors);
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Enhanced form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      toast.error('Please fix all validation errors before submitting');
      navigate(-1)
      return;
    }

    try {
      const response = await createTestimonial({
        title: formData.title.trim(),
        message: formData.message.trim(),
        photo: formData.photo,
        country: formData.country.trim(),
        jobTitle: formData.jobTitle.trim(),
        rating: formData.rating,
      }).unwrap();

      if (response.success) {
        toast.success(
          response.message ||
            'Testimonial created successfully! It will be reviewed for approval.'
        );

        // Reset form
        setFormData({
          title: '',
          message: '',
          photo: '',
          country: '',
          jobTitle: '',
          rating: 5,
        });
        setValidationErrors({});

        // Navigate to testimonials page
        navigate('/testimonials');
      }
    } catch (error) {
      console.error('Create testimonial error:', error);
      toast.error(error?.data?.message || 'Failed to create testimonial');
    }
  };

  // Show loading state while checking existing testimonial
  if (isCheckingExisting) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Checking your testimonial status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16 px-4'>
      <div className='max-w-4xl mx-auto'>
        {/* Enhanced Header */}
        <div className='text-center mb-12'>
          <div className='inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-2 mb-6'>
            <svg
              className='w-5 h-5 text-blue-600 mr-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
              />
            </svg>
            <span className='text-blue-800 font-semibold'>
              Share Your Story
            </span>
          </div>
          <h1 className='text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4'>
            Create Your Testimonial
          </h1>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            Share your journey and inspire others with your authentic experience
          </p>
        </div>

        {/* Main Form Container */}
        <div className='bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden'>
          <div className='p-8 md:p-12'>
            <form onSubmit={handleSubmit} className='space-y-8'>
              {/* Title Input */}
              <div className='group'>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Testimonial Title *
                </label>
                <input
                  type='text'
                  name='title'
                  placeholder='Give your testimonial a compelling title...'
                  value={formData.title}
                  onChange={handleInputChange}
                  maxLength={100}
                  className={`w-full bg-white/80 border-2 px-6 py-4 rounded-2xl focus:outline-none focus:ring-4 transition-all duration-300 text-lg placeholder-gray-400 group-hover:border-gray-300 ${
                    validationErrors.title
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                  required
                />
                <div className='mt-1 flex justify-between items-center'>
                  {validationErrors.title && (
                    <span className='text-red-500 text-sm'>
                      {validationErrors.title}
                    </span>
                  )}
                  <span
                    className={`text-sm ml-auto ${
                      formData.title.length > 90
                        ? 'text-red-500'
                        : 'text-gray-500'
                    }`}
                  >
                    {formData.title.length}/100
                  </span>
                </div>
              </div>

              {/* Message Textarea */}
              <div className='group'>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Your Experience *
                </label>
                <textarea
                  name='message'
                  placeholder='Share your experience, journey, challenges overcome, and what you learned...'
                  value={formData.message}
                  onChange={handleInputChange}
                  className={`w-full bg-white/80 border-2 px-6 py-4 rounded-2xl resize-none focus:outline-none focus:ring-4 transition-all duration-300 text-lg placeholder-gray-400 group-hover:border-gray-300 ${
                    validationErrors.message
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                  rows={8}
                  maxLength={1000}
                  required
                />
                <div className='mt-1 flex justify-between items-center'>
                  {validationErrors.message && (
                    <span className='text-red-500 text-sm'>
                      {validationErrors.message}
                    </span>
                  )}
                  <span
                    className={`text-sm ml-auto ${
                      formData.message.length > 950
                        ? 'text-red-500'
                        : 'text-gray-500'
                    }`}
                  >
                    {formData.message.length}/1000
                  </span>
                </div>
              </div>

              {/* Country and Job Title */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='group'>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    Country *
                  </label>
                  <input
                    type='text'
                    name='country'
                    placeholder='Your country...'
                    value={formData.country}
                    onChange={handleInputChange}
                    className={`w-full bg-white/80 border-2 px-6 py-4 rounded-2xl focus:outline-none focus:ring-4 transition-all duration-300 text-lg placeholder-gray-400 group-hover:border-gray-300 ${
                      validationErrors.country
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                        : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                    }`}
                    required
                  />
                  {validationErrors.country && (
                    <span className='text-red-500 text-sm mt-1 block'>
                      {validationErrors.country}
                    </span>
                  )}
                </div>

                <div className='group'>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    Job Title *
                  </label>
                  <input
                    type='text'
                    name='jobTitle'
                    placeholder='Your job title...'
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    className={`w-full bg-white/80 border-2 px-6 py-4 rounded-2xl focus:outline-none focus:ring-4 transition-all duration-300 text-lg placeholder-gray-400 group-hover:border-gray-300 ${
                      validationErrors.jobTitle
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                        : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                    }`}
                    required
                  />
                  {validationErrors.jobTitle && (
                    <span className='text-red-500 text-sm mt-1 block'>
                      {validationErrors.jobTitle}
                    </span>
                  )}
                </div>
              </div>

              {/* Rating Section */}
              <div className='group'>
                <label className='block text-sm font-semibold text-gray-700 mb-4'>
                  Rate Your Experience
                </label>
                <div className='flex items-center justify-center space-x-2 bg-white/80 border-2 border-gray-200 rounded-2xl p-6 group-hover:border-gray-300 transition-all duration-300'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type='button'
                      onClick={() => handleRatingChange(star)}
                      className={`text-5xl transition-all duration-200 hover:scale-125 focus:outline-none ${
                        star <= formData.rating
                          ? 'text-yellow-400 hover:text-yellow-500'
                          : 'text-gray-300 hover:text-gray-400'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                  <div className='ml-6 text-center'>
                    <span className='text-2xl font-bold text-gray-800 block'>
                      {formData.rating}/5
                    </span>
                    <span className='text-sm text-gray-600'>
                      {formData.rating === 5
                        ? 'Excellent!'
                        : formData.rating === 4
                        ? 'Very Good!'
                        : formData.rating === 3
                        ? 'Good'
                        : formData.rating === 2
                        ? 'Fair'
                        : 'Poor'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Enhanced Image Upload Section */}
              <div className='space-y-6'>
                <label className='block text-sm font-semibold text-gray-700'>
                  Profile Photo *
                </label>

                {/* Current Image Display */}
                {formData.photo && (
                  <div className='flex justify-center'>
                    <div className='relative group'>
                      <img
                        src={formData.photo}
                        alt='Profile preview'
                        className='w-48 h-48 object-cover rounded-2xl border-4 border-white shadow-xl'
                      />
                      <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl flex items-center justify-center'>
                        <button
                          type='button'
                          onClick={removePhoto}
                          className='bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg transform hover:scale-105'
                        >
                          Remove Photo
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                <div className='relative'>
                  <input
                    type='file'
                    onChange={handlePhotoUpload}
                    accept='image/*'
                    className='hidden'
                    id='image-upload'
                    disabled={isUploading}
                    ref={fileInputRef}
                  />
                  <label
                    htmlFor='image-upload'
                    className={`block w-full cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-2 border-transparent px-8 py-6 rounded-2xl text-center font-semibold transition-all duration-300 transform hover:scale-105 ${
                      isUploading ? 'opacity-50 cursor-not-allowed' : ''
                    } ${validationErrors.photo ? 'border-red-300' : ''}`}
                  >
                    {isUploading ? (
                      <div className='flex items-center justify-center'>
                        <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3'></div>
                        Uploading Photo...
                      </div>
                    ) : (
                      <div className='flex items-center justify-center'>
                        <svg
                          className='w-6 h-6 mr-3'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d={
                              formData.photo
                                ? 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12'
                                : 'M12 6v6m0 0v6m0-6h6m-6 0H6'
                            }
                          />
                        </svg>
                        {formData.photo ? 'Change Photo' : 'Upload Your Photo'}
                      </div>
                    )}
                  </label>
                  {validationErrors.photo && (
                    <span className='text-red-500 text-sm mt-2 block text-center'>
                      {validationErrors.photo}
                    </span>
                  )}
                </div>

                <div className='bg-blue-50/80 rounded-2xl p-4 text-center'>
                  <p className='text-sm text-blue-700'>
                    <strong>Photo Requirements:</strong> JPG, PNG, or GIF •
                    Maximum 5MB • Clear, professional headshot recommended
                  </p>
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className='flex flex-col sm:flex-row gap-4 pt-8'>
                <button
                  type='button'
                  onClick={() => navigate(-1)}
                  className='flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={
                    isCreating ||
                    isUploading ||
                    Object.keys(validationErrors).length > 0
                  }
                  className={`flex-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    isCreating ||
                    isUploading ||
                    Object.keys(validationErrors).length > 0
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  {isCreating ? (
                    <div className='flex items-center justify-center'>
                      <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3'></div>
                      Creating Testimonial...
                    </div>
                  ) : (
                    'Share Your Story'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Enhanced Helper Tips */}
        <div className='mt-12 grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div className='bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center'>
            <div className='w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6'>
              <svg
                className='w-8 h-8 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
                />
              </svg>
            </div>
            <h3 className='text-xl font-bold text-gray-800 mb-3'>
              Be Authentic
            </h3>
            <p className='text-gray-600 leading-relaxed'>
              Share your genuine experience with honest feedback. Authenticity
              resonates more than perfection.
            </p>
          </div>

          <div className='bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center'>
            <div className='w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6'>
              <svg
                className='w-8 h-8 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
            </div>
            <h3 className='text-xl font-bold text-gray-800 mb-3'>
              Include Details
            </h3>
            <p className='text-gray-600 leading-relaxed'>
              Describe specific challenges you faced, solutions you found, and
              outcomes you achieved.
            </p>
          </div>

          <div className='bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center'>
            <div className='w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6'>
              <svg
                className='w-8 h-8 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                />
              </svg>
            </div>
            <h3 className='text-xl font-bold text-gray-800 mb-3'>
              Inspire Others
            </h3>
            <p className='text-gray-600 leading-relaxed'>
              Your success story can motivate and guide others on similar
              journeys to achieve their goals.
            </p>
          </div>
        </div>

        {/* Enhanced Review Process Notice */}
        <div className='mt-12 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-8'>
          <div className='flex items-start'>
            <div className='w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0'>
              <svg
                className='w-6 h-6 text-amber-800'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div>
              <h4 className='text-xl font-bold text-amber-800 mb-2'>
                Review and Approval Process
              </h4>
              <p className='text-amber-700 leading-relaxed'>
                Your testimonial will be carefully reviewed by our team before
                being published publicly. This ensures quality and authenticity
                for all visitors. You'll be able to edit or delete your
                testimonial from your profile page after submission. The review
                process typically takes 24-48 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTestimonial;
