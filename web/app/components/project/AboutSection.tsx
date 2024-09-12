"use client"

import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import SimpleMDE from "react-simplemde-editor";
import EasyMDE from "easymde";
import { Button } from "primereact/button";

import "easymde/dist/easymde.min.css";

interface IAboutSectionProps {
    content: string;
    name: string;
    projectId: string
}

export const AboutSection: React.FC<IAboutSectionProps> = ({ content, name, projectId }) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [markdown, setMarkdown] = React.useState<string>(content || "# Hello, Markdown!");
    const [editorData, setEditorData] = React.useState<string>(content || "# Hello, Markdown!");
    const editorRef = React.useRef<EasyMDE | null>(null);

    const handleEditorChange = React.useCallback((value: string) => {
        setEditorData(value);
    }, []);

    const closePreview = () => {
        const editor = editorRef.current;
        if (editor && editor.isSideBySideActive()) {
            EasyMDE.toggleFullScreen(editor);
        }
    };

    const handleSubmit = () => {
        setMarkdown(editorData);
        setIsEditing(false);
    }

    const editorOptions: EasyMDE.Options = React.useMemo(() => ({
        toolbar: [
            "bold",
            "italic",
            "heading",
            "|",
            "quote",
            "code",
            "unordered-list",
            "ordered-list",
            "|",
            "link",
            "image",
            "|",
            {
                name: "custom-preview",
                action: EasyMDE.toggleSideBySide,
                className: "fa fa-eye",
                title: "Render Preview",
            },
            {
                name: "close-preview",
                action: closePreview,
                className: "fa fa-times",
                title: "Close Preview",
            },
        ],
        maxHeight: "500px"
    }), [])

    const memoizedSimpleMDE = React.useMemo(() => (
        <SimpleMDE
            value={markdown}
            onChange={handleEditorChange}
            options={editorOptions}
            getMdeInstance={(instance) => {
                console.log("new instance", instance);
                editorRef.current = instance;
            }}
        />
    ), [markdown, handleEditorChange, editorOptions]);


    return (
        <React.Fragment>
            <div className="flex">
                <div className="w-11 pr-4">
                    <h3 className="">About {name}</h3>
                </div>
                {!isEditing && <div className="w-1 flex justify-center align-items-start">
                    <Button onClick={() => setIsEditing(true)} icon="pi pi-pencil" className="p-button-rounded p-button-text" />
                </div>}
            </div>
            {!isEditing && <ReactMarkdown rehypePlugins={[rehypeRaw]}>{markdown}</ReactMarkdown>}
            {isEditing && <div className="flex justify-content-between mb-4 mt-2">
                <Button label="Back" icon="pi pi-arrow-left" className="p-button-text p-button-sm" onClick={() => setIsEditing(false)} />
                <Button label="Save changes" className="p-button-outlined p-button-sm" onClick={handleSubmit} />
            </div>}
            {isEditing && memoizedSimpleMDE}
        </React.Fragment>
    )
}