import express from 'express';
import {
  createUser,
  deleteUserById,
  getAllUsers,
  getUser,
  getUserById,
  getUsersStats,
  loginUser,
  logOutUser,
  sendPassVerificationCode,
  sendVerificationCode,
  updateProfile,
  updateUserById,
  verifyCode,
  verifyPassCode,
} from '../controllers/userControllers.js';
import {
  authenticate,
  authorizeAdmin,
  superAdmin,
} from '../middlewares/authMiddleware.js';

const userRoutes = express.Router();

userRoutes
  .route('/')
  .post(createUser)
  .get(authenticate, authorizeAdmin, getAllUsers);
userRoutes.route('/sendcode').post(sendVerificationCode);
userRoutes.route('/verify').post(verifyCode);
userRoutes.route('/login').post(loginUser);
userRoutes.route('/logout').post(logOutUser);
userRoutes
  .route('/profile')
  .get(authenticate, getUser)
  .put(authenticate, updateProfile);

userRoutes
  .route('/admincontrol/:id')
  .get(authenticate, authorizeAdmin, superAdmin, getUserById)
  .put(authenticate, authorizeAdmin, superAdmin, updateUserById)
  .delete(authenticate, authorizeAdmin, superAdmin, deleteUserById);

userRoutes.route('/users').get(authenticate, authorizeAdmin, getUsersStats);

userRoutes.route("/sendverifypassword").post(sendPassVerificationCode)
userRoutes.route("/verifypassword").post(verifyPassCode)
export default userRoutes;
