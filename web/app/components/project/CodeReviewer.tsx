"use client";

import React from "react";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { tss } from "tss-react";
import { http } from "@refineit/utilities";
import AceEditor from "react-ace";
import ace from "ace-builds/src-noconflict/ace";
import { ContextMenu } from "primereact/contextmenu";
import { OverlayPanel } from "primereact/overlaypanel";
import { MenuItem, MenuItemCommandEvent } from "primereact/menuitem";
import "ace-builds/src-noconflict/theme-github_light_default";
import "ace-builds/src-noconflict/ext-language_tools";
import { InputTextarea } from "primereact/inputtextarea";

interface Annotation {
    row: number;
    column: number;
    text: string;
    type: AnnotationType
}

interface CodeReviewerProps {
    project: any;
    mode?: "view" | "review" | "difference";
}

type AnnotationType = "error" | "warning" | "info";

const useStyles = tss.create((props: any) => (
    {
        loader: { width: "50px", height: "50px" },
        code: {
            minHeight: "150px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        editorContainer: props.isFullScreen ? {
            background: "#fff",
            padding: "0.4rem 1.4rem",
            marginBottom: "0px!important",
        } : {},
        overlayPanel: {
            ".p-overlaypanel-content": {
                padding: "1rem!important"
            }
        },
        textarea: {
            resize: "none"
        }
    }
));

export const CodeReviewer: React.FC<CodeReviewerProps> = ({ project, mode = "view" }) => {
    const [loading, setLoading] = React.useState(true);
    const [code, setCode] = React.useState("");
    const [language, setLanguage] = React.useState("");
    const [languageLoaded, setLanguageLoaded] = React.useState(false);
    const [isFullScreen, setIsFullscreen] = React.useState(false);
    const [annotations, setAnnotations] = React.useState<Annotation[]>([]);
    const [text, setText] = React.useState("");
    const [selectedType, setSelectedType] = React.useState("");
    
    const { classes } = useStyles({ isFullScreen });

    const annotationMeta = React.useRef({ row: 0, column: 0, type: "" });
    const editorRef = React.useRef<HTMLDivElement>(null);
    const aceRef = React.useRef<AceEditor | null>(null);
    const cm = React.useRef<ContextMenu>(null);
    const op = React.useRef<OverlayPanel>(null);
    const labels = {
        warning: "Suggest Update",
        info: "Comment",
        error: "Mark as Problem"
    };
    const modes = {
        view: "Viewing",
        review: "Reviewing",
        difference: "Viewing Changes"
    };


    const exitFullscreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen().then(() => setIsFullscreen(false));
        }
    };

    const toggleFullScreen = () => {
        if (editorRef.current) {
            if (!document.fullscreenElement) {
                editorRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch((err) => {
                    console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
                });
            } else {
                document.exitFullscreen().then(() => setIsFullscreen(false));
            }
        }
    };

    const downloadFile = () => {
        const blob = new Blob([code], { type: "text/plain" }); // Create a Blob from the text content
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = project.filename; // Specify the file name
        a.click();

        // Cleanup: revoke the object URL after triggering the download
        URL.revokeObjectURL(url);
    };


    const addAnnotation = (row: number, column: number, text: string, type: AnnotationType) => {
        const newAnnotation: Annotation = { row, column, text, type };
        const updatedAnnotations = [...annotations, newAnnotation];

        setAnnotations(updatedAnnotations);
        aceRef.current?.editor.getSession().setAnnotations(updatedAnnotations);
    };

    const handleAnnotation = (type: AnnotationType, event: MenuItemCommandEvent) => {
        setSelectedType(labels[type]);

        if (aceRef.current && aceRef.current.editor) {
            const editor = aceRef.current.editor as any;

            // Get the coordinates of the mouse click
            const { clientX, clientY } = event.originalEvent as React.MouseEvent;

            // Convert the screen coordinates to editor line and column
            const position = editor.renderer.screenToTextCoordinates(clientX, clientY);
            const row = position.row - 1; // Line number substracted 1 
            const column = position.column; // Column number

            op.current?.toggle(event.originalEvent as React.MouseEvent)
            annotationMeta.current = { row, column, type };
        }
    }

    const handleAnnotationSubmit = () => {
        if (text && selectedType) {
            addAnnotation(annotationMeta.current.row, annotationMeta.current.column, text, annotationMeta.current.type as AnnotationType);
            setText("");
            op.current?.hide();
        }
    }

    const handleContextMenuOpen = (event: React.MouseEvent) => {
        event.preventDefault();
        if (mode === "view") return;

        cm.current?.show(event)
    };

    const items: MenuItem[] = [
        { label: labels.info, icon: "pi pi-plus-circle", command: handleAnnotation.bind(null, "info") },
        { label: labels.warning, icon: "pi pi-comment", command: handleAnnotation.bind(null, "warning") },
        { label: labels.error, icon: "pi pi-exclamation-triangle", command: handleAnnotation.bind(null, "error") },
    ];

    React.useEffect(() => {
        const loadMode = async () => {
            setLanguageLoaded(false);
            const mode = language; // Get the mode for the selected language
            if (mode) {
                await import(`ace-builds/src-noconflict/mode-${mode}`);
                ace.config.set("mode", mode); // Set the mode for the Ace editor
            }

            setLanguageLoaded(true);
        };

        loadMode();
    }, [language]);

    React.useEffect(() => {
        setLoading(true)
        http.get("https://raw.githubusercontent.com/imshawan/snippetscloud/refs/heads/main/Scrapers/cbseschools.py", {}, true).then((res) => {
            setCode(res as string);
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            setLoading(false)
        });

    }, [project.file_url]);


    return (
        <div className="" ref={editorRef}>
            <div className={"flex justify-content-between align-items-center mb-3 " + classes.editorContainer}>
                <h3>{modes[mode]} {project.filename && <span className="font-light"> - {project.filename}</span>}</h3>
                <div className="flex gap-2">
                    <Button
                        icon="pi pi-expand"
                        className="p-button-rounded p-button-outlined"
                        onClick={toggleFullScreen}
                    />
                    <Button
                        icon="pi pi-download"
                        className="p-button-rounded p-button-outlined"
                        onClick={downloadFile}
                    />
                    <Button
                        icon="pi pi-times"
                        className="p-button-rounded p-button-outlined"
                        onClick={exitFullscreen}
                    />
                </div>
            </div>

            <div
                onContextMenu={handleContextMenuOpen}
                className={classes.code}>
                {loading ? <ProgressSpinner className={classes.loader} /> : (
                    <AceEditor
                        ref={aceRef}
                        mode={languageLoaded ? language : ""}
                        theme="github_light_default" // Set the theme (use any preferred theme)
                        value={code}
                        name="code-diff-editor"
                        editorProps={{ $blockScrolling: true }}
                        setOptions={{
                            wrap: true,
                            showPrintMargin: false,
                            tabSize: 4,
                            fontSize: 14
                        }}
                        width="100%"
                        height="calc(100vh - 74px)"
                        readOnly={mode === "view"}
                    />
                )}
                <ContextMenu model={items} ref={cm} breakpoint="767px" />
                <OverlayPanel ref={op} className={classes.overlayPanel}>
                    <h4 className="mt-0 mb-2">{selectedType}</h4>
                    <InputTextarea rows={5} cols={30} className={classes.textarea} value={text} onChange={(e) => setText(e.target.value)} />
                    <div className="flex justify-content-end mt-2">
                        <Button label="Submit" className="p-button-contrast p-button-sm" onClick={handleAnnotationSubmit} />
                    </div>
                </OverlayPanel>
            </div>
        </div>
    );
};
