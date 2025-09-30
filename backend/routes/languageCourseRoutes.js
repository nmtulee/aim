import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import { addLevelToCourse, createLanguageCourse, deleteCourseLevel, deleteLanguageCourse, getAllLanguageCourses, getLanguageCourseById, getLanguageCourses, getLanguageCoursesStats, updateCourseLevel, updateLanguageCourse } from "../controllers/languageCourseControllers.js";




const LanguageCourseRoutes = express.Router();

LanguageCourseRoutes
  .route('/')
  .post(authenticate, authorizeAdmin, createLanguageCourse)
  .get(getAllLanguageCourses);


LanguageCourseRoutes.get(
  '/all',
  authenticate,
  authorizeAdmin,
  getLanguageCourses
);


LanguageCourseRoutes.get(
  '/stats',
  authenticate,
  authorizeAdmin,
  getLanguageCoursesStats
);

LanguageCourseRoutes.route('/:id')
  .get(getLanguageCourseById)
  .put(authenticate, authorizeAdmin, updateLanguageCourse)
    .delete(authenticate, authorizeAdmin, deleteLanguageCourse);

LanguageCourseRoutes.post(
      '/:id/levels',
      authenticate,
      authorizeAdmin,
      addLevelToCourse
);
    
LanguageCourseRoutes.route('/:id/levels/:levelId')
  .put(authenticate, authorizeAdmin, updateCourseLevel)
  .delete(authenticate, authorizeAdmin, deleteCourseLevel);
  


export default LanguageCourseRoutes;