import express from 'express';
import { authorize } from '../middlewares/authorizeMiddleware.js';
import { createChatHandler, fetchUserChats } from '../controllers/chat/ChatController.js';

export const chatRoutes = express.Router();

chatRoutes.post('/create-chat', authorize, createChatHandler);
chatRoutes.get('/my-chat', authorize, fetchUserChats);
// chatRoutes.post('/create-group', authorize, createGroupChatHandler);
// chatRoutes.put('/rename-group', authorize, renameGroupHandler);
// chatRoutes.put('/remove-from-group', authorize, removeFromGroupHandler);
// chatRoutes.put('/add-to-group', authorize, addToGroupHandler);