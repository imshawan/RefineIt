import { TreeNode } from "primereact/treenode";

export interface IRepositoryTreeNode extends TreeNode {
    key: string
    children: IRepositoryTreeNode[]
}

export interface INodeItem {
    key: string;
    label: string;
    data: any;
    leaf: boolean;
    icon: string;
    url: string;
}

export interface ISearchResult {
    name: string;
    path: string;
    sha: string;
    url: string;
    git_url: string;
    html_url: string;
    score: number;
}

interface ILinks {
    self: string;
    git: string;
    html: string;
}

export interface IGitHubFileContent extends Array {
    name: string;
    path: string;
    sha: string;
    size: number;
    url: string;
    html_url: string;
    git_url: string;
    download_url: string | null; // download_url can be null for some file types
    type: "file" | "dir";
    _links: ILinks;
}

export interface IRepositoryInfo {
    id: number;
    node_id: string;
    name: string;
    full_name: string;
    private: boolean;
    html_url: string;
    description: string;
    fork: boolean;
    url: string;
    created_at: string;
    updated_at: string;
    pushed_at: string;
    git_url: string;
    ssh_url: string;
    clone_url: string;
    svn_url: string;
    homepage: string;
    size: number;
    stargazers_count: number;
    watchers_count: number;
    language: string;
    has_issues: boolean;
    has_projects: boolean;
    has_downloads: boolean;
    has_wiki: boolean;
    has_pages: boolean;
    has_discussions: boolean;
    forks_count: number;
    mirror_url: string | null;
    archived: boolean;
    disabled: boolean;
    open_issues_count: number;
    allow_forking: boolean;
    is_template: boolean;
    web_commit_signoff_required: boolean;
    visibility: string;
    forks: number;
    open_issues: number;
    watchers: number;
    default_branch: string;
    temp_clone_token: string | null;
    topics: string[];
    network_count: number;
    subscribers_count: number;
}
