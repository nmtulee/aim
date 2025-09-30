import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
  useDeletePhotoMutation,
  useUploadPhotoMutation,
} from '../../redux/api/photoApiSlice.js';
import {
  useGetMyTestimonialQuery,
  useUpdateMyTestimonialMutation,
} from '../../redux/api/testimonialApiSlice.js';

const UpdateTestimonial = () => {
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

  const [imagePreview, setImagePreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  const {
    data: testimonialData,
    isLoading: isLoadingTestimonial,
    error: err,
  } = useGetMyTestimonialQuery();
  const [uploadImg] = useUploadPhotoMutation();
  const [deleteImg] = useDeletePhotoMutation();
  const [updateTestimonial, { isLoading: isUpdating }] =
    useUpdateMyTestimonialMutation();

  // Redirect if no testimonial exists
  useEffect(() => {
    if (err && err.status === 404) {
      toast.error("You don't have a testimonial yet. Create one first.");
      navigate('/create-testimonial');
    }
  }, [err, navigate]);

  // Populate form with existing testimonial data
  useEffect(() => {
    if (testimonialData?.data) {
      const testimonial = testimonialData.data;
      const initialData = {
        title: testimonial.title || '',
        message: testimonial.message || '',
        photo: testimonial.photo || '',
        country: testimonial.country || '',
        jobTitle: testimonial.jobTitle || '',
        rating: testimonial.rating || 5,
      };

      setFormData(initialData);
      setOriginalData(initialData);
      setImagePreview(testimonial.photo || '');
    }
  }, [testimonialData]);

  // Check for changes
  useEffect(() => {
    const hasFormChanges = Object.keys(formData).some(
      (key) => formData[key] !== originalData[key]
    );
    setHasChanges(hasFormChanges);
  }, [formData, originalData]);

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
      e.target.value = null;
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      e.target.value = null;
      return;
    }

    setIsUploading(true);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);

    try {
      // Delete old image if exists and is different from original
      if (formData.photo && formData.photo !== originalData.photo) {
        try {
          const imgname = formData.photo.split('/').pop();
          await deleteImg(imgname).unwrap();
        } catch (err) {
          console.warn('Old image delete failed:', err);
        }
      }

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

      toast.success(res.message || 'Image uploaded successfully');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to upload image');
      setImagePreview(originalData.photo || '');
      setFormData((prev) => ({ ...prev, photo: originalData.photo || '' }));
    } finally {
      setIsUploading(false);
      e.target.value = null;
    }
  };

  // Enhanced image removal
  const removePhoto = async () => {
    if (!formData.photo) return;

    try {
      if (formData.photo !== originalData.photo) {
        const imgname = formData.photo.split('/').pop();
        await deleteImg(imgname).unwrap();
      } else if (originalData.photo) {
        const imgname = originalData.photo.split('/').pop();
        await deleteImg(imgname).unwrap();
      } 

      setFormData((prev) => ({ ...prev, photo: '' }));
      setImagePreview('');
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
        const fieldErrors = validateField(key, formData[key]);
        Object.assign(errors, fieldErrors);
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };


  // Enhanced form submission
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!hasChanges) {
      toast.info('No changes to save');
      return;
    }

    // Validate form
    if (!validateForm()) {
      toast.error('Please fix all validation errors before submitting');
      return;
    }

    try {
      const response = await updateTestimonial({
        title: formData.title.trim(),
        message: formData.message.trim(),
        photo: formData.photo || "",
        country: formData.country.trim(),
        jobTitle: formData.jobTitle.trim(),
        rating: formData.rating,
      }).unwrap();

      if (response.success) {
        toast.success(response.message || 'Testimonial updated successfully');
        setOriginalData(formData);
        setHasChanges(false);
        setValidationErrors({});

        // Navigate to testimonials page
        navigate('/testimonials');
      }
    } catch (error) {
      console.error('Update testimonial error:', error);
      toast.error(error?.data?.message || 'Failed to update testimonial');
    }
  };

  if (isLoadingTestimonial) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading your testimonial...</p>
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
                d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
              />
            </svg>
            <span className='text-blue-800 font-semibold'>Update Story</span>
          </div>
          <h1 className='text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4'>
            Update Your Experience
          </h1>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            Modify your testimonial to reflect your latest thoughts and
            experiences
          </p>
          {testimonialData?.data?.approved === false && (
            <div className='mt-6 bg-gradient-to-r from-yellow-100 to-amber-100 border-2 border-yellow-300 text-yellow-800 px-6 py-3 rounded-2xl inline-flex items-center'>
              <svg
                className='w-5 h-5 mr-2'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
              <span className='font-semibold'>Pending Review</span>
            </div>
          )}
        </div>

        {/* Main Form Container */}
        <div className='bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden'>
          <div className='p-8 md:p-12'>
            <form onSubmit={submitHandler} className='space-y-8'>
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

                {/* Current/Preview Image */}
                {(formData.photo || imagePreview) && (
                  <div className='flex justify-center'>
                    <div className='relative group'>
                      <img
                        src={imagePreview || formData.photo}
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
                            d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12'
                          />
                        </svg>
                        Change Photo
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
                  type='submit'
                  disabled={
                    isUpdating ||
                    isUploading ||
                    !hasChanges ||
                    Object.keys(validationErrors).length > 0
                  }
                  className={`flex-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 w-full rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    isUpdating ||
                    isUploading ||
                    !hasChanges ||
                    Object.keys(validationErrors).length > 0
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  {isUpdating ? (
                    <div className='flex items-center justify-center'>
                      <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3'></div>
                      Updating...
                    </div>
                  ) : hasChanges ? (
                    'Update Your Story'
                  ) : (
                    'No Changes'
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
                  d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                />
              </svg>
            </div>
            <h3 className='text-xl font-bold text-gray-800 mb-3'>
              Keep it Fresh
            </h3>
            <p className='text-gray-600 leading-relaxed'>
              Update your testimonial with new insights and recent experiences
              to keep it current and relevant.
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
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </div>
            <h3 className='text-xl font-bold text-gray-800 mb-3'>
              Review Process
            </h3>
            <p className='text-gray-600 leading-relaxed'>
              Updated testimonials need approval and may temporarily become
              private during the review process.
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
                  d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                />
              </svg>
            </div>
            <h3 className='text-xl font-bold text-gray-800 mb-3'>
              Track Changes
            </h3>
            <p className='text-gray-600 leading-relaxed'>
              Only modified fields will be updated, keeping your original data
              safe and preserving your testimonial's integrity.
            </p>
          </div>
        </div>

        {/* Enhanced Update Guidelines Notice */}
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
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div>
              <h4 className='text-xl font-bold text-amber-800 mb-2'>
                Update Guidelines
              </h4>
              <p className='text-amber-700 leading-relaxed mb-4'>
                When you update your testimonial, it will be marked as pending
                review. Your changes will be visible publicly only after admin
                approval. The review process typically takes 24-48 hours.
              </p>
              <div className='bg-white/60 rounded-xl p-4 border border-amber-200'>
                <h5 className='font-semibold text-amber-800 mb-2'>
                  What happens after you update:
                </h5>
                <ul className='text-sm text-amber-700 space-y-1'>
                  <li>• Your testimonial status changes to "Pending Review"</li>
                  <li>• The updated version is reviewed by our team</li>
                  <li>• You'll be notified once the review is complete</li>
                  <li>• Only approved changes become publicly visible</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateTestimonial;