import React from "react";
import Navigation from "@refineit/components/common/navbar";
import { Container } from "@refineit/components/common";
import Header from "./Header";
import { getProjectBySlug } from "@refineit/store/project";
import { IUserTokenInfo, UserTokenStore } from "@refineit/lib";
import { getNextServerSession } from "@refineit/lib/auth";
import { ApiResponse, IProject } from "@refineit/types";
import ProjectTabs from "./Tabs";

interface ProjectProfileProps {
    params: {
      username: string;
      projectSlug: string
    };
  }

const ProjectProfileScreen: React.FC<ProjectProfileProps> = async ({params}) => {
    const session = await getNextServerSession();
    if (session && session.user) {
        let user = session.user as IUserTokenInfo;
        UserTokenStore.setTokenInfo(user);
    }

    const data = await getProjectBySlug({slug: params.projectSlug}) as ApiResponse.IBaseResponse;
    if (typeof data != "object") return null
    
    return (
        <React.Fragment>
            <Navigation searchEnabled={false} />
            <Container>
                <div className="project-profile w-full">
                    <Header project={data.response} />
                    <ProjectTabs project={data.response} />
                </div>
            </Container>
        </React.Fragment>
    );
};

export default ProjectProfileScreen;
