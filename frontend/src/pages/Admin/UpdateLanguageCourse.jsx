import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  useUpdateLanguageCourseMutation,
  useGetLanguageCourseByIdQuery,
} from '../../redux/api/languageCourseApiSlice.js';
import {
  useUploadImgMutation,
  useDeleteImgMutation,
} from '../../redux/api/imgUploadApiSlise.js';
import {
  HiPlus as Plus,
  HiTrash as Trash,
  HiPhotograph as Image,
  HiExclamationCircle as AlertCircle,
  HiCheckCircle as CheckCircle,
  HiArrowLeft as ArrowLeft,
  HiUpload as Upload,
  HiX as X,
} from 'react-icons/hi';

const UpdateLanguageCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [updateLanguageCourse, { isLoading: isUpdating }] =
    useUpdateLanguageCourseMutation();
  const [uploadImg, { isLoading: isUploading }] = useUploadImgMutation();
  const [deleteImg] = useDeleteImgMutation();

  const {
    data: courseData,
    isLoading: isLoadingCourse,
    error: courseError,
  } = useGetLanguageCourseByIdQuery(id);

  // Form state
  const [formData, setFormData] = useState({
    couresName: '',
    shortName: '',
    image: '',
    description: '',
    country: '',
    levels: [
      {
        level: '',
        CourseFee: '',
        duration: '',
        description: '',
      },
    ],
  });

  // Image upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [hasImageChanged, setHasImageChanged] = useState(false);

  // Form validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Success/Error messages
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Populate form with existing data
  useEffect(() => {
    if (courseData) {
      setFormData({
        couresName: courseData.couresName || '',
        shortName: courseData.shortName || '',
        image: courseData.image || '',
        description: courseData.description || '',
        country: courseData.country || '',
        levels:
          courseData.levels && courseData.levels.length > 0
            ? courseData.levels.map((level) => ({
                level: level.level || '',
                CourseFee: level.CourseFee || '',
                duration: level.duration || '',
                description: level.description || '',
                _id: level._id || '', // Keep ID for updates
              }))
            : [
                {
                  level: '',
                  CourseFee: '',
                  duration: '',
                  description: '',
                },
              ],
      });

      // Set preview URL for existing image
      if (courseData.image) {
        setPreviewUrl(courseData.image);
      }
    }
  }, [courseData]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Handle level field changes
  const handleLevelChange = (index, field, value) => {
    const updatedLevels = formData.levels.map((level, i) =>
      i === index ? { ...level, [field]: value } : level
    );

    setFormData((prev) => ({
      ...prev,
      levels: updatedLevels,
    }));

    // Clear level error when user starts typing
    const errorKey = `levels[${index}].${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: '',
      }));
    }
  };

  // Add new level
  const addLevel = () => {
    setFormData((prev) => ({
      ...prev,
      levels: [
        ...prev.levels,
        {
          level: '',
          CourseFee: '',
          duration: '',
          description: '',
        },
      ],
    }));
  };

  // Remove level
  const removeLevel = (index) => {
    if (formData.levels.length > 1) {
      const updatedLevels = formData.levels.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        levels: updatedLevels,
      }));

      // Clear level-related errors
      const newErrors = { ...errors };
      Object.keys(newErrors).forEach((key) => {
        if (key.startsWith(`levels[${index}]`)) {
          delete newErrors[key];
        }
      });
      setErrors(newErrors);
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
      ];
      if (!allowedTypes.includes(file.type)) {
        setMessage('Please select a valid image file (JPEG, PNG, or WebP)');
        setMessageType('error');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('Image file must be less than 5MB');
        setMessageType('error');
        return;
      }

      setSelectedFile(file);
      setHasImageChanged(true);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);

      // Clear any previous errors
      setErrors((prev) => ({
        ...prev,
        image: '',
      }));
    }
  };

  // Handle image upload
  const handleImageUpload = async () => {
    if (!selectedFile) return;

    try {
      const imageFormData = new FormData();
      imageFormData.append('image', selectedFile);

      const response = await uploadImg(imageFormData).unwrap();

      // Delete old image if it was uploaded (not the default)
      if (formData.image && hasImageChanged && uploadedFileName) {
        try {
          await deleteImg(uploadedFileName);
        } catch (error) {
          console.warn('Failed to delete old image:', error);
        }
      }

      // Update form data with uploaded image path
      setFormData((prev) => ({
        ...prev,
        image: response.image,
      }));

      // Store filename for potential deletion
      const filename = response.image.split('/').pop();
      setUploadedFileName(filename);

      setMessage('Image uploaded successfully!');
      setMessageType('success');

      // Clear the message after 3 seconds
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
    } catch (error) {
      setMessage(error?.data?.message || 'Failed to upload image');
      setMessageType('error');
    }
  };

  // Handle image removal
  const handleImageRemove = async () => {
    if (uploadedFileName && hasImageChanged) {
      try {
        await deleteImg(uploadedFileName);
      } catch (error) {
        console.error('Failed to delete image:', error);
      }
    }

    // Reset image state
    setSelectedFile(null);
    setPreviewUrl('');
    setUploadedFileName('');
    setHasImageChanged(false);
    setFormData((prev) => ({
      ...prev,
      image: '',
    }));

    // Reset file input
    const fileInput = document.getElementById('course-image-upload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.couresName.trim()) {
      newErrors.couresName = 'Course name is required';
    }

    if (!formData.shortName.trim()) {
      newErrors.shortName = 'Short name is required';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'Course image is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    // Validate levels
    formData.levels.forEach((level, index) => {
      if (!level.level.trim()) {
        newErrors[`levels[${index}].level`] = 'Level name is required';
      }

      if (!level.CourseFee.trim()) {
        newErrors[`levels[${index}].CourseFee`] = 'Course fee is required';
      }

      if (!level.duration.trim()) {
        newErrors[`levels[${index}].duration`] = 'Duration is required';
      }

      if (!level.description.trim()) {
        newErrors[`levels[${index}].description`] =
          'Level description is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage('Please fix the errors below');
      setMessageType('error');
      return;
    }

    try {
      // Prepare update data
      const languageCourseData = {
        id,
        couresName: formData.couresName.trim(),
        shortName: formData.shortName.trim(),
        description: formData.description.trim(),
        country: formData.country.trim(),
        image: formData.image,
        levels: formData.levels
          .filter(
            (level) =>
              level.level.trim() &&
              level.CourseFee.trim() &&
              level.duration.trim() &&
              level.description.trim()
          )
          .map((level) => ({
            level: level.level.trim(),
            CourseFee: level.CourseFee.trim(),
            duration: level.duration.trim(),
            description: level.description.trim(),
            ...(level._id && { _id: level._id }), // Include ID if it exists
          })),
      };

      await updateLanguageCourse(languageCourseData).unwrap();

      setMessage('Language course updated successfully!');
      setMessageType('success');

      // Navigate back after a short delay
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      setMessage(
        error?.data?.message ||
          'Failed to update language course. Please try again.'
      );
      setMessageType('error');
    }
  };

  // Handle field blur for validation
  const handleBlur = (fieldName) => {
    setTouched((prev) => ({
      ...prev,
      [fieldName]: true,
    }));
  };

  // Loading state
  if (isLoadingCourse) {
    return (
      <div className='container my-10 mx-auto px-4 py-8 max-w-4xl'>
        <div className='animate-pulse'>
          <div className='h-8 bg-gray-200 rounded w-1/3 mb-4'></div>
          <div className='h-4 bg-gray-200 rounded w-2/3 mb-8'></div>
          <div className='bg-white rounded-lg shadow-md p-6 space-y-6'>
            <div className='h-4 bg-gray-200 rounded w-1/4 mb-2'></div>
            <div className='h-10 bg-gray-200 rounded'></div>
            <div className='h-4 bg-gray-200 rounded w-1/4 mb-2'></div>
            <div className='h-10 bg-gray-200 rounded'></div>
            <div className='h-4 bg-gray-200 rounded w-1/4 mb-2'></div>
            <div className='h-32 bg-gray-200 rounded'></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (courseError) {
    return (
      <div className='container my-10 mx-auto px-4 py-8 max-w-4xl'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-8 text-center'>
          <AlertCircle className='w-16 h-16 text-red-400 mx-auto mb-4' />
          <h2 className='text-2xl font-bold text-red-800 mb-2'>
            Course Not Found
          </h2>
          <p className='text-red-600 mb-6'>
            {courseError?.data?.message ||
              'The course you are trying to edit could not be found.'}
          </p>
          <button
            onClick={() => navigate(-1)}
            className='bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors'
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='container my-10 mx-auto px-4 py-8 max-w-4xl'>
      {/* Header */}
      <div className='mb-8'>
        <div className='flex items-center mb-4'>
          <button
            onClick={() => navigate(-1)}
            className='flex items-center text-gray-600 hover:text-gray-900 mr-4'
          >
            <ArrowLeft className='w-5 h-5 mr-1' />
            Back to Language Courses
          </button>
        </div>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>
          Update Language Course
        </h1>
        <p className='text-gray-600'>
          Update the details below to modify the language course
        </p>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center ${
            messageType === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {messageType === 'success' ? (
            <CheckCircle className='w-5 h-5 mr-2' />
          ) : (
            <AlertCircle className='w-5 h-5 mr-2' />
          )}
          {message}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className='bg-white rounded-lg shadow-md p-6 space-y-6'
      >
        {/* Basic Information */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Course Name */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Course Name *
            </label>
            <input
              type='text'
              name='couresName'
              value={formData.couresName}
              onChange={handleInputChange}
              onBlur={() => handleBlur('couresName')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.couresName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder='e.g., German Language Course'
            />
            {errors.couresName && (
              <p className='mt-1 text-sm text-red-600'>{errors.couresName}</p>
            )}
          </div>

          {/* Short Name */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Short Name *
            </label>
            <input
              type='text'
              name='shortName'
              value={formData.shortName}
              onChange={handleInputChange}
              onBlur={() => handleBlur('shortName')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.shortName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder='e.g., German'
            />
            {errors.shortName && (
              <p className='mt-1 text-sm text-red-600'>{errors.shortName}</p>
            )}
          </div>
        </div>

        {/* Country */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Country *
          </label>
          <input
            type='text'
            name='country'
            value={formData.country}
            onChange={handleInputChange}
            onBlur={() => handleBlur('country')}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.country ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder='e.g., Germany'
          />
          {errors.country && (
            <p className='mt-1 text-sm text-red-600'>{errors.country}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Description *
          </label>
          <textarea
            name='description'
            value={formData.description}
            onChange={handleInputChange}
            onBlur={() => handleBlur('description')}
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder='Describe the language course, its benefits, and what students will learn...'
          />
          {errors.description && (
            <p className='mt-1 text-sm text-red-600'>{errors.description}</p>
          )}
        </div>

        {/* Course Image Upload */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Course Image *
          </label>

          {/* Image Preview */}
          {previewUrl && (
            <div className='mb-4 relative'>
              <img
                src={previewUrl}
                alt='Course preview'
                className='w-full h-48 object-cover rounded-lg border'
              />
              <button
                type='button'
                onClick={handleImageRemove}
                className='absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600'
              >
                <X className='w-4 h-4' />
              </button>
            </div>
          )}

          {/* File Input */}
          <div className='flex items-center gap-4'>
            <input
              type='file'
              id='course-image-upload'
              accept='image/*'
              onChange={handleFileSelect}
              className='hidden'
            />
            <label
              htmlFor='course-image-upload'
              className='flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50'
            >
              <Image className='w-4 h-4 mr-2' />
              {previewUrl ? 'Change Course Image' : 'Choose Course Image'}
            </label>

            {/* Upload Button */}
            {selectedFile && (
              <button
                type='button'
                onClick={handleImageUpload}
                disabled={isUploading}
                className='flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50'
              >
                <Upload className='w-4 h-4 mr-2' />
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
            )}
          </div>

          {/* File Info */}
          {selectedFile && (
            <p className='mt-2 text-sm text-gray-600'>
              Selected: {selectedFile.name} (
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}

          {errors.image && (
            <p className='mt-1 text-sm text-red-600'>{errors.image}</p>
          )}
        </div>

        {/* Course Levels Section */}
        <div className='border-t pt-6'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Course Levels *
            </h3>
            <button
              type='button'
              onClick={addLevel}
              className='flex items-center text-blue-600 hover:text-blue-800 text-sm'
            >
              <Plus className='w-4 h-4 mr-1' />
              Add Level
            </button>
          </div>

          <div className='space-y-6'>
            {formData.levels.map((level, index) => (
              <div
                key={index}
                className='bg-gray-50 rounded-lg p-4 border border-gray-200'
              >
                <div className='flex justify-between items-center mb-4'>
                  <h4 className='text-md font-medium text-gray-800'>
                    Level {index + 1}
                  </h4>
                  {formData.levels.length > 1 && (
                    <button
                      type='button'
                      onClick={() => removeLevel(index)}
                      className='text-red-600 hover:text-red-800'
                    >
                      <Trash className='w-4 h-4' />
                    </button>
                  )}
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {/* Level Name */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Level Name *
                    </label>
                    <input
                      type='text'
                      value={level.level}
                      onChange={(e) =>
                        handleLevelChange(index, 'level', e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors[`levels[${index}].level`]
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      placeholder='e.g., Beginner (A1)'
                    />
                    {errors[`levels[${index}].level`] && (
                      <p className='mt-1 text-sm text-red-600'>
                        {errors[`levels[${index}].level`]}
                      </p>
                    )}
                  </div>

                  {/* Course Fee */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Course Fee *
                    </label>
                    <input
                      type='text'
                      value={level.CourseFee}
                      onChange={(e) =>
                        handleLevelChange(index, 'CourseFee', e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors[`levels[${index}].CourseFee`]
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      placeholder='e.g., $500'
                    />
                    {errors[`levels[${index}].CourseFee`] && (
                      <p className='mt-1 text-sm text-red-600'>
                        {errors[`levels[${index}].CourseFee`]}
                      </p>
                    )}
                  </div>

                  {/* Duration */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Duration *
                    </label>
                    <input
                      type='text'
                      value={level.duration}
                      onChange={(e) =>
                        handleLevelChange(index, 'duration', e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors[`levels[${index}].duration`]
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      placeholder='e.g., 3 months'
                    />
                    {errors[`levels[${index}].duration`] && (
                      <p className='mt-1 text-sm text-red-600'>
                        {errors[`levels[${index}].duration`]}
                      </p>
                    )}
                  </div>
                </div>

                {/* Level Description */}
                <div className='mt-4'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Level Description *
                  </label>
                  <textarea
                    value={level.description}
                    onChange={(e) =>
                      handleLevelChange(index, 'description', e.target.value)
                    }
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors[`levels[${index}].description`]
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    placeholder='Describe what students will learn in this level...'
                  />
                  {errors[`levels[${index}].description`] && (
                    <p className='mt-1 text-sm text-red-600'>
                      {errors[`levels[${index}].description`]}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className='flex justify-end pt-6 border-t'>
          <button
            type='button'
            onClick={() => navigate(-1)}
            className='mr-4 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={isUpdating}
            className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            {isUpdating ? 'Updating Course...' : 'Update Course'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateLanguageCourse;
