import express from 'express';
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js';
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from '../controllers/categoryController.js';

const categoryRoutes = express.Router();

categoryRoutes
  .route('/')
  .post(authenticate, authorizeAdmin, createCategory)
  .get(getAllCategories);
categoryRoutes
  .route('/single/:id')
  .put(authenticate, authorizeAdmin, updateCategory)
  .get(getCategoryById)
  .delete(authenticate, authorizeAdmin, deleteCategory);

export default categoryRoutes;
