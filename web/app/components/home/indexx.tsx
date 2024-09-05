import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Tag } from "primereact/tag";
import { ScrollPanel } from "primereact/scrollpanel";
// import ProjectsSection from "./ProjectsSection";

const GithubLikeUI: React.FC = () => {
    const myProjects = [
        { name: "react-todo-app", contributions: 23, progress: 75 },
        { name: "vue-weather-dashboard", contributions: 45, progress: 90 },
        { name: "node-express-api", contributions: 12, progress: 60 },
        { name: "python-data-analysis", contributions: 78, progress: 85 },
        { name: "flutter-mobile-app", contributions: 56, progress: 40 },
    ];

    const feeds = [
        {
            type: "commit",
            user: "Sarah Lee",
            avatar: "https://github.com/sarahlee.png",
            content: "Optimized database queries in user authentication module",
            repo: "auth-service",
            time: "2 hours ago",
            color: "#4CAF50",
        },
        {
            type: "issue",
            user: "Alex Chen",
            avatar: "https://github.com/alexchen.png",
            content: "Reported bug in payment gateway integration",
            repo: "e-commerce-platform",
            time: "4 hours ago",
            color: "#FFC107",
        },
        {
            type: "pull_request",
            user: "Emma Watson",
            avatar: "https://github.com/emmawatson.png",
            content: "Added dark mode support to the dashboard",
            repo: "admin-dashboard",
            time: "1 day ago",
            color: "#2196F3",
        },
        {
            type: "release",
            user: "Michael Brown",
            avatar: "https://github.com/michaelbrown.png",
            content: "Released version 2.0 with new AI features",
            repo: "ml-toolkit",
            time: "2 days ago",
            color: "#9C27B0",
        },
        {
            type: "fork",
            user: "David Kim",
            avatar: "https://github.com/davidkim.png",
            content: "Forked react-native-animations for custom implementation",
            repo: "mobile-app",
            time: "3 days ago",
            color: "#FF5722",
        },
        {
            type: "release",
            user: "Michael Brown",
            avatar: "https://github.com/michaelbrown.png",
            content: "Released version 2.0 with new AI features",
            repo: "ml-toolkit",
            time: "2 days ago",
            color: "#9C27B0",
        },
        {
            type: "fork",
            user: "David Kim",
            avatar: "https://github.com/davidkim.png",
            content: "Forked react-native-animations for custom implementation",
            repo: "mobile-app",
            time: "3 days ago",
            color: "#FF5722",
        },
        {
            type: "release",
            user: "Michael Brown",
            avatar: "https://github.com/michaelbrown.png",
            content: "Released version 2.0 with new AI features",
            repo: "ml-toolkit",
            time: "2 days ago",
            color: "#9C27B0",
        },
        {
            type: "fork",
            user: "David Kim",
            avatar: "https://github.com/davidkim.png",
            content: "Forked react-native-animations for custom implementation",
            repo: "mobile-app",
            time: "3 days ago",
            color: "#FF5722",
        },
        {
            type: "release",
            user: "Michael Brown",
            avatar: "https://github.com/michaelbrown.png",
            content: "Released version 2.0 with new AI features",
            repo: "ml-toolkit",
            time: "2 days ago",
            color: "#9C27B0",
        },
        {
            type: "fork",
            user: "David Kim",
            avatar: "https://github.com/davidkim.png",
            content: "Forked react-native-animations for custom implementation",
            repo: "mobile-app",
            time: "3 days ago",
            color: "#FF5722",
        },
        {
            type: "release",
            user: "Michael Brown",
            avatar: "https://github.com/michaelbrown.png",
            content: "Released version 2.0 with new AI features",
            repo: "ml-toolkit",
            time: "2 days ago",
            color: "#9C27B0",
        },
        {
            type: "fork",
            user: "David Kim",
            avatar: "https://github.com/davidkim.png",
            content: "Forked react-native-animations for custom implementation",
            repo: "mobile-app",
            time: "3 days ago",
            color: "#FF5722",
        },
        {
            type: "release",
            user: "Michael Brown",
            avatar: "https://github.com/michaelbrown.png",
            content: "Released version 2.0 with new AI features",
            repo: "ml-toolkit",
            time: "2 days ago",
            color: "#9C27B0",
        },
        {
            type: "fork",
            user: "David Kim",
            avatar: "https://github.com/davidkim.png",
            content: "Forked react-native-animations for custom implementation",
            repo: "mobile-app",
            time: "3 days ago",
            color: "#FF5722",
        },
        {
            type: "release",
            user: "Michael Brown",
            avatar: "https://github.com/michaelbrown.png",
            content: "Released version 2.0 with new AI features",
            repo: "ml-toolkit",
            time: "2 days ago",
            color: "#9C27B0",
        },
        {
            type: "fork",
            user: "David Kim",
            avatar: "https://github.com/davidkim.png",
            content: "Forked react-native-animations for custom implementation",
            repo: "mobile-app",
            time: "3 days ago",
            color: "#FF5722",
        },
    ];

    const trending = [
        {
            name: "tensorflow/tensorflow",
            description:
                "An Open Source Machine Learning Framework for Everyone",
            contributions: 166000,
            language: "Python",
        },
        {
            name: "microsoft/vscode",
            description: "Visual Studio Code",
            contributions: 132000,
            language: "TypeScript",
        },
        {
            name: "facebook/react",
            description:
                "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
            contributions: 178000,
            language: "JavaScript",
        },
    ];

    const suggestions = [
        {
            name: "denoland/deno",
            description: "A modern runtime for JavaScript and TypeScript.",
            contributions: 83000,
            language: "TypeScript",
        },
        {
            name: "rust-lang/rust",
            description:
                "Empowering everyone to build reliable and efficient software.",
            contributions: 70000,
            language: "Rust",
        },
        {
            name: "golang/go",
            description: "The Go programming language",
            contributions: 102000,
            language: "Go",
        },
    ];

    return (
        <div
            className="block md:flex mx-0 xl:px-8 surface-50 feeds-section overflow-hidden">

            {/* <ProjectsSection projects={myProjects} /> */}

            {/* Feeds Section */}
            <div className="w-12 md:w-7 lg:w-9 pl-3">

                <ScrollPanel className="z-0 mx-0 px-0" style={{ width: "100%", height: "100%" }}>
                    <div className="grid w-full mt-3">
                        <div className="w-12 px-2 lg:w-8">
                            {feeds.map((item, index) => (
                                <div
                                    key={index}
                                    className="mb-4 p-3 bg-white p-card"
                                    style={{
                                        borderLeft: `4px solid ${item.color}`,
                                    }}
                                >
                                    <div className="flex align-items-center mb-2">
                                        <Avatar
                                            image={item.avatar}
                                            shape="circle"
                                            size="large"
                                        />
                                        <span className="ml-2 font-bold">
                                            {item.user}
                                        </span>
                                        <span className="ml-2 text-500">
                                            {item.time}
                                        </span>
                                    </div>
                                    <p>{item.content}</p>
                                    <div className="flex gap-2">
                                        <Tag value={item.type} severity="info" />
                                        <Tag value={item.repo} severity="success" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Trending and Suggestions */}
                        <div className="w-12 lg:w-4 p-2 pt-0 trending-section">
                            <Card
                                className="px-0"
                                style={{ backgroundColor: "#ffffff" }}
                            >
                                <h3 className="m-0 px-3">Trending Projects</h3>
                                {trending.map((project, index) => (
                                    <div
                                        key={index}
                                        className={"p-3 " + (index !== trending.length - 1 ? "border-bottom-1 border-black-alpha-10 mb-3" : "")}
                                    >
                                        <h5 className="mt-0 mb-1">{project.name}</h5>
                                        <p className="text-sm text-500 m-0">
                                            {project.description}
                                        </p>
                                        <div className="flex justify-content-between align-items-center mt-2">
                                            <Tag
                                                value={`★ ${project.contributions}`}
                                                severity="warning"
                                            />
                                            <Tag value={project.language} severity="info" />
                                        </div>
                                    </div>
                                ))}
                            </Card>
                            <Card
                                className="mt-3"
                                style={{ backgroundColor: "#ffffff" }}
                            >
                                <h3 className="m-0 px-3">
                                    Suggested for You
                                </h3>
                                {suggestions.map((project, index) => (
                                    <div
                                        key={index}
                                        className={"p-3 " + (index !== trending.length - 1 ? "border-bottom-1 border-black-alpha-10 mb-3" : "")}
                                    >
                                        <h5 className="mt-0 mb-1">{project.name}</h5>
                                        <p className="text-sm text-500 m-0">
                                            {project.description}
                                        </p>
                                        <div className="flex justify-content-between align-items-center mt-2">
                                            <Tag
                                                value={`★ ${project.contributions}`}
                                                severity="warning"
                                            />
                                            <Tag value={project.language} severity="info" />
                                        </div>
                                    </div>
                                ))}
                            </Card>
                        </div>
                    </div>
                </ScrollPanel>
            </div>


        </div>
    );
};

export default GithubLikeUI;
