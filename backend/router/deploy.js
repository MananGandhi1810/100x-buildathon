import { Router } from "express";
import { checkAuth } from "../middlewares/auth.js";
import {
    newDeploymentHandler,
    getAllDeploymentsHandler,
    getDeploymentByIdHandler,
    startDeploymentHandler,
    stopDeploymentHandler,
    getDeploymentStatusHandler,
    getContainerPortHandler,
    incomingWebhookHandler,
    getContainerLogsHandler,
} from "../handlers/deploy.js";
const router = Router();

router.post("/:deploymentId/hooks/", incomingWebhookHandler);
router.get("/:deploymentId/logs", getContainerLogsHandler);

router.use(checkAuth);
router.get("/", getAllDeploymentsHandler);
router.get("/:deploymentId", getDeploymentByIdHandler);
router.post("/new", newDeploymentHandler);
router.post("/:deploymentId/start", startDeploymentHandler);
router.post("/:deploymentId/stop", stopDeploymentHandler);
router.get("/:deploymentId/status", getDeploymentStatusHandler);
router.get("/:deploymentId/port", getContainerPortHandler);

export default router;
