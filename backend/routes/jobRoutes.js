import express from 'express';

import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js';
import {
  createJob,
  deleteJob,
  getAllJobs,
  getJobById,
  getJobs,
  getJobsByCategory,
  getJobsStats,
  toggleJobStatus,
  updateJob,
} from '../controllers/jobControllers.js';

const jobRouter = express.Router();

jobRouter.get('/stats', authenticate, authorizeAdmin, getJobsStats);

jobRouter.get('/category/:categoryId', getJobsByCategory);

jobRouter
  .route('/')
  .get(getAllJobs)
  .post(authenticate, authorizeAdmin, createJob);

jobRouter
  .route('/all')
  .get(authenticate, authorizeAdmin, getJobs);

jobRouter
  .route('/:id')
  .get(getJobById)
  .put(authenticate, authorizeAdmin, updateJob)
  .delete(authenticate, authorizeAdmin, deleteJob);

jobRouter.patch(
  '/:id/toggle-status',
  authenticate,
  authorizeAdmin,
  toggleJobStatus
);

export default jobRouter;
