import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
  useCreateResumeMutation,
  useGetMyResumeQuery,
} from '../../redux/api/resumeApiSlice.js';
import {
  useUploadPDFMutation,
  useDeletePDFMutation,
} from '../../redux/api/fileUploadApiSlice.js';
import {
  useUploadPhotoMutation,
  useDeletePhotoMutation,
} from '../../redux/api/photoApiSlice.js';
import { useGetCategoriesQuery } from '../../redux/api/categoryApiSlice.js';

const CreateResume = () => {
  const [fullName, setFullName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [photo, setPhoto] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { data: MyResume } = useGetMyResumeQuery();
  const { data: categories } = useGetCategoriesQuery();
  const [uploadPhoto] = useUploadPhotoMutation();
  const [deletePhoto] = useDeletePhotoMutation();
  const [uploadPDF] = useUploadPDFMutation();
  const [deletePDF] = useDeletePDFMutation();
  const [createResume] = useCreateResumeMutation();

  // Redirect if resume already exists
  useEffect(() => {
    if (MyResume) {
      navigate('/myResume');
    }
  }, [MyResume, navigate]);

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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (pdf) {
      const pdfName = pdf.split('/').pop();
      await deletePDF(pdfName).unwrap();
      setPdf(null);
      toast.success('Previous PDF deleted');
    }

    try {
      const formData = new FormData();
      formData.append('pdf', file);
      const res = await uploadPDF(formData).unwrap();
      setPdf(res.file);
      toast.success('PDF uploaded');
    } catch (err) {
      toast.error(err?.data?.message || 'PDF upload failed');
    }
  };

  const removePhoto = async () => {
    if (!photo) return;
    const photoName = photo.split('/').pop();
    await deletePhoto(photoName).unwrap();
    setPhoto(null);
    toast.success('Photo removed');
  };

  const removePDF = async () => {
    if (!pdf) return;
    const pdfName = pdf.split('/').pop();
    await deletePDF(pdfName).unwrap();
    setPdf(null);
    toast.success('PDF removed');
  };

  // Check if all required fields are filled
  const canSubmit = fullName && jobTitle && category && photo && pdf;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) {
      toast.error('Please fill out all fields and upload files');
      return;
    }

    setLoading(true);
    try {
      await createResume({
        fullName,
        jobTitle,
        category,
        photo,
        file: pdf,
      }).unwrap();

      toast.success('Resume submitted successfully');
      navigate('/myResume');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to submit resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 pt-10 sm:pt-0'>
      <div className='w-full max-w-xl px-4 sm:px-6 py-8 mx-auto bg-white shadow-lg rounded-2xl'>
        <h2 className='text-2xl font-semibold text-gray-800 mb-6 text-center'>
          Create Resume
        </h2>
        <form onSubmit={handleSubmit} className='space-y-5'>
          {/* Full Name */}
          <div>
            <label
              htmlFor='fullName'
              className='block mb-1 font-medium text-gray-700'
            >
              Full Name
            </label>
            <input
              id='fullName'
              type='text'
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base'
            />
          </div>

          {/* Job Title */}
          <div>
            <label
              htmlFor='jobTitle'
              className='block mb-1 font-medium text-gray-700'
            >
              Job Title
            </label>
            <input
              id='jobTitle'
              type='text'
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base'
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor='category'
              className='block mb-1 font-medium text-gray-700'
            >
              Select Category
            </label>
            <select
              id='category'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base'
            >
              <option value=''>Select Category</option>
              {categories?.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Photo Upload */}
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

          {/* PDF Upload */}
          <div>
            <label className='block mb-1 font-medium text-gray-700'>
              Upload Resume (PDF)
            </label>
            <input
              type='file'
              accept='application/pdf'
              onChange={handleFileUpload}
              className='w-full cursor-pointer border border-gray-300 rounded-lg p-2'
            />
            {pdf && (
              <div className='flex items-center gap-2 mt-2'>
                <p className='text-green-600 text-sm'>
                  ✅ PDF: {pdf.split('/').pop()}
                </p>
                <button
                  type='button'
                  onClick={removePDF}
                  className='text-sm text-red-600 underline'
                >
                  Remove PDF
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            disabled={loading || !canSubmit}
            className={`w-full py-3 rounded-2xl font-semibold text-white transform transition-all ${
              !canSubmit
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105'
            }`}
          >
            {loading ? 'Submitting...' : 'Submit Resume'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateResume;
