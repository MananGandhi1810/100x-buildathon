import { set, get, exists } from "./keyvalue-db.js";
import { getFileTree, getPRDiff, getRepoArchive, getPullRequestsNew, getPullRequestDiff } from "./github-api.js";
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

async function generatePullRequestReview(owner, repo, prNumber, diff, codebase) {
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

    try {
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
            console.error(
                `[processPullRequest] Error fetching repo archive for ${repoFullName} commit ${commitHash}. Status: ${archiveResponse.status}`,
                archiveResponse.data,
            );
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

        // Get the repository contents for the PR review
        const repoContentsKey = `repo_contents:${owner}:${repoName}:${commitHash}`;
        let allFileContents = [];
        
        if (await exists(repoContentsKey)) {
            const cachedContents = await get(repoContentsKey);
            allFileContents = JSON.parse(cachedContents);
        } else {
            // Extract file contents from the archive for the review
            const extractedContents = await extractContentsFromArchive(archiveResponse.data);
            allFileContents = extractedContents;
            // Cache the contents for future use
            await set(repoContentsKey, JSON.stringify(allFileContents), 24 * 60 * 60);
        }
        
        // Generate AI review for the pull request
        const aiReview = await generatePullRequestReview(
            owner,
            repoName,
            prNumber,
            diff,
            allFileContents
        );
        
        return {
            title: pullRequestPayload.title,
            aiReview: aiReview
        };
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
        return null;
    }
};

async function generateReadmeAndDiagram(owner, repo, ref, allFileContents) {
    const codeDescriptionForDiagram = allFileContents
        .map(
            (file) =>
                `File: ${file.name}\nContent:\n${file.content}\n\n`,
        )
        .join("");
    const diagramTitle = `Code Structure for ${repo}/${ref}`;

    const [generatedReadmeText, generatedDiagramMermaid] =
        await Promise.all([
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

    // Check if repo contents are cached
    if (await exists(repoContentsKey)) {
        const cachedContents = await get(repoContentsKey);
        const allFileContents = JSON.parse(cachedContents);
        return await generateReadmeAndDiagram(owner, repo, ref, allFileContents);
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

            const result = await generateReadmeAndDiagram(owner, repo, ref, allFileContents);
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

const processAllPullRequests = async (owner, repo, githubToken, projectId) => {
    const pullRequestsKey = `pull_requests:${owner}:${repo}`;
    const expiry = 24 * 60 * 60;

    // Check if pull requests are cached
    if (await exists(pullRequestsKey)) {
        const cachedPRs = await get(pullRequestsKey);
        return JSON.parse(cachedPRs);
    }

    const pullRequests = await getPullRequestsNew(owner, repo);
    
    if (!pullRequests || pullRequests.length === 0) {
        return [];
    }

    const processedPRs = [];

    for (const pr of pullRequests) {
        const prData = await processPullRequest(projectId, pr, githubToken);
        if (prData) {
            processedPRs.push({
                number: pr.number,
                title: pr.title,
                state: pr.state,
                url: pr.html_url,
                createdAt: pr.created_at,
                updatedAt: pr.updated_at,
                ...prData
            });
        }
    }

    // Cache the processed pull requests
    await set(pullRequestsKey, JSON.stringify(processedPRs), expiry);
    
    return processedPRs;
};

export { processPullRequest, processPush, generateReadme, generateDiagram, processAllPullRequests, generatePullRequestReview };
