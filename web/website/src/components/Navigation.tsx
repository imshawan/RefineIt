import React, { useState } from "react";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { Menu } from "primereact/menu";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const Navigation = () => {
    const [visible, setVisible] = useState(false);

    const items = [
        { label: "Home", url: "#home" },
        { label: "Features", url: "#features" },
        { label: "How it works?", url: "#howitworks" },
        { label: "Contact us", url: "#contactus" },
    ];

    const Logo = () => (
        <div className="flex align-items-center">
            <i className="pi pi-prime mr-2" style={{ fontSize: "1.5rem" }}></i>
            <span className="font-bold">Refine.It</span>
        </div>
    );

    const MobileMenu = () => (
        <>
            <Button icon="pi pi-bars" onClick={() => setVisible(true)} className="p-button-text text-black-alpha-90"/>
            <Sidebar visible={visible} onHide={() => setVisible(false)} className="w-full sm:w-20rem">
                <Menu model={items} onClick={() => setVisible(false)} className="w-full" />
            </Sidebar>
        </>
    );

    return (
        <div className="flex justify-content-between align-items-center">
            <div className="flex align-items-center">
                <div className="lg:hidden">
                    <MobileMenu />
                </div>
                <Logo />
            </div>
            <div className="hidden lg:block">
                <Menubar
                    model={items}
                    className="border-none"
                    style={{ background: "none", border: "none" }}
                />
            </div>
            <Button label="Sign Up" className="p-button-outlined p-button-secondary" />
        </div>
    );
}

export default Navigation;