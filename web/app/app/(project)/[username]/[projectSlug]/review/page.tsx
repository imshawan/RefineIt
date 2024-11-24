import React from "react";
import Navigation from "@refineit/components/common/navbar";
import { getProjectBySlug } from "@refineit/store/project";
import { IUserTokenInfo, UserTokenStore } from "@refineit/lib";
import { getNextServerSession } from "@refineit/lib/auth";
import { ApiResponse, IProject } from "@refineit/types";
import { CodeReviewer, ReviewHeader } from "@refineit/components/project";
import { ReviewAction } from "@refineit/components/project/review/ReviewActions";

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
            <div className="block mx-0 xl:px-8 surface-50 overflow-hidden">
                <div className="project-profile w-full">
                    <ReviewHeader project={data.response} />
                </div>
                <div className="w-full p-4 xl:px-0 py-0">
                    <CodeReviewer project={data.response as IProject} mode="review" />
                </div>
                <div className="w-full p-4 xl:px-0">
                    <ReviewAction project={data.response} />
                </div>
            </div>
        </React.Fragment>
    );
};

export default ProjectProfileScreen;
