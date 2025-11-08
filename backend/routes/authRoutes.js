import { Router } from 'express';
import { checkEmail, verifyOtp } from '../controllers/authController.js';

const router = Router();
router.post('/check-email', checkEmail);
router.post('/verify-otp', verifyOtp);

export default router;
