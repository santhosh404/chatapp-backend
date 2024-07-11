import express from 'express';
import { signUpHandler } from '../controllers/user/auth/signUpHandler.js';
import { signInHandler } from '../controllers/user/auth/signInHandler.js';


export const userRoutes = express.Router();

userRoutes.post('/signin', signInHandler);
userRoutes.post('/signup', signUpHandler);
