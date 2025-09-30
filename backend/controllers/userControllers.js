import asyncHandler from '../middlewares/asyncHandler.js';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import Verification from '../models/verificationModel.js';
import sendEmail from '../utils/sendEmail.js';
import generateToken from '../utils/createToken.js';

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password,phone } = req.body;

  if (!name?.trim() || !email?.trim() || !password?.trim() || !phone?.trim()) {
    res.status(400);
    throw new Error('Please fill all the fields');
  }
  const existingUser = await User.findOne({
    $or: [{ email:email?.trim().toLowerCase() }, { phone:phone?.trim() }],
  }).lean();

  if (existingUser) {
    let errorMessage = 'User already exists with ';
    if (existingUser.email === email && existingUser.phone === phone) {
      errorMessage += 'this email and phone.';
    } else if (existingUser.email === email) {
      errorMessage += 'this email.';
    } else {
      errorMessage += 'this phone number.';
    }

    res.status(400);
    throw new Error(errorMessage);
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name: name?.trim(),
    email: email?.trim().toLowerCase(),
    phone: phone?.trim(),
    password: hashedPassword,
  });
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    isAdmin: user.isAdmin,
    isVarify: user.isVarify,
  });
});

const sendVerificationCode = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const trimdEmail = email?.trim().toLowerCase();
  //validate input
  const user = await User.findOne({ email:trimdEmail }).lean();
  if (!user) {
    res.status(401);
    throw new Error('user not found');
  }
  const token = Math.floor(100000 + Math.random() * 900000).toString();

  const salt = await bcrypt.genSalt(10);
  const hashedToken = await bcrypt.hash(token, salt);

  await Verification.deleteMany({ userId: user._id });

  await Verification.create({
    userId: user._id,
    verificationCode: hashedToken,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });
  const message = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #ffffff; background-color:#1a202c; padding: 20px; border-radius: 8px; width: 100%; max-width: 600px; margin: auto;text-align: center;">
    <h2 style="color: #63b3ed;">Hello ${user.name},</h2>
    <p>Thank you for registering with us!</p>
    <p>Your verification code is:</p>
    <div style="font-size: 24px; font-weight: bold; color: #63b3ed; margin: 10px 0;">
      ${token}
    </div>
    <p>This code will expire in <strong>5 minutes</strong>.</p>
    <p>If you did not request this, please ignore this email.</p>
    <br />
    <p style="font-size: 14px; color: #a0aec0;">— AR Team</p>
  </div>
`;

  res.json({ message: 'Verification token sent successfully' });
  await sendEmail({
    to: user.email,
    subject: 'Email verification',
    text: 'Please verify your email',
    html: message,
  });

});

const verifyCode = asyncHandler(async (req, res) => {
  const { email, code } = req.body;
  const trimdEmail = email?.trim().toLowerCase();
  const trimdCode = code?.trim();
  //validate input
  if (!trimdEmail || !trimdCode) {
    res.status(400);
    throw new Error('Please fill all the fields');
  }
  //find user
  const user = await User.findOne({ email:trimdEmail });
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  //find verification code
  const verification = await Verification.findOne({
    userId: user._id,
  }).lean();
  if (!verification) {
    res.status(404);
    throw new Error('Verification code not found or expired');
  }
  //compare code
  const isMatch = await bcrypt.compare(trimdCode, verification.verificationCode);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid verification code');
  }
  //update user
  if (user.email === process.env.GMAIL_USER) {
    user.isVarify = true;
    user.isAdmin = true;
    user.superAdmin = true;
  } else {
    user.isVarify = true;
  }
  generateToken(res, user._id);
  await user.save();
  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    isAdmin: user.isAdmin,
    isVarify: user.isVarify,
    superAdmin: user.superAdmin,
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const trimdEmail = email?.trim().toLowerCase();
  const trimdPassword = password?.trim();
  //validate input
  if (!trimdEmail || !password) {
    res.status(400);
    throw new Error('Please fill all the fields');
  }
  //find user
  const user = await User.findOne({ email:trimdEmail }).lean();
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  //compare password
  const isMatch = await bcrypt.compare(trimdPassword, user.password);

  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid password');
  }

  generateToken(res, user._id);
  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    isAdmin: user.isAdmin,
    isVarify: user.isVarify,
    superAdmin: user.superAdmin,
  });
});

const logOutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(Date.now()),
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    isAdmin: user.isAdmin,
    isVarify: user.isVarify,
  });
});
const updateProfile = asyncHandler(async (req, res) => {
  const { name, password ,phone } = req.body;
  const user = await User.findById(req.user._id).select('-password');
  const userPhone = await User.findOne({ phone: phone?.trim() }).lean();
  if (userPhone && phone?.trim() !== user.phone) {
    res.status(400);
    throw new Error('Phone number already exists');
  }
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (name?.trim()) user.name = name.trim();
  if (phone?.trim()) user.phone = phone.trim();
  if (password?.trim()) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password.trim(), salt);
  }
  const updateUser = await user.save();
  res.status(200).json({
    _id: updateUser._id,
    name: updateUser.name,
    email: updateUser.email,
    phone: updateUser.phone,
    isAdmin: updateUser.isAdmin,
    isVarify: updateUser.isVarify,
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').lean();
  if (!users) {
    res.status(404);
    throw new Error('Users not found');
  }
  res.status(200).json(users);
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json(user);
});
const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.status(200).json({
    message: `${user.name} deleted successfully`,
  });
});
const updateUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const user = await User.findById(id);
  const { name, isAdmin ,phone } = req.body;
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (name?.trim()) user.name = name.trim();
  if (phone?.trim()) user.phone = phone.trim();
  if (isAdmin !== undefined) user.isAdmin = isAdmin;
  const updatedUser = await user.save();
  res.status(200).json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    isAdmin: updatedUser.isAdmin,
    isVarify: updatedUser.isVarify,
  });
});

const sendPassVerificationCode = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const trimdEmail = email?.trim().toLowerCase();
  //validate input
  const user = await User.findOne({ email: trimdEmail }).lean();
  if (!user) {
    res.status(401);
    throw new Error('user not found');
  }
  const token = Math.floor(100000 + Math.random() * 900000).toString();

  const salt = await bcrypt.genSalt(10);
  const hashedToken = await bcrypt.hash(token, salt);

  await Verification.deleteMany({ userId: user._id });

  await Verification.create({
    userId: user._id,
    verificationCode: hashedToken,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });
  const message = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #ffffff; background-color:#1a202c; padding: 20px; border-radius: 8px; width: 100%; max-width: 600px; margin: auto;text-align: center;">
    <h2 style="color: #63b3ed;">Hello ${user.name},</h2>
    <p>Your verification code is:</p>
    <div style="font-size: 24px; font-weight: bold; color: #63b3ed; margin: 10px 0;">
      ${token}
    </div>
    <p>This code will expire in <strong>5 minutes</strong>.</p>
    <p>If you did not request this, please ignore this email.</p>
    <br />
    <p style="font-size: 14px; color: #a0aec0;">— AR Team</p>
  </div>
`;

  res.json({ message: 'Verification token sent successfully' });
  await sendEmail({
    to: user.email,
    subject: 'Password verification',
    text: 'Please verify your password',
    html: message,
  });

})

const verifyPassCode = asyncHandler(async (req, res) => {
  const {email, code} = req.body;
  const trimdEmail = email?.trim().toLowerCase();
  const trimdCode = code?.trim();
  //validate input
  if (!trimdEmail || !trimdCode) {
    res.status(400);
    throw new Error('Please fill all the fields');
  }
  //find user
  const user = await User.findOne({ email:trimdEmail });
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  //find verification code
  const verification = await Verification.findOne({
    userId: user._id,
  }).lean();
  if (!verification) {
    res.status(404);
    throw new Error('Verification code not found or expired');
  }
  //compare code
  const isMatch = await bcrypt.compare(trimdCode, verification.verificationCode);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid verification code');
  }
  generateToken(res, user._id);
  res.status(200).json({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  isAdmin: user.isAdmin,
  isVarify: user.isVarify,
  });

})
 
const getUsersStats = asyncHandler(async (req, res) => {
  // Get total users count
  const totalUsers = await User.countDocuments();

  // Get verified users count
  const verifiedUsers = await User.countDocuments({ isVarify: true });

  // Get unverified users count
  const unverifiedUsers = await User.countDocuments({ isVarify: false });

  // Get admin users count
  const adminUsers = await User.countDocuments({ isAdmin: true });

  // Get regular users count (non-admin)
  const regularUsers = await User.countDocuments({ isAdmin: false });

  // Get users registered today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const usersToday = await User.countDocuments({
    createdAt: { $gte: today },
  });

  // Get users registered this week
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const usersThisWeek = await User.countDocuments({
    createdAt: { $gte: weekAgo },
  });

  // Get users registered this month
  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  const usersThisMonth = await User.countDocuments({
    createdAt: { $gte: monthAgo },
  });

  // Get recent users (last 5)
  const recentUsers = await User.find({})
    .select('-password')
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  // Calculate verification rate
  const verificationRate =
    totalUsers > 0 ? ((verifiedUsers / totalUsers) * 100).toFixed(2) : 0;

  // Calculate admin rate
  const adminRate =
    totalUsers > 0 ? ((adminUsers / totalUsers) * 100).toFixed(2) : 0;

  res.status(200).json({
    totalUsers,
    verifiedUsers,
    unverifiedUsers,
    adminUsers,
    regularUsers,
    registrationStats: {
      today: usersToday,
      thisWeek: usersThisWeek,
      thisMonth: usersThisMonth,
    },
    rates: {
      verificationRate: `${verificationRate}%`,
      adminRate: `${adminRate}%`,
    },
    recentUsers,
  });
});

export {
  createUser,
  sendVerificationCode,
  verifyCode,
  loginUser,
  logOutUser,
  getUser,
  updateProfile,
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserById,
  sendPassVerificationCode,
  verifyPassCode,
  getUsersStats
};
