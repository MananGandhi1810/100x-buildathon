import axios from "axios";
import { exists, get, set } from "./keyvalue-db.js";
import dotenv from "dotenv";
dotenv.config();

const ghRepoRegex =
    /https?:\/\/(www\.)?github.com\/(?<owner>[\w.-]+)\/(?<name>[\w.-]+)/;

const getAccessToken = async (code) => {
    return await axios.post(
        `https://github.com/login/oauth/access_token?client_id=${process.env.GH_CLIENT_ID}&client_secret=${process.env.GH_CLIENT_SECRET}&code=${code}`,
        {},
        {
            headers: {
                accept: "application/json",
            },
            validateStatus: false,
        },
    );
};

const getUserDetails = async (token) => {
    return await axios.get("https://api.github.com/user", {
        headers: {
            Authorization: "Bearer " + token,
            "X-OAuth-Scopes": "repo, user",
            "X-Accepted-OAuth-Scopes": "user",
        },
        validateStatus: false,
    });
};

const getUserEmails = async (token) => {
    return await axios.get("https://api.github.com/user/emails", {
        headers: {
            Authorization: "Bearer " + token,
            "X-OAuth-Scopes": "repo, user",
            "X-Accepted-OAuth-Scopes": "user",
        },
        validateStatus: false,
    });
};

const createWebhook = async (
    id,
    token,
    repo,
    path,
    hooks = false,
    pull = false,
) => {
    return await axios.post(
        `https://api.github.com/repos/${repo}/hooks`,
        {
            name: "web",
            active: true,
            events: ["push", ...(pull ? ["pull_request"] : [])],
            config: {
                url: `${process.env.BACKEND_URL}/${path}/${id}/${hooks ? "hooks" : ""}`,
                content_type: "json",
                insecure_ssl: "0",
            },
        },
        {
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: "Bearer " + token,
                "X-GitHub-Api-Version": "2022-11-28",
                "Content-Type": "application/json",
            },
            validateStatus: false,
        },
    );
};

const getUserRepositories = async (token) => {
    return await axios.get("https://api.github.com/user/repos?per_page=1000", {
        headers: {
            Authorization: "Bearer " + token,
            "X-OAuth-Scopes": "repo, user",
            "X-Accepted-OAuth-Scopes": "user",
        },
        validateStatus: false,
    });
};

const getPRDiff = async (owner, repoName, prNumber, token) => {
    const url = `https://api.github.com/repos/${owner}/${repoName}/pulls/${prNumber}`;
    return await axios.get(url, {
        headers: {
            Accept: "application/vnd.github.v3.diff",
            Authorization: `Bearer ${token}`,
            "X-GitHub-Api-Version": "2022-11-28",
        },
        validateStatus: false,
    });
};

const getRepoArchive = async (
    owner,
    repoName,
    ref,
    token,
    format = "tarball",
) => {
    const url = `https://api.github.com/repos/${owner}/${repoName}/${format}/${ref}`;
    return await axios.get(url, {
        headers: {
            Authorization: `Bearer ${token}`,
            "X-GitHub-Api-Version": "2022-11-28",
        },
        responseType: "arraybuffer",
        validateStatus: false,
    });
};

const getFileTree = async (owner, repoName, treeSha, token) => {
    const url = `https://api.github.com/repos/${owner}/${repoName}/git/trees/${treeSha}?recursive=true`;
    const kvKey = `file-tree:${owner}/${repoName}/${treeSha}`;
    if (await exists(kvKey)) {
        return await get(kvKey);
    }
    const result = await axios.get(url, {
        headers: {
            Accept: "application/vnd.github.v3+json",
            Authorization: `Bearer ${token}`,
            "X-GitHub-Api-Version": "2022-11-28",
        },
        validateStatus: false,
    });
    if (result.status >= 400) {
        return null;
    }

    if (!result.data || !result.data.tree) {
        return null;
    }
    console.log(result.data.tree);
    const tree = result.data.tree.map((element) => {
        return { path: element.path, type: element.type };
    });

    set(kvKey, JSON.stringify(tree), 3 * 60 * 60);
    return JSON.stringify(tree);
};

const getPullRequests = async (owner, repoName, token, state = "all") => {
    const url = `https://api.github.com/repos/${owner}/${repoName}/pulls?state=${state}&per_page=100`;
    return await axios.get(url, {
        headers: {
            Accept: "application/vnd.github.v3+json",
            Authorization: `Bearer ${token}`,
            "X-GitHub-Api-Version": "2022-11-28",
        },
        validateStatus: false,
    });
};

async function getPullRequestsNew(owner, repo) {
    let allPullRequests = [];
    let page = 1;
    const perPage = 100;

    try {
        while (true) {
            const response = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/pulls?state=all&page=${page}&per_page=${perPage}`,
                {
                    headers: {
                        Authorization: `token ${process.env.GITHUB_TOKEN}`,
                        Accept: "application/vnd.github.v3+json",
                    },
                },
            );

            if (!response.ok) {
                break;
            }

            const pullRequests = await response.json();
            if (pullRequests.length === 0) {
                break;
            }

            allPullRequests = allPullRequests.concat(pullRequests);

            if (pullRequests.length < perPage) {
                break;
            }

            page++;
        }

        return allPullRequests;
    } catch (error) {
        return [];
    }
}

async function getPullRequestDiff(owner, repo, prNumber) {
    try {
        const response = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`,
            {
                headers: {
                    Authorization: `token ${process.env.GITHUB_TOKEN}`,
                    Accept: "application/vnd.github.v3.diff",
                },
            },
        );

        if (!response.ok) {
            return null;
        }

        return await response.text();
    } catch (error) {
        return null;
    }
}

export {
    getAccessToken,
    getUserDetails,
    getUserEmails,
    createWebhook,
    getUserRepositories,
    getPRDiff,
    getRepoArchive,
    getFileTree,
    getPullRequests,
    getPullRequestsNew,
    getPullRequestDiff,
};
