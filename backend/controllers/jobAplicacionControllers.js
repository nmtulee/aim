import asyncHandler from '../middlewares/asyncHandler.js';
import mongoose from 'mongoose';
import JobApply from '../models/jobApplyModel.js';
import Job from '../models/jobModel.js';
import Resume from '../models/resumeModel.js';

// Apply for a job
const jobAplicacion = asyncHandler(async (req, res) => {
  const { job } = req.body;
  const user = req.user._id;

  if (!user) {
    res.status(400);
    throw new Error('User is not authorized');
  }

  if (!job) {
    res.status(400);
    throw new Error('Job ID is required');
  }

  // Check if job exists
  const jobExists = await Job.findById(job);
  if (!jobExists) {
    res.status(404);
    throw new Error('Job not found');
  }

  if (!jobExists.isActive) {
    res.status(400);
    throw new Error('This job is no longer active');
  }

  // Check resume
  const resume = await Resume.findOne({ user });
  if (!resume) {
    res.status(404);
    throw new Error('Resume not found');
  }

  // Check if already applied
  const existingApplication = await JobApply.findOne({ user, job });
  if (existingApplication) {
    res.status(400);
    throw new Error('You have already applied for this job');
  }

  // Create application
  const apply = await JobApply.create({
    user,
    resume: resume._id,
    job,
  });

  // Populate response
  const populatedApplication = await JobApply.findById(apply._id)
    .populate('user', 'name email')
    .populate('job', 'title salary')
    .populate('resume', 'fullName jobTitle');

  res.status(201).json({
    success: true,
    message: 'Job application submitted successfully',
    data: populatedApplication,
  });
});

// Get all job applications
const getJobAplicacions = asyncHandler(async (req, res) => {
  const applications = await JobApply.find({})
    .populate('user', 'name email')
    .populate('job', 'title salary')
    .populate('resume', 'fullName jobTitle')
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    count: applications.length,
    data: applications,
  });
});

// Get single job application by ID
const getJobAplicacionById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid Application ID');
  }

  const application = await JobApply.findById(id)
    .populate('user', 'name email')
    .populate({
      path: 'job',
      select: 'title salary location country isSchengen',
      populate: { path: 'category', select: 'name' },
    })
    .populate({
      path: 'resume',
      select: 'fullName jobTitle photo file',
      populate: { path: 'category', select: 'name' },
    });

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  res.status(200).json({
    success: true,
    data: application,
  });
});

const getMyJobAplicacion = asyncHandler(async (req, res) => {
  const user = req.user._id;
  const { id } = req.params;
  if (id && !mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid Application ID');
  }

  const applications = await JobApply.findOne({job:id , user })
    .populate('user', 'name email')
    .populate('job', 'title salary')
    .populate('resume', 'fullName jobTitle')
    .sort({ createdAt: -1 })
    .lean();
  
  

  res.status(200).json({
    success: true,
    count: 1,
    data: applications,
  });
});

// Delete job application (admin)
const deleteJobAplicacion = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid Application ID');
  }

  const application = await JobApply.findById(id);
  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  await application.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Application deleted successfully',
  });
});

// Delete my own job application (user)
const deleteMyJobAplicacion = asyncHandler(async (req, res) => {
  const user = req.user._id;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid Application ID');
  }

  const application = await JobApply.findOne({ _id: id, user });
  if (!application) {
    res.status(404);
    throw new Error('Application not found or not authorized');
  }

  await application.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Your application has been deleted successfully',
  });
});

export {
  jobAplicacion,
  getJobAplicacions,
  getJobAplicacionById,
  getMyJobAplicacion ,
  deleteJobAplicacion,
  deleteMyJobAplicacion,
};
