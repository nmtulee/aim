import express from "express";
import { createMessage, deleteMessage, getAllMessages, getMessageById } from "../controllers/messageControllers.js";


const messageRoutes = express.Router();



messageRoutes.route("/").post(createMessage).get(getAllMessages);
messageRoutes.route("/:id").get(getMessageById).delete(deleteMessage)




export default messageRoutes;