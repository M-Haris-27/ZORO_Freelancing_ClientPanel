// routes/chatbotRoutes.js
import express from 'express';
const router = express.Router();
import { protect } from '../middlewares/authMiddleware';
const { 
  saveChatHistory, 
  getChatHistory 
} = require('../controllers/chatbot.controller');

router.route('/save')
  .post(protect, saveChatHistory);

router.route('/history')
  .get(protect, getChatHistory);

export default router;