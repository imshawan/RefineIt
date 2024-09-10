export interface IProject {
    id: string;
    contributors_count: number;
    created_at: string;
    description: string;
    file_url: string;
    filename: string;
    is_featured: boolean;
    last_reviewed_at: string | null;
    name: string;
    owner_id: string;
    owner: IProjectOwner;
    priority: "low" | "medium" | "high";
    repository_url: string | null;
    review_type: string;
    reviews_count: number;
    slug: string;
    stars_count: number;
    tags: Array<string>;
    updated_at: string;
    visibility: string;
}

interface IProjectOwner {
    username: ReactNode;
    fullname: string;
    profile_picture: string;
}