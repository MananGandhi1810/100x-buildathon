import { set, get, exists } from "./keyvalue-db.js";
import { getFileTree, getPRDiff, getRepoArchive } from "./github-api.js";
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
            return;
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
            return;
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

export { processPullRequest, processPush, generateReadme, generateDiagram };
