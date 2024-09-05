"use client";

import React, { useState, useRef, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

interface SearchBarProps {
    onValueChange?: (value: string) => void;
    onExpand?: (expanded: boolean) => void;
}

const ExpandableSearchBar: React.FC<SearchBarProps> = ({onValueChange, onExpand}) => {
    const [expanded, setExpanded] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (onExpand && typeof onExpand === "function") {
            onExpand(expanded);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expanded])

    const toggleExpand = () => {
        setExpanded(!expanded);
        if (!expanded) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    const valueOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
        if (onValueChange && typeof onValueChange === "function") {
            onValueChange(event.target.value);
        }
    };

    return (
        <div ref={containerRef} className={"relative"}
            style={{
                width: expanded ? "22rem" : "2rem",
                transition: "width 0.3s ease-in-out"
            }}>
            <div
                className={"inset-0 flex items-center h-full w-full"}
                style={{
                    opacity: expanded ? 1 : 0,
                    pointerEvents: expanded ? "auto" : "none",
                    transition: "opacity 0.3s ease-in-out",
                }}
            >
                <InputText
                    ref={inputRef}
                    value={searchValue}
                    onChange={valueOnChange}
                    // onKeyPress={handleKeyPress}
                    placeholder="Search"
                    className="w-full h-full pr-3rem p-inputtext-sm"
                />
            </div>
            <Button onClick={toggleExpand} className="p-button-sm h-full p-button-icon-only p-button-link p-button-text absolute right-0 top-0 z-1 p-icon-badge-button">
                <i className={"pi p-overlay-badge text-black-alpha-60 pi-" + (expanded ? "times" : "search")} style={{ fontSize: "1.2rem" }} />
            </Button>
        </div>
    );
};

export default ExpandableSearchBar;
