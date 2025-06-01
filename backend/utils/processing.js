import { set, get, exists } from "./keyvalue-db.js";
import {
    getFileTree,
    getPRDiff,
    getRepoArchive,
    getPullRequestsNew,
    getPullRequestDiff,
} from "./github-api.js";
import { GoogleGenAI } from "@google/genai";
import tar from "tar-stream";
import zlib from "zlib";
import { Readable } from "stream";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateReadme(owner, repo, ref, fileContents) {
    const redisKey = `readme:${owner}:${repo}:${ref}`;
    const expiry = 24 * 60 * 60;

    if (await exists(redisKey)) {
        return await get(redisKey);
    }

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Generate a README.md file for a project with the following files and their content:\n\n${fileContents
            .map((file) => `File: ${file.name}\nContent:\n${file.content}\n\n`)
            .join("")}`,
        config: {
            maxOutputTokens: 1024,
            temperature: 0.1,
        },
    });

    const readmeContent = response.text;
    if (readmeContent) {
        await set(redisKey, readmeContent, expiry);
    }

    return readmeContent;
}

async function generateDiagram(
    codeDescription,
    title = "System Diagram",
    owner,
    repo,
    ref,
) {
    const diagramRedisKey = `diagram:${owner}:${repo}:${ref}`;
    const expiry = 24 * 60 * 60;

    if (await exists(diagramRedisKey)) {
        return await get(diagramRedisKey);
    }

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Generate a Mermaid TD (top-down) graph diagram representing the following system/code.
The diagram should be suitable for a README file.
Title the diagram '${title}':

${codeDescription}`,
        config: {
            maxOutputTokens: 2048,
            temperature: 0.2,
        },
    });

    const diagramContent = response.text;
    if (diagramContent) {
        await set(diagramRedisKey, diagramContent, expiry);
    }

    return diagramContent;
}

async function generatePullRequestReview(
    owner,
    repo,
    prNumber,
    diff,
    codebase,
) {
    const reviewRedisKey = `pr_review:${owner}:${repo}:${prNumber}`;
    const expiry = 24 * 60 * 60;

    if (await exists(reviewRedisKey)) {
        return await get(reviewRedisKey);
    }

    const codebaseContent = codebase
        .map((file) => `File: ${file.name}\nContent:\n${file.content}\n\n`)
        .join("");

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Please provide a detailed code review for this pull request. Analyze both the changes and the overall codebase context.

**Pull Request Diff:**
\`\`\`diff
${diff}
\`\`\`

**Full Codebase Context:**
${codebaseContent}

Please provide a comprehensive review covering:
1. **Code Quality**: Assess the overall quality of the changes
2. **Best Practices**: Check adherence to coding standards and best practices
3. **Security**: Identify any potential security vulnerabilities
4. **Performance**: Evaluate performance implications
5. **Architecture**: Assess how changes fit into the overall architecture
6. **Testing**: Comment on test coverage and quality
7. **Documentation**: Check if documentation needs updates
8. **Suggestions**: Provide specific improvement suggestions

Format your response in markdown with clear sections.`,
        config: {
            maxOutputTokens: 4096,
            temperature: 0.3,
        },
    });

    const reviewContent = response.text;
    if (reviewContent) {
        await set(reviewRedisKey, reviewContent, expiry);
    }

    return reviewContent;
}

async function extractContentsFromArchive(archiveData) {
    return new Promise((resolve, reject) => {
        const allFileContents = [];
        const extract = tar.extract();
        const gunzip = zlib.createGunzip();

        extract.on("entry", (header, stream, next) => {
            if (header.type === "file") {
                let content = "";
                stream.on("data", (chunk) => {
                    content += chunk.toString("utf8");
                });
                stream.on("end", () => {
                    allFileContents.push({ name: header.name, content });
                    next();
                });
                stream.resume();
            } else {
                stream.resume();
                next();
            }
        });

        extract.on("finish", () => {
            resolve(allFileContents);
        });

        extract.on("error", reject);

        const readableStream = new Readable();
        readableStream._read = () => {};
        readableStream.push(Buffer.from(archiveData));
        readableStream.push(null);

        readableStream.pipe(gunzip).pipe(extract);
    });
}

const processPullRequest = async (
    projectId,
    pullRequestPayload,
    githubToken,
    ignoreCache = false,
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
        return null;
    }

    const commitHash = pullRequestPayload.head.sha;
    const prNumber = pullRequestPayload.number;
    const repoFullName = pullRequestPayload.base.repo.full_name;
    const [owner, repoName] = repoFullName.split("/");

    try {
        const diffResponse = await getPRDiff(
            owner,
            repoName,
            prNumber,
            githubToken,
        );

        if (diffResponse.status !== 200) {
            return null;
        }
        const diff = diffResponse.data;

        const archiveResponse = await getRepoArchive(
            owner,
            repoName,
            commitHash,
            githubToken,
        );

        if (archiveResponse.status !== 200) {
            return null;
        }

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

        const repoContentsKey = `repo_contents:${owner}:${repoName}:${commitHash}`;
        let allFileContents = [];

        if (await exists(repoContentsKey)) {
            const cachedContents = await get(repoContentsKey);
            allFileContents = JSON.parse(cachedContents);
        } else {
            const extractedContents = await extractContentsFromArchive(
                archiveResponse.data,
            );
            allFileContents = extractedContents;
            await set(
                repoContentsKey,
                JSON.stringify(allFileContents),
                24 * 60 * 60,
            );
        }

        const aiReview = await generatePullRequestReview(
            owner,
            repoName,
            prNumber,
            diff,
            allFileContents,
        );

        return {
            title: pullRequestPayload.title,
            aiReview: aiReview,
        };
    } catch (error) {
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
        }
        return null;
    }
};

async function generateReadmeAndDiagram(owner, repo, ref, allFileContents) {
    const codeDescriptionForDiagram = allFileContents
        .map((file) => `File: ${file.name}\nContent:\n${file.content}\n\n`)
        .join("");
    const diagramTitle = `Code Structure for ${repo}/${ref}`;

    const [generatedReadmeText, generatedDiagramMermaid] = await Promise.all([
        generateReadme(owner, repo, ref, allFileContents),
        generateDiagram(
            codeDescriptionForDiagram,
            diagramTitle,
            owner,
            repo,
            ref,
        ),
    ]);

    return {
        readme: generatedReadmeText,
        diagram: generatedDiagramMermaid,
    };
}

const processPush = async (owner, repo, ref, githubToken) => {
    const repoContentsKey = `repo_contents:${owner}:${repo}:${ref}`;
    const expiry = 24 * 60 * 60;

    if (await exists(repoContentsKey)) {
        const cachedContents = await get(repoContentsKey);
        const allFileContents = JSON.parse(cachedContents);
        return await generateReadmeAndDiagram(
            owner,
            repo,
            ref,
            allFileContents,
        );
    }

    const archiveResponse = await getRepoArchive(owner, repo, ref, githubToken);

    if (archiveResponse.status !== 200 || !archiveResponse.data) {
        return null;
    }

    return new Promise((resolve, reject) => {
        const allFileContents = [];
        const extract = tar.extract();
        const gunzip = zlib.createGunzip();

        extract.on("entry", (header, stream, next) => {
            if (header.type === "file") {
                let content = "";
                stream.on("data", (chunk) => {
                    content += chunk.toString("utf8");
                });
                stream.on("end", () => {
                    allFileContents.push({ name: header.name, content });
                    next();
                });
                stream.resume();
            } else {
                stream.resume();
                next();
            }
        });

        extract.on("finish", async () => {
            if (allFileContents.length === 0) {
                resolve(null);
                return;
            }

            await set(repoContentsKey, JSON.stringify(allFileContents), expiry);

            const result = await generateReadmeAndDiagram(
                owner,
                repo,
                ref,
                allFileContents,
            );
            resolve(result);
        });

        extract.on("error", reject);

        const readableStream = new Readable();
        readableStream._read = () => {};
        readableStream.push(Buffer.from(archiveResponse.data));
        readableStream.push(null);

        readableStream.pipe(gunzip).pipe(extract);
    });
};

const processAllPullRequests = async (
    owner,
    repo,
    githubToken,
    projectId,
    ignoreCache = false,
) => {
    const pullRequestsKey = `pull_requests_open:${owner}:${repo}`;
    const expiry = 24 * 60 * 60;

    if ((await exists(pullRequestsKey)) && !ignoreCache) {
        const cachedPRs = await get(pullRequestsKey);
        const parsedPRs = JSON.parse(cachedPRs);
        return parsedPRs;
    }

    const pullRequests = await getPullRequestsNew(owner, repo, githubToken);
    console.log("Pull Requests:", pullRequests);

    if (!pullRequests || pullRequests.length === 0) {
        return [];
    }

    const processedPRs = [];

    for (const pr of pullRequests) {
        if (pr.state === "open") {
            const prData = await processPullRequest(projectId, pr, githubToken);
            if (prData) {
                processedPRs.push({
                    number: pr.number,
                    title: pr.title,
                    state: pr.state,
                    url: pr.html_url,
                    createdAt: pr.created_at,
                    updatedAt: pr.updated_at,
                    ...prData,
                });
            }
        }
    }

    await set(pullRequestsKey, JSON.stringify(processedPRs), expiry);

    return processedPRs;
};

const processSinglePullRequest = async (
    owner,
    repo,
    githubToken,
    projectId,
    pullRequestPayload,
    action,
) => {
    const pullRequestsKey = `pull_requests_open:${owner}:${repo}`;
    const expiry = 24 * 60 * 60;

    // Get existing cached pull requests
    let existingPRs = [];
    if (await exists(pullRequestsKey)) {
        const cachedPRs = await get(pullRequestsKey);
        existingPRs = JSON.parse(cachedPRs);
    } else {
        // If no pull requests exist in cache, recalculate all pull requests
        return await processAllPullRequests(
            owner,
            repo,
            githubToken,
            projectId,
        );
    }

    const prNumber = pullRequestPayload.number;

    if (action === "opened" && pullRequestPayload.state === "open") {
        // Process the new pull request
        const prData = await processPullRequest(
            projectId,
            pullRequestPayload,
            githubToken,
        );
        if (prData) {
            const newPR = {
                number: pullRequestPayload.number,
                title: pullRequestPayload.title,
                state: pullRequestPayload.state,
                url: pullRequestPayload.html_url,
                createdAt: pullRequestPayload.created_at,
                updatedAt: pullRequestPayload.updated_at,
                ...prData,
            };

            // Add to existing PRs if not already present
            const existingIndex = existingPRs.findIndex(
                (pr) => pr.number === prNumber,
            );
            if (existingIndex === -1) {
                existingPRs.push(newPR);
            }
        }
    } else if (action === "closed") {
        // Remove the closed pull request from cache
        existingPRs = existingPRs.filter((pr) => pr.number !== prNumber);
    } else if (action === "synchronize" || action === "edited") {
        // Update existing pull request
        const existingIndex = existingPRs.findIndex(
            (pr) => pr.number === prNumber,
        );
        if (existingIndex !== -1 && pullRequestPayload.state === "open") {
            const prData = await processPullRequest(
                projectId,
                pullRequestPayload,
                githubToken,
            );
            if (prData) {
                existingPRs[existingIndex] = {
                    number: pullRequestPayload.number,
                    title: pullRequestPayload.title,
                    state: pullRequestPayload.state,
                    url: pullRequestPayload.html_url,
                    createdAt: pullRequestPayload.created_at,
                    updatedAt: pullRequestPayload.updated_at,
                    ...prData,
                };
            }
        }
    }

    // Update the cache with the modified pull requests
    await set(pullRequestsKey, JSON.stringify(existingPRs), expiry);

    return existingPRs;
};

export {
    processPullRequest,
    processPush,
    generateReadme,
    generateDiagram,
    processAllPullRequests,
    generatePullRequestReview,
    processSinglePullRequest,
};
