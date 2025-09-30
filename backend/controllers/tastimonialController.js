import asyncHandler from '../middlewares/asyncHandler.js';
import Testimonial from '../models/testimonialModel.js';

// Helper function to validate and trim testimonial data
// Helper function to validate and trim testimonial data
const validateAndTrimTestimonialData = (data, isPartial = false) => {
  const { title, message, photo, country, jobTitle, rating } = data;

  const trimmedData = {
    title: title?.trim(),
    message: message?.trim(),
    photo: photo?.trim(),
    country: country?.trim(),
    jobTitle: jobTitle?.trim(),
    rating: rating ? Number(rating) : undefined,
  };

  const errors = [];

  // Title
  if (trimmedData.title !== undefined) {
    if (trimmedData.title.length < 3) {
      errors.push('Title must be at least 3 characters long');
    }
  } else if (!isPartial) {
    errors.push('Title is required');
  }

  // Message
  if (trimmedData.message !== undefined) {
    if (trimmedData.message.length < 10) {
      errors.push('Message must be at least 10 characters long');
    }
    if (trimmedData.message.length > 1000) {
      errors.push('Message cannot exceed 1000 characters');
    }
  } else if (!isPartial) {
    errors.push('Message is required');
  }

  // Photo
  if (trimmedData.photo !== undefined) {
    if (!trimmedData.photo) {
      errors.push('Photo URL cannot be empty');
    }
  } else if (!isPartial) {
    errors.push('Photo URL is required');
  }

  // Country
  if (trimmedData.country !== undefined) {
    if (trimmedData.country.length < 2) {
      errors.push('Country must be at least 2 characters long');
    }
  } else if (!isPartial) {
    errors.push('Country is required');
  }

  // Job title
  if (trimmedData.jobTitle !== undefined) {
    if (trimmedData.jobTitle.length < 2) {
      errors.push('Job title must be at least 2 characters long');
    }
  } else if (!isPartial) {
    errors.push('Job title is required');
  }

  // Rating
  if (trimmedData.rating !== undefined) {
    if (trimmedData.rating < 1 || trimmedData.rating > 5) {
      errors.push('Rating must be between 1 and 5');
    }
  }

  return { trimmedData, errors };
};


// Create a new testimonial
const createTestimonial = asyncHandler(async (req, res) => {
  // Check if user already has a testimonial
  const existingTestimonial = await Testimonial.findOne({ user: req.user._id });

  if (existingTestimonial) {
    res.status(409);
    throw new Error(
      'You already have a testimonial. Please update your existing one instead.'
    );
  }

  const { trimmedData, errors } = validateAndTrimTestimonialData(req.body);

  if (errors.length > 0) {
    res.status(400);
    throw new Error(`Validation errors: ${errors.join(', ')}`);
  }

  const testimonial = await Testimonial.create({
    user: req.user._id,
    ...trimmedData,
  });

  res.status(201).json({
    success: true,
    message: 'Testimonial created successfully',
    data: testimonial,
  });
});

// Update user's own testimonial
const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findOne({ user: req.user._id });

  if (!testimonial) {
    res.status(404);
    throw new Error('Testimonial not found. Please create one first.');
  }

  const { trimmedData, errors } = validateAndTrimTestimonialData(req.body);

  // For updates, we allow partial validation (empty fields will keep existing values)
  const partialErrors = errors.filter(
    (error) =>
      !error.includes('is required') ||
      (error.includes('Title') && req.body.title !== undefined) ||
      (error.includes('Message') && req.body.message !== undefined) ||
      (error.includes('Photo') && req.body.photo !== undefined) ||
      (error.includes('Country') && req.body.country !== undefined) ||
      (error.includes('Job title') && req.body.jobTitle !== undefined)
  );

  if (partialErrors.length > 0) {
    res.status(400);
    throw new Error(`Validation errors: ${partialErrors.join(', ')}`);
  }

  // Update only provided fields
  Object.keys(trimmedData).forEach((key) => {
    if (trimmedData[key] !== undefined && trimmedData[key] !== '') {
      testimonial[key] = trimmedData[key];
    }
  });

  // Reset approval status when user updates their testimonial
  testimonial.approved = false;

  const updatedTestimonial = await testimonial.save();

  res.status(200).json({
    success: true,
    message:
      'Testimonial updated successfully. It will be reviewed for approval.',
    data: updatedTestimonial,
  });
});

// Delete user's own testimonial
const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findOneAndDelete({
    user: req.user._id,
  });

  if (!testimonial) {
    res.status(404);
    throw new Error('Testimonial not found');
  }

  res.status(200).json({
    success: true,
    message: 'Testimonial deleted successfully',
  });
});

// Get user's own testimonial
const getMyTestimonial = asyncHandler(async (req, res) => {
  // Fetch testimonial for the logged-in user

    
    
    const testimonial = await Testimonial.findOne({ user: req.user._id })
    .populate('user', 'name email')
    .lean();
    
    
    if (!testimonial) {
      
      res.status(404)
      throw new Error("You haven't submitted a testimonial yet.");
    }
    

    // Respond with testimonial data
    res.status(200).json({
      success: true,
      data: testimonial ,
    });

  
});

// Admin: Update testimonial by ID
const updateTestimonialById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { approved, rating, ...otherFields } = req.body;

  const testimonial = await Testimonial.findById(id);

  if (!testimonial) {
    res.status(404);
    throw new Error('Testimonial not found');
  }

  // Validate other fields if provided
  if (Object.keys(otherFields).length > 0) {
    const { trimmedData, errors } = validateAndTrimTestimonialData(
      otherFields,
      true
    );

    const partialErrors = errors.filter(
      (error) =>
        !error.includes('is required') ||
        (error.includes('Title') && otherFields.title !== undefined) ||
        (error.includes('Message') && otherFields.message !== undefined) ||
        (error.includes('Photo') && otherFields.photo !== undefined) ||
        (error.includes('Country') && otherFields.country !== undefined) ||
        (error.includes('Job title') && otherFields.jobTitle !== undefined)
    );

    if (partialErrors.length > 0) {
      res.status(400);
      throw new Error(`Validation errors: ${partialErrors.join(', ')}`);
    }

    // Update provided fields
    Object.keys(trimmedData).forEach((key) => {
      if (trimmedData[key] !== undefined && trimmedData[key] !== '') {
        testimonial[key] = trimmedData[key];
      }
    });
  }

  // Handle approval status
  if (typeof approved === 'boolean') {
    testimonial.approved = approved;
  }

  // Handle rating
  if (rating !== undefined) {
    const numRating = Number(rating);
    if (numRating >= 1 && numRating <= 5) {
      testimonial.rating = numRating;
    } else {
      res.status(400);
      throw new Error('Rating must be between 1 and 5');
    }
  }

  const updated = await testimonial.save();

  res.status(200).json({
    success: true,
    message: 'Testimonial updated successfully',
    data: updated,
  });
});

// Get all approved testimonials with pagination
const getAllTestimonials = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 6)); // Max 50 per page
  const sortBy = req.query.sortBy || 'createdAt';
  const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
  const country = req.query.country;
  const minRating = req.query.minRating
    ? Number(req.query.minRating)
    : undefined;

  const skip = (page - 1) * limit;

  // Build query filter
  const filter = { approved: true };

  if (country) {
    filter.country = {
      $regex: country.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      $options: 'i',
    };
  }

  if (minRating && minRating >= 1 && minRating <= 5) {
    filter.rating = { $gte: minRating };
  }

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder;


  

  const testimonials = await Testimonial.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate('user', 'name email')
    .lean();

  const totalTestimonials = await Testimonial.countDocuments(filter);
  const totalPages = Math.ceil(totalTestimonials / limit);

  res.status(200).json({
    success: true,
    data: {
      testimonials,
      pagination: {
        totalTestimonials,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    },
  });
});

// Admin: Get testimonial by ID
const getTestimonialById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400);
    throw new Error('Invalid testimonial ID format');
  }

  const testimonial = await Testimonial.findById(id).populate(
    'user',
    'name email'
  );

  if (!testimonial) {
    res.status(404);
    throw new Error('Testimonial not found');
  }

  res.status(200).json({
    success: true,
    data: testimonial,
  });
});

// Admin: Delete testimonial by ID
const deleteTestimonialById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400);
    throw new Error('Invalid testimonial ID format');
  }

  const testimonial = await Testimonial.findById(id);

  if (!testimonial) {
    res.status(404);
    throw new Error('Testimonial not found');
  }

  await testimonial.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Testimonial deleted successfully',
  });
});

// Admin: Get all testimonials (including unapproved) with filters
const getAllTestimonialsAdmin = asyncHandler(async (req, res) => {
  const Testimonials = await Testimonial.find({})
    .populate('user', 'name email')
    .lean();
  
  res.status(200).json(Testimonials)

});

export {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  updateTestimonialById,
  getAllTestimonials,
  getMyTestimonial,
  deleteTestimonialById,
  getTestimonialById,
  getAllTestimonialsAdmin,
};
