import {Router} from "express";
import{addqn,getallquestion,getqnbyId,updateqn,getstegqnbyyear,stegqnadd} from "../controllers/roundoneController.js"
const router = Router();
router.post('/AddQn', addqn);
router.post('/StegAdd',stegqnadd);
router.get('/getallquestion',getallquestion);
router.get('/getqn-id/:id',getqnbyId);
router.put('/update-qn/:id',updateqn);
router.get('/get-steg-qn-by-year',getstegqnbyyear);
export default router;
