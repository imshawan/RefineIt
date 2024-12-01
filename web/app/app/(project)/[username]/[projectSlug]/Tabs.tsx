"use client"

import React from "react";
import { TabPanel, TabView } from "primereact/tabview";
import Overview from "./Overview";
import { IProject } from "@refineit/types";
import {CodeReviewer} from "../../../../components/project";
import ReviewSection from "./ReviewSection";
import Discussions from "./Discussions";

const ProjectTabs: React.FC<{project: IProject}> = ({project}) => {
    const [activeIndex, setActiveIndex] = React.useState(0);

    return (
        <TabView
            activeIndex={activeIndex}
            onTabChange={(e) => setActiveIndex(e.index)}
            className="custom-tabview"
        >
            <TabPanel header="Overview">
                <Overview project={project} />
            </TabPanel>
            <TabPanel header="Code">
                <CodeReviewer project={project as IProject} mode="view" />
            </TabPanel>
            <TabPanel header="Reviews">
                <ReviewSection project={project} />
            </TabPanel>
            <TabPanel header="Discussions">
                <Discussions />
            </TabPanel>
        </TabView>
    );
};

export default ProjectTabs;
