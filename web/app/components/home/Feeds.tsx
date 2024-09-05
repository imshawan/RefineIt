"use client"

import React from "react";
import { useSession } from "next-auth/react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { ScrollPanel } from "primereact/scrollpanel";
import { tss } from "tss-react";
import { IUserTokenInfo, UserTokenStore } from "@refineit/lib";
import { IProject } from "@refineit/types";
import { useProject } from "@refineit/app/project/hooks";
import SkeletonLoader from "./SkeletonLoader";
import ProjectCard from "./Project";

const useStyles = tss.create({
    loadMore: {
        margin: "0px .25rem 1.2rem .25rem"
    }
});

export const Feeds: React.FC = () => {
    const { classes } = useStyles();
    const { data: session } = useSession();
    const { projects, loading, pagination, loadProjects } = useProject();

    const [trending, setTrending] = React.useState<any>([]);
    const [suggestions, setSuggestions] = React.useState<any>([]);

    React.useEffect(() => {
        if (!session || !session.user) return;

        UserTokenStore.setTokenInfo(session?.user as IUserTokenInfo);
        loadProjects({});

    }, [loadProjects, session]);

    return (
        <div className="w-12 md:w-7 lg:w-9 pl-3">

            <ScrollPanel className="z-0 mx-0 px-0" style={{ width: "100%", height: "100%" }}>
                <div className="grid w-full mt-3">
                    <div className="w-12 px-2 lg:w-8">
                        {projects && projects.length
                            ? projects.map((item: IProject) => <ProjectCard project={item} key={item.id} />)
                            : Array.from(new Array(pagination.per_page)).map((_, index) => <SkeletonLoader key={index} />)
                        }

                        {projects && projects.length && <div className="w-full">
                            <div className={classes.loadMore}>
                                <Button className="w-full p-button-sm p-button-text text-color" label="Load more" />
                            </div>
                        </div>}
                    </div>

                    {/* Trending and Suggestions */}
                    <div className="w-12 lg:w-4 p-2 pt-0 trending-section">
                        <Card className="px-0">
                            <h3 className="m-0 px-3">Trending Projects</h3>
                            {trending.map((project: any, index: number) => (
                                <div
                                    key={index}
                                    className={"p-3 " + (index !== trending.length - 1 ? "border-bottom-1 border-black-alpha-10 mb-3" : "")}
                                >
                                    <h5 className="mt-0 mb-1">{project.name}</h5>
                                    <p className="text-sm text-500 m-0">
                                        {project.description}
                                    </p>
                                    <div className="flex justify-content-between align-items-center mt-2">
                                        <Tag
                                            value={`★ ${project.contributions}`}
                                            severity="warning"
                                        />
                                        <Tag value={project.language} severity="info" />
                                    </div>
                                </div>
                            ))}
                        </Card>
                        <Card className="mt-3" >
                            <h3 className="m-0 px-3">
                                Suggested for You
                            </h3>
                            {suggestions.map((project: any, index: number) => (
                                <div
                                    key={index}
                                    className={"p-3 " + (index !== trending.length - 1 ? "border-bottom-1 border-black-alpha-10 mb-3" : "")}
                                >
                                    <h5 className="mt-0 mb-1">{project.name}</h5>
                                    <p className="text-sm text-500 m-0">
                                        {project.description}
                                    </p>
                                    <div className="flex justify-content-between align-items-center mt-2">
                                        <Tag
                                            value={`★ ${project.contributions}`}
                                            severity="warning"
                                        />
                                        <Tag value={project.language} severity="info" />
                                    </div>
                                </div>
                            ))}
                        </Card>
                    </div>
                </div>
            </ScrollPanel>
        </div>
    )
}