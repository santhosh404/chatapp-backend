import express from 'express';
import { signUpHandler } from '../controllers/user/auth/signUpHandler.js';
import { signInHandler } from '../controllers/user/auth/signInHandler.js';
import { authorize } from '../middlewares/authorizeMiddleware.js';
import { getUserHandler } from '../controllers/user/others/UserController.js';


export const userRoutes = express.Router();

userRoutes.post('/signin', signInHandler);
userRoutes.post('/signup', signUpHandler);
userRoutes.get('/', authorize, getUserHandler);