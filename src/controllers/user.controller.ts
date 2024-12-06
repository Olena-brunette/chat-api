import {  Router } from "express";
import { authenticate } from "../middlwares/auth.middlware.js";


const router = Router();
router.use(authenticate);


export default router;
