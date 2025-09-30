import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import { deleteEnrollById, Enroll, getAllEnrolls, getEnrollByUserAndCourse } from "../controllers/enrollControllers.js";




const enrollRouter = express.Router()


enrollRouter.post("/", authenticate, Enroll)
enrollRouter.get("/all",authenticate,authorizeAdmin,getAllEnrolls)
enrollRouter.get('/:courseId', authenticate, getEnrollByUserAndCourse);

enrollRouter.route("/:id").delete(authenticate,authorizeAdmin,deleteEnrollById)








export default enrollRouter