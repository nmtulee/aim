import express from 'express';
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js';
import {
  createBlog,
  createReview,
  deleteBlog,
  deleteReview,
  getAllBlogs,
  getBlogById,
  getBlogsStats,
  getAllBlogsNoPagination, // Updated function name (was getBlos)
  updateBlog,
  getBlogsByUser,
  searchBlogs,
} from '../controllers/blogControllers.js';

const blogRoutes = express.Router();

// Main blog routes
blogRoutes
  .route('/')
  .post(authenticate, authorizeAdmin, createBlog)
  .get(getAllBlogs);

// Individual blog routes
blogRoutes
  .route('/blog/:id')
  .get(getBlogById)
  .put(authenticate, authorizeAdmin, updateBlog)
  .delete(authenticate, authorizeAdmin, deleteBlog);

// Admin routes
blogRoutes
  .route('/all')
  .get(authenticate, authorizeAdmin, getAllBlogsNoPagination);
blogRoutes.route('/stats').get(getBlogsStats);

// Additional utility routes
blogRoutes.route('/search').get(searchBlogs);
blogRoutes.route('/user/:userId').get(getBlogsByUser);

// Review routes
blogRoutes.post('/reviews/:id', authenticate, createReview);
blogRoutes.delete('/reviews/:blogId/:reviewId', authenticate, deleteReview);

export default blogRoutes;
