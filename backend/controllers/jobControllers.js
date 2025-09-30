import asyncHandler from '../middlewares/asyncHandler.js';
import Job from '../models/jobModel.js';
import mongoose from 'mongoose';

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private/Admin
const createJob = asyncHandler(async (req, res) => {
  const {
    title,
    image,
    category,
    isSchengen,
    location,
    country,
    description,
    requirements,
    salary,
  } = req.body;

  // Trim and validate input
  const trimmedTitle = title?.trim();
  const trimmedImage = image?.trim();
  const trimmedLocation = location?.trim();
  const trimmedCountry = country?.trim();
  const trimmedDescription = description?.trim();
  const trimmedRequirements = requirements
    ?.map((req) => req.trim())
    .filter((req) => req.length > 0);
  const trimmedSalary = salary?.trim();

  if (
    !trimmedTitle ||
    !category ||
    !trimmedLocation ||
    !trimmedCountry ||
    !trimmedDescription ||
    !trimmedRequirements?.length ||
    !trimmedSalary
  ) {
    res.status(400);
    throw new Error('Please fill all required fields');
  }

  // Validate category ObjectId
  if (!mongoose.Types.ObjectId.isValid(category)) {
    res.status(400);
    throw new Error('Invalid category ID');
  }

  // Validate image URL if provided
  if (trimmedImage && !isValidUrl(trimmedImage)) {
    res.status(400);
    throw new Error('Invalid image URL format');
  }

  const jobData = {
    title: trimmedTitle,
    category,
    isSchengen: isSchengen || false,
    location: trimmedLocation,
    country: trimmedCountry,
    description: trimmedDescription,
    requirements: trimmedRequirements,
    salary: trimmedSalary,
  };

  // Add image if provided
  if (trimmedImage) {
    jobData.image = trimmedImage;
  }

  const job = await Job.create(jobData);

  res.status(201).json({
    message: 'Job created successfully',
    job,
  });
});

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getAllJobs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build filter object
  const filter = {};

  // Filter by active status (default to active jobs only)
  filter.isActive = req.query.includeInactive === 'true' ? { $in: [true, false] } : true;

  // Filter by category
  if (req.query.category) {
    filter.category = req.query.category;
  }

  // Filter by country
  if (req.query.country) {
    filter.country = new RegExp(req.query.country, 'i');
  }

  // Filter by Schengen status
  if (req.query.isSchengen !== undefined) {
    filter.isSchengen = req.query.isSchengen === 'true';
  }

  // Search by title
  if (req.query.search) {
    filter.title = new RegExp(req.query.search, 'i');
  }

  // Sort options
  let sortBy = {};
  if (req.query.sortBy) {
    const sortField = req.query.sortBy;
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
    sortBy[sortField] = sortOrder;
  } else {
    sortBy.createdAt = -1; // Default sort by newest first
  }

  const jobs = await Job.find(filter)
    .populate('category', 'name')
    .sort(sortBy)
    .skip(skip)
    .limit(limit);

  const totalJobs = await Job.countDocuments(filter);
  const totalPages = Math.ceil(totalJobs / limit);

  res.json({
    jobs,
    pagination: {
      currentPage: page,
      totalPages,
      totalJobs,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
});
const getJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find().populate('category', 'name');
  res.json(jobs);
});

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid job ID');
  }

  const job = await Job.findById(id).populate('category', 'name');

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  res.json(job);
});

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private/Admin
const updateJob = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    image,
    category,
    isSchengen,
    location,
    country,
    description,
    requirements,
    salary,
    isActive,
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid job ID');
  }

  const job = await Job.findById(id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  // Trim and validate input if provided
  const updateData = {};

  if (title !== undefined) {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      res.status(400);
      throw new Error('Title cannot be empty');
    }
    updateData.title = trimmedTitle;
  }

  if (image !== undefined) {
    const trimmedImage = image.trim();
    if (trimmedImage && !isValidUrl(trimmedImage)) {
      res.status(400);
      throw new Error('Invalid image URL format');
    }
    updateData.image = trimmedImage;
  }

  if (category !== undefined) {
    if (!mongoose.Types.ObjectId.isValid(category)) {
      res.status(400);
      throw new Error('Invalid category ID');
    }
    updateData.category = category;
  }

  if (isSchengen !== undefined) {
    updateData.isSchengen = isSchengen;
  }

  if (location !== undefined) {
    const trimmedLocation = location.trim();
    if (!trimmedLocation) {
      res.status(400);
      throw new Error('Location cannot be empty');
    }
    updateData.location = trimmedLocation;
  }

  if (country !== undefined) {
    const trimmedCountry = country.trim();
    if (!trimmedCountry) {
      res.status(400);
      throw new Error('Country cannot be empty');
    }
    updateData.country = trimmedCountry;
  }

  if (description !== undefined) {
    const trimmedDescription = description.trim();
    if (!trimmedDescription) {
      res.status(400);
      throw new Error('Description cannot be empty');
    }
    updateData.description = trimmedDescription;
  }

  if (requirements !== undefined) {
    const trimmedRequirements = requirements
      .map((req) => req.trim())
      .filter((req) => req.length > 0);
    if (!trimmedRequirements.length) {
      res.status(400);
      throw new Error('At least one requirement is needed');
    }
    updateData.requirements = trimmedRequirements;
  }

  if (salary !== undefined) {
    const trimmedSalary = salary.trim();
    if (!trimmedSalary) {
      res.status(400);
      throw new Error('Salary cannot be empty');
    }
    updateData.salary = trimmedSalary;
  }

  if (isActive !== undefined) {
    updateData.isActive = isActive;
  }

  const updatedJob = await Job.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate('category', 'name');

  res.json({
    message: 'Job updated successfully',
    job: updatedJob,
  });
});

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private/Admin
const deleteJob = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid job ID');
  }

  const job = await Job.findById(id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  await Job.findByIdAndDelete(id);

  res.json({
    message: 'Job deleted successfully',
  });
});

// @desc    Toggle job active status
// @route   PATCH /api/jobs/:id/toggle-status
// @access  Private/Admin
const toggleJobStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid job ID');
  }

  const job = await Job.findById(id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  job.isActive = !job.isActive;
  await job.save();

  res.json({
    message: `Job ${job.isActive ? 'activated' : 'deactivated'} successfully`,
    job,
  });
});

// @desc    Get jobs by category
// @route   GET /api/jobs/category/:categoryId
// @access  Public
const getJobsByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    res.status(400);
    throw new Error('Invalid category ID');
  }

  const filter = {
    category: categoryId,
    isActive: true,
  };

  const jobs = await Job.find(filter)
    .populate('category', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalJobs = await Job.countDocuments(filter);
  const totalPages = Math.ceil(totalJobs / limit);

  res.json({
    jobs,
    pagination: {
      currentPage: page,
      totalPages,
      totalJobs,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
});

// @desc    Get jobs statistics
// @route   GET /api/jobs/stats
// @access  Private/Admin
const getJobsStats = asyncHandler(async (req, res) => {
  const totalJobs = await Job.countDocuments();
  const activeJobs = await Job.countDocuments({ isActive: true });
  const inactiveJobs = await Job.countDocuments({ isActive: false });
  const schengenJobs = await Job.countDocuments({
    isSchengen: true,
    isActive: true,
  });

  // Jobs by country
  const jobsByCountry = await Job.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$country', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  // Jobs by category
  const jobsByCategory = await Job.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'category',
      },
    },
    { $unwind: '$category' },
    { $project: { _id: 0, categoryName: '$category.name', count: 1 } },
    { $sort: { count: -1 } },
  ]);

  // Recent jobs (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentJobs = await Job.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
    isActive: true,
  });

  res.json({
    totalJobs,
    activeJobs,
    inactiveJobs,
    schengenJobs,
    recentJobs,
    jobsByCountry,
    jobsByCategory,
  });
});

// Helper function to validate URL format
const isValidUrl = (string) => {
  // Accept local upload path like /uploads/file.jpg
  if (/^\/uploads\/.+\.(jpg|jpeg|png|webp)$/i.test(string)) {
    return true;
  }

  // Accept full URLs (https://...)
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};


export {
  createJob,
  getAllJobs,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  toggleJobStatus,
  getJobsByCategory,
  getJobsStats,
};
