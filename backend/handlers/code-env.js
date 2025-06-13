import { createProxyMiddleware } from "http-proxy-middleware";
import { get } from "../utils/keyvalue-db.js";

const createProjectProxy = (projectId, port) => {
    return createProxyMiddleware({
        target: `http://localhost:${port}`,
        changeOrigin: true,
        ws: true,
        timeout: 60000,
        proxyTimeout: 60000,
        onProxyReq: (proxyReq, req, res) => {
            proxyReq.setHeader("Host", `localhost:${port}`);
            proxyReq.setHeader(
                "X-Forwarded-For",
                req.ip || req.connection.remoteAddress,
            );
            proxyReq.setHeader("X-Forwarded-Proto", req.protocol);
            proxyReq.setHeader("X-Forwarded-Host", req.get("Host"));
            if (req.headers.upgrade === "websocket") {
                proxyReq.setHeader("Connection", "upgrade");
                proxyReq.setHeader("Upgrade", "websocket");
            }
        },
        onProxyReqWs: (proxyReq, req, socket, options, head) => {
            proxyReq.setHeader("Host", `localhost:${port}`);
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

const provisionUseHandler = async (req, res) => {
    const projectId = req.subdomains[0];
    if (!projectId) {
        return res.status(400).json({
            success: false,
            message: "Project ID is required",
            data: null,
        });
    }

    try {
        const containerKey = `project:${projectId}:container`;
        const containerData = await get(containerKey);

        if (!containerData) {
            return res.status(404).json({
                success: false,
                message: "Project container not found or expired",
                data: null,
            });
        }

        const container = JSON.parse(containerData);
        const { port } = container;

        if (!port) {
            return res.status(400).json({
                success: false,
                message: "Container port not available",
                data: null,
            });
        }

        const proxy = createProjectProxy(projectId, port);
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

export { provisionUseHandler };