import { set } from "./keyvalue-db.js";
import { getPRDiff, getRepoArchive } from "./github-api.js";

const processPullRequest = async (
    projectId,
    pullRequestPayload,
    githubToken,
) => {
    if (
        !pullRequestPayload ||
        !pullRequestPayload.head ||
        !pullRequestPayload.head.sha ||
        !pullRequestPayload.number ||
        !pullRequestPayload.base ||
        !pullRequestPayload.base.repo ||
        !pullRequestPayload.base.repo.full_name
    ) {
        console.error(
            "[processPullRequest] Invalid or incomplete pullRequestPayload:",
            pullRequestPayload,
        );
        return;
    }

    const commitHash = pullRequestPayload.head.sha;
    const prNumber = pullRequestPayload.number;
    const repoFullName = pullRequestPayload.base.repo.full_name;
    const [owner, repoName] = repoFullName.split("/");

    console.log(
        `[processPullRequest] Starting processing for PR #${prNumber} in repo ${repoFullName}, project: ${projectId}, commit: ${commitHash}`,
    );

    try {
        console.log(
            `[processPullRequest] Fetching diff for PR #${prNumber} from ${repoFullName}`,
        );
        const diffResponse = await getPRDiff(
            owner,
            repoName,
            prNumber,
            githubToken,
        );

        if (diffResponse.status !== 200) {
            console.error(
                `[processPullRequest] Error fetching PR diff for ${repoFullName} PR #${prNumber}. Status: ${diffResponse.status}`,
                diffResponse.data,
            );
            return;
        }
        const diff = diffResponse.data;

        console.log(
            `[processPullRequest] Fetching codebase snapshot for commit ${commitHash} from ${repoFullName}`,
        );
        const archiveResponse = await getRepoArchive(
            owner,
            repoName,
            commitHash,
            githubToken,
        );

        if (archiveResponse.status !== 200) {
            console.error(
                `[processPullRequest] Error fetching repo archive for ${repoFullName} commit ${commitHash}. Status: ${archiveResponse.status}`,
                archiveResponse.data,
            );
            return;
        }
        console.log(
            `[processPullRequest] Successfully fetched repo archive for ${commitHash}. Size: ${archiveResponse.data.byteLength} bytes.`,
        );

        const processingKey = `pull_request:${projectId}:${commitHash}`;
        const processingData = {
            status: "pending_processing",
            prNumber: prNumber,
            repoFullName: repoFullName,
            commitHash: commitHash,
            projectId: projectId,
            receivedAt: new Date().toISOString(),
            diffData: diff,
            archiveInfo: {
                fetched: true,
                commit: commitHash,
                size: archiveResponse.data.byteLength,
            },
        };

        await set(processingKey, JSON.stringify(processingData));
        console.log(
            `[processPullRequest] Successfully stored processing task with key: ${processingKey}.`,
        );
    } catch (error) {
        console.error(
            `[processPullRequest] Error during PR processing for project ${projectId}, PR #${prNumber}:`,
            error,
        );
        const processingKey = `pull_request:${projectId}:${commitHash || "unknown_commit"}`;
        try {
            await set(
                processingKey,
                JSON.stringify({
                    status: "failed_processing",
                    error: error.message,
                    prNumber: prNumber,
                    repoFullName: repoFullName,
                    commitHash: commitHash,
                    projectId: projectId,
                    receivedAt: new Date().toISOString(),
                }),
            );
        } catch (dbError) {
            console.error(
                `[processPullRequest] Critical: Failed to even store error state for ${processingKey}:`,
                dbError,
            );
        }
    }
};

export { processPullRequest };
