import express from 'express';
import { getAllMessages } from '../controllers/messageController.js';

const router = express.Router();

// Route to get all messages for a specific project
router.get('/all/:projectId', getAllMessages);

export default router;