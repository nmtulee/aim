import asyncHandler from '../middlewares/asyncHandler.js';
import Team from '../models/teamModel.js';
import mongoose from 'mongoose';

// Create team member
const createTeamMember = asyncHandler(async (req, res) => {
  const { name, role, image, description } = req.body;

  if (!name?.trim() || !role?.trim() || !image || !description?.trim()) {
    res.status(400);
    throw new Error('Please fill all fields');
  }

  const teamMember = await Team.create({
    name: name.trim(),
    role: role.trim(),
    image,
    description: description.trim(),
  });

  res.status(201).json({
    message: 'Team member created successfully',
    teamMember,
  });
});

// Update team member
const updateTeamMember = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid team member ID format');
  }

  const { name, role, image, description } = req.body;
  const teamMember = await Team.findById(id);

  if (!teamMember) {
    res.status(404);
    throw new Error('Team member not found');
  }

  if (name?.trim()) teamMember.name = name.trim();
  if (role?.trim()) teamMember.role = role.trim();
  if (image) teamMember.image = image;
  if (description?.trim()) teamMember.description = description.trim();

  await teamMember.save();

  res.status(200).json({
    message: 'Team member updated successfully',
    teamMember,
  });
});

// Delete team member
const deleteTeamMember = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid team member ID format');
  }

  const teamMember = await Team.findById(id);

  if (!teamMember) {
    res.status(404);
    throw new Error('Team member not found');
  }

  await Team.findByIdAndDelete(id);

  res.status(200).json({
    message: 'Team member deleted successfully',
  });
});

// Get all team members with pagination
const getAllTeamMembers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;
  const skip = (page - 1) * limit;

  const total = await Team.countDocuments();
  const teamMembers = await Team.find({})
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    teamMembers,
    page,
    totalPages: Math.ceil(total / limit),
    total,
    hasNextPage: page < Math.ceil(total / limit),
    hasPrevPage: page > 1,
  });
});

// Get single team member
const getTeamMemberById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid team member ID format');
  }

  const teamMember = await Team.findById(id);

  if (!teamMember) {
    res.status(404);
    throw new Error('Team member not found');
  }

  res.status(200).json(teamMember);
});

// Search team members by name or role
const searchTeamMembers = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;
  const skip = (page - 1) * limit;

  if (!q || q.trim().length === 0) {
    res.status(400);
    throw new Error('Search query is required');
  }

  const searchRegex = new RegExp(q.trim(), 'i');
  const searchQuery = {
    $or: [{ name: { $regex: searchRegex } }, { role: { $regex: searchRegex } }],
  };

  const total = await Team.countDocuments(searchQuery);
  const teamMembers = await Team.find(searchQuery)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    teamMembers,
    page,
    totalPages: Math.ceil(total / limit),
    total,
    searchQuery: q.trim(),
  });
});

export {
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getAllTeamMembers,
  getTeamMemberById,
  searchTeamMembers,
};
