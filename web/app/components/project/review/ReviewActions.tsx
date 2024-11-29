"use client"

import React from "react";
import { Button } from "primereact/button";
import { tss } from "tss-react";
import { BadgeSeverityType } from "@refineit/types";

interface CodeReviewActionProps {
    project?: any;
}

const useStyles = tss.create(() => ({
    reviewersSection: {
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        justifyContent: "space-between",
    },
}));

export const ReviewAction: React.FC<CodeReviewActionProps> = ({ project = {} }) => {
    const { classes } = useStyles();

    const priorities: Record<string, BadgeSeverityType> = {
        "low": "info",
        "medium": "warning",
        "high": "danger",
    }

    const handleSave = () => {}

    const handleSubmitReview = () => {}

    return (
        <div className={classes.reviewersSection}>
            <Button
                label="Save Draft"
                icon="pi pi-save"
                severity="success"
                onClick={handleSave}
                size="small"
                className="p-button-tertiary"
            />
            <Button
                label="Submit Changes"
                icon="pi pi-check-circle"
                onClick={handleSubmitReview}
                size="small"
                className="p-button-contrast"
            />
        </div>
    );
};