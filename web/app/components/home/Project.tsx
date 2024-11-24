"use client";

import React from "react";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { tss } from "tss-react";
import { Badge } from "primereact/badge";
import { BadgeSeverityType, IProject } from "@refineit/types";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ActionMenu } from "../common";
import OwnerInfo from "./OwnerInfo";
import Image from "next/image";

interface ProjectCardProps {
    project: IProject;
}

export const useStyles = tss.create({
    card: {
        backgroundColor: "var(--surface-card)",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        margin: "0rem .25rem 1.2rem .25rem",
        transition: "all 0.3s ease",
        "&:hover": {
            // transform: "translateY(-2px)",
        },
    },
    header: {
        padding: "14px 14px",
        borderBottom: "1px solid var(--surface-border)",
    },
    title: {
        fontWeight: "bold",
        color: "var(--text-color)",
        marginBottom: "0px",
        marginTop: "6px",
        "a": {
            textDecoration: "none",
            color: "var(--text-color)",
            "&:hover": {
                textDecoration: "underline",
                color: "var(--primary-color)",
            }
        }
    },
    tags: {
        display: "flex",
        flexWrap: "wrap",
        gap: "6px",
        marginBottom: "16px"
    },
    tag: {
        padding: "2px 8px",
        borderRadius: "12px",
        fontSize: "12px",
        backgroundColor: "var(--primary-color-100)",
        color: "var(--primary-700)",
        cursor: "pointer"
    },
    body: {
        padding: "16px",
    },
    description: {
        fontSize: "14px",
        color: "var(--text-color-secondary)",
        marginBottom: "16px",
        display: "-webkit-box",
        WebkitLineClamp: "3",
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
    },
    infoGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "12px",
        marginBottom: "16px",
    },
    infoItem: {
        display: "flex",
        alignItems: "center",
        fontSize: "13px",
        color: "var(--text-color-secondary)",
        textDecoration: "none"
    },
    icon: {
        marginRight: "6px",
        color: "var(--primary-color)",
    },
    footer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 16px",
        borderTop: "1px solid var(--surface-border)",
        backgroundColor: "var(--surface-ground)",
    },
    footerLeft: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },
    statItem: {
        display: "flex",
        alignItems: "center",
        gap: "4px",
        fontSize: "13px",
        color: "var(--text-color-secondary)",
        cursor: "pointer"
    },
    reviewButton: {
        padding: "6px 12px",
        fontSize: "13px",
    },
});

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    const { classes } = useStyles();
    const router = useRouter();
    const link = `/${project.owner.username}/${project.slug}`;

    const priorities: Record<string, BadgeSeverityType> = {
        "low": "info",
        "medium": "warning",
        "high": "danger",
    }

    return (
        <div className={classes.card}>
            <div className={classes.header}>
                <div className="flex justify-content-between">

                    <OwnerInfo authorImage={project.owner.profile_picture} createdAt={project.created_at} name={project.owner.fullname} />
                    <ActionMenu />
                </div>
            </div>
            <div className={classes.body}>
                <div className="">
                    <h4 className={classes.title}>
                        <Link href={link}>{project.owner.username}/{project.slug}</Link>
                    </h4>
                </div>
                <p className={classes.description}>{project.description}</p>

                <div className={classes.infoGrid}>
                    <Link href={project.file_url} target="_blank" className={classes.infoItem}>
                        <i className={`${classes.icon} pi pi-file`} />
                        {project.filename}
                    </Link>
                    <div className={classes.infoItem}>
                        <i className={`${classes.icon} pi pi-code`} />
                        Language: <div className="pl-2 flex">
                            <Image className="mr-1" src={project.language?.iconUrl} height={18} width={18} alt={project.language?.language} />
                            <span className="text-xs align-self-end">{project.language?.language}</span>
                        </div>
                    </div>
                </div>

                {project.tags && project.tags.length > 0 && <div className={classes.tags}>
                    {project.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className={classes.tag}>#{tag}</span>
                    ))}
                    {project.tags.length > 3 && <span className={classes.tag}>+{project.tags.length - 3}</span>}
                </div>}
            </div>
            <div className={classes.footer}>
                <div className={classes.footerLeft}>
                    <span className={classes.statItem} title="Stars">
                        <i className="pi pi-star-fill" style={{ color: "var(--yellow-500)" }} />
                        {project.stars_count}
                    </span>
                    <span className={classes.statItem} title="Contributors/reviewers">
                        <Avatar icon="pi pi-users" shape="circle" />
                        {project.contributors_count}
                    </span>
                    <span className={classes.statItem} title="Priority">
                        <Badge value={<div className="flex text-xs">
                            <i className="pi pi-flag my-auto mr-1 text-xs" />
                            <small className="font-medium">{project.priority}</small>
                        </div>} severity={priorities[project.priority]} />
                    </span>
                </div>
                <Button label="Review" icon="pi pi-arrow-circle-right" iconPos="right" onClick={() => router.push(link)} className={classes.reviewButton + " p-button-outlined"} />
            </div>
        </div>
    );
};

export default ProjectCard;