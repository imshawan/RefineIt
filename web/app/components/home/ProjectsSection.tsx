"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

export const ProjectsSection: React.FC<{projects: any}> = ({projects}) => {
    const router = useRouter();

    return (
        <div className="w-12 md:w-5 lg:w-3 p-3">
            <Card>
                <div className="px-3 mb-3 flex justify-content-between">
                    <h3 className="m-0 my-auto">My Projects</h3>
                    <Button
                        icon="pi pi-plus"
                        iconPos="right"
                        className="p-button-sm p-button-contrast my-auto py-2 px-4"
                        onClick={() => router.push("/create")}
                    />
                </div>
                <ul className="list-none p-0 m-0">
                    {projects.map((project: any, index: any) => (
                        <li key={index} className="mb-3 px-3">
                            <div className="text-sm">
                                {project.name}
                            </div>
                        </li>
                    ))}
                </ul>

            </Card>
        </div>
    )
}