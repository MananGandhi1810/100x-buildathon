import { PrismaClient } from "@prisma/client";
import { createWebhook, getPullRequests } from "../utils/github-api.js";
import {
    processPush,
    processAllPullRequests,
    processSinglePullRequest,
} from "../utils/processing.js";
import Docker from "dockerode";
import { set, get } from "../utils/keyvalue-db.js";
import { createProxyMiddleware } from "http-proxy-middleware";

const prisma = new PrismaClient();
const docker = new Docker();
const ghRepoRegex =
    /https?:\/\/(www\.)?github.com\/(?<owner>[\w.-]+)\/(?<name>[\w.-]+)/;

const getProjectDataHandler = async (req, res) => {
    const { projectId } = req.params;

    const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { user: true },
    });

    if (!project) {
        return res.status(404).json({
            success: false,
            message: "Project not found",
            data: null,
        });
    }

    if (project.userId !== req.user.id) {
        return res.status(403).json({
            success: false,
            message:
                "Access denied: You don't have permission to access this project",
            data: null,
        });
    }

    const match = project.repoUrl.match(ghRepoRegex);
    if (!match) {
        return res.status(400).json({
            success: false,
            message: "Invalid repository URL",
            data: null,
        });
    }

    const owner = match.groups.owner;
    const repoName = match.groups.name;
    const ghAccessToken = project.user.ghAccessToken;

    const { readme, diagram } =
        (await processPush(owner, repoName, "main", ghAccessToken)) || {};

    const pullRequests = await processAllPullRequests(
        owner,
        repoName,
        ghAccessToken,
        projectId,
    );

    let testsData = null;
    let mocksData = null;
    let bugsData = null;
    let aiError = null;

    const aiServiceBaseUrl =
        process.env.AI_SERVICE_BASE_URL || "http://127.0.0.1:8888";
    const payload = {
        owner: owner,
        repo: repoName,
        token: ghAccessToken,
    };

    const [testsResponse, mocksResponse, bugsResponse] = await Promise.all([
        fetch(`${aiServiceBaseUrl}/generate_tests`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        }),
        fetch(`${aiServiceBaseUrl}/generate_mocks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        }),
        fetch(`${aiServiceBaseUrl}/bug_detect`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        }),
    ]);

    if (testsResponse.ok) {
        try {
            testsData = await testsResponse.json();
        } catch (e) {
            console.error("Error parsing JSON for tests:", e);
        }
    } else {
        console.error(
            "Error fetching tests:",
            testsResponse.status,
            await testsResponse.text(),
        );
    }

    if (mocksResponse.ok) {
        try {
            mocksData = await mocksResponse.json();
        } catch (e) {
            console.error("Error parsing JSON for mocks:", e);
        }
    } else {
        console.error(
            "Error fetching mocks:",
            mocksResponse.status,
            await mocksResponse.text(),
        );
    }

    if (bugsResponse.ok) {
        try {
            bugsData = await bugsResponse.json();
        } catch (e) {
            console.error("Error parsing JSON for bugs:", e);
        }
    } else {
        console.error(
            "Error fetching bugs:",
            bugsResponse.status,
            await bugsResponse.text(),
        );
    }

    return res.json({
        success: true,
        message: "Project found",
        data: {
            project,
            readme,
            diagram,
            pullRequests,
            aiAnalysis: {
                tests: testsData,
                mocks: mocksData,
                bugs: bugsData,
                error: aiError,
            },
        },
    });
};

const incomingProjectWebhookHandler = async (req, res) => {
    const { projectId } = req.params;

    const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { user: true },
    });
    if (!project) {
        return res.status(404).json({
            success: false,
            message: "Project not found",
            data: null,
        });
    }
    const match = project.repoUrl.match(ghRepoRegex);
    const repo = `${match.groups.owner}/${match.groups.name}`;

    const githubEvent = req.headers["x-github-event"];
    const { id: projectIdForLog } = project;

    if (githubEvent === "push") {
        const ref = req.body.ref;
        if (ref) {
            const branch = ref.split("/").pop();
            if (branch === "main" || branch === "master") {
                await processPush(
                    match.groups.owner,
                    match.groups.name,
                    req.body.head_commit.id,
                    project.user.ghAccessToken,
                );
            }
        }
    } else if (githubEvent === "pull_request") {
        const pullRequestAction = req.body.action;

        const repoFullName = req.body.pull_request.base.repo.full_name;
        const [owner, repo] = repoFullName.split("/");

        await processSinglePullRequest(
            owner,
            repo,
            project.user.ghAccessToken,
            projectId,
            req.body.pull_request,
            pullRequestAction,
        );
    } else if (githubEvent == "ping") {
        await Promise.all([
            processPush(
                match.groups.owner,
                match.groups.name,
                "HEAD",
                project.user.ghAccessToken,
            ),
            processAllPullRequests(
                match.groups.owner,
                match.groups.name,
                project.user.ghAccessToken,
                project.id,
                true,
            ),
        ]);
    }

    return res.json({
        success: true,
        message: "Webhook received",
        data: null,
    });
};

const projectListHandler = async (req, res) => {
    const { id } = req.user;

    const projectData = await prisma.project.findMany({
        where: { userId: id },
    });

    return res.json({
        success: true,
        message: "project data found",
        data: {
            projectData,
        },
    });
};

const createProjectHandler = async (req, res) => {
    const { repo: url, title, description } = req.query;
    const ghAccessToken = req.user.ghAccessToken;

    if (!url || url.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Repository URL is required",
            data: null,
        });
    }

    const match = url.match(ghRepoRegex);
    const repo = `${match.groups.owner}/${match.groups.name}`;

    const project = await prisma.project.create({
        data: {
            title: title,
            description: description,
            repoUrl: `https://github.com/${repo}`,
            userId: req.user.id,
        },
    });

    const projectRequest = await createWebhook(
        project.id,
        ghAccessToken,
        repo,
        "project",
        false,
        true,
    );

    // Process all existing pull requests for the new project
    const pullRequests = await processAllPullRequests(
        match.groups.owner,
        match.groups.name,
        ghAccessToken,
        project.id,
    );

    res.json({
        success: true,
        message: "Project created successfully",
        data: {
            project,
            webhook: projectRequest.data,
            pullRequests,
        },
    });
};

const provisionProjectHandler = async (req, res) => {
    const { projectId } = req.params;

    const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { user: true },
    });

    if (!project) {
        return res.status(404).json({
            success: false,
            message: "Project not found",
            data: null,
        });
    }

    if (project.userId !== req.user.id) {
        return res.status(403).json({
            success: false,
            message:
                "Access denied: You don't have permission to access this project",
            data: null,
        });
    }

    const containerKey = `project:${projectId}:container`;
    const existingContainer = await get(containerKey);

    if (existingContainer) {
        const containerData = JSON.parse(existingContainer);
        return res.json({
            success: true,
            message: "Project already provisioned",
            data: {
                project,
                containerId: containerData.containerId,
                containerName: containerData.containerName,
                port: containerData.port,
                url: `http://localhost:${containerData.port}`,
                repository: containerData.repository,
                createdAt: containerData.createdAt,
            },
        });
    }

    const match = project.repoUrl.match(ghRepoRegex);

    if (!match) {
        return res.status(400).json({
            success: false,
            message: "Invalid repository URL",
            data: null,
        });
    }

    const { owner, name } = match.groups;

    try {
        const containerName = `code-server-${projectId}-${Date.now()}`;
        const container = await docker.createContainer({
            Image: "codercom/code-server:latest",
            Cmd: [
                "--auth",
                "none",
                "--bind-addr",
                "0.0.0.0:8080",
                "/home/coder/workspace",
            ],
            name: containerName,
            Tty: true,
            WorkingDir: "/home/coder",
            ExposedPorts: {
                "8080/tcp": {},
            },
            HostConfig: {
                AutoRemove: true,
                PortBindings: {
                    "8080/tcp": [
                        {
                            HostPort: "0",
                        },
                    ],
                },
            },
        });

        await container.start();

        const createDirExec = await container.exec({
            Cmd: ["mkdir", "-p", "/home/coder/workspace"],
            AttachStdout: true,
            AttachStderr: true,
        });
        await createDirExec.start();

        const repoUrl = project.user.ghAccessToken
            ? `https://${project.user.ghAccessToken}@github.com/${owner}/${name}.git`
            : `https://github.com/${owner}/${name}.git`;

        const cloneExec = await container.exec({
            Cmd: ["git", "clone", repoUrl, "/home/coder/workspace"],
            AttachStdout: true,
            AttachStderr: true,
            WorkingDir: "/home/coder",
        });

        const cloneStream = cloneExec.start();

        const containerInfo = await container.inspect();
        const hostPort =
            containerInfo.NetworkSettings.Ports["8080/tcp"]?.[0]?.HostPort;

        await set(
            containerKey,
            JSON.stringify({
                containerId: container.id,
                containerName: containerName,
                port: hostPort,
                repository: `${owner}/${name}`,
                createdAt: new Date().toISOString(),
            }),
            24 * 60 * 60,
        );

        return res.json({
            success: true,
            message: "Project provisioned successfully",
            data: {
                project,
                containerId: container.id,
                containerName: containerName,
                port: hostPort,
                url: `http://localhost:${hostPort}`,
                repository: `${owner}/${name}`,
            },
        });
    } catch (error) {
        console.error("Error provisioning project:", error);
        return res.status(500).json({
            success: false,
            message: "Error provisioning project",
            data: null,
        });
    }
};

const createProjectProxy = (projectId, port) => {
    return createProxyMiddleware({
        target: `http://localhost:${port}`,
        changeOrigin: true,
        ws: true,
        timeout: 60000,
        proxyTimeout: 60000,
        pathRewrite: {
            [`^/project/${projectId}/provision/use`]: "",
        },
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

const provisionUseHandler = async (req, res, next) => {
    const { projectId } = req.params;

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
        proxy(req, res, next);
    } catch (error) {
        console.error("Error in proxy handler:", error);
        return res.status(500).json({
            success: false,
            message: "Error accessing project container",
            data: null,
        });
    }
};

export {
    getProjectDataHandler,
    incomingProjectWebhookHandler,
    projectListHandler,
    createProjectHandler,
    provisionProjectHandler,
    provisionUseHandler,
    createProjectProxy,
};
