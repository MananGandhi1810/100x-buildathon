import { createProxyMiddleware } from "http-proxy-middleware";
import { get } from "../utils/keyvalue-db.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createProjectProxy = (projectId, target) => {
    return createProxyMiddleware({
        target: target,
        changeOrigin: true,
        ws: true,
        timeout: 60000,
        proxyTimeout: 60000,
        onProxyReq: (proxyReq, req, res) => {
            const url = new URL(target);
            proxyReq.setHeader("Host", url.host);
            proxyReq.setHeader(
                "X-Forwarded-For",
                req.ip || req.connection.remoteAddress
            );
            proxyReq.setHeader("X-Forwarded-Proto", req.protocol);
            proxyReq.setHeader("X-Forwarded-Host", req.get("Host"));
            if (req.headers.upgrade === "websocket") {
                proxyReq.setHeader("Connection", "upgrade");
                proxyReq.setHeader("Upgrade", "websocket");
            }
        },
        onProxyReqWs: (proxyReq, req, socket, options, head) => {
            const url = new URL(target);
            proxyReq.setHeader("Host", url.host);
            proxyReq.setHeader(
                "X-Forwarded-For",
                req.ip || req.connection.remoteAddress,
            );
            proxyReq.setHeader("X-Forwarded-Proto", req.protocol);
        },
        onProxyRes: (proxyRes, req, res) => {
            if (proxyRes.headers["set-cookie"]) {
                proxyRes.headers["set-cookie"] = proxyRes.headers[
                    "set-cookie"
                ].map((cookie) => {
                    return cookie.replace(
                        /Path=\/[^;]*/g,
                        `Path=/project/${projectId}/provision/use`,
                    );
                });
            }
        },
        onError: (err, req, res, target) => {
            console.error("Proxy error:", err.message);
            if (res && !res.headersSent) {
                if (req.headers.upgrade === "websocket") {
                    res.status(502).end();
                } else {
                    res.status(502).json({
                        success: false,
                        message: "Error connecting to code-server container",
                        data: null,
                    });
                }
            }
        },
        logLevel: "debug",
    });
};

const subdomainHandler = async (req, res) => {
    const projectId = req.subdomains[0];
    if (!projectId) {
        return res.status(400).json({
            success: false,
            message: "Project ID is required",
            data: null,
        });
    }

    try {
        const codeEnvKey = `project:${projectId}:container`;
        const codeEnvDataPromise = get(codeEnvKey);
        const deploymentDataPromise = prisma.deployment.findUnique({
            where: { id: projectId },
            select: {
                id: true,
                containerPort: true,
                containerName: true,
            },
        });

        const [codeEnvData, deploymentData] = await Promise.all([
            codeEnvDataPromise,
            deploymentDataPromise,
        ]);
        console.log(codeEnvData, deploymentData);

        let target = null;
        const isDevelopment = process.env.NODE_ENV === "development";

        if (codeEnvData && !deploymentData) {
            const container = JSON.parse(codeEnvData);
            if (container && container.port) {
                if (isDevelopment) {
                    target = `http://localhost:${container.port}`;
                } else {
                    if (container.containerName) {
                        target = `http://${container.containerName}:${container.port}`;
                    }
                }
            }
        } else if (deploymentData && !codeEnvData) {
            if (deploymentData.containerPort) {
                if (isDevelopment) {
                    target = `http://localhost:${deploymentData.containerPort}`;
                } else {
                    if (deploymentData.containerName) {
                        target = `http://${deploymentData.containerName}:${deploymentData.containerPort}`;
                    }
                }
            }
        } else if (deploymentData && codeEnvData) {
            return res.status(404).json({
                success: false,
                message:
                    "Ambiguous project ID, exists in both dev and deployment",
                data: null,
            });
        }

        if (!target) {
            return res.status(404).json({
                success: false,
                message: "Project container not found or not running",
                data: null,
            });
        }

        const proxy = createProjectProxy(projectId, target);
        proxy(req, res);
    } catch (error) {
        console.error("Error in proxy handler:", error);
        return res.status(500).json({
            success: false,
            message: "Error accessing project container",
            data: null,
        });
    }
};

export { subdomainHandler };
