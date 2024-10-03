import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { tss } from "tss-react";
import UserInputForm from "../signin/UserInputForm";

const useStyles = tss.create((theme) => ({
    title: {
        fontSize: "2.5rem",
        fontWeight: "bold",
        marginBottom: "0.2rem",
        textAlign: "center",
        marginTop: "0"
    },
    subtitle: {
        fontSize: "1rem",
        marginBottom: "2rem",
        marginTop: "0.5rem",
        textAlign: "center",
    },
}));

const LoginPopup: React.FC<{show: boolean, onHide: () => void}> = ({show, onHide}) => {
    const { classes } = useStyles();

    return (
        <Dialog
            visible={show}
            onHide={onHide}
            className="md:w-6 lg:w-4 sm:w-12 w-12 px-2 sm:px-6 md:px-0"
            header={null}
            footer={null}
            modal
            draggable={false}
            headerClassName="pb-0"
            contentClassName="pb-2"
        >
            <h2 className={classes.title}>Refine<span className="text-green-600">.</span>It</h2>
            <p className={classes.subtitle}>Collaborate, Refine, Perfect</p>
            <UserInputForm />
        </Dialog>
    );
};

export default LoginPopup;