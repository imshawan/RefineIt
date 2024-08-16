import React from "react";
import { ProcessProps, steps } from "./constants";
import {useBreakpoints} from "../../hooks"

const ProcessFlow: React.FC = () => {
    const breakpoints = useBreakpoints();

    const isMobile = breakpoints("mobile");
    const isMd = breakpoints("md");

    const ImageContainer: React.FC<ProcessProps> = (step) => (
        <div className={"py-3 pr-8 pl-3 w-26rem xl:w-30rem overflow-hidden h-18rem hidden lg:block " + step.color + "-200"} style={styles.borderRadius}>
            <img src={step.image} alt="Image" className="w-full ml-5"/>
        </div>
    )

    const DetailContainer: React.FC<ProcessProps> = (step) => (
        <div className="py-3 pl-5 lg:pl-8 pl-3 lg:w-26rem xl:w-30rem">
            <div className="text-900 text-xl mb-2" style={styles.title}>{step.title}</div>
            <p style={styles.paragraph} className="block text-700 line-height-3 mb-3">
                {step.subtitle}
            </p>
            <div className="pt-3 border-top-1 border-300">
                {step.description.map((e, i) => {
                    let className = "line-height-3";
                    if (i !== step.description.length - 1) {
                        className += " mb-3";
                    }

                    return <p style={styles.paragraph} key={i} className={className}>{e}</p>
                })}
            </div>
        </div>
    )

    const Separator: React.FC<{ index: number, color: string }> = ({index, color}) => (
        <div className="flex lg:px-6 flex-column align-items-center w-2rem">
            <span style={styles.circle} className={"text-0 flex align-items-center justify-content-center border-circle " + color + "-500"}>{index}</span>
            <div className={"h-full " + color + "-500"} style={styles.line}></div>
        </div>
    )

    return (
        <div id="howitworks" className="surface-ground px-4 py-8 md:px-6 lg:px-8">
            <div className="text-center mb-6">
                <h2 style={styles.heading}>How it works?</h2>
                <div className="text-600 text-xl">
                No more chasing down reviews—our app streamlines the process, ensuring the quality you need.
                </div>
            </div>

            <div className="flex flex-column align-items-center">
                {steps.map((step, index) => (
                    <React.Fragment key={index}>
                        <div className="flex lg:justify-content-center mb-5">
                            {(isMobile || isMd) && <Separator index={index + 1} color={step.color} />}
                            {index % 2 === 0 ? <ImageContainer {...step} /> : <DetailContainer {...step} />}
                            {!(isMobile || isMd) && <Separator index={index + 1} color={step.color} />}
                            {index % 2 === 0 ? <DetailContainer {...step} /> : <ImageContainer {...step} />}
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

const styles = {
    heading: {
        textAlign: "center" as "center", // Type assertion
        fontSize: "2.5rem"
    },
    circle: {
        minWidth: "2.5rem",
        minHeight: "2.5rem", 
    },
    line: {
        width: "2px",
        minHeight: "4rem",
    },
    borderRadius: {
        borderRadius: "10px"
    },
    title: {
        fontWeight: 600
    },
    paragraph: {
        marginTop: 0
    }
};

export default ProcessFlow;