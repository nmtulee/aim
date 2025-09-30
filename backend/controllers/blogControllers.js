import asyncHandler from '../middlewares/asyncHandler.js';
import Blog from '../models/blogModel.js';
import mongoose from 'mongoose';

const createBlog = asyncHandler(async (req, res) => {
  const { title, description, image } = req.body;
  const trimmedTitle = title?.trim();
  const trimmedDescription = description?.trim();

  if (!trimmedTitle || !trimmedDescription || !image) {
    res.status(400);
    throw new Error('Please fill all fields');
  }

  const user = req.user._id;
  const blog = await Blog.create({
    title: trimmedTitle,
    description: trimmedDescription,
    image,
    user,
  });

  res.status(201).json({
    message: 'Blog created successfully',
    blog,
  });
});

const updateBlog = asyncHandler(async (req, res) => {
  const { title, description, image } = req.body;
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }

  // Check if user owns the blog
  if (!req.user.superAdmin) {
    
    if (blog.user.toString() !== req.user._id.toString() )  {
      res.status(403);
      throw new Error('Not authorized to update this blog');
    }
  }

  const trimmedTitle = title?.trim();
  const trimmedDescription = description?.trim();

  if (trimmedTitle) blog.title = trimmedTitle;
  if (trimmedDescription) blog.description = trimmedDescription;
  if (image) blog.image = image;

  await blog.save();

  res.status(200).json({
    message: 'Blog updated successfully',
    blog,
  });
});

const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }

  // Check if user owns the blog or is admin
  if (blog.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Not authorized to delete this blog');
  }

  await Blog.findByIdAndDelete(req.params.id);

  res.status(200).json({
    message: 'Blog deleted successfully',
  });
});

const getAllBlogs = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;
  const skip = (page - 1) * limit;

  const total = await Blog.countDocuments();
  const blogs = await Blog.find({})
    .skip(skip)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'name')
    .lean();

  res.status(200).json({
    blogs,
    page,
    totalPages: Math.ceil(total / limit),
    total,
    hasNextPage: page < Math.ceil(total / limit),
    hasPrevPage: page > 1,
  });
});

const createReview = asyncHandler(async (req, res) => {
  const { comment } = req.body;
  const trimmedComment = comment?.trim();

  if (!trimmedComment) {
    res.status(400);
    throw new Error('Comment cannot be empty');
  }

  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }

  // Check if user already reviewed this blog
  const existingReview = blog.reviews.find(
    (review) => review.user.toString() === req.user._id.toString()
  );

  if (existingReview) {
    res.status(400);
    throw new Error('You have already reviewed this blog');
  }

  const newReview = {
    user: req.user._id,
    comment: trimmedComment,
  };

  blog.reviews.push(newReview);
  await blog.save();

  res.status(201).json({
    message: 'Review added successfully',
    reviews: blog.reviews,
  });
});

const deleteReview = asyncHandler(async (req, res) => {
  const { blogId, reviewId } = req.params;

  const blog = await Blog.findById(blogId);
  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }

  const reviewIndex = blog.reviews.findIndex(
    (review) => review._id.toString() === reviewId
  );

  if (reviewIndex === -1) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Check if user owns the review or the blog or is admin
  const review = blog.reviews[reviewIndex];
  if (
    review.user.toString() !== req.user._id.toString() &&
    blog.user.toString() !== req.user._id.toString() &&
    !req.user.isAdmin
  ) {
    res.status(403);
    throw new Error('Not authorized to delete this review');
  }

  blog.reviews.splice(reviewIndex, 1);
  await blog.save();

  res.status(200).json({
    message: 'Review deleted successfully',
    reviews: blog.reviews,
  });
});

const getBlogById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate MongoDB ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid blog ID format');
  }

  const blog = await Blog.findById(id)
    .populate('user', 'name')
    .populate('reviews.user', 'name email')
    .lean();

  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }

  res.status(200).json(blog);
});

const getBlogsStats = asyncHandler(async (req, res) => {
  const totalBlogs = await Blog.countDocuments();

  const totalReviews = await Blog.aggregate([
    { $project: { reviewCount: { $size: '$reviews' } } },
    { $group: { _id: null, total: { $sum: '$reviewCount' } } },
  ]);

  const allBlogs = await Blog.find().populate('user', 'name').lean();

  const blogsWithMostReviews = allBlogs
    .sort((a, b) => b.reviews.length - a.reviews.length)
    .slice(0, 5);


  // Get unique authors count
  const activeAuthors = await Blog.distinct('user').countDocuments();

  // Calculate average reviews per blog
  const averageReviews =
    totalBlogs > 0
      ? Math.round(((totalReviews[0]?.total || 0) / totalBlogs) * 10) / 10
      : 0;

  res.status(200).json({
    totalBlogs,
    totalReviews: totalReviews[0]?.total || 0,
    blogsWithMostReviews,
    activeAuthors,
    averageReviews,
  });
});

// Fixed function name (was getBlos)
const getAllBlogsNoPagination = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({})
    .populate('user', 'name')
    .sort({ createdAt: -1 })
    .lean();
  res.status(200).json(blogs);
});

// Additional utility functions
const getBlogsByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;
  const skip = (page - 1) * limit;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400);
    throw new Error('Invalid user ID format');
  }

  const total = await Blog.countDocuments({ user: userId });
  const blogs = await Blog.find({ user: userId })
    .skip(skip)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'name')
    .lean();

  res.status(200).json({
    blogs,
    page,
    totalPages: Math.ceil(total / limit),
    total,
  });
});

const searchBlogs = asyncHandler(async (req, res) => {
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
      { title: { $regex: searchRegex } },
      { description: { $regex: searchRegex } },
    ],
  };

  const total = await Blog.countDocuments(searchQuery);
  const blogs = await Blog.find(searchQuery)
    .skip(skip)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'name')
    .lean();

  res.status(200).json({
    blogs,
    page,
    totalPages: Math.ceil(total / limit),
    total,
    searchQuery: q.trim(),
  });
});

export {
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
  createReview,
  deleteReview,
  getBlogById,
  getBlogsStats,
  getAllBlogsNoPagination, // This replaces getBlos
  getBlogsByUser,
  searchBlogs,
};
