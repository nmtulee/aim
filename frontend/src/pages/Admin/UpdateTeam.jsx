import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useUpdateTeamMemberMutation,
  useGetTeamMemberByIdQuery,
} from '../../redux/api/teamApiSlice.js';
import {
  useUploadPhotoMutation,
  useDeletePhotoMutation,
} from '../../redux/api/photoApiSlice.js';
import {
  HiArrowLeft as ArrowLeft,
  HiUpload as Upload,
  HiX as X,
} from 'react-icons/hi';

const UpdateTeam = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // RTK Queries
  const { data: teamMember, isLoading: loadingMember } =
    useGetTeamMemberByIdQuery(id);
  const [updateTeamMember, { isLoading: updating }] =
    useUpdateTeamMemberMutation();
  const [uploadPhoto] = useUploadPhotoMutation();
  const [deletePhoto] = useDeletePhotoMutation();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    description: '',
    image: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (teamMember) {
      setFormData({
        name: teamMember.name || '',
        role: teamMember.role || '',
        description: teamMember.description || '',
        image: teamMember.image || '',
      });
      setPreviewUrl(teamMember.image || '');
    }
  }, [teamMember]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;
    try {
      const form = new FormData();
      form.append('image', selectedFile);
      const response = await uploadPhoto(form).unwrap();
      setFormData((prev) => ({ ...prev, image: response.image }));
      setSelectedFile(null);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleImageRemove = async () => {
    if (formData.image) {
      try {
        const fileName = formData.image.split('/').pop();
        await deletePhoto(fileName).unwrap();
        setFormData((prev) => ({ ...prev, image: '' }));
        setPreviewUrl('');
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTeamMember({ id, data: formData }).unwrap();
      navigate('/admin/team');
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  if (loadingMember) return <p>Loading...</p>;

  return (
    <div className='container mx-auto my-16 p-6 max-w-2xl '>
      <button
        onClick={() => navigate(-1)}
        className='flex items-center mb-4 text-gray-600 hover:text-gray-900'
      >
        <ArrowLeft className='w-5 h-5 mr-1' /> Go Back
      </button>

      <h1 className='text-2xl font-bold mb-6'>Update Team Member</h1>

      <form
        onSubmit={handleSubmit}
        className='bg-white p-6 rounded shadow space-y-6'
      >
        <div>
          <label className='block mb-1 font-medium'>Name</label>
          <input
            type='text'
            name='name'
            value={formData.name}
            onChange={handleInputChange}
            className='w-full border px-3 py-2 rounded'
          />
        </div>

        <div>
          <label className='block mb-1 font-medium'>Role</label>
          <input
            type='text'
            name='role'
            value={formData.role}
            onChange={handleInputChange}
            className='w-full border px-3 py-2 rounded'
          />
        </div>

        <div>
          <label className='block mb-1 font-medium'>Description</label>
          <textarea
            name='description'
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className='w-full border px-3 py-2 rounded'
          />
        </div>

        <div>
          <label className='block mb-1 font-medium'>Image</label>
          {previewUrl && (
            <div className='relative mb-2'>
              <img
                src={previewUrl}
                alt='Preview'
                className='w-full h-48 object-cover rounded border'
              />
              <button
                type='button'
                onClick={handleImageRemove}
                className='absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600'
              >
                <X className='w-4 h-4' />
              </button>
            </div>
          )}
          <div className='flex gap-2 items-center'>
            <input
              type='file'
              onChange={handleFileSelect}
              className='hidden'
              id='team-image-upload'
            />
            <label
              htmlFor='team-image-upload'
              className='cursor-pointer px-4 py-2 border rounded hover:bg-gray-50'
            >
              Choose Image
            </label>
            {selectedFile && (
              <button
                type='button'
                onClick={handleImageUpload}
                className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
              >
                Upload
              </button>
            )}
          </div>
        </div>

        <button
          type='submit'
          disabled={updating}
          className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'
        >
          {updating ? 'Updating...' : 'Update Team Member'}
        </button>
      </form>
    </div>
  );
};

export default UpdateTeam;
