import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateJobMutation } from '../../redux/api/jobApiSlice.js';
import { useGetCategoriesQuery } from '../../redux/api/categoryApiSlice.js';
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
  HiChevronDown as ChevronDown,
} from 'react-icons/hi';

const CreateJob = () => {
  const navigate = useNavigate();
  const [createJob, { isLoading }] = useCreateJobMutation();
  const [uploadImg, { isLoading: isUploading }] = useUploadImgMutation();
  const [deleteImg] = useDeleteImgMutation();

  // Fetch categories
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useGetCategoriesQuery();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    category: '',
    isSchengen: false,
    location: '',
    country: '',
    description: '',
    requirements: [''],
    salary: '',
  });

  // Image upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');

  // Form validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Success/Error messages
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
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
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await uploadImg(formData).unwrap();

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
    if (uploadedFileName) {
      try {
        await deleteImg(uploadedFileName);
        console.log(uploadedFileName);
        
      } catch (error) {
        console.error('Failed to delete image:', error);
      }
    }

    // Reset image state
    setSelectedFile(null);
    setPreviewUrl('');
    setUploadedFileName('');
    setFormData((prev) => ({
      ...prev,
      image: '',
    }));

    // Reset file input
    const fileInput = document.getElementById('image-upload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Handle requirements array changes
  const handleRequirementChange = (index, value) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData((prev) => ({
      ...prev,
      requirements: newRequirements,
    }));
  };

  // Add new requirement field
  const addRequirement = () => {
    setFormData((prev) => ({
      ...prev,
      requirements: [...prev.requirements, ''],
    }));
  };

  // Remove requirement field
  const removeRequirement = (index) => {
    if (formData.requirements.length > 1) {
      const newRequirements = formData.requirements.filter(
        (_, i) => i !== index
      );
      setFormData((prev) => ({
        ...prev,
        requirements: newRequirements,
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required';
    }

    if (!formData.salary.trim()) {
      newErrors.salary = 'Salary information is required';
    }

    // Validate requirements
    const validRequirements = formData.requirements.filter((req) => req.trim());
    if (validRequirements.length === 0) {
      newErrors.requirements = 'At least one requirement is needed';
    }

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
      // Filter out empty requirements
      const jobData = {
        ...formData,
        requirements: formData.requirements.filter((req) => req.trim()),
      };

      await createJob(jobData).unwrap();

      setMessage('Job created successfully!');
      setMessageType('success');

      // Reset form
      setFormData({
        title: '',
        image: '',
        category: '',
        isSchengen: false,
        location: '',
        country: '',
        description: '',
        requirements: [''],
        salary: '',
      });

      // Reset image state
      setSelectedFile(null);
      setPreviewUrl('');
      setUploadedFileName('');

      // Navigate to jobs list after a short delay
      setTimeout(() => {
        navigate('/jobs');
      }, 2000);
    } catch (error) {
      setMessage(
        error?.data?.message || 'Failed to create job. Please try again.'
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

  return (
    <div className='container mx-auto px-4 py-8 max-w-4xl my-16'>
      {/* Header */}
      <div className='mb-8'>
        <div className='flex items-center mb-4'>
          <button
            onClick={() => navigate(-1)}
            className='flex items-center text-gray-600 hover:text-gray-900 mr-4'
          >
            <ArrowLeft className='w-5 h-5 mr-1' />
            Back to Jobs
          </button>
        </div>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>
          Create New Job
        </h1>
        <p className='text-gray-600'>
          Fill in the details below to post a new job opportunity
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

      {/* Categories Loading Error */}
      {categoriesError && (
        <div className='mb-6 p-4 rounded-lg flex items-center bg-yellow-50 border border-yellow-200 text-yellow-800'>
          <AlertCircle className='w-5 h-5 mr-2' />
          Failed to load categories. Please refresh the page.
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className='bg-white rounded-lg shadow-md p-6'
      >
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Job Title */}
          <div className='md:col-span-2'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Job Title *
            </label>
            <input
              type='text'
              name='title'
              value={formData.title}
              onChange={handleInputChange}
              onBlur={() => handleBlur('title')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder='e.g., Senior Software Engineer'
            />
            {errors.title && (
              <p className='mt-1 text-sm text-red-600'>{errors.title}</p>
            )}
          </div>

          {/* Category Dropdown */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Category *
            </label>
            <div className='relative'>
              <select
                name='category'
                value={formData.category}
                onChange={handleInputChange}
                onBlur={() => handleBlur('category')}
                disabled={isCategoriesLoading}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                } ${
                  isCategoriesLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <option value=''>
                  {isCategoriesLoading
                    ? 'Loading categories...'
                    : 'Select a category'}
                </option>
                {categories?.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <ChevronDown className='absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none' />
            </div>
            {errors.category && (
              <p className='mt-1 text-sm text-red-600'>{errors.category}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Job Image (Optional)
            </label>

            {/* Image Preview */}
            {previewUrl && (
              <div className='mb-4 relative'>
                <img
                  src={previewUrl}
                  alt='Job preview'
                  className='w-full h-32 object-cover rounded-lg border'
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
                id='image-upload'
                accept='image/*'
                onChange={handleFileSelect}
                className='hidden'
              />
              <label
                htmlFor='image-upload'
                className='flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50'
              >
                <Image className='w-4 h-4 mr-2' />
                Choose Image
              </label>

              {/* Upload Button */}
              {selectedFile && !formData.image && (
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

          {/* Location */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Location *
            </label>
            <input
              type='text'
              name='location'
              value={formData.location}
              onChange={handleInputChange}
              onBlur={() => handleBlur('location')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder='e.g., New York, NY'
            />
            {errors.location && (
              <p className='mt-1 text-sm text-red-600'>{errors.location}</p>
            )}
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
              placeholder='e.g., United States'
            />
            {errors.country && (
              <p className='mt-1 text-sm text-red-600'>{errors.country}</p>
            )}
          </div>

          {/* Salary */}
          <div className='md:col-span-2'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Salary *
            </label>
            <input
              type='text'
              name='salary'
              value={formData.salary}
              onChange={handleInputChange}
              onBlur={() => handleBlur('salary')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.salary ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder='e.g., $80,000 - $120,000 per year'
            />
            {errors.salary && (
              <p className='mt-1 text-sm text-red-600'>{errors.salary}</p>
            )}
          </div>

          {/* Schengen Area */}
          <div className='md:col-span-2'>
            <label className='flex items-center'>
              <input
                type='checkbox'
                name='isSchengen'
                checked={formData.isSchengen}
                onChange={handleInputChange}
                className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
              />
              <span className='ml-2 text-sm text-gray-700'>
                This job is in the Schengen Area
              </span>
            </label>
          </div>

          {/* Description */}
          <div className='md:col-span-2'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Job Description *
            </label>
            <textarea
              name='description'
              value={formData.description}
              onChange={handleInputChange}
              onBlur={() => handleBlur('description')}
              rows={6}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe the job role, responsibilities, and what you're looking for in a candidate..."
            />
            {errors.description && (
              <p className='mt-1 text-sm text-red-600'>{errors.description}</p>
            )}
          </div>

          {/* Requirements */}
          <div className='md:col-span-2'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Requirements *
            </label>
            {formData.requirements.map((requirement, index) => (
              <div key={index} className='flex items-center mb-2'>
                <input
                  type='text'
                  value={requirement}
                  onChange={(e) =>
                    handleRequirementChange(index, e.target.value)
                  }
                  className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  placeholder={`Requirement ${index + 1}`}
                />
                <button
                  type='button'
                  onClick={() => removeRequirement(index)}
                  disabled={formData.requirements.length === 1}
                  className='ml-2 p-2 text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <Trash className='w-4 h-4' />
                </button>
              </div>
            ))}
            <button
              type='button'
              onClick={addRequirement}
              className='flex items-center text-blue-600 hover:text-blue-800 text-sm'
            >
              <Plus className='w-4 h-4 mr-1' />
              Add Requirement
            </button>
            {errors.requirements && (
              <p className='mt-1 text-sm text-red-600'>{errors.requirements}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className='flex justify-end mt-8 pt-6 border-t'>
          <button
            type='button'
            onClick={() => navigate('/admin/jobs')}
            className='mr-4 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={isLoading}
            className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            {isLoading ? 'Creating Job...' : 'Create Job'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJob;
