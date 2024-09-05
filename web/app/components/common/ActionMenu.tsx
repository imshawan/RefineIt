"use client";

import React, { useRef } from "react";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { MenuItem } from "primereact/menuitem";

interface IActionMenuProps {
    items?: MenuItem[];
}

export const ActionMenu: React.FC<IActionMenuProps> = () => {
    const menu = useRef<Menu>(null);

    const items = [
        {
            label: "Edit",
            icon: "pi pi-pencil mr-3",
            command: () => {
                // Handle edit action
            },
        },
        {
            label: "Delete",
            icon: "pi pi-trash mr-3",
            command: () => {
                // Handle delete action
            },
        },
    ];

    return (
        <div className="flex align-items-center justify-content-end">
            <Button
                icon="pi pi-ellipsis-v"
                className="p-button-text p-button-plain p-button-sm mx-0"
                onClick={(event) => menu.current?.toggle(event)}
                aria-haspopup
            />
            <Menu
                model={items}
                popup
                ref={menu}
                className="action-menu border-1 border-black-alpha-10"
                appendTo={document.body}
                style={{ width: "12rem" }}
            />
        </div>
    );
};