import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";

const BackToTopButton: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        const windowHeight = window.innerHeight;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;

        if (scrollTop > windowHeight) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    return (
        <div style={styles.container} className="p-3">
            {isVisible && <Button
                icon="pi pi-arrow-up"
                className="p-button-rounded bg-green-600 p-button-success"
                onClick={scrollToTop}
                style={{ width: "3rem", height: "3rem", position: "sticky", bottom: 0, right: 0 }}
            />}
        </div>
    );
};

const styles = {
    container: {
        position: "sticky" as "sticky",
        bottom: "1rem",
        right: "1rem",
        display: "flex",
        justifyContent: "end",
        alignItems: "center",
        zIndex: 1000
    }
};

export default BackToTopButton;
