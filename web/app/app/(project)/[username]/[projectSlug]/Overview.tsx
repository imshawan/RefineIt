import React from "react";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { Avatar } from "primereact/avatar";
import moment from "moment";
import { Button } from "primereact/button";
import { AboutSection } from "@refineit/components/project";

const Overview: React.FC<{ project: any }> = ({ project }) => {

    return (
        <div className="p-4">
            <div className="flex grid mx-0">
                <div className="w-12 md:w-8">
                    <div className="mb-4">
                        <div className="flex">
                            <div className="mr-2">
                                <Avatar
                                    image={project.owner.profile_picture}
                                    icon="pi pi-user"
                                    shape="circle"
                                    style={{ height: "60px", width: "60px" }}
                                    className="cursor-pointer mb-auto overflow-hidden"
                                />
                            </div>
                            <div className="">
                                <h4 className="m-0">{project.owner.fullname}</h4>
                                <h5 className="m-0 font-normal mt-1 mb-2 ellipse-2">{"Lead designer and developer at Refine.It"}</h5>
                                <small className="text-muted text-xs">{moment(project.created_at).fromNow()}</small>
                            </div>
                        </div>
                    </div>
                    <AboutSection name={project.name} projectId={project.id} content={project.about} />
                </div>
                <div className="w-12 md:w-4 md:pl-4">
                    <Button label="Start a Review" className="p-button-contrast w-full mb-4" icon="pi pi-comment" />
                    <Button label="Star Project" className="mb-4 w-full p-button-tertiary" icon="pi pi-star" />
                    <Button label="Project Settings" className="mb-4 w-full p-button-outlined" icon="pi pi-cog" />
                    <div className="flex grid mx-0 justify-content-between">
                        <div className="w-12 lg:w-6 mb-3 lg:pr-2">
                            <div style={{ borderRadius: "0.5rem", cursor: "pointer" }} className="p-button-tertiary flex flex-column p-3 align-items-center ">
                                <i className="pi pi-star font-medium text-3xl mb-1"></i>
                                <div className="text-3xl font-semibold mb-1">12.5k</div>
                                <div className="text-muted font-light">Stars</div>
                            </div>
                        </div>
                        <div className="w-12 lg:w-6 mb-3 lg:pl-2">
                            <div style={{ borderRadius: "0.5rem", cursor: "pointer" }} className="p-button-tertiary flex flex-column p-3 align-items-center">
                                <i className="pi pi-comment font-medium text-3xl mb-1"></i>
                                <div className="text-3xl font-semibold mb-1">142</div>
                                <div className="text-muted font-light">Reviews</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid">
                <div className="col-12 md:col-6">
                    <Card title="Contribution Activity">
                        <Chart
                            type="line"
                            data={{
                                labels: [
                                    "January",
                                    "February",
                                    "March",
                                    "April",
                                    "May",
                                    "June",
                                    "July",
                                ],
                                datasets: [
                                    {
                                        label: "Contributions",
                                        data: [65, 59, 80, 81, 56, 55, 40],
                                        fill: false,
                                        borderColor: "#4bc0c0",
                                    },
                                ],
                            }}
                        />
                    </Card>
                </div>

            </div>
        </div>
    )
}

export default Overview;