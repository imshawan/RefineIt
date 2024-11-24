import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useRouter } from "next/navigation";

const ReviewSection: React.FC<{ project: any }> = ({ project }) =>{
    const router = useRouter();

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
                value={[
                    {
                        id: 1,
                        reviewer: "Alice",
                        status: "In Progress",
                        lastUpdated: "2024-09-06",
                    },
                    {
                        id: 2,
                        reviewer: "Bob",
                        status: "Completed",
                        lastUpdated: "2024-09-05",
                    },
                ]}
            >
                <Column field="id" header="ID"></Column>
                <Column field="reviewer" header="Reviewer"></Column>
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
                <Column field="lastUpdated" header="Last Updated"></Column>
            </DataTable>
        </div>
    );
};

export default ReviewSection;
