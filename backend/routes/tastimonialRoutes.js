import express from 'express';
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js';
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  updateTestimonialById,
  getAllTestimonials,
  getMyTestimonial,
  deleteTestimonialById,
  getTestimonialById,
  getAllTestimonialsAdmin,
} from '../controllers/tastimonialController.js';

const testimonialRoute = express.Router();

// Public routes
testimonialRoute
  .route('/')
  .post(authenticate, createTestimonial)
  .get(getAllTestimonials);

// User's own testimonial routes
testimonialRoute
  .route('/my')
  .get(authenticate, getMyTestimonial)
  .put(authenticate, updateTestimonial)
  .delete(authenticate, deleteTestimonial);

// Admin routes - must come before /:id routes to avoid conflicts
testimonialRoute
  .route('/admin')
  .get(authenticate, authorizeAdmin, getAllTestimonialsAdmin);

testimonialRoute
  .route('/admin/:id')
  .get(authenticate, authorizeAdmin, getTestimonialById)
  .put(authenticate, authorizeAdmin, updateTestimonialById)
  .delete(authenticate, authorizeAdmin, deleteTestimonialById);

// Individual testimonial routes (public read access)
testimonialRoute.route('/:id').get(getTestimonialById);

export default testimonialRoute;

