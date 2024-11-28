"use client";

import React, { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { FileUpload, FileUploadSelectEvent } from "primereact/fileupload";
import { Button } from "primereact/button";
import { ProgressBar } from "primereact/progressbar";
import { TreeNode } from "primereact/treenode";
import { MultiSelect } from "primereact/multiselect";
import { RepositoryContentSelector } from "@refineit/components/project";
import { IGitHubFileContent, IRepositoryInfo } from "@refineit/types/github";
import { ConfirmDialog } from "primereact/confirmdialog";
import { formatBytes, http, parseParams } from "@refineit/utilities";
import { toast, Toaster } from "sonner";
import { Badge } from "primereact/badge";
import Navigation from "@refineit/components/common/navbar";
import { Divider } from "primereact/divider";
import { isAllowedCodeExtension } from "@refineit/utilities/files";
import { reviewTypes, priorities, visibility } from "@refineit/utilities";
import { allowedCodeExtensions, externals } from "@refineit/common";
import { Overlay } from "@refineit/components/common";
import { createProject } from "@refineit/store/project";
import { useSession } from "next-auth/react";
import { IUserTokenInfo, UserTokenStore } from "@refineit/lib";
import { useRouter } from "next/navigation";

const ProjectCreation = () => {
    const {data: session} = useSession();
    const router = useRouter();

    const [projectName, setProjectName] = useState("");
    const [projectSlug, setProjectSlug] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [projectVisibility, setProjectVisibility] = useState("public");
    const [reviewType, setReviewType] = useState(null);
    const [priority, setPriority] = useState("medium");
    const [progress, setProgress] = useState(0);
    const [isRepositoryLoading, setIsRepositoryLoading] = useState(false);
    const [isRepositoryLoaded, setIsRepositoryLoaded] = useState(false);
    const [repositoryUrl, setRepositoryUrl] = useState("");
    const [repositoryContent, setRepositoryContent] = useState<TreeNode[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<IGitHubFileContent | null>();
    const [showRepositoryDialog, setShowRepositoryDialog] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [availableTags, setAvailableTags] = useState(["JavaScript", "React", "TypeScript", "Machine Learning"]);
    const [visible, setVisible] = useState(false);
    const [fileSelected, setFileSelected] = useState<File>();
    const [showFileUpload, setShowFileUpload] = useState(true);
    const [showGithubImport, setShowGithubImport] = useState(true);
    const [loading, setLoading] = useState(false);

    const repositoryData = useRef<IRepositoryInfo | null>(null);
    const currentRepoUrl = useRef<string>("");
    const fileUploadRef = React.useRef<FileUpload>(null);
    const user = React.useMemo(() => session?.user, [session?.user]);

    const updateProgress = () => {
        let completed = 0;
        if (projectName) completed++;
        if (projectDescription) completed++;
        if (reviewType) completed++;
        if (projectVisibility) completed++;
        if (fileSelected || (selectedFiles && Object.keys(selectedFiles).length)) completed++;

        setProgress(Math.floor((completed / 5) * 100));
    };

    const generateSlug = (name: string) => {
        return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    };

    const projectNameOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProjectName(event.target.value);
        setProjectSlug(generateSlug(event.target.value));
    }

    const populateWithRepositoryData = (repoData: IRepositoryInfo | null) => {
        if (!repoData) return;

        setProjectName(repoData.name);
        setProjectSlug(repoData.name);
        setProjectDescription(repoData.description || "");
        setTags(repoData.topics || []);
        setAvailableTags(prev => [...prev, ...repoData.topics]);
    }

    const fetchGitHubRepository = async () => {
        if (!repositoryUrl) {
            return toast.error("URL is required", {description: "Please enter a valid GitHub repository URL to load"});
        }
        if (isRepositoryLoaded) {
            setShowRepositoryDialog(true);
            return;
        }

        setIsRepositoryLoading(true);

        try {
            const repoUrlParts = repositoryUrl.split("/");
            const owner = repoUrlParts[repoUrlParts.length - 2];
            const repo = repoUrlParts[repoUrlParts.length - 1];

            const [repoResponse, contentsResponse] = await Promise.all([
                http.get<IRepositoryInfo>(parseParams(externals.github.REPOSITORY, {owner, repo}), {}, true),
                http.get<IGitHubFileContent[]>(parseParams(externals.github.REPOSITORY_CONTENT, {owner, repo}), {}, true),
            ]);

            repositoryData.current = repoResponse;
            setVisible(true);

            const transformToTreeNodes = (items: IGitHubFileContent[]): TreeNode[] => {
                return items.sort((a, b) => {
                    if (a.type === "dir" && b.type !== "dir") return -1;
                    if (a.type !== "dir" && b.type === "dir") return 1;
                    return a.name.localeCompare(b.name);
                }).map(item => ({
                    key: item.path,
                    label: item.name,
                    data: item,
                    leaf: item.type !== "dir",
                    children: item.type === "dir" ? [] : undefined,
                    icon: item.type === "dir" ? "pi pi-folder" : "pi pi-file",
                }));
            };

            const initialContent = transformToTreeNodes(contentsResponse);
            setRepositoryContent(initialContent);
            setIsRepositoryLoaded(true);
            setShowFileUpload(false);
        } catch (error: any) {
            let err = http.parseHttpError(error) as any;
            let message = error.message as string;
            if (err.message) {
                message = err.message;
            }

            toast.error("Error fetching GitHub repository", { description: message })

        } finally {
            setIsRepositoryLoading(false);

            currentRepoUrl.current = repositoryUrl;
        }
    };

    const onRepositoryContentSelection = (content: IGitHubFileContent | null) => {
        if (!content) return;

        setSelectedFiles(content);
    }

    const onRepositoryUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let { value } = event.target;
        setRepositoryUrl(value);

        if (currentRepoUrl.current && repositoryUrl && value != repositoryUrl) {
            setIsRepositoryLoaded(false);
        }
    }

    const dialogAccept = () => {
        populateWithRepositoryData(repositoryData.current);
        setShowRepositoryDialog(true);
    }

    const dialogReject = () => {
        setShowRepositoryDialog(true);
    }

    const handleSubmit = async () => {
        setLoading(true);

        let fileName = (selectedFiles && Object.keys(selectedFiles).length) 
            ? selectedFiles.name 
            : String(fileSelected).split("/").pop();
        let fileUrl = (selectedFiles && Object.keys(selectedFiles).length) ? selectedFiles.download_url : fileSelected;

        let data = {
            name: projectName,
            slug: projectSlug,
            description: projectDescription,
            review_type: reviewType,
            repository_url: repositoryUrl,
            file_url: fileUrl,
            filename: fileName,
            visibility: projectVisibility,
            tags,
            priority: priority
        };

        const resp = await createProject(data);
        
        if (typeof resp === "string") {
            toast.error("Error creating project", { description: resp });
            setLoading(false);
        } else {
            let {statusCode, response, status} = resp;
            if (statusCode > 399) {
                toast.error("Error creating project", { description: status.message });
                setLoading(false);
                return;
            }

            toast.success("Success", {description: response.message});

            if (response.project) {
                // navigate to project page
                router.push(`${response.project.owner.username}/${response.project.slug}`)
            } else {
                router.push("/");
            }
        }
    }

    const onFileSelect = (event: FileUploadSelectEvent) => {
        const files = event.files;
        let file = files.length ? files[0] : null;

        if (!file) return fileUploadRef.current?.clear();

        if (!isAllowedCodeExtension(file)) {
            toast.error("Invalid File Type", {description: `${file.name} is not an allowed file.`});
            fileUploadRef.current?.clear();
        }

        setFileSelected(file);
        setShowGithubImport(false);
    }

    useEffect(() => {
        updateProgress();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectName, projectDescription, reviewType, repositoryUrl, fileSelected, projectVisibility]);

    useEffect(() => {
        if (isRepositoryLoaded) {
            setShowFileUpload(false);
        } else if (fileSelected) {
            setShowGithubImport(false);
        }
    }, [isRepositoryLoaded, fileSelected]);

    useEffect(() => {
        if (!repositoryUrl.length) {
            setShowFileUpload(true)
        }
    }, [repositoryUrl]);

    useEffect(() => {
        UserTokenStore.setTokenInfo(user as IUserTokenInfo);
    }, [user]);

    const SelectedGithubFile: React.FC<{file: IGitHubFileContent | null | undefined}> = ({file}) => {
        if (!file) return;

        const onCancel = () => {
            setSelectedFiles(null);
        }

        return (
            <div>
                <div className="p-fileupload-row" data-pc-section="file">
                    <div data-pc-section="details">
                        <div className="p-fileupload-filename">
                            {file.name}
                        </div>
                        <span data-pc-section="filesize">{formatBytes(file.size)}</span>
                        <Badge value="Completed" className="p-fileupload-file-badge mx-0 sm:mx-2" severity="success"></Badge>
                    </div>
                    <div data-pc-section="actions">
                        <Button icon="pi pi-times" onClick={onCancel} rounded outlined severity="danger" className="text-red-500 border-0" aria-label="Cancel" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <React.Fragment>
            <Navigation />
            <ProgressBar value={progress} className="sticky left-0 z-1 w-full text-xs rounded-progress-bar hidden md:block" style={{ borderRadius: 0, height: "12px", top: "58px" }} />
            <div className="flex justify-content-center align-items-center project-creation min-h-screen">
                <div className="p-5 w-full lg:w-8 xl:w-6 relative overflow-hidden">
                    <div className="mb-5">
                        <i className="pi pi-code-branch text-5xl text-blue-500 mb-3"></i>
                        <h2 className="text-900 font-bold mb-2">Start a New Project</h2>
                        <span className="text-600 font-normal text-sm line-height-3">
                        Create a workspace for your project’s code, discussions, and feedback. Already have code hosted elsewhere? Easily link your existing repository and start collaborating in real time!
                        </span>
                    </div>
                    <div className="grid formgrid p-fluid">
                        <div className="field col-12">
                            <label htmlFor="project-name" className="mb-2 text-sm">Project name</label>
                            <InputText id="project-name" value={projectName} onChange={projectNameOnChange} className="w-full mb-1 p-inputtext-sm" placeholder="awesome-project" />
                            {
                                projectSlug && <small className="">
                                    Cool! Your project will be visible under your profile as <span className="font-semibold m-0">imshawan/{projectSlug}</span>
                                </small>
                            }
                        </div>
                        <div className="field col-12">
                            <label htmlFor="project-description" className="mb-2 text-sm">Description (optional)</label>
                            <InputTextarea id="project-description" value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} rows={5} className="w-full p-inputtext-sm" placeholder="What are we reviewing today?" />
                        </div>

                        <div className="field col-12 md:col-6">
                            <label htmlFor="visibility" className="mb-2 text-sm">Project visibility</label>
                            <Dropdown id="visibility" value={projectVisibility} onChange={(e) => setProjectVisibility(e.value)} options={visibility} placeholder="Select project visibility" className="w-full p-inputtext-sm" />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="review-type" className="mb-2 text-sm">Priority</label>
                            <Dropdown id="review-type" value={priority} onChange={(e) => setPriority(e.value)} options={priorities} placeholder="Select priority" className="w-full p-inputtext-sm" />
                        </div>
                        <div className="field col-12">
                            <label htmlFor="review-type" className="mb-2 text-sm">Review Type</label>
                            <Dropdown id="review-type" value={reviewType} onChange={(e) => setReviewType(e.value)} options={reviewTypes} placeholder="Select review focus" className="w-full p-inputtext-sm" />
                        </div>
                        <div className="field col-12 relative">
                            <label htmlFor="tags" className="p-d-block">Project Tags</label>
                            <MultiSelect id="tags" value={tags} options={availableTags} onChange={(e) => setTags(e.value)} placeholder="Select Tags" display="chip" className="w-full text-xs" filter maxSelectedLabels={6} />
                        </div>
                        <div className="field col-12">
                            <h3>Code submission</h3>
                        </div>
                        <div className="field col-12 relative">
                            <Overlay show={!showGithubImport} />
                            <label htmlFor="github-url" className="text-sm mb-2">
                                Import from GitHub
                            </label>
                            <div className="p-component p-fileupload p-fileupload-advanced">
                                <div className="p-fileupload-buttonbar">
                                    <div className="p-inputgroup flex flex-row">
                                        <InputText
                                            placeholder="https://github.com/username/repo"
                                            id="github-url" value={repositoryUrl} onChange={onRepositoryUrlChange}
                                            className="border-round-left p-inputtext-sm"
                                        />
                                        <Button label={(isRepositoryLoaded ? "View" : "Get")} icon="pi pi-angle-right" iconPos="right" loading={isRepositoryLoading} onClick={fetchGitHubRepository} className="p-button-sm md:hidden p-button-info border-round-right mx-0" />
                                        <Button label={(isRepositoryLoaded ? "View" : "Get") + " repository"} icon="pi pi-angle-right" iconPos="right" loading={isRepositoryLoading} onClick={fetchGitHubRepository} className="p-button-sm hidden p-button-info md:flex border-round-right mx-0" />
                                    </div>
                                </div>
                                <div className="p-fileupload-content">
                                    <SelectedGithubFile file={selectedFiles} />
                                </div>
                            </div>
                        </div>
                        <Divider align="center" type="solid">Or</Divider>
                        <div className="field col-12 relative">
                            <Overlay show={!showFileUpload} />
                            <label htmlFor="code-upload" className="text-sm mb-2">Upload file from device</label>
                            <FileUpload id="code-upload" mode="advanced" ref={fileUploadRef}
                                accept={`.${allowedCodeExtensions.join(",.")}`} 
                                maxFileSize={10000000}
                                chooseOptions={{
                                    className: "p-button-info p-button-sm"
                                }}
                                uploadOptions={{
                                    className: "p-button-contrast p-button-sm"
                                }}
                                cancelOptions={{
                                    className: "p-button-tertiary p-button-sm"
                                }}
                                emptyTemplate={<p className="m-0 p-5 text-600">Drag and drop files here or click to upload.</p>}
                                multiple={false}
                                onSelect={onFileSelect}
                                onRemove={() => setShowGithubImport(true)}
                                onClear={() => setShowGithubImport(true)}
                            />
                        </div>
                        
                    </div>
                    <div className="flex justify-content-end">
                        <div className="field w-12 md:w-4">
                            <Button label="Create Review Project" loading={loading} onClick={handleSubmit} icon="pi pi-code-branch" className="w-full p-button-contrast mt-4" disabled={progress !== 100} />
                        </div>
                    </div>
                </div>
            </div>
            <RepositoryContentSelector
                show={showRepositoryDialog && Boolean(repositoryContent.length)}
                onHide={() => setShowRepositoryDialog(false)}
                onSelectionComplete={onRepositoryContentSelection}
                defaultContent={repositoryContent}
                repositoryUrl={repositoryUrl}
            />
            <ConfirmDialog
                visible={visible}
                onHide={() => setVisible(false)}
                message="Do you want to use the repository information such as name, description and tags for this project?"
                header="Use repository information"
                icon="pi pi-exclamation-triangle"
                accept={dialogAccept}
                reject={dialogReject}
                style={{ width: "60vw" }}
                breakpoints={{ "1100px": "75vw", "960px": "90vw" }}
            />
            <Toaster position="top-right" richColors />
        </React.Fragment>
    );
};

export default ProjectCreation;