import asyncHandler from "../middlewares/asyncHandler.js";
import StudyWork from "../models/studyWork.js";
import mongoose from "mongoose";

const createStudyWork = asyncHandler(async (req, res) => {
  const {
    country,
    title,
    subtitle,
    bannerImage,
    whyCountry,
    whoCanApply,
    howWeHelp,
    whyChooseUs,
  } = req.body;

  if (
      !country ||
    !title ||
    !subtitle ||
    !bannerImage ||
    !whyCountry?.description ||
    !whoCanApply?.description ||
    !howWeHelp?.description
  ) {
    res.status(400);
    throw new Error('Please fill all required fields');
  }

  const sanitizeArray = (arr) =>
    Array.isArray(arr)
      ? arr.map((s) => s.trim()).filter((s) => s.length > 0)
      : [];

  const studyWork = await StudyWork.create({
    country: country.trim(),
    title: title?.trim() || 'Study and Work Abroad', // fallback to schema default
    subtitle: subtitle.trim(),
    bannerImage: bannerImage.trim(),
    whyCountry: {
      description: whyCountry.description.trim(),
      points: sanitizeArray(whyCountry.points),
    },
    whoCanApply: {
      description: whoCanApply.description.trim(),
      requirements: sanitizeArray(whoCanApply.requirements),
    },
    howWeHelp: {
      description: howWeHelp.description.trim(),
      services: sanitizeArray(howWeHelp.services),
    },
    whyChooseUs: {
      points: sanitizeArray(whyChooseUs?.points),
    },
  });

  res.status(201).json({
    success: true,
    message: 'Study & Work entry created successfully',
    data: studyWork,
  });
});

const getAllStudyWorks = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};

  // Search by country
  if (req.query.country) {
    filter.country = new RegExp(req.query.country, 'i');
  }

  const studyWorks = await StudyWork.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await StudyWork.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  res.json({
    studyWorks,
    pagination: {
      currentPage: page,
      totalPages,
      total,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
});

const getStudyWorkById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid StudyWork ID');
  }

  const studyWork = await StudyWork.findById(id);

  if (!studyWork) {
    res.status(404);
    throw new Error('StudyWork entry not found');
  }

  res.status(200).json({
    success: true,
    data: studyWork,
  });
});

const updateStudyWork = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid StudyWork ID');
  }

  const studyWork = await StudyWork.findById(id);
  if (!studyWork) {
    res.status(404);
    throw new Error('StudyWork entry not found');
  }

  Object.assign(studyWork, req.body);
  await studyWork.save();

  res.status(200).json({
    success: true,
    message: 'Study & Work entry updated successfully',
    data: studyWork,
  });
});

const deleteStudyWork = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid StudyWork ID');
  }

  const studyWork = await StudyWork.findById(id);
  if (!studyWork) {
    res.status(404);
    throw new Error('StudyWork entry not found');
  }

  await studyWork.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Study & Work entry deleted successfully',
  });
});

const getStudyWorks = asyncHandler(async (req, res) => {
  const studyWorks = await StudyWork.find()
  res.status(200).json({
    success: true,
    data: studyWorks,
  });
});


export {
  createStudyWork,
  getAllStudyWorks,
  getStudyWorkById,
  updateStudyWork,
  deleteStudyWork,
  getStudyWorks
};
