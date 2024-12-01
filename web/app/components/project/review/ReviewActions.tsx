"use client"

import React from "react";
import { Button } from "primereact/button";
import { tss } from "tss-react";
import { BadgeSeverityType, IReview } from "@refineit/types";
import { useEditor } from "@refineit/hooks/editor";
import { endpoints } from "@refineit/common";
import { http, parseParams } from "@refineit/utilities";
import { useSession } from "next-auth/react";
import { UserTokenStore } from "@refineit/lib";

interface CodeReviewActionProps {
    project?: any;
    review?: IReview;
}

const useStyles = tss.create(() => ({
    reviewersSection: {
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        justifyContent: "space-between",
    },
}));

export const ReviewAction: React.FC<CodeReviewActionProps> = ({ project = {}, review }) => {
    const { classes } = useStyles();
    const {data: session} = useSession();
    const {code, additions, deletions} = useEditor();

    const priorities: Record<string, BadgeSeverityType> = {
        "low": "info",
        "medium": "warning",
        "high": "danger",
    }

    const handleSave = () => {
        if (!review || !review.id) return;

        http.put(
            parseParams(endpoints.REVIEWS.UPDATE_CONTENT, {
                reviewId: review?.id,
            }),
            { content: code, project_id: project.id, additions, deletions },
        );
    }

    const handleSubmitReview = () => {}

    React.useEffect(() => {
        UserTokenStore.parseAndSetTokenInfo(session);
    }, [session]);

    return (
        <div className={classes.reviewersSection}>
            <Button
                label="Save Changes"
                icon="pi pi-save"
                severity="success"
                onClick={handleSave}
                size="small"
                className="p-button-tertiary"
            />
            <Button
                label="Submit Code"
                icon="pi pi-check-circle"
                onClick={handleSubmitReview}
                size="small"
                className="p-button-contrast"
            />
        </div>
    );
};