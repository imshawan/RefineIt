import React from "react";
import { FeatureIconProps, features } from "./constants";

const styles = {
    featureIcon: (gradient: string, shape: string): React.CSSProperties => {
        let clipPath = "none";
        let borderRadius = "0";

        switch (shape) {
            case "circle":
                borderRadius = "50%";
                break;
            case "triangle":
                clipPath = "polygon(50% 0%, 0% 100%, 100% 100%)";
                break;
            case "hexagon":
                clipPath = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";
                break;
            case "pentagon":
                clipPath = "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)";
                break;
            case "rectangle":
                // No clipPath needed for rectangles
                borderRadius = "0";
                break;
            case "star":
                clipPath = "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";
                break;
            default:
                borderRadius = "12px"; // Default shape
                break;
        }

        return {
            width: "60px",
            height: "60px",
            background: gradient,
            borderRadius,
            margin: "0 auto 20px",
            clipPath
        };
    },
    section: {
        padding: "40px 0",
    },
    container: {
        maxWidth: "1200px",
        margin: "0 auto",
        paddingLeft: "2rem",
        paddingRight: "2rem"
    },
    heading: {
        textAlign: "center" as "center", // Type assertion
        fontSize: "2.5rem"
    },
    grid: {
        display: "grid",
        justifyContent: "center",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        // gap: "20px",
    },
    card: {
        textAlign: "center" as "center", // Type assertion
        border: "none",
        maxWidth: "250px"
    },
    title: {
        marginBottom: "10px"
    },
    description: {
        color: "#6c757d"
    }
};

const FeatureIcon: React.FC<FeatureIconProps> = ({ gradient, shape, icon }) => (
    <div className="feature-icon" style={styles.featureIcon(gradient, shape)}>
        <i className={icon + " text-white-alpha-90"}></i>
    </div>
);

const FeatureSection: React.FC = () => {
    return (
        <section id="features" className="features-section px-4 py-8 md:px-6 lg:px-8 surface-0" style={styles.section}>
            <div className="container" style={styles.container}>
            <div className="text-center mb-6">
                    <h2 style={styles.heading}>What do we offer?</h2>
                    <div className="text-600 text-xl">
                    We simplify code reviews with seamless integration, flexible workflows, and real-time collaboration, helping you sharpen your development skills.
                    </div>
                </div>
                <div className="grid grid-nogutter justify-content-center">
                    {features.map((feature, index) => (
                        <div key={index} className="col-12 md:col-6 xl:col-4 flex justify-content-center my-2">
                            <div className="p-shadow-2" style={styles.card}>
                                <FeatureIcon gradient={feature.gradient} shape={feature.shape} icon={feature.icon} />
                                <h3 style={styles.title}>{feature.title}</h3>
                                <p style={styles.description}>{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;
