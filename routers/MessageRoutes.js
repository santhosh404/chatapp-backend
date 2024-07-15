import express from 'express';
import { authorize } from '../middlewares/authorizeMiddleware';


export const messageRoutes = express.Router();

messageRoutes.post('/send-message', authorize, sendMessageHandler);
messageRoutes.get('/all-messages', authorize, getAllMessagesHandler)