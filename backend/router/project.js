import { Router } from "express";
import {
    getProjectDataHandler,
    incomingProjectWebhookHandler,
    projectListHandler,
    createProjectHandler,
    provisionProjectHandler,
    provisionUseHandler,
    projectChatHandler, // Import the new handler
} from "../handlers/project.js";
import { checkAuth } from "../middlewares/auth.js";

const router = Router();

router.post("/create", checkAuth, createProjectHandler);
router.get("/list", checkAuth, projectListHandler);
router.get("/:projectId", checkAuth, getProjectDataHandler);
router.post("/:projectId/provision", checkAuth, provisionProjectHandler);
router.use("/:projectId/provision/use/*", provisionUseHandler);
router.post("/:projectId/chat", checkAuth, projectChatHandler); 
router.post("/:projectId", incomingProjectWebhookHandler);

export default router;
