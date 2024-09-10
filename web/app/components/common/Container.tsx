import React from "react";
import { BaseContainer } from "./BaseContainer";

export const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <BaseContainer>
            <div className="block md:flex mx-0 xl:px-8 surface-50 overflow-hidden">
                {children}
            </div>
        </BaseContainer>
    );
};
