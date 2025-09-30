import express from 'express';
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js';
import {
  deleteJobAplicacion,
  deleteMyJobAplicacion,
  getJobAplicacionById,
  getJobAplicacions,
  getMyJobAplicacion,
  jobAplicacion,
} from '../controllers/jobAplicacionControllers.js';

const aplicacionRouter = express.Router();

// Apply for a job (user)
aplicacionRouter.post('/', authenticate, jobAplicacion);

// Get all applications (admin only)
aplicacionRouter.get('/all', authenticate, authorizeAdmin, getJobAplicacions);

// Get single application (admin only)
aplicacionRouter.get(
  '/:id',
  authenticate,
  authorizeAdmin,
  getJobAplicacionById
);

// Delete application (admin only)
aplicacionRouter.delete(
  '/:id',
  authenticate,
  authorizeAdmin,
  deleteJobAplicacion
);

// Delete my own application (user)
aplicacionRouter.route("/my/:id").delete( authenticate, deleteMyJobAplicacion).get(
  authenticate,
  getMyJobAplicacion
);



export default aplicacionRouter;
