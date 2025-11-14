import {Router} from "express";
import authmiddleware from "../authMiddleware.js";
import{addqn,getallquestion,getqnbyId,updateqn,getstegqnbyyear,stegqnadd,deleteqn} from "../controllers/roundoneController.js"
import { submitAnswer, submitStegAnswer, getAnsweredQuestions, getPlayerScore } from "../controllers/playerController.js";

const router = Router();


router.post('/AddQn',authmiddleware.verifyToken,addqn);
router.post('/StegAdd',authmiddleware.verifyToken,stegqnadd);
router.get('/getallquestion',authmiddleware.verifyToken,getallquestion);
router.get('/getqn-id/:id',authmiddleware.verifyToken,getqnbyId);
router.put('/update-qn/:id',authmiddleware.verifyToken,updateqn);
router.get('/get-steg-qn-by-year',authmiddleware.verifyToken,getstegqnbyyear);
router.delete('/delete-qn/:id',authmiddleware.verifyToken,deleteqn);


router.post('/player/submit-answer', authmiddleware.verifyToken, submitAnswer);
router.post('/player/submit-steg-answer', authmiddleware.verifyToken, submitStegAnswer);
router.get('/player/answered-questions', authmiddleware.verifyToken, getAnsweredQuestions);
router.get('/player/score', authmiddleware.verifyToken, getPlayerScore);

export default router;
