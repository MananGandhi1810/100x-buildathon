import { Router } from "express";
import {
    githubCallbackHandler,
    accessTokenHandler,
    userHandler,
} from "../handlers/auth.js";
import { checkAuth } from "../middlewares/auth.js";

var router = Router();

router.get("/gh-callback", githubCallbackHandler);
router.post("/get-access-token", accessTokenHandler);
router.get("/user", checkAuth, userHandler);

export default router;
