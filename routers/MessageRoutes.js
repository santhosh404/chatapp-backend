import express from 'express';
import { authorize } from '../middlewares/authorizeMiddleware.js';
import { getAllMessagesHandler, sendMessageHandler } from '../controllers/chat/MessageController.js';


export const messageRoutes = express.Router();

messageRoutes.post('/send-message', authorize, sendMessageHandler);
messageRoutes.get('/all-messages', authorize, getAllMessagesHandler);