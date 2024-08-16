export interface Skill {
    name: string;
    icon: string;
    description: string;
}

export interface FeatureIconProps {
    gradient: string;
    shape: string;
    icon: string;
}

export interface ProcessProps {
    icon: string;
    title: string;
    subtitle: string;
    description: Array<string>;
    color: string;
    image: string;
}

export interface HowItWorks {
    label: string;
    description: string;
}

export const skills: Skill[] = [
    {
        name: "Performance Tuning",
        icon: "pi-bolt",
        description:
            "Proficiency in identifying performance bottlenecks, optimizing code and infrastructure for speed and efficiency, and using profiling tools to diagnose and resolve performance issues.",
    },
    {
        name: "Mentoring",
        icon: "pi-users",
        description:
            "Ability to mentor and coach junior developers, providing guidance on best practices, code reviews, and career development. This involves not only sharing technical knowledge but also fostering growth and development in others.",
    },
    {
        name: "Communication",
        icon: "pi-comments",
        description:
            "Communicate clearly and effectively with team members, stakeholders, and non-technical audiences. Senior engineers should be able to explain complex technical concepts in a way that is understandable and actionable for others.",
    },
    {
        name: "Code Quality",
        icon: "pi-check-circle",
        description:
            "Prioritize writing clean, maintainable, and well-documented code. A expert engineer advocate for best practices, conduct thorough code reviews, and ensures adherence to coding standards to maintain a high level of quality across the codebase.",
    },
    {
        name: "Innovation",
        icon: "pi-lightbulb",
        description:
            "Ability to innovate and create novel solutions to complex problems. This includes thinking outside the box, experimenting with new technologies, and bringing fresh perspectives to challenges.",
    },
    {
        name: "Debugging",
        icon: "pi-code",
        description:
            "Debugging is crucial for an engineer because it allows them to identify, diagnose, and fix issues in the code, ensuring that software functions as intended. If an engineer can't fix bugs themselves, they must rely on others, creating bottlenecks and slowing down development. This dependency can delay progress and hinder both personal growth and team efficiency.",
    },
];

export const features = [
    {
        title: "Collaborative Reviews",
        description:
            "Inline comments, threaded discussions, and real-time feedback.",
        icon: "pi pi-users",
        gradient: "linear-gradient(45deg, #FF9A8B, #FF6A88, #FF99AC)",
        shape: "circle",
    },
    {
        title: "Version Control Integration",
        description: "Seamless integration with GitHub, GitLab, and Bitbucket.",
        icon: "pi pi-github",
        gradient: "linear-gradient(45deg, #FF6B6B, #FFA07A)",
        shape: "pentagon",
    },
    {
        title: "Comprehensive Reporting",
        description: "Track review progress and code quality metrics.",
        icon: "pi pi-chart-bar",
        gradient: "linear-gradient(45deg, #FF8008, #FFC837)",
        shape: "square",
    },
    {
        title: "Diverse Tech Stack",
        description: "Find professionals from various tech stacks can come together to share ideas and insights.",
        icon: "pi pi-globe",
        gradient: "linear-gradient(45deg, #11998E, #38EF7D)",
        shape: "rectangle",
    },
    {
        title: "Intelligent Dashboards",
        description: "Dashboards that allow you to track metrics, reviews, and project statuses at a glance.",
        icon: "pi pi-desktop",
        gradient: "linear-gradient(45deg, rgb(129 74 194), rgb(247 189 255))",
        shape: "hexagon",
    },
];

export const steps: ProcessProps[] = [
    {
        icon: "pi pi-upload",
        title: "Submit Code",
        subtitle: "Upload your code or link a pull request from your preferred version control system.",
        description: ["Easily connect with your version control system to submit code for review.", "Whether you’re working with GitHub, GitLab, or Bitbucket, the submission process is seamless and straightforward."],
        color: "bg-orange",
        image: "/images/9353435.webp"
    },
    {
        icon: "pi pi-users",
        title: "Review & Collaborate",
        subtitle: "Get reviewers, discuss code, and get real-time feedback.",
        description: ["Reviewers pick your code submissions and provide feedback, which helps you identify and fix issues in your code.", "Engage in meaningful discussions directly on the code, resolving issues in real-time, prioritizing quality and efficiency."],
        color: "bg-green",
        image: "/images/Code-Review-color-800px.png"
    },
    {
        icon: "pi pi-chart-line",
        title: "Track Progress",
        subtitle: "Monitor review status, comments, and approval flow.",
        description: ["Stay on top of your project’s development with tools that allow you to track the progress of code reviews.", "View status updates, monitor comments, and follow the approval flow to ensure that your submission is on schedule and that nothing slips through the cracks."],
        color: "bg-blue",
        image: "/images/progress-is-well-done.webp"
    },
    {
        icon: "pi pi-cog",
        title: "Optimize with Analytics",
        subtitle: "Leverage insights from review metrics to improve team efficiency.",
        description: ["Use data-driven insights from your code reviews to identify bottlenecks and areas for improvement.", "Analytics provide valuable metrics that help you optimize your review process, making your team more productive."],
        color: "bg-red",
        image: "/images/Analytics_Illustrations-min.png"
    }
];
