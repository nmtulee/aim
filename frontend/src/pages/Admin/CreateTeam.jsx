import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateTeamMemberMutation } from '../../redux/api/teamApiSlice.js';
import {
  useUploadPhotoMutation,
  useDeletePhotoMutation,
} from '../../redux/api/photoApiSlice.js';
import {
  HiPlus as Plus,
  HiTrash as Trash,
  HiPhotograph as Image,
  HiCheckCircle as CheckCircle,
  HiExclamationCircle as AlertCircle,
  HiArrowLeft as ArrowLeft,
  HiUpload as Upload,
  HiX as X,
} from 'react-icons/hi';

const CreateTeam = () => {
  const navigate = useNavigate();
  const [createTeamMember, { isLoading }] = useCreateTeamMemberMutation();
  const [uploadPhoto, { isLoading: isUploading }] = useUploadPhotoMutation();
  const [deletePhoto] = useDeletePhotoMutation();

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    description: '',
    image: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setMessage('Please select a valid image file (JPEG, PNG, WebP)');
      setMessageType('error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage('Image file must be less than 5MB');
      setMessageType('error');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target.result);
    reader.readAsDataURL(file);
  };

  // Upload image
  const handleImageUpload = async () => {
    if (!selectedFile) return;
    try {
      const form = new FormData();
      form.append('image', selectedFile);
      const response = await uploadPhoto(form).unwrap();
      setFormData((prev) => ({ ...prev, image: response.image }));
      setUploadedFileName(response.image.split('/').pop());
      setMessage('Image uploaded successfully');
      setMessageType('success');
    } catch (err) {
      setMessage(err?.data?.message || 'Failed to upload image');
      setMessageType('error');
    }
  };

  // Remove image
  const handleImageRemove = async () => {
    if (uploadedFileName) await deletePhoto(uploadedFileName);
    setSelectedFile(null);
    setPreviewUrl('');
    setUploadedFileName('');
    setFormData((prev) => ({ ...prev, image: '' }));
    const input = document.getElementById('team-image-upload');
    if (input) input.value = '';
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.role.trim()) newErrors.role = 'Role is required';
    if (!formData.description.trim())
      newErrors.description = 'Description is required';
    if (!formData.image.trim()) newErrors.image = 'Image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setMessage('Please fix the errors below');
      setMessageType('error');
      return;
    }

    try {
      await createTeamMember(formData).unwrap();
      setMessage('Team member created successfully!');
      setMessageType('success');
      setFormData({ name: '', role: '', description: '', image: '' });
      setSelectedFile(null);
      setPreviewUrl('');
      setUploadedFileName('');
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      setMessage(err?.data?.message || 'Failed to create team member');
      setMessageType('error');
    }
  };

  return (
    <div className='container mx-auto my-16 p-6 max-w-2xl'>
      <button
        onClick={() => navigate(-1)}
        className='flex items-center mb-4 text-gray-600 hover:text-gray-900'
      >
        <ArrowLeft className='w-5 h-5 mr-1' />Go Back
      </button>

      <h1 className='text-3xl font-bold mb-4'>Create Team Member</h1>

      {message && (
        <div
          className={`p-4 rounded mb-6 flex items-center ${
            messageType === 'success'
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
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

      <form
        onSubmit={handleSubmit}
        className='bg-white p-6 rounded shadow space-y-6'
      >
        <div>
          <label className='block mb-2'>Name *</label>
          <input
            type='text'
            name='name'
            value={formData.name}
            onChange={handleInputChange}
            className='w-full border px-3 py-2 rounded'
          />
          {errors.name && (
            <p className='text-red-600 text-sm mt-1'>{errors.name}</p>
          )}
        </div>

        <div>
          <label className='block mb-2'>Role *</label>
          <input
            type='text'
            name='role'
            value={formData.role}
            onChange={handleInputChange}
            className='w-full border px-3 py-2 rounded'
          />
          {errors.role && (
            <p className='text-red-600 text-sm mt-1'>{errors.role}</p>
          )}
        </div>

        <div>
          <label className='block mb-2'>Description *</label>
          <textarea
            name='description'
            value={formData.description}
            onChange={handleInputChange}
            className='w-full border px-3 py-2 rounded'
            rows={4}
          ></textarea>
          {errors.description && (
            <p className='text-red-600 text-sm mt-1'>{errors.description}</p>
          )}
        </div>

        {/* Image upload */}
        <div>
          <label className='block mb-2'>Photo *</label>
          {previewUrl && (
            <div className='relative mb-4'>
              <img
                src={previewUrl}
                alt='Preview'
                className='w-full h-48 object-cover rounded'
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
          <div className='flex items-center gap-4'>
            <input
              type='file'
              id='team-image-upload'
              accept='image/*'
              onChange={handleFileSelect}
              className='hidden'
            />
            <label
              htmlFor='team-image-upload'
              className='flex items-center px-4 py-2 border rounded cursor-pointer hover:bg-gray-50'
            >
              <Image className='w-4 h-4 mr-2' /> Choose Photo
            </label>
            {selectedFile && !formData.image && (
              <button
                type='button'
                onClick={handleImageUpload}
                disabled={isUploading}
                className='flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
              >
                <Upload className='w-4 h-4 mr-2' />{' '}
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
            )}
          </div>
          {errors.image && (
            <p className='text-red-600 text-sm mt-1'>{errors.image}</p>
          )}
        </div>

        <div className='flex justify-end gap-4'>
          <button
            type='button'
            onClick={() => navigate(-1)}
            className='px-6 py-2 border rounded text-gray-700 hover:bg-gray-50'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={isLoading}
            className='px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
          >
            {isLoading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTeam;
