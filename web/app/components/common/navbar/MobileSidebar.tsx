"use client";

import React, { useRef } from "react";
import { Ripple } from "primereact/ripple";
import { StyleClass } from "primereact/styleclass";

interface MenuItem {
    label: string;
    icon: string;
    className?: string;
    command?: () => void;
    items?: MenuItem[];
}

const SidebarMenu: React.FC<{item: MenuItem}> = ({item}) => {
    const buttonRef = useRef(null);

    if (item.items && item.items.length) {
        return (
            <li>
                <StyleClass nodeRef={buttonRef} selector="@next" enterClassName="hidden" enterActiveClassName="slidedown" leaveToClassName="hidden" leaveActiveClassName="slideup">
                    <a ref={buttonRef} className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                        <i className={item.icon + " mr-2"}></i>
                        <span className="font-medium">{item.label}</span>
                        <i className="pi pi-chevron-down ml-auto mr-1"></i>
                        <Ripple />
                    </a>
                </StyleClass>
                <ul className="list-none py-0 pl-3 pr-0 m-0 hidden overflow-y-hidden transition-all transition-duration-400 transition-ease-in-out">
                    {item.items.map((child, index) => <SidebarMenu key={index} item={child} />)}
                </ul>
            </li>
        );
    } else {
        return (
            <li>
                <a onClick={item.command} className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                    <i className={item.icon + " mr-2"}></i>
                    <span className="font-medium">{item.label}</span>
                    <Ripple />
                </a>
            </li>
        );
    }
};

export default SidebarMenu;
