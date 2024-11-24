"use client"

import React from "react";
import { tss } from "tss-react";
import { BadgeSeverityType } from "@refineit/types";
import { Badge } from "primereact/badge";
import { extractRepoFilePath } from "@refineit/utilities/files";
import { useEditor } from "@refineit/hooks/editor";

interface CodeReviewHeaderProps {
    project?: any;
}

const useStyles = tss.create(() => ({
    projectHeader: {
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        marginBottom: "1rem",
    },
    projectIcon: {
        width: "52px",
        height: "52px",
        backgroundColor: "var(--primary-100)",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--primary-700)",
    },
    projectTitle: {
        fontSize: "1.5rem",
        fontWeight: 600,
        color: "var(--surface-900)",
        marginBottom: "0.2rem",
    },
    fileName: {
        color: "#718096",
        fontSize: "0.9rem",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
    },
    fileChanges: {
        display: "flex",
        gap: "1rem",
        marginTop: "1rem",
        padding: "0.5rem",
        background: "#fff",
        borderRadius: "6px",
        border: "1px solid #e2e8f0",
    },
    changeStat: {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        fontSize: "0.9rem",
        color: "#718096",
    },
    additions: {
        color: "#38a169",
    },
    deletions: {
        color: "#e53e3e",
    },
    projectPath: {
        color: "var(--surface-600)",
        fontSize: "0.875rem",
        alignItems: "center",
        gap: "0.5rem",
    },
    actionsContainer: {
        display: "flex",
        gap: "1rem",
        alignItems: "center",
    },
    reviewersSection: {
        display: "flex",
        alignItems: "center",
        gap: "1rem",
    },
    buttonContainer: {
        display: "flex",
        gap: "0.75rem",
    },
}));

export const ReviewHeader: React.FC<CodeReviewHeaderProps> = ({ project = {} }) => {
    const { classes } = useStyles();
    const {additions, deletions} = useEditor();

    const priorities: Record<string, BadgeSeverityType> = {
        "low": "info",
        "medium": "warning",
        "high": "danger",
    }

    const filePath = React.useMemo(() => extractRepoFilePath(project.file_url), [project]);

    console.log(project)

    return (
        <div className="p-4 xl:px-0">
            <div>
                <div>
                    <div className={classes.projectHeader}>
                        <div className={classes.projectIcon}>
                            <i className="pi pi-folder text-2xl" />
                        </div>
                        <div className="w-10">
                            <h1 className={classes.projectTitle}>
                                {project?.name || "Project Name"}
                            </h1>
                            <span className={classes.fileName}>
                                📁 {filePath}
                                <Badge value="TypeScript" severity="info" />
                            </span>
                        </div>
                    </div>
                </div>
                <div className={classes.fileChanges}>
                    <div className={`${classes.changeStat} ${classes.additions}`}>
                        <span>+{additions}</span> additions
                    </div>
                    <div className={`${classes.changeStat} ${classes.deletions}`}>
                        <span>-{deletions}</span> deletions
                    </div>
                </div>
            </div>
        </div>
    );
};