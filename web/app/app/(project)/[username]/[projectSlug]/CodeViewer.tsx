import React from "react";
import { Editor } from "primereact/editor";
import { ScrollPanel } from "primereact/scrollpanel";
import { Button } from "primereact/button";
import { Tree } from "primereact/tree";

const CodeViewer = () => {

    return (
        <div className="p-4 flex">
            <div className="w-4 pr-4">
                <h3 className="mb-3">File Explorer</h3>
                <Tree
                    value={[
                        {
                            key: "0",
                            label: "src",
                            children: [
                                { key: "0-0", label: "components" },
                                { key: "0-1", label: "pages" },
                                { key: "0-2", label: "utils" },
                            ],
                        },
                        {
                            key: "1",
                            label: "public",
                        },
                        {
                            key: "2",
                            label: "package.json",
                        },
                    ]}
                />
            </div>
            <div className="w-8">
                <div className="flex justify-content-between align-items-center mb-3">
                    <h3>Code Viewer</h3>
                    <div className="flex gap-2">
                        <Button
                            icon="pi pi-search"
                            className="p-button-rounded p-button-outlined"
                        />
                        <Button
                            icon="pi pi-download"
                            className="p-button-rounded p-button-outlined"
                        />
                    </div>
                </div>
                <ScrollPanel
                    style={{ width: "100%", height: "400px" }}
                    className="custom-scrollbar"
                >
                    <pre
                        className="language-typescript"
                        style={{
                            padding: "1em",
                            background: "#f8f9fa",
                            borderRadius: "4px",
                        }}
                    >
                        {`import React from 'react';
import { Button } from 'primereact/button';

const App: React.FC = () => {
  return (
    <div>
      <h1>Hello, PrimeReact!</h1>
      <Button label="Click me" icon="pi pi-check" />
    </div>
  );
};

export default App;`}
                    </pre>
                </ScrollPanel>
            </div>
        </div>
    );
};

export default CodeViewer;
