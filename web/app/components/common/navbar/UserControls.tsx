"use client";

import React, { useState } from "react";
import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { useRouter } from "next/navigation";
import ExpandableSearchBar from "./ExpandableSearchBar";
import { useBreakpoints } from "@refineit/hooks";
import { signOut } from "next-auth/react";

export default function UserControls({searchEnabled=true}) {
    const router = useRouter();
    const breakpoints = useBreakpoints();
    const [expanded, setExpanded] = useState(false);
    const profileMenu = React.useRef<Menu | null>(null);
    const profileItems = React.useRef([
        {
            label: "Settings",
            icon: "pi pi-fw pi-cog",
            items: [
                { label: "Profile Settings", icon: "pi pi-fw pi-user", command: () => router.push("/settings/profile") },
                { label: "Account Settings", icon: "pi pi-fw pi-lock", command: () => router.push("/settings/account") },
                { label: "Integrations", icon: "pi pi-fw pi-link", command: () => router.push("/settings/integrations") }
            ]
        },
        {
            label: "Help & Support",
            icon: "pi pi-fw pi-question-circle",
            items: [
                { label: "FAQ", icon: "pi pi-fw pi-info-circle", command: () => router.push("/help/faq") },
                { label: "Contact Support", icon: "pi pi-fw pi-envelope", command: () => router.push("/help/support") },
                { label: "Documentation", icon: "pi pi-fw pi-file", command: () => router.push("/help/docs") }
            ]
        },
        { separator: true },
        {
            label: "Logout",
            icon: "pi pi-fw pi-power-off",
            command: () => {
                signOut({ callbackUrl: "/sign-in" });
            }
        }
    ]);

    const onSearchbarExpand = (value: boolean) => {
        if (value && breakpoints("mobile")) {
            setExpanded(true);
        } else {
            setExpanded(false);
        }
    }

    return (
        <div className={"flex " + (expanded ? "search-expanded" : "")}>
            {searchEnabled && <ExpandableSearchBar onExpand={onSearchbarExpand} />}
            {!expanded && <React.Fragment>
                <Button className="p-button-sm p-button-icon-only p-button-link hover:bg-gray-200 p-icon-badge-button">
                    <i className="pi pi-bell p-overlay-badge text-black-alpha-60" style={{ fontSize: "1.2rem" }}>
                        <Badge severity="danger"></Badge>
                    </i>
                </Button>
                <Button className="p-button-sm p-button-icon-only p-button-link hover:bg-gray-200 p-icon-badge-button">
                    <i className="pi pi-envelope p-overlay-badge text-black-alpha-60" style={{ fontSize: "1.2rem" }}>
                        <Badge severity="danger"></Badge>
                    </i>
                </Button>
                <Menu model={profileItems.current} popup ref={profileMenu} />
                <Avatar
                    image="https://www.imshawan.dev/assets/img/profile-img.jpg"
                    shape="circle"
                    className="cursor-pointer mx-2 my-auto overflow-hidden"
                    style={{ height: "40px", width: "40px" }}
                    onClick={(e) => profileMenu.current?.toggle(e)}
                />
            </React.Fragment>}
        </div>
    )
}