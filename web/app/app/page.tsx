import React from "react";
import { getNextServerSession } from "@refineit/lib/auth";
import Navigation from "@refineit/components/common/navbar";
import { BaseContainer } from "@refineit/components/common";
import {ProjectsSection, Feeds} from "@refineit/components/home";
import { UserTokenStore, IUserTokenInfo } from "@refineit/lib";

export default async function Home() {
    const session = await getNextServerSession();
    if (session && session.user) {
        let user = session.user as IUserTokenInfo;
        UserTokenStore.setTokenInfo(user);
    }

    return (
        <React.Fragment>
            <Navigation />
            <BaseContainer>
                <div className="block md:flex mx-0 xl:px-8 surface-50 feeds-section overflow-hidden">
                    {session && <ProjectsSection projects={[]} />}
                    <Feeds />
                </div>
            </BaseContainer>
        </React.Fragment>
    )
}