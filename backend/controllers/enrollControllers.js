import asyncHandler from '../middlewares/asyncHandler.js';
import mongoose from 'mongoose';
import LanguageCourse from '../models/LanguageCourse.js';
import LanguageEnroll from '../models/LanguageEnroll.js'; // fixed import

const Enroll = asyncHandler(async (req, res) => {
  const { course, level } = req.body;
  const user = req.user._id;

  if (!user) {
    res.status(401);
    throw new Error('User is not authorized');
  }

  if (!course || !level) {
    res.status(400);
    throw new Error('All inputs are required');
  }

  // Check if course exists
  const isCourseExists = await LanguageCourse.findById(course);
  if (!isCourseExists) {
    res.status(404);
    throw new Error('Course not found');
  }

  // Check if user already enrolled
  const existingEnroll = await LanguageEnroll.findOne({ user, course });
  if (existingEnroll) {
    res.status(400);
    throw new Error('You have already applied for this Language Course');
  }

  // Enroll now
  const enrollNow = await LanguageEnroll.create({
    user,
    course,
    selectedLevel: level,
  });

  res.status(201).json({
    success: true,
    message: 'Language Course enrolled successfully',
    data: enrollNow,
  });
});

const getEnrollByUserAndCourse = asyncHandler(async (req, res) => {
  const user = req.user._id;
  const { courseId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    res.status(400);
    throw new Error('Invalid Course ID');
  }

  const enroll = await LanguageEnroll.findOne({
    user,
    course: courseId,
  }).populate('course', 'couresName shortName country ');

  if (!enroll) {
    res.status(404);
    throw new Error('Enrollment not found for this course');
  }

  res.status(200).json({
    success: true,
    data: enroll,
  });
});

// Get all enrollments (admin)
const getAllEnrolls = asyncHandler(async (req, res) => {
    const enrolls = await LanguageEnroll.find({})
      .populate('user', 'name email phone')
      .populate('course', 'couresName shortName country image')
      .sort({ createdAt: -1 })
      .lean();
  
    res.status(200).json({
      success: true,
      count: enrolls.length,
      data: enrolls,
    });
  });
  
  const deleteEnrollById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Invalid Enrollment ID');
    }

    const enroll = await LanguageEnroll.findById(id);
    if (!enroll) {
      res.status(404);
      throw new Error('Enrollment not found');
    }

    await enroll.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Enrollment deleted successfully',
    });
  });
  
  
  

export {
    Enroll,
    getEnrollByUserAndCourse,
    getAllEnrolls,
    deleteEnrollById
};


