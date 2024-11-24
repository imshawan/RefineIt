import React from "react";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { Avatar } from "primereact/avatar";
import moment from "moment";
import { AboutSection, OverviewActions } from "@refineit/components/project";

const Overview: React.FC<{ project: any }> = ({ project={} }) => {

    return (
        <div className="p-4">
            <div className="flex grid mx-0">
                <div className="w-12 md:w-8">
                    <div className="mb-4">
                        <div className="flex">
                            <div className="mr-2">
                                <Avatar
                                    image={project?.owner.profile_picture}
                                    icon="pi pi-user"
                                    shape="circle"
                                    style={{ height: "60px", width: "60px" }}
                                    className="cursor-pointer mb-auto overflow-hidden"
                                />
                            </div>
                            <div className="">
                                <h4 className="m-0">{project?.owner.fullname}</h4>
                                <h5 className="m-0 font-normal mt-1 mb-2 ellipse-2">{"Lead designer and developer at Refine.It"}</h5>
                                <small className="text-muted text-xs">{moment(project?.created_at).fromNow()}</small>
                            </div>
                        </div>
                    </div>
                    <AboutSection name={project?.name} projectId={project?.id} content={project?.about} />
                </div>
                {Object.keys(project || {}).length > 0 && <OverviewActions project={project} />}
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