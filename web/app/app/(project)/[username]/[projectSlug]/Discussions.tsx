import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

const Discussions = () => {

    return (
        <div className="p-4">
            <h2 className="text-2xl mb-3">Discussions</h2>
            <InputText
                placeholder="Start a new discussion..."
                style={{ width: "100%", marginBottom: "1rem" }}
            />
            <div
                style={{
                    background: "#f8f9fa",
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    marginBottom: "1rem",
                }}
            >
                <h3>Optimizing Database Queries</h3>
                <p>
                    We should consider implementing database indexing to improve
                    query performance. Any thoughts on this?
                </p>
                <div
                    style={{
                        display: "flex",
                        gap: "0.5rem",
                        marginTop: "0.5rem",
                    }}
                >
                    <Button
                        icon="pi pi-thumbs-up"
                        className="p-button-rounded p-button-text"
                    />
                    <Button
                        icon="pi pi-star"
                        className="p-button-rounded p-button-text"
                    />
                    <Button
                        icon="pi pi-reply"
                        label="Reply"
                        className="p-button-text"
                    />
                </div>
            </div>
            <div
                style={{
                    background: "#f8f9fa",
                    padding: "1rem",
                    borderRadius: "0.5rem",
                }}
            >
                <h3>Implementing OAuth2</h3>
                <p>
                    Let&lsquo;s discuss the implementation of OAuth2 for user
                    authentication. Which provider should we start with?
                </p>
                <div
                    style={{
                        display: "flex",
                        gap: "0.5rem",
                        marginTop: "0.5rem",
                    }}
                >
                    <Button
                        icon="pi pi-thumbs-up"
                        className="p-button-rounded p-button-text"
                    />
                    <Button
                        icon="pi pi-star"
                        className="p-button-rounded p-button-text"
                    />
                    <Button
                        icon="pi pi-reply"
                        label="Reply"
                        className="p-button-text"
                    />
                </div>
            </div>
        </div>
    );
};

export default Discussions;
