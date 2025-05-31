import { PrismaClient } from "@prisma/client";
import { sendQueueMessage } from "../utils/queue-manager.js";

const prisma = new PrismaClient();

const incomingWebhookHandler = async (req, res) => {
    const { deploymentId } = req.params;
    const hook_id = req.headers["x-github-hook-id"];

    const deployment = await prisma.deployment.findUnique({
        where: {
            id: deploymentId,
        },
    });

    if (!deployment) {
        return res.status(404).json({
            success: false,
            message: "deployment not found",
            data: null,
        });
    }

    if (deployment.webhookId !== hook_id) {
        return res.status(400).json({
            success: false,
            message: "Invalid webhook",
            data: null,
        });
    }

    if (req.body.hook_id !== undefined) {
        console.log(
            "Hook Registration Successful for deployment",
            deploymentId,
        );

        sendQueueMessage(
            "deploy",
            JSON.stringify({
                deploymentId,
                branchName: deployment.branchName,
                commitHash: "HEAD",
                userId: deployment.userId,
            }),
        );

        return res.json({
            success: true,
            message: "Hook Registration Successful",
            data: null,
        });
    }

    if (req.body.ref.split("/").pop() !== deployment.branchName) {
        return res.json({
            success: true,
            message: "Webhook received",
            data: null,
        });
    }

    if (!req.body.commits || req.body.commits.length === 0) {
        return res.json({
            success: true,
            message: "Webhook received",
            data: null,
        });
    }

    const changes = req.body.commits
        .map((commit) => commit.added.concat(commit.modified, commit.removed))
        .flat();
    if (
        !!deployment.baseDirectory &&
        !changes.some((change) =>
            change.startsWith(
                deployment.baseDirectory == "." ? "" : deployment.baseDirectory,
            ),
        )
    ) {
        console.log("Changes", changes);
        return res.json({
            success: true,
            message: "Webhook received",
            data: null,
        });
    }

    const branchName = req.body.ref.split("/").pop();

    if (branchName != deployment.branchName) {
        return res.json({
            success: true,
            message: "Webhook received but not building",
            data: null,
        });
    }

    if (req.body.commits.length == 0) {
        return res.json({
            success: true,
            message: "Webhook received but not building",
            data: null,
        });
    }

    const latestCommit = req.body.commits
        .sort((a, b) => {
            return new Date(a.timestamp) - new Date(b.timestamp);
        })
        .at(-1).id;

    sendQueueMessage(
        "deploy",
        JSON.stringify({
            deploymentId,
            branchName: branchName,
            commitHash: latestCommit,
            userId: deployment.userId,
        }),
    );

    return res.json({
        success: true,
        message: "Webhook received",
        data: null,
    });
};

export { incomingWebhookHandler };
