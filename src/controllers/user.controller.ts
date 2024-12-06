import {  Request, Response, Router } from "express";
import { authenticate } from "../middlwares/auth.middlware.js";
import { HttpStatusCode } from "axios";
import { ResponceMessage } from "../constants.js";
import { verifyAccessToken, verifyRefreshToken } from "../services/token.services.js";
import { validateUserById } from "../services/user.service.js";


const router = Router();
router.use(authenticate);

router.get("/profile", async(req: Request, res: Response) => {
    const authData = req.headers.authorization;
  
    if (!authData) {
      res
        .status(HttpStatusCode.BadRequest)
        .json({ error: ResponceMessage.BadRequest });
      return;
    }
    const token = authData.split(" ")[1];
    try {
      const payload: any = verifyAccessToken(token);
      const user = await validateUserById(payload.userId);
  
      if (!user) {
        res
          .status(HttpStatusCode.NotFound)
          .json({ error: ResponceMessage.NotFound });
        return;
      }
     
  
      res.status(HttpStatusCode.Ok).json({login: user.login, id: user._id});
    } catch (error: any) {
      res
        .status(HttpStatusCode.Unauthorized)
        .json({ error: error.message || ResponceMessage.InvalidCreds });
    }
  });

export default router;
