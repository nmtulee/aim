import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCreateStudyWorkMutation } from '../../redux/api/studyWorkApiSlice.js';
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

const CreateAboutCountry = () => {
  const navigate = useNavigate();
  const [createStudyWork, { isLoading }] = useCreateStudyWorkMutation();
  const [uploadImg, { isLoading: isUploading }] = useUploadImgMutation();
  const [deleteImg] = useDeleteImgMutation();

  // Form state
  const [formData, setFormData] = useState({
    country: '',
    title: 'Study and Work Abroad',
    subtitle: '',
    bannerImage: '',
    whyCountry: {
      description: '',
      points: [''],
    },
    whoCanApply: {
      description: '',
      requirements: [''],
    },
    howWeHelp: {
      description: '',
      services: [''],
    },
    whyChooseUs: {
      points: [''],
    },
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

  // Handle nested object changes
  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));

    // Clear error when user starts typing
    const errorKey = `${section}.${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: '',
      }));
    }
  };

  // Handle array field changes
  const handleArrayFieldChange = (section, field, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: prev[section][field].map((item, i) =>
          i === index ? value : item
        ),
      },
    }));
  };

  // Add new array field
  const addArrayField = (section, field) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: [...prev[section][field], ''],
      },
    }));
  };

  // Remove array field
  const removeArrayField = (section, field, index) => {
    if (formData[section][field].length > 1) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: prev[section][field].filter((_, i) => i !== index),
        },
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
        bannerImage: '',
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

      // Update form data with uploaded image path
      setFormData((prev) => ({
        ...prev,
        bannerImage: response.image,
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
      bannerImage: '',
    }));

    // Reset file input
    const fileInput = document.getElementById('banner-image-upload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.country.trim()) {
      newErrors.country = 'Country name is required';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.subtitle.trim()) {
      newErrors.subtitle = 'Subtitle is required';
    }

    if (!formData.bannerImage.trim()) {
      newErrors.bannerImage = 'Banner image is required';
    }

    // Validate nested required fields
    if (!formData.whyCountry.description.trim()) {
      newErrors['whyCountry.description'] =
        'Why Country description is required';
    }

    if (!formData.whoCanApply.description.trim()) {
      newErrors['whoCanApply.description'] =
        'Who Can Apply description is required';
    }

    if (!formData.howWeHelp.description.trim()) {
      newErrors['howWeHelp.description'] =
        'How We Help description is required';
    }

    // Validate array fields
    const validateArrayField = (section, field, errorName) => {
      const validItems = formData[section][field].filter((item) => item.trim());
      if (validItems.length === 0) {
        newErrors[
          errorName
        ] = `At least one ${errorName.toLowerCase()} is required`;
      }
    };

    validateArrayField('whyCountry', 'points', 'Why Country point');
    validateArrayField(
      'whoCanApply',
      'requirements',
      'Who Can Apply requirement'
    );
    validateArrayField('howWeHelp', 'services', 'How We Help service');
    validateArrayField('whyChooseUs', 'points', 'Why Choose Us point');

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
      // Filter out empty array items
      const studyWorkData = {
        ...formData,
        whyCountry: {
          ...formData.whyCountry,
          points: formData.whyCountry.points.filter((point) => point.trim()),
        },
        whoCanApply: {
          ...formData.whoCanApply,
          requirements: formData.whoCanApply.requirements.filter((req) =>
            req.trim()
          ),
        },
        howWeHelp: {
          ...formData.howWeHelp,
          services: formData.howWeHelp.services.filter((service) =>
            service.trim()
          ),
        },
        whyChooseUs: {
          points: formData.whyChooseUs.points.filter((point) => point.trim()),
        },
      };

      await createStudyWork(studyWorkData).unwrap();

      setMessage('Study & Work entry created successfully!');
      setMessageType('success');

      // Reset form
      setFormData({
        country: '',
        title: 'Study and Work Abroad',
        subtitle: '',
        bannerImage: '',
        whyCountry: {
          description: '',
          points: [''],
        },
        whoCanApply: {
          description: '',
          requirements: [''],
        },
        howWeHelp: {
          description: '',
          services: [''],
        },
        whyChooseUs: {
          points: [''],
        },
      });

      // Reset image state
      setSelectedFile(null);
      setPreviewUrl('');
      setUploadedFileName('');

      // Navigate to study works list after a short delay
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      setMessage(
        error?.data?.message ||
          'Failed to create study work entry. Please try again.'
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

  // Render array field section
  const renderArrayFieldSection = (section, field, label, placeholder) => (
    <div>
      <label className='block text-sm font-medium text-gray-700 mb-2'>
        {label} *
      </label>
      {formData[section][field].map((item, index) => (
        <div key={index} className='flex items-center mb-2'>
          <input
            type='text'
            value={item}
            onChange={(e) =>
              handleArrayFieldChange(section, field, index, e.target.value)
            }
            className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            placeholder={`${placeholder} ${index + 1}`}
          />
          <button
            type='button'
            onClick={() => removeArrayField(section, field, index)}
            disabled={formData[section][field].length === 1}
            className='ml-2 p-2 text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <Trash className='w-4 h-4' />
          </button>
        </div>
      ))}
      <button
        type='button'
        onClick={() => addArrayField(section, field)}
        className='flex items-center text-blue-600 hover:text-blue-800 text-sm'
      >
        <Plus className='w-4 h-4 mr-1' />
        Add {label}
      </button>
      {errors[`${section}.${field}`] && (
        <p className='mt-1 text-sm text-red-600'>
          {errors[`${section}.${field}`]}
        </p>
      )}
    </div>
  );

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
            Back to Study Works
          </button>
        </div>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>
          Create Study & Work Entry
        </h1>
        <p className='text-gray-600'>
          Fill in the details below to create a new study and work abroad entry
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
              placeholder='e.g., Canada'
            />
            {errors.country && (
              <p className='mt-1 text-sm text-red-600'>{errors.country}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Title *
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
              placeholder='e.g., Study and Work Abroad'
            />
            {errors.title && (
              <p className='mt-1 text-sm text-red-600'>{errors.title}</p>
            )}
          </div>
        </div>

        {/* Subtitle */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Subtitle *
          </label>
          <input
            type='text'
            name='subtitle'
            value={formData.subtitle}
            onChange={handleInputChange}
            onBlur={() => handleBlur('subtitle')}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.subtitle ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder='e.g., Discover amazing opportunities in Canada'
          />
          {errors.subtitle && (
            <p className='mt-1 text-sm text-red-600'>{errors.subtitle}</p>
          )}
        </div>

        {/* Banner Image Upload */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Banner Image *
          </label>

          {/* Image Preview */}
          {previewUrl && (
            <div className='mb-4 relative'>
              <img
                src={previewUrl}
                alt='Banner preview'
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
              id='banner-image-upload'
              accept='image/*'
              onChange={handleFileSelect}
              className='hidden'
            />
            <label
              htmlFor='banner-image-upload'
              className='flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50'
            >
              <Image className='w-4 h-4 mr-2' />
              Choose Banner Image
            </label>

            {/* Upload Button */}
            {selectedFile && !formData.bannerImage && (
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

          {errors.bannerImage && (
            <p className='mt-1 text-sm text-red-600'>{errors.bannerImage}</p>
          )}
        </div>

        {/* Why Country Section */}
        <div className='border-t pt-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Why This Country
          </h3>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Description *
              </label>
              <textarea
                value={formData.whyCountry.description}
                onChange={(e) =>
                  handleNestedChange(
                    'whyCountry',
                    'description',
                    e.target.value
                  )
                }
                onBlur={() => handleBlur('whyCountry.description')}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors['whyCountry.description']
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder='Describe why this country is great for studying and working...'
              />
              {errors['whyCountry.description'] && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors['whyCountry.description']}
                </p>
              )}
            </div>

            {renderArrayFieldSection(
              'whyCountry',
              'points',
              'Key Points',
              'Point'
            )}
          </div>
        </div>

        {/* Who Can Apply Section */}
        <div className='border-t pt-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Who Can Apply
          </h3>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Description *
              </label>
              <textarea
                value={formData.whoCanApply.description}
                onChange={(e) =>
                  handleNestedChange(
                    'whoCanApply',
                    'description',
                    e.target.value
                  )
                }
                onBlur={() => handleBlur('whoCanApply.description')}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors['whoCanApply.description']
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder='Describe who is eligible to apply...'
              />
              {errors['whoCanApply.description'] && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors['whoCanApply.description']}
                </p>
              )}
            </div>

            {renderArrayFieldSection(
              'whoCanApply',
              'requirements',
              'Requirements',
              'Requirement'
            )}
          </div>
        </div>

        {/* How We Help Section */}
        <div className='border-t pt-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            How We Help
          </h3>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Description *
              </label>
              <textarea
                value={formData.howWeHelp.description}
                onChange={(e) =>
                  handleNestedChange('howWeHelp', 'description', e.target.value)
                }
                onBlur={() => handleBlur('howWeHelp.description')}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors['howWeHelp.description']
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder='Describe how you help applicants...'
              />
              {errors['howWeHelp.description'] && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors['howWeHelp.description']}
                </p>
              )}
            </div>

            {renderArrayFieldSection(
              'howWeHelp',
              'services',
              'Services',
              'Service'
            )}
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className='border-t pt-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Why Choose Us
          </h3>
          <div className='space-y-4'>
            {renderArrayFieldSection(
              'whyChooseUs',
              'points',
              'Advantages',
              'Advantage'
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className='flex justify-end pt-6 border-t'>
          <button
            type='button'
            onClick={() => navigate('/admin/study-works')}
            className='mr-4 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={isLoading}
            className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            {isLoading ? 'Creating Entry...' : 'Create Entry'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAboutCountry;
