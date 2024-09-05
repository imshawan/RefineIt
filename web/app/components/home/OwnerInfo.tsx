import moment from "moment";
import Image from "next/image";
import { Avatar } from "primereact/avatar";
import React from "react";
import { tss } from "tss-react";

interface UserCardProps {
    authorImage: string;
    name: string;
    createdAt: string
}

const useStyles = tss.create({
    image: {
        width: "40px",
        height: "40px"
    }
});

const OwnerInfo: React.FC<UserCardProps> = ({ authorImage, name, createdAt }) => {
    const { classes } = useStyles();

    return (
        <div className="flex align-items-center justify-content-between">
            <div className="flex align-items-center">
                <Avatar
                    image={authorImage}
                    icon="pi pi-user"
                    shape="circle"
                    className={"cursor-pointer mr-2 my-auto overflow-hidden " + classes.image}
                />
                <div>
                    <h5 className="m-0">{name}</h5>
                    <small className="text-muted text-xs font-light">{moment(createdAt).fromNow()}</small>
                </div>
            </div>
        </div>
    );
};

export default OwnerInfo;