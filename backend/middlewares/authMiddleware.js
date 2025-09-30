import asyncHandler from './asyncHandler.js';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
const authenticate = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user and exclude password
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      res.status(401);
      throw new Error('User not found');
    }

    if (!user.isVarify) {
      res.status(401);
      throw new Error('Please verify your email');
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error(error.message || 'Not authorized, token failed');
  }
});

const authorizeAdmin = asyncHandler(async(req, res, next) => {
  if (req.user.isVarify && req.user.isAdmin) {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }
})

const superAdmin = asyncHandler(async(req, res, next) => {
  if (req.user.email === process.env.GMAIL_USER) {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an super admin');
  }
} )



export {
    authenticate,
    authorizeAdmin,
    superAdmin
}