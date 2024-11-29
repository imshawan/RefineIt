export * from "./requests";
export * from "./response";
export * from "./github";
export * from "./project";
export * from "./review";

export type MutableObject = {
    [key: string]: any;
}

export type BadgeSeverityType = "warning" | "danger" | "success" | "info" | null | undefined;