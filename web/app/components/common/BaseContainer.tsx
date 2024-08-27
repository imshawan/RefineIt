import React from "react";

export const BaseContainer: React.FC<{children: React.ReactNode}> = ({children}) => {
    return (
        <div className="w-full h-full items-center justify-center">
            {children}
        </div>
    );
};