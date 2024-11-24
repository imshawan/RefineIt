import { allowedCodeExtensions } from "@refineit/common";

export const isAllowedCodeExtension = (file: File): boolean => {
    if (!file) {
        return false;
    }

    const fileExtension = String(file.name.split(".").pop()).toLowerCase();
    return allowedCodeExtensions.includes(fileExtension);
}

export const extractRepoFilePath = (url: string): string | null => {
    try {
        const baseUrl = "https://raw.githubusercontent.com/";
        if (!url.startsWith(baseUrl)) {
            throw new Error("Invalid URL format");
        }
        const path = url.slice(baseUrl.length);

        // Split the remaining path into parts
        const parts = path.split("/");

        // Validate structure: username, repo name, branch, and file path
        if (parts.length < 4) {
            throw new Error("URL does not contain enough parts for a valid file path");
        }

        // Extract the repo name and file path, skipping the branch name (3rd part)
        const repoName = parts[1];
        const filePath = parts.slice(3).join("/");

        const decodedPath = `${repoName}/${filePath}`;
        
        return decodeURIComponent(decodedPath);
    } catch (error: any) {
        return null;
    }
}