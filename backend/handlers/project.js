import { PrismaClient } from "@prisma/client";
import { createWebhook } from "../utils/github-api.js";

const prisma = new PrismaClient();
const ghRepoRegex =
    /https?:\/\/(www\.)?github.com\/(?<owner>[\w.-]+)\/(?<name>[\w.-]+)/;

const getProjectDataHandler = async (req, res) => {
    const { projectId } = req.params;

    const project = await prisma.project.findUnique({
        where: { id: projectId },
    });
    if (!project) {
        return res.status(404).json({
            success: false,
            message: "Project not found",
            data: null,
        });
    }
    return res.json({
        success: true,
        message: "Project found",
        data: { project },
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
    console.log("Received webhook for repo: ", repo);

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
    const { repo: url } = req.query;
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
            title: "",
            description: "",
            repoUrl: `https://github.com/${repo}`,
            userId: req.user.id,
        },
    });
    const projectRequest = await createWebhook(
        project.id,
        ghAccessToken,
        repo,
        "project",
    );

    res.json({
        success: true,
        message: "Project created successfully",
        data: projectRequest.data,
    });
};

export {
    getProjectDataHandler,
    incomingProjectWebhookHandler,
    projectListHandler,
    createProjectHandler,
};
