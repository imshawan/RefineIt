"use client";

import React from "react";
import { tss } from "tss-react";
import { Skeleton } from "primereact/skeleton";
import { useStyles } from "./Project";

const skeletonStyles = tss.create({
    dots: {
        marginBottom: "2px"
    }
})

const SkeletonLoader = () => {
    const { classes } = useStyles();
    const {classes: skeletonClasses} = skeletonStyles();

    return (
        <div className={classes.card}>
            <div className="p-3">
                <div className="flex mb-3 justify-content-between">
                    <div className="flex">
                        <Skeleton shape="circle" size="40px" className="mr-2" />
                        <div>
                            <Skeleton width="8rem" className="mb-2" />
                            <Skeleton width="2rem" height=".7rem" className="mb-2" />
                        </div>
                    </div>
                    <div className="my-auto">
                        {Array.from(new Array(3)).map((_, ind) => <Skeleton key={ind} shape="circle" size="4px" className={skeletonClasses.dots} />)}
                    </div>
                </div>
                <Skeleton width="100%" className="mb-2" />
                <Skeleton width="100%" height="4rem" className="my-3" />
                <div className={classes.infoGrid}>
                    {Array.from(new Array(2)).map((_, ind) => <Skeleton key={ind} width="80%" />)}
                </div>
                <div className="flex mt-3 mb-4 gap-2">
                    {Array.from(new Array(3)).map((_, ind) => <Skeleton key={ind} height=".8rem" width="3rem" />)}
                </div>
            </div>
            <div className={classes.footer}>
                <div className={classes.footerLeft}>
                    {Array.from(new Array(2)).map((_, ind) => <Skeleton key={ind} width="2rem" />)}
                    <Skeleton width="4rem" />
                </div>
                <Skeleton width="4rem" height="1.5rem" className="mb-2" />
            </div>
        </div>
    )
}

export default SkeletonLoader;