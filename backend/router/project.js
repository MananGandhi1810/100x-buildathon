import { Router } from "express";
import {
    getProjectDataHandler,
    incomingProjectWebhookHandler,
    projectListHandler,
    createProjectHandler,
} from "../handlers/project.js";
import { checkAuth } from "../middlewares/auth.js";

const router = Router();

router.post("/create", checkAuth, createProjectHandler);
router.get("/list", checkAuth, projectListHandler);
router.get("/:projectId", checkAuth, getProjectDataHandler);
router.post("/:projectId", incomingProjectWebhookHandler);

export default router;
