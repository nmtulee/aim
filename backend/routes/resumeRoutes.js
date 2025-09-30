import express from 'express';
import {
  createResume,
  deleteResume,
  getAllResumes,
  getAllResumesNoPagination,
  getResumeById,
  getResumeByUser,
  updateResumeById,
  updateResumeByUser,
  toggleResumeHireStatus,
  getResumeStats,
  searchResumes,
  deleteMyResume,
} from '../controllers/resumeControllers.js';
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js';

const resumeRoute = express.Router();

// Public routes
resumeRoute.get('/',authenticate, authorizeAdmin,  getAllResumes); // Get all resumes with pagination and filtering
resumeRoute.get('/search',authenticate,authenticate, searchResumes); // Search resumes by name or job title
resumeRoute.get('/stats', authenticate, authorizeAdmin, getResumeStats); // Get resume statistics (admin only)
resumeRoute.get(
  '/all',
  authenticate,
  authorizeAdmin,
  getAllResumesNoPagination
); // Get all resumes without pagination (admin only)

// User-specific routes
resumeRoute.post('/', authenticate, createResume); // Create a new resume
resumeRoute
  .route('/me')
  .get(authenticate, getResumeByUser) // Get current user's resume
  .put(authenticate, updateResumeByUser) // Update current user's resume
  .delete(authenticate,deleteMyResume);

// Individual resume routes
resumeRoute.get('/:id', getResumeById); // Get resume by ID (public)
resumeRoute.put('/:id', authenticate, authorizeAdmin, updateResumeById); // Update resume by ID (admin only)
resumeRoute.delete('/:id', authenticate, authorizeAdmin, deleteResume); // Delete resume by ID (admin only)
resumeRoute.patch(
  '/:id/hire-status',
  authenticate,
  authorizeAdmin,
  toggleResumeHireStatus
); // Toggle hire status (admin only)

export default resumeRoute;
