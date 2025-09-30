import asyncHandler from '../middlewares/asyncHandler.js';
import Message from '../models/messageModel.js';

const createMessage = asyncHandler(async (req, res) => {
  const name = req.body.name?.trim();
  const email = req.body.email?.trim();
  const subject = req.body.subject?.trim();
  const message = req.body.message?.trim();

  if (!name || !email || !subject || !message) {
    res.status(400);
    throw new Error('All fields are required');
  }

  const newMessage = new Message({
    name,
    email,
    subject,
    message,
  });

  const savedMessage = await newMessage.save();

  res.status(201).json({
    message: 'Message sent successfully',
    data: savedMessage,
  });
});

const getAllMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  res.status(200).json(messages);
});

const getMessageById = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);

  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }

  res.status(200).json(message);
});

const deleteMessage = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);

  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }

  await message.deleteOne();
  res.status(200).json({ message: 'Message deleted successfully' });
});

export { createMessage, getAllMessages, getMessageById, deleteMessage };
