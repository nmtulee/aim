import mongoose from "mongoose";
import LanguageCourse from "../models/LanguageCourse.js";
import asyncHandler from "../middlewares/asyncHandler.js";





const createLanguageCourse = asyncHandler(async (req, res) => {
  const { couresName, shortName, image, description, country, levels } =
    req.body;

  // Trim and validate input
  const trimmedCourseName = couresName?.trim();
  const trimmedShortName = shortName?.trim();
  const trimmedImage = image?.trim();
  const trimmedDescription = description?.trim();
  const trimmedCountry = country?.trim();

  if (
    !trimmedCourseName ||
    !trimmedShortName ||
    !trimmedImage ||
    !trimmedDescription ||
    !trimmedCountry ||
    !levels?.length
  ) {
    res.status(400);
    throw new Error('Please fill all required fields');
  }

  // Validate image URL if provided
  if (trimmedImage && !isValidUrl(trimmedImage)) {
    res.status(400);
    throw new Error('Invalid image URL format');
  }

  // Validate levels array
  const validatedLevels = levels.map((level) => {
    const { level: levelName, CourseFee, duration, description } = level;

    if (
      !levelName?.trim() ||
      !CourseFee?.trim() ||
      !duration?.trim() ||
      !description?.trim()
    ) {
      res.status(400);
      throw new Error('All level fields are required');
    }

    return {
      level: levelName.trim(),
      CourseFee: CourseFee.trim(),
      duration: duration.trim(),
      description: description.trim(),
    };
  });

  const languageCourseData = {
    couresName: trimmedCourseName,
    shortName: trimmedShortName,
    image: trimmedImage,
    description: trimmedDescription,
    country: trimmedCountry,
    levels: validatedLevels,
  };

  const languageCourse = await LanguageCourse.create(languageCourseData);

  res.status(201).json({
    message: 'Language course created successfully',
    languageCourse,
  });
});

const getAllLanguageCourses = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build filter object
  const filter = {};

  // Filter by country
  if (req.query.country) {
    filter.country = new RegExp(req.query.country, 'i');
  }

  // Search by course name
  if (req.query.search) {
    filter.$or = [
      { couresName: new RegExp(req.query.search, 'i') },
      { shortName: new RegExp(req.query.search, 'i') },
    ];
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

  const languageCourses = await LanguageCourse.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit);

  const totalCourses = await LanguageCourse.countDocuments(filter);
  const totalPages = Math.ceil(totalCourses / limit);

  res.json({
    languageCourses,
    pagination: {
      currentPage: page,
      totalPages,
      totalCourses,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
});

const getLanguageCourses = asyncHandler(async (req, res) => {
  const languageCourses = await LanguageCourse.find();
  res.json(languageCourses);
});

const getLanguageCourseById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid language course ID');
  }

  const languageCourse = await LanguageCourse.findById(id);

  if (!languageCourse) {
    res.status(404);
    throw new Error('Language course not found');
  }

  res.json(languageCourse);
});
  
const updateLanguageCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { couresName, shortName, image, description, country, levels } =
    req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid language course ID');
  }

  const languageCourse = await LanguageCourse.findById(id);

  if (!languageCourse) {
    res.status(404);
    throw new Error('Language course not found');
  }

  // Trim and validate input if provided
  const updateData = {};

  if (couresName !== undefined) {
    const trimmedCourseName = couresName.trim();
    if (!trimmedCourseName) {
      res.status(400);
      throw new Error('Course name cannot be empty');
    }
    updateData.couresName = trimmedCourseName;
  }

  if (shortName !== undefined) {
    const trimmedShortName = shortName.trim();
    if (!trimmedShortName) {
      res.status(400);
      throw new Error('Short name cannot be empty');
    }
    updateData.shortName = trimmedShortName;
  }

  if (image !== undefined) {
    const trimmedImage = image.trim();
    if (!trimmedImage) {
      res.status(400);
      throw new Error('Image cannot be empty');
    }
    if (!isValidUrl(trimmedImage)) {
      res.status(400);
      throw new Error('Invalid image URL format');
    }
    updateData.image = trimmedImage;
  }

  if (description !== undefined) {
    const trimmedDescription = description.trim();
    if (!trimmedDescription) {
      res.status(400);
      throw new Error('Description cannot be empty');
    }
    updateData.description = trimmedDescription;
  }

  if (country !== undefined) {
    const trimmedCountry = country.trim();
    if (!trimmedCountry) {
      res.status(400);
      throw new Error('Country cannot be empty');
    }
    updateData.country = trimmedCountry;
  }

  if (levels !== undefined) {
    if (!levels.length) {
      res.status(400);
      throw new Error('At least one level is required');
    }

    const validatedLevels = levels.map((level) => {
      const { level: levelName, CourseFee, duration, description } = level;

      if (
        !levelName?.trim() ||
        !CourseFee?.trim() ||
        !duration?.trim() ||
        !description?.trim()
      ) {
        res.status(400);
        throw new Error('All level fields are required');
      }

      return {
        level: levelName.trim(),
        CourseFee: CourseFee.trim(),
        duration: duration.trim(),
        description: description.trim(),
      };
    });

    updateData.levels = validatedLevels;
  }

  const updatedLanguageCourse = await LanguageCourse.findByIdAndUpdate(
    id,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  res.json({
    message: 'Language course updated successfully',
    languageCourse: updatedLanguageCourse,
  });
});

const deleteLanguageCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid language course ID');
  }

  const languageCourse = await LanguageCourse.findById(id);

  if (!languageCourse) {
    res.status(404);
    throw new Error('Language course not found');
  }

  await LanguageCourse.findByIdAndDelete(id);

  res.json({
    message: 'Language course deleted successfully',
  });
});

const getLanguageCoursesStats = asyncHandler(async (req, res) => {
  const totalCourses = await LanguageCourse.countDocuments();

  // Courses by country
  const coursesByCountry = await LanguageCourse.aggregate([
    { $group: { _id: '$country', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  // Average levels per course
  const avgLevelsPerCourse = await LanguageCourse.aggregate([
    { $project: { levelCount: { $size: '$levels' } } },
    { $group: { _id: null, avgLevels: { $avg: '$levelCount' } } },
  ]);

  // Recent courses (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentCourses = await LanguageCourse.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  // Most popular course names (based on shortName)
  const popularCourseNames = await LanguageCourse.aggregate([
    { $group: { _id: '$shortName', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);

  res.json({
    totalCourses,
    recentCourses,
    averageLevelsPerCourse: avgLevelsPerCourse[0]?.avgLevels || 0,
    coursesByCountry,
    popularCourseNames,
  });
});
  
const addLevelToCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { level, CourseFee, duration, description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid language course ID');
  }

  if (
    !level?.trim() ||
    !CourseFee?.trim() ||
    !duration?.trim() ||
    !description?.trim()
  ) {
    res.status(400);
    throw new Error('All level fields are required');
  }

  const languageCourse = await LanguageCourse.findById(id);

  if (!languageCourse) {
    res.status(404);
    throw new Error('Language course not found');
  }

  const newLevel = {
    level: level.trim(),
    CourseFee: CourseFee.trim(),
    duration: duration.trim(),
    description: description.trim(),
  };

  languageCourse.levels.push(newLevel);
  await languageCourse.save();

  res.status(201).json({
    message: 'Level added successfully',
    languageCourse,
  });
});

const updateCourseLevel = asyncHandler(async (req, res) => {
  const { id, levelId } = req.params;
  const { level, CourseFee, duration, description } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(id) ||
    !mongoose.Types.ObjectId.isValid(levelId)
  ) {
    res.status(400);
    throw new Error('Invalid language course ID or level ID');
  }

  const languageCourse = await LanguageCourse.findById(id);

  if (!languageCourse) {
    res.status(404);
    throw new Error('Language course not found');
  }

  const levelIndex = languageCourse.levels.findIndex(
    (lvl) => lvl._id.toString() === levelId
  );

  if (levelIndex === -1) {
    res.status(404);
    throw new Error('Level not found');
  }

  // Update only provided fields
  if (level !== undefined) {
    const trimmedLevel = level.trim();
    if (!trimmedLevel) {
      res.status(400);
      throw new Error('Level cannot be empty');
    }
    languageCourse.levels[levelIndex].level = trimmedLevel;
  }

  if (CourseFee !== undefined) {
    const trimmedCourseFee = CourseFee.trim();
    if (!trimmedCourseFee) {
      res.status(400);
      throw new Error('Course fee cannot be empty');
    }
    languageCourse.levels[levelIndex].CourseFee = trimmedCourseFee;
  }

  if (duration !== undefined) {
    const trimmedDuration = duration.trim();
    if (!trimmedDuration) {
      res.status(400);
      throw new Error('Duration cannot be empty');
    }
    languageCourse.levels[levelIndex].duration = trimmedDuration;
  }

  if (description !== undefined) {
    const trimmedDescription = description.trim();
    if (!trimmedDescription) {
      res.status(400);
      throw new Error('Description cannot be empty');
    }
    languageCourse.levels[levelIndex].description = trimmedDescription;
  }

  await languageCourse.save();

  res.json({
    message: 'Level updated successfully',
    languageCourse,
  });
});

const deleteCourseLevel = asyncHandler(async (req, res) => {
  const { id, levelId } = req.params;

  if (
    !mongoose.Types.ObjectId.isValid(id) ||
    !mongoose.Types.ObjectId.isValid(levelId)
  ) {
    res.status(400);
    throw new Error('Invalid language course ID or level ID');
  }

  const languageCourse = await LanguageCourse.findById(id);

  if (!languageCourse) {
    res.status(404);
    throw new Error('Language course not found');
  }

  if (languageCourse.levels.length <= 1) {
    res.status(400);
    throw new Error(
      'Cannot delete the last level. Course must have at least one level.'
    );
  }

  const levelIndex = languageCourse.levels.findIndex(
    (lvl) => lvl._id.toString() === levelId
  );

  if (levelIndex === -1) {
    res.status(404);
    throw new Error('Level not found');
  }

  languageCourse.levels.splice(levelIndex, 1);
  await languageCourse.save();

  res.json({
    message: 'Level deleted successfully',
    languageCourse,
  });
});

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
    createLanguageCourse,
    getAllLanguageCourses,
    getLanguageCourses,
    getLanguageCourseById,
    updateLanguageCourse,
    deleteLanguageCourse,
    getLanguageCoursesStats,
    addLevelToCourse,
    updateCourseLevel,
    deleteCourseLevel,
}