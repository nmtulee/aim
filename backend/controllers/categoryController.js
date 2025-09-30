import mongoose from 'mongoose';
import asyncHandler from '../middlewares/asyncHandler.js';
import Category from '../models/categoryModel.js';

const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name?.trim()) {
    res.status(400);
    throw new Error('please fill the name field');
  }

  const category = await Category.findOne({ name: name?.trim() });
  if (category) {
    res.status(400);
    throw new Error('Category already exists');
  }
  const newCategory = await Category.create({ name: name?.trim() });

  res.status(201).json(newCategory);
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
 

  const name = req.body.name?.trim();
  if (!name) {
    res.status(400);
    throw new Error('Please fill the name field');
  }
  const existingCategory = await Category.findOne({
    name,
    _id: { $ne: new mongoose.Types.ObjectId(id) }, 
  });

  if (existingCategory) {
    res.status(400);
    throw new Error('Category name already exists');
  }
  const category = await Category.findById(id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  category.name = name;
  await category.save();
  res.status(200).json(category);
});

const getCategoryById = asyncHandler(async (req, res) => { 
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        res.status(400);
        throw new Error('Invalid category ID format');
    }
    const category = await Category.findById(id);
    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }
    res.status(200).json(category);
})

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  if (!categories) {
    res.status(404);
    throw new Error('No categories found');
  }
  res.status(200).json(categories);
}
);

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  await category.deleteOne();
  res.status(200).json({ message: 'Category deleted successfully' });
});

export { createCategory, updateCategory ,getCategoryById ,getAllCategories,deleteCategory};
