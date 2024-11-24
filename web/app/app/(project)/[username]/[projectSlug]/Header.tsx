import React from "react";
import { Badge } from "primereact/badge";
import { BadgeSeverityType, IProject } from "@refineit/types";

interface Owner {
    fullname: string;
    profile_picture: string;
    username: string;
}

const ProjectHeader: React.FC<{ project: any }> = ({ project={} }) => {
    const priorities: Record<string, BadgeSeverityType> = {
        "low": "info",
        "medium": "warning",
        "high": "danger",
    }

    return (
        <React.Fragment>
            <div className="flex flex-column md:flex-row justify-content-between align-items-center p-4 xl:px-0">
                <div className="flex flex-column sm:w-12 md:w-8">
                    <h1 style={{fontSize: "1.5rem", fontWeight: 600, color: "var(--surface-900)", marginBottom: "0.2rem"}}>{project?.slug}</h1>
                    <p className="mb-3 mt-2">{project?.description}</p>
                    <div className="flex gap-2">
                        {project?.tags?.map((tag: any, index: any) => (
                            <Badge
                                key={index}
                                value={tag}
                                severity="info"
                                className="mr-2"
                            />
                        ))}
                    </div>
                </div>
                <div className="flex flex-column align-items-center md:align-items-end mt-4 md:mt-0">
                    <div className="flex gap-2 justify-content-evenly">
                        <Badge value={"medium"} className="py-0" severity={priorities["high"]} />
                        <Badge value={"Feature Request"} className="bg-white text-black-alpha-90 border-1 border-black-alpha-10 py-0" />
                        <Badge value={"JavaScript"} className="py-0" />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default ProjectHeader;
