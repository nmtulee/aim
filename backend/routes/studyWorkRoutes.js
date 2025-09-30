import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import { createStudyWork, deleteStudyWork, getAllStudyWorks, getStudyWorkById, getStudyWorks, updateStudyWork,  } from "../controllers/studyWorkControllers.js";


const studyWorkRoutes = express.Router()



studyWorkRoutes.route('/')
    .post(authenticate,authorizeAdmin, createStudyWork)
    .get(getAllStudyWorks);

studyWorkRoutes.route('/all')
    .get(getStudyWorks);

studyWorkRoutes.route('/:id')
    .get(getStudyWorkById)
    .put(authenticate, authorizeAdmin, updateStudyWork)
    .delete(authenticate, authorizeAdmin, deleteStudyWork);



export default studyWorkRoutes;