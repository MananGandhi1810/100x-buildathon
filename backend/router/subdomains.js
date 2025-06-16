import { Router } from "express";
import { subdomainHandler } from "../handlers/subdomains.js";

const router = Router();

router.get("/*", subdomainHandler);

export default router;
