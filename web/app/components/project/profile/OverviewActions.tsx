"use client";

import React from "react";
import { Button } from "primereact/button";
import { handleStar } from "@refineit/store/project";
import { useSession } from "next-auth/react";
import { UserTokenStore } from "@refineit/lib";
import { toast } from "sonner";
import { formatNumberWithMetricPrefix } from "@refineit/utilities";
import LoginPopup from "@refineit/components/common/LoginPrompt";

export const OverviewActions: React.FC<{ project: any }> = ({ project }) => {
    const { data: session } = useSession();
    const [starred, setStarred] = React.useState(project.self_starred);
    const [stars, setStars] = React.useState(Number(project.stars_count) || 0);
    const [reviews, setReviews] = React.useState(Number(project.reviews_count) || 0);
    const [showLogin, setShowLogin] = React.useState(false);

    const starsCount = React.useMemo(() => formatNumberWithMetricPrefix(stars), [stars]);
    const reviewsCount = React.useMemo(() => formatNumberWithMetricPrefix(reviews), [reviews]);

    const handleStarOnClick = async () => {
        if (!session) return setShowLogin(true);

        UserTokenStore.parseAndSetTokenInfo(session);
        setStars(prev => starred ? prev - 1 : prev + 1)

        let resp = await handleStar({
            id: project.id,
            action: starred ? "UNSTAR" : "STAR"
        });

        if (typeof resp === "string") {
            return toast.error("Error", {description: resp})
        }

        if (resp.statusCode > 399) {
            toast.error("Count't star project", {description: resp.status.message})
        } else {
            toast.success("Success", {description: resp.response.message});
            setStarred(!starred);
        }
    };
    const handleReview = () => {

    };

    return (
        <React.Fragment>
            <div className="w-12 md:w-4 md:pl-4">
                <Button onClick={handleReview} label="Start a Review" className="p-button-contrast w-full mb-4" icon="pi pi-comment" />
                <Button onClick={handleStarOnClick} label={starred ? "Starred" : "Star Project"} className="mb-4 w-full p-button-tertiary" icon={starred ? "pi pi-star-fill" : "pi pi-star"} />
                <Button label="Project Settings" className="mb-4 w-full p-button-outlined" icon="pi pi-cog" />
                <div className="flex grid mx-0 justify-content-between">
                    <div className="w-12 lg:w-6 mb-3 lg:pr-2">
                        <div style={{ borderRadius: "0.5rem", cursor: "pointer" }} className="p-button-tertiary flex flex-column p-3 align-items-center ">
                            <i className="pi pi-star font-medium text-3xl mb-1"></i>
                            <div className="text-3xl font-semibold mb-1">{starsCount}</div>
                            <div className="text-muted font-light">Stars</div>
                        </div>
                    </div>
                    <div className="w-12 lg:w-6 mb-3 lg:pl-2">
                        <div style={{ borderRadius: "0.5rem", cursor: "pointer" }} className="p-button-tertiary flex flex-column p-3 align-items-center">
                            <i className="pi pi-comment font-medium text-3xl mb-1"></i>
                            <div className="text-3xl font-semibold mb-1">{reviewsCount}</div>
                            <div className="text-muted font-light">Reviews</div>
                        </div>
                    </div>
                </div>
            </div>
            <LoginPopup show={showLogin} onHide={() => setShowLogin(false)} />
        </React.Fragment>
    );
};