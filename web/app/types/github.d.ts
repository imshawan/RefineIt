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
    text_matches?: IFileContent[]
}

export interface IFileContent {
    object_url: string;     // URL to the object (string)
    object_type: string;    // Type of the object, here it's 'FileContent' (string)
    property: string;       // Property name, e.g., 'content' (string)
    fragment: string;
    matches: any[];         // Matches array, can be empty or contain other data (any[] for flexibility)
}

export interface IBlobContent {
    sha: string;       
    node_id: string;   // A unique identifier for the blob
    size: number;      // The size of the blob in bytes
    url: string;       // The API URL to access the blob
    content: string;   // The base64-encoded content of the blob
    encoding: string;  // The encoding type, in this case "base64"
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
