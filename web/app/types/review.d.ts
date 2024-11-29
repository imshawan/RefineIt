interface Language {
    color: string;
    iconUrl: string;
    language: string;
}

interface Project {
    about: string;
    contributors_count: number;
    created_at: string;
    description: string;
    file_url: string;
    filename: string;
    id: string;
    is_featured: boolean;
    language: Language;
    last_reviewed_at: string | null;
    name: string;
    owner_id: string;
    priority: string;
    repository_url: string;
    review_type: string;
    reviews_count: number;
    slug: string;
    stars_count: number;
    tags: string[];
    updated_at: string;
    visibility: string;
}

interface User {
    created_at: string;
    email: string;
    fullname: string;
    id: string;
    is_active: boolean;
    updated_at: string;
    username: string;
}

export interface IReview {
    id: string;
    title: string;
    content: string;
    rating: number;
    project_id: string;
    project: Project;
    project_owner_id: string;
    project_owner: User;
    reviewer_id: string;
    reviewer: User;
    status: string;
    tags: string[];
    upvotes_count: number;
    downvotes_count: number;
    is_highlighted: boolean;
    comments_count: number;
    last_commented_at: string | null;
    created_at: string;
    updated_at: string;
}
