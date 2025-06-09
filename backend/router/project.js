import { Router } from "express";
import {
    getProjectDataHandler,
    incomingProjectWebhookHandler,
    projectListHandler,
    createProjectHandler,
    provisionProjectHandler,
    provisionUseHandler,
    projectChatHandler,
    getProjectReadmeHandler,
    getProjectDiagramHandler,
    getProjectBugDetectHandler,
    getProjectMocksHandler,
    getProjectTestsHandler,
} from "../handlers/project.js";
import { checkAuth } from "../middlewares/auth.js";

const router = Router();

router.post("/create", checkAuth, createProjectHandler);
router.get("/list", checkAuth, projectListHandler);
router.get("/:projectId", checkAuth, getProjectDataHandler);
router.post("/:projectId/provision", checkAuth, provisionProjectHandler);
router.use("/:projectId/provision/use/*", provisionUseHandler);
router.post("/:projectId/chat", checkAuth, projectChatHandler);
router.get("/:projectId/readme", checkAuth, getProjectReadmeHandler);
router.get("/:projectId/diagram", checkAuth, getProjectDiagramHandler);
router.get("/:projectId/bugs", checkAuth, getProjectBugDetectHandler);
router.get("/:projectId/mocks", checkAuth, getProjectMocksHandler);
router.get("/:projectId/tests", checkAuth, getProjectTestsHandler);
router.post("/:projectId", incomingProjectWebhookHandler);

export default router;
