import express from 'express';
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js';

import {
  createTeamMember,
  deleteTeamMember,
  updateTeamMember,
  getAllTeamMembers,
  getTeamMemberById,
} from '../controllers/teamControllers.js';

const teamRouter = express.Router();

// ✅ Get all team members
teamRouter.get('/', getAllTeamMembers);

// ✅ Get a single team member by ID
teamRouter.get('/:id', getTeamMemberById);

// ✅ Create a new team member (admin only)
teamRouter.post('/', authenticate, authorizeAdmin, createTeamMember);

// ✅ Update a team member (admin only)
teamRouter.put('/:id', authenticate, authorizeAdmin, updateTeamMember);

// ✅ Delete a team member (admin only)
teamRouter.delete('/:id', authenticate, authorizeAdmin, deleteTeamMember);

export default teamRouter;
