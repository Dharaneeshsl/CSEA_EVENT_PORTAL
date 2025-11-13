import express from 'express';
import {
  createAnswer,
  getAllAnswers,
  getAnswer,
  updateAnswer,
  deleteAnswer
} from '../controllers/round3Controller.js';

const router = express.Router();

// POST /api/v1/round3/answers
router.post('/answers', createAnswer);

// GET /api/v1/round3/answers/:year
router.get('/answers', getAllAnswers); 
router.get('/answers/:year', getAnswer);

// PUT /api/v1/round3/answers/:year
router.put('/answers/:year', updateAnswer);

// DELETE /api/v1/round3/answers/:year
router.delete('/answers/:year', deleteAnswer);

export default router;
