"use client";

import React, { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Sidebar } from "primereact/sidebar";
import { useRouter } from "next/navigation";
import UserControls from "./UserControls";
import SidebarMenu from "./MobileSidebar";
import { Ripple } from "primereact/ripple";
import { removeIcons } from "@refineit/utilities";

const Navigation: React.FC = () => {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const router = useRouter();
    const { data, status } = useSession();
    const sidebarIcon = useRef<Button>(null);

    const items = useRef([
        {
            label: "Home",
            icon: "pi pi-fw pi-home",
            command: () => router.push("/")
        },
        {
            label: "Code Reviews",
            icon: "pi pi-fw pi-code",
            items: [
                { label: "My Reviews", icon: "pi pi-fw pi-user-edit", command: () => router.push("/reviews/my") },
                { label: "Pending Reviews", icon: "pi pi-fw pi-clock", command: () => router.push("/reviews/pending") },
                { label: "All Reviews", icon: "pi pi-fw pi-list", command: () => router.push("/reviews/all") }
            ]
        },
        {
            label: "Projects",
            icon: "pi pi-fw pi-briefcase",
            items: [
                { label: "My Projects", icon: "pi pi-fw pi-folder-open", command: () => router.push("/projects/my") },
                { label: "Create New Project", icon: "pi pi-fw pi-plus", command: () => router.push("/projects/new") },
                { label: "Project Directory", icon: "pi pi-fw pi-search", command: () => router.push("/projects/directory") }
            ]
        },
        {
            label: "Teams",
            icon: "pi pi-fw pi-users",
            items: [
                { label: "My Teams", icon: "pi pi-fw pi-user", command: () => router.push("/teams/my") },
                { label: "Team Directory", icon: "pi pi-fw pi-search", command: () => router.push("/teams/directory") }
            ]
        }
    ]);

    const Logo = () => (
        <div className="flex align-items-center mr-4">
            <i className="pi pi-prime mr-2" style={{ fontSize: "1.5rem" }}></i>
            <span className="font-bold">Refine.It</span>
        </div>
    );

    return (
        <div className="card sticky top-0 z-5">
            <div className="hidden lg:block">
                <Menubar model={removeIcons(items.current)} start={Logo} end={UserControls}
                    className="shadow-2 border-noround surface-overlay px-4 shadow-2 flex align-items-center justify-content-between relative lg:static" />
            </div>
            <div className="lg:hidden flex justify-content-between px-4 surface-100 shadow-2 py-2">
                <Button icon="pi pi-bars" ref={sidebarIcon} onClick={() => setSidebarVisible(true)} className="p-button-text text-black-alpha-90 sidebar-toggle-btn" />
                <UserControls />
                <Sidebar header={<Logo />} visible={sidebarVisible} onHide={() => setSidebarVisible(false)}>
                    <div className="flex flex-column h-full">
                        <ul className="list-none p-0 m-0">
                            {/* <PanelMenu model={items} /> */}
                            {items.current.map((item, index) => <SidebarMenu key={index} item={item} />)}
                        </ul>
                        <div className="mt-auto">
                            <hr className="mb-3 mx-3 border-top-1 border-none surface-border" />
                            <a className="flex align-items-center cursor-pointer p-3 gap-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                                <Avatar image="https://www.imshawan.dev/assets/img/profile-img.jpg" shape="circle" />
                                <div className="">
                                    <div className="font-bold">{data?.user?.name}</div>
                                    <small>{data?.user?.email}</small>
                                </div>
                                <Ripple />
                            </a>
                        </div>
                    </div>
                </Sidebar>
            </div>
        </div>
    );
};

export default Navigation;