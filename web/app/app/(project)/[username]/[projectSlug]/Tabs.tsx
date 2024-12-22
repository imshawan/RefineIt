"use client"

import React from "react";
import { TabPanel, TabView } from "primereact/tabview";
import Overview from "./Overview";
import { IProject } from "@refineit/types";
import {CodeReviewer} from "../../../../components/project";
import ReviewSection from "./ReviewSection";
import Discussions from "./Discussions";
import { useReviews } from "../../hooks";
import { useSession } from "next-auth/react";
import { UserTokenStore } from "@refineit/lib";

const ProjectTabs: React.FC<{project: IProject}> = ({project}) => {
    const {data: session} = useSession();
    const {loadInitialReviews} = useReviews();
    const [activeIndex, setActiveIndex] = React.useState(0);

    React.useEffect(()=> {
        if (!session?.user) return;
        
        UserTokenStore.parseAndSetTokenInfo(session);
        loadInitialReviews({projectId: project.id, fields: ["id", "reviewer", "status", "updated_at"]});
    }, [session]);

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
