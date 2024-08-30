import { allowedCodeExtensions } from "@refineit/common";

export const isAllowedCodeExtension = (file: File): boolean => {
    if (!file) {
        return false;
    }

    const fileExtension = String(file.name.split(".").pop()).toLowerCase();
    return allowedCodeExtensions.includes(fileExtension);
}