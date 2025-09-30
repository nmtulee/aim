import asyncHandler from '../middlewares/asyncHandler.js';
import Resume from '../models/resumeModel.js';
import mongoose from 'mongoose';

// Controller to get all resumes
const getAllResumes = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;
  const skip = (page - 1) * limit;

  const { jobTitle, category } = req.query;

  // Build dynamic filter
  const filter = { isHired: false };

  if (jobTitle) {
    filter.jobTitle = { $regex: jobTitle, $options: 'i' }; // case-insensitive search
  }

  if (category) {
    filter.category = category; // must be an ObjectId
  }

  const resumes = await Resume.find(filter)
    .skip(skip)
    .limit(limit)
    .select('fullName jobTitle photo category')
    .populate('category', 'name')
    .sort({ createdAt: -1 })
    .lean();

  if (resumes.length === 0) {
    res.status(404);
    throw new Error('No resumes found');
  }

  const totalResumes = await Resume.countDocuments(filter);
  const totalPages = Math.ceil(totalResumes / limit);

  res.status(200).json({
    resumes,
    pagination: {
      totalResumes,
      totalPages,
      currentPage: page,
      limit,
    },
  });
});

// Get all resumes without pagination (for admin)
const getAllResumesNoPagination = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({})
    .populate('category', 'name')
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json(resumes);
});

// Controller to get a single resume by ID
const getResumeByUser = asyncHandler(async (req, res) => {
  // Find the resume for the authenticated user (req.user._id)
  

    
    const resume = await Resume.findOne({ user: req.user._id })
      .populate('category', 'name')
      .populate('user', 'name email')
      .lean();
  
    if (!resume) {
      res.status(404);
      throw new Error('Resume not found for this user');
    }
  
    // Respond with the user's resume
    res.status(200).json(resume);
  

});

const getResumeById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate MongoDB ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid resume ID format');
  }

  // Find the resume by ID
  const resume = await Resume.findById(id)
    .populate('category', 'name')
    .populate('user', 'name email')
    .lean();

  if (!resume) {
    res.status(404);
    throw new Error('Resume not found');
  }

  res.status(200).json(resume);
});

// Controller to create a new resume
const createResume = asyncHandler(async (req, res) => {
  const existingResume = await Resume.findOne({ user: req.user._id });

  if (existingResume) {
    res.status(404);
    throw new Error('You already submitted a resume');
  }

  const { fullName, jobTitle, category, photo, file } = req.body;

  const trimmedData = {
    fullName: fullName?.trim(),
    jobTitle: jobTitle?.trim(),
    photo: photo?.trim(),
    file: file?.trim(),
    category,
  };
  // Validate fields
  if (
    !trimmedData.fullName ||
    !trimmedData.jobTitle ||
    !trimmedData.photo ||
    !trimmedData.file ||
    !trimmedData.category
  ) {
    res.status(400);
    throw new Error('All fields are required');
  }

  const resume = await Resume.create({
    user: req.user._id,
    ...trimmedData,
  });

  res.status(201).json(resume);
});

// Controller to update a resume by ID
const updateResumeByUser = asyncHandler(async (req, res) => {


  
    
    const resume = await Resume.findOne({ user: req.user._id});
  
    if (!resume) {
      res.status(404);
      throw new Error('Resume not found');
    }
  
    const { fullName, jobTitle, category, photo, file, isHired } = req.body;
  
    // Trim string fields
    const trimmedData = {
      fullName: fullName?.trim(),
      jobTitle: jobTitle?.trim(),
      photo: photo?.trim(),
      file: file?.trim(),
      category,
      isHired,
    };
  
    // Update fields if provided
    if (trimmedData.fullName) resume.fullName = trimmedData.fullName;
    if (trimmedData.jobTitle) resume.jobTitle = trimmedData.jobTitle;
    if (trimmedData.photo) resume.photo = trimmedData.photo;
    if (trimmedData.file) resume.file = trimmedData.file;
    if (trimmedData.category) resume.category = trimmedData.category;
    if (typeof trimmedData.isHired === 'boolean')
      resume.isHired = trimmedData.isHired;
  
    const updatedResume = await resume.save();
  
    res.status(200).json(updatedResume);
  

});

const updateResumeById = asyncHandler(async (req, res) => {
  // Get resume by ID
  const resume = await Resume.findById(req.params.id);

  if (!resume) {
    res.status(404);
    throw new Error('Resume not found');
  }

  // Update resume fields
  const { fullName, jobTitle, category, photo, file, isHired } = req.body;

  // Trim and prepare the data
  const trimmedData = {
    fullName: fullName?.trim(),
    jobTitle: jobTitle?.trim(),
    photo: photo?.trim(),
    file: file?.trim(),
    category,
    isHired,
  };

  // Update fields if provided
  if (trimmedData.fullName) resume.fullName = trimmedData.fullName;
  if (trimmedData.jobTitle) resume.jobTitle = trimmedData.jobTitle;
  if (trimmedData.photo) resume.photo = trimmedData.photo;
  if (trimmedData.file) resume.file = trimmedData.file;
  if (trimmedData.category) resume.category = trimmedData.category;
  if (typeof trimmedData.isHired === 'boolean')
    resume.isHired = trimmedData.isHired;

  // Save the updated resume
  const updatedResume = await resume.save();

  // Send response
  res.status(200).json(updatedResume);
});

// Controller to delete a resume by ID
const deleteResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findById(req.params.id);

  if (!resume) {
    res.status(404);
    throw new Error('Resume not found');
  }

  await resume.deleteOne();

  res.status(200).json({ message: 'Resume deleted successfully' });
});

// Toggle resume hire status
const toggleResumeHireStatus = asyncHandler(async (req, res) => {
  const resume = await Resume.findById(req.params.id);

  if (!resume) {
    res.status(404);
    throw new Error('Resume not found');
  }

  resume.isHired = !resume.isHired;
  await resume.save();

  res.status(200).json({
    message: `Resume ${
      resume.isHired ? 'marked as hired' : 'marked as available'
    }`,
    resume,
  });
});

// Get resume statistics
const getResumeStats = asyncHandler(async (req, res) => {
  const totalResumes = await Resume.countDocuments();
  const hiredResumes = await Resume.countDocuments({ isHired: true });
  const availableResumes = await Resume.countDocuments({ isHired: false });

  // Get resumes by category
  const resumesByCategory = await Resume.aggregate([
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'categoryInfo',
      },
    },
    {
      $unwind: '$categoryInfo',
    },
    {
      $group: {
        _id: '$category',
        categoryName: { $first: '$categoryInfo.name' },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  // Get recent resumes (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentResumes = await Resume.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  // Get top job titles
  const topJobTitles = await Resume.aggregate([
    {
      $group: {
        _id: '$jobTitle',
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: 5,
    },
  ]);

  // Calculate hire rate
  const hireRate =
    totalResumes > 0 ? Math.round((hiredResumes / totalResumes) * 100) : 0;

  res.status(200).json({
    totalResumes,
    hiredResumes,
    availableResumes,
    recentResumes,
    hireRate,
    resumesByCategory,
    topJobTitles,
  });
});

// Search resumes
const searchResumes = asyncHandler(async (req, res) => {
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
    $or: [
      { fullName: { $regex: searchRegex } },
      { jobTitle: { $regex: searchRegex } },
    ],
  };

  const total = await Resume.countDocuments(searchQuery);
  const resumes = await Resume.find(searchQuery)
    .skip(skip)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('category', 'name')
    .populate('user', 'name email')
    .lean();

  res.status(200).json({
    resumes,
    page,
    totalPages: Math.ceil(total / limit),
    total,
    searchQuery: q.trim(),
  });
});
const deleteMyResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({user: req.user._id});

  if (!resume) {
    res.status(404);
    throw new Error('Resume not found');
  }

  await resume.deleteOne();

  res.status(200).json({ message: 'Resume deleted successfully' });
});

export {
  getAllResumes,
  getAllResumesNoPagination,
  getResumeByUser,
  getResumeById,
  createResume,
  updateResumeByUser,
  updateResumeById,
  deleteResume,
  toggleResumeHireStatus,
  getResumeStats,
  searchResumes,
  deleteMyResume
};
