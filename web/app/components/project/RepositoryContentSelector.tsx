"use client";

import React, { useEffect, useRef, useState } from "react";
import _ from "lodash";
import { toast } from "sonner";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Tree, TreeCheckboxSelectionKeys, TreeMultipleSelectionKeys, TreeNodeTemplateOptions, TreeSelectionEvent } from "primereact/tree";
import { TreeNode } from "primereact/treenode";
import { Dialog } from "primereact/dialog";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { useBreakpoints } from "@refineit/hooks";
import { http, parseParams } from "@refineit/utilities";
import { endpoints, externals } from "@refineit/common/constants";
import { INodeItem, IGitHubFileContent, ISearchResult, IRepositoryTreeNode } from "@refineit/types";

interface IRepositoryContentSelectorProps {
    show: boolean;
    onHide: () => void;
    onSelectionComplete: (content: IGitHubFileContent | null) => void;
    defaultContent: TreeNode[];
    repositoryUrl: string;
}

const MIN_SEARCH_CHARS = 2;

export const RepositoryContentSelector: React.FC<IRepositoryContentSelectorProps> = ({ show, onHide, onSelectionComplete, defaultContent, repositoryUrl }) => {
    const [repositoryContent, setRepositoryContent] = useState<TreeNode[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<string | TreeMultipleSelectionKeys | TreeCheckboxSelectionKeys | null>(null);
    const [loadingNodes, setLoadingNodes] = useState<string[]>([]);
    const [searching, setSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const inputText = useRef<HTMLInputElement>(null);

    const breakpoints = useBreakpoints();
    const isMobile = breakpoints("mobile");

    const findNodeByKey = (nodes: IRepositoryTreeNode[], key: string): IGitHubFileContent | null => {
        for (let node of nodes) {
            if (node.key === key) {
                return node.data;
            }
            if (node.children) {
                const found = findNodeByKey(node.children, key);
                if (found) {
                    return found;
                }
            }
        }
        return null;
    };

    const onSelectionSubmit = () => {
        if (onSelectionComplete && typeof onSelectionComplete === "function") {
            const content = findNodeByKey(repositoryContent as IRepositoryTreeNode[], String(selectedFiles));
            if (content?.type !== "file") {
                return toast.error("Error", {description: "Please select a single file"});
            }

            onSelectionComplete(content);
        }

        onHide();
    }

    const searchGitHubRepository = async (query: string) => {
        setSearching(true);
        try {
            const repoUrlParts = repositoryUrl.split("/");
            const owner = repoUrlParts[repoUrlParts.length - 2];
            const repo = repoUrlParts[repoUrlParts.length - 1];
            const response = await http.get<{items: ISearchResult[]}>(
                parseParams(endpoints.GITHUB.REPOSITORY_SEARCH, {query: new URLSearchParams({q: query, owner, repo}).toString()}),
                {}, true
            );

            const searchResults = response.items.map((item: ISearchResult) => ({
                key: item.path,
                label: item.path,
                data: item,
                leaf: true,
                icon: "pi pi-file",
            })) as INodeItem[];

            setRepositoryContent(searchResults);
        } catch (error: any) {
            let err = http.parseHttpError(error) as any;
            let message = error.message as string;
            if (err.error) {
                message = err.error;
            }
            toast.error("Error", {description: message})
        } finally {
            setSearching(false);
        }
    };

    const handleNodeExpand = async (event: any) => {
        const node = event.node;
        if (node.children && node.children.length === 0 && !node.leaf) {
            setLoadingNodes(prev => [...prev, node.key]);
            try {
                const repoUrlParts = repositoryUrl.split("/");
                const owner = repoUrlParts[repoUrlParts.length - 2];
                const repo = repoUrlParts[repoUrlParts.length - 1];
                const response = await http.get<IGitHubFileContent[]>(parseParams(externals.github.REPOSITORY_CONTENT, {owner, repo, name: node.key}));

                node.children = response.map((item: IGitHubFileContent) => ({
                    key: item.path,
                    label: item.name,
                    data: item,
                    leaf: item.type !== "dir",
                    icon: item.type === "dir" ? "pi pi-folder" : "pi pi-file",
                    children: item.type === "dir" ? [] : undefined,
                }));

                node.children.sort((a: any, b: any) => {
                    if (a.leaf && !b.leaf) return 1;
                    if (!a.leaf && b.leaf) return -1;
                    return a.label.localeCompare(b.label);
                });
                setRepositoryContent([...repositoryContent]);
            } catch (error) {
                toast.error("Error", {description: "Error fetching directory content"});
                // console.error("Error fetching directory content:", error);
            } finally {
                setLoadingNodes(prev => prev.filter(key => key !== node.key));
            }
        }
    };

    const handleSearchChange = _.debounce((e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query)

        if (query.length > MIN_SEARCH_CHARS) {
            searchGitHubRepository(query);
        } else {
            setRepositoryContent(defaultContent);
        }
    }, 500);

    const clearSearch = () => {
        if (searchQuery.length > MIN_SEARCH_CHARS) {
            inputText.current && (inputText.current.value = "");
            setRepositoryContent(defaultContent);
            setSearchQuery("");
        }
    }

    const nodeTemplate = (node: TreeNode, options: TreeNodeTemplateOptions) => {
        const isSelected = selectedFiles === node.key;
        const isFolder = node.children && Array.isArray(node.children);

        return (
            <span className="flex">
                {node.label}
                {loadingNodes.includes(String(node.key)) && <i className="pi pi-spin pi-spinner ml-2 my-auto" />}
                {isSelected && !isFolder && <i className="pi pi-check" style={{ marginLeft: "5px" }}></i>}
            </span>
        );
    };

    const footerTemplate = () => {
        return (
            <div>
                <Button label="Cancel" onClick={onHide} icon="pi pi-times" className="p-button-text p-button-sm" />
                <Button label="Save" onClick={onSelectionSubmit} icon="pi pi-check" autoFocus className="p-button-sm" />
            </div>
        )
    }

    const handleSelectionChange = (event: TreeSelectionEvent) => {
        setSelectedFiles(event.value);
    }

    useEffect(() => {
        setRepositoryContent(defaultContent);
    }, [defaultContent])

    return (
        <React.Fragment>
            <Dialog header="Select Files from Repository" maximized={isMobile} footer={footerTemplate}
                style={{ width: "60vw", }} breakpoints={{ "960px": "75vw", "641px": "100vw" }}
                visible={show} onHide={onHide}>
                <IconField className="my-2 sticky top-0 z-1" iconPosition="right">
                    <InputIcon onClick={clearSearch} className={"pi cursor-pointer " + (searching ? "pi-spinner pi-spin" : (searchQuery.length ? "pi-times" : "pi-search"))}> </InputIcon>
                    <InputText ref={inputText} className="w-full" v-model="value1" placeholder="Search files" onChange={handleSearchChange} />
                </IconField>
                <div>
                    <Tree value={repositoryContent} selectionMode="single" selectionKeys={selectedFiles} onSelectionChange={handleSelectionChange} onExpand={handleNodeExpand} nodeTemplate={nodeTemplate} />
                </div>
            </Dialog>
        </React.Fragment>
    )
}