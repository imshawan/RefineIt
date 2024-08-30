import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { externals } from "@refineit/common";
import { http, parseParams } from "@refineit/utilities";

interface GitHubSearchResultItem {
    path: string;
    html_url: string;
}

interface GitHubSearchResponse {
    total_count: number;
    incomplete_results: boolean;
    items: GitHubSearchResultItem[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { q: query, owner, repo } = req.query;

    if (!query || !owner || !repo) {
        return res.status(400).json({ error: "Missing required query parameters: query, owner, repo" });
    }

    const githubToken = process.env.GITHUB_ACCESS_TOKEN;

    if (!githubToken) {
        return res.status(500).json({ error: "GitHub Access Token is not configured in environment variables." });
    }

    const searchQuery = `${query} repo:${owner}/${repo} in:path`;

    const githubApiUrl = parseParams(externals.github.REPOSITORY_SEARCH, {query: encodeURIComponent(searchQuery)});

    try {
        const response = await http.get<GitHubSearchResponse>(githubApiUrl, {
            headers: {
                Authorization: `token ${githubToken}`,
                Accept: "application/vnd.github.v3.text-match+json",
            },
            
        }, true);

        res.status(200).json(response);
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            let err = http.parseHttpError(error) as any;
            let message = error.message as string;
            let status = error.response?.status || 500;

            if (err.errors && err.errors.length) {
                message = err.errors[0]["message"];
            } else if (err.message) {
                message = err.message;
            }

            if (message.includes("limit exceeded")) {
                message = "Search rate limit exceeded. Please try again later.";
            }

            return res.status(status).json({ error: message });
        }

        res.status(500).json({ error: "An unexpected error occurred." });
    }
}
