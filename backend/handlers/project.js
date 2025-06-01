import { PrismaClient } from "@prisma/client";
import { createWebhook, getPullRequests } from "../utils/github-api.js";
import {
    processPush,
    processAllPullRequests,
    processSinglePullRequest,
} from "../utils/processing.js";

const prisma = new PrismaClient();
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

    const match = project.repoUrl.match(ghRepoRegex);
    if (!match) {
        return res.status(400).json({
            success: false,
            message: "Invalid repository URL",
            data: null,
        });
    }

    const { readme, diagram } =
        (await processPush(
            match.groups.owner,
            match.groups.name,
            "main",
            project.user.ghAccessToken,
        )) || {};

    const pullRequests = await processAllPullRequests(
        match.groups.owner,
        match.groups.name,
        project.user.ghAccessToken,
        projectId,
    );

    return res.json({
        success: true,
        message: "Project found",
        data: {
            project,
            readme,
            diagram,
            pullRequests,
        },
    });
};

const incomingProjectWebhookHandler = async (req, res) => {
    const { projectId } = req.params;
    console.log(req.body);

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
    console.log(githubEvent);

    if (githubEvent === "push") {
        const ref = req.body.ref;
        if (ref) {
            const branch = ref.split("/").pop();
            if (branch === "main" || branch === "master") {
                console.log(`Processing ${projectIdForLog}`);
                await processPush(
                    match.groups.owner,
                    match.groups.name,
                    req.body.head_commit.id,
                    project.user.ghAccessToken,
                );
            } else {
                console.log(
                    `Push event on branch '${branch}' for project ${projectIdForLog}. Not the main/default branch.`,
                );
            }
        } else {
            console.log(
                `Push event for project ${projectIdForLog}, but ref is missing in payload.`,
            );
        }
    } else if (githubEvent === "pull_request") {
        const pullRequestAction = req.body.action;
        console.log(
            `Pull request event (action: ${pullRequestAction}) for project ${projectIdForLog}. Processing efficiently.`,
        );

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

export {
    getProjectDataHandler,
    incomingProjectWebhookHandler,
    projectListHandler,
    createProjectHandler,
};
