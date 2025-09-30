import { useState } from 'react';
import {
  useCreateCategoryMutation,
  useDeleteCategoryByIdMutation,
  useGetCategoriesQuery,
  useUpdateCategoryByIdMutation,
} from '../../redux/api/categoryApiSlice.js';
import { toast } from 'react-toastify';
import Modal from '../../components/Modal.jsx';
import CategoryForm from '../../components/CategoryForm.jsx';

const Category = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState('');
  const [name, setName] = useState('');

  const { data: categories, isLoading } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategoryById] = useUpdateCategoryByIdMutation();
  const [deleteCategoryById] = useDeleteCategoryByIdMutation();

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await createCategory({ name }).unwrap();
      toast.success('Category created');
      setName('');
    } catch (err) {
      toast.error(err?.data?.message || 'Create failed');
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    try {
      await updateCategoryById({
        id: selectedCategory._id,
        name: updatingName,
      }).unwrap();
      toast.success('Category updated');
      setModalVisible(false);
      setSelectedCategory(null);
    } catch (err) {
      toast.error(err?.data?.message || 'Update failed');
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory?._id) return toast.error('No category selected');

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this category?'
    );
    if (!confirmDelete) return;

    try {
      await deleteCategoryById(selectedCategory._id).unwrap();
      toast.success('Category deleted');
      setModalVisible(false);
      setSelectedCategory(null);
    } catch (err) {
      toast.error(err?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className='flex flex-col items-center md:items-start md:flex-row min-h-[100svh] px-4 py-6 md:px-10 md:py-20 bg-gray-50'>
      <div className='w-full md:w-3/4 max-w-4xl mx-auto p-4 bg-white rounded-xl shadow-md'>
        <h2 className='text-2xl font-semibold mb-4 text-center md:text-left'>
          Manage Categories
        </h2>

        <CategoryForm
          value={name}
          setValue={setName}
          handleSubmit={handleCreateCategory}
        />

        <hr className='my-6' />

        <div className='flex flex-wrap gap-3 justify-center  md:justify-start '>
          {categories?.map((category) => (
            <button
              key={category._id}
              className='bg-white border border-pink-500 text-pink-500 py-2 px-4 rounded-lg hover:bg-pink-500 hover:text-white transition-all duration-200'
              onClick={() => {
                setModalVisible(true);
                setSelectedCategory(category);
                setUpdatingName(category.name);
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
        <CategoryForm
          value={updatingName}
          setValue={(value) => setUpdatingName(value)}
          handleSubmit={handleUpdateCategory}
          buttonText='Update'
          handleDelete={handleDeleteCategory}
        />
      </Modal>
    </div>
  );
};

export default Category;
