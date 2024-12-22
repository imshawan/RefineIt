import React from "react";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useRouter } from "next/navigation";
import { useReviews } from "../../hooks";
import { IReview } from "@refineit/types";
import moment from "moment";

const ReviewSection: React.FC<{ project: any }> = ({ project }) =>{
    const router = useRouter();
    const {reviews} = useReviews();

    const handleReview = () => {
        router.push(`/project/${project.slug}/review`);
    };

    return (
        <div className="p-4">
            <div className="flex justify-content-between align-items-center mb-4">
                <h2 className="text-2xl">Reviews</h2>
                <Button
                    label="Start New Review"
                    icon="pi pi-plus"
                    className="p-button-contrast"
                    onClick={handleReview}
                />
            </div>
            <DataTable
                value={reviews}
                placeholder="No reviews found"
            >
                <Column field="id" header="ID" body={(rowData, { rowIndex }) => rowIndex + 1}></Column>
                <Column header="Reviewer" body={(rowData: IReview) => rowData.reviewer.fullname}></Column>
                <Column
                    field="status"
                    header="Status"
                    body={(rowData) => (
                        <Badge
                            value={rowData.status}
                            severity={
                                rowData.status === "Completed"
                                    ? "success"
                                    : "warning"
                            }
                        />
                    )}
                ></Column>
                <Column field="updated_at" header="Last Updated" body={(rowData: IReview) => {
                    return moment(rowData.updated_at).fromNow();
                }}></Column>
            </DataTable>
        </div>
    );
};

export default ReviewSection;
