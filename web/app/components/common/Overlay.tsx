"use client";

import React from "react";
import { tss } from "tss-react";

const useStyles = tss.create(() => ({
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        zIndex: 1
    },
}));

export const Overlay: React.FC<{show: boolean}> = ({show}) => {
    const { classes } = useStyles();

    return (show && <div className={classes.overlay}></div>)
}