import { Router } from "express";
import { provisionUseHandler } from "../handlers/code-env.js";

const router = Router();

router.get("/*", provisionUseHandler);

export default router;
