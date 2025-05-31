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

const createWebhook = async (id, token, repo) => {
    return await axios.post(
        `https://api.github.com/repos/${repo}/hooks`,
        {
            name: "web",
            active: true,
            events: ["push"],
            config: {
                url: `${process.env.BACKEND_URL}/webhook/${id}/`,
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

export {
    getAccessToken,
    getUserDetails,
    getUserEmails,
    createWebhook,
    getUserRepositories,
};
