import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import {useBreakpoints} from "../../hooks"
import { skills, Skill } from "./constants";


const Engineering: React.FC = () => {

    const [activeSkill, setActiveSkill] = useState<Skill | null>(null);
    const breakpoints = useBreakpoints();

    const isMobile = breakpoints("mobile");

    return (
        <div className="flex lg:mx-5 xl:mx-7 md:px-2 justify-content-center">
            <div className="px-4 pb-8 pt-4 mb-8 md:px-6 bg-black-alpha-90 lg:px-8 shadow-7" style={styles.container}>
                <div className="text-center mb-5">
                    <h2 style={styles.heading} className="text-900 font-bold text-white mb-3">
                        <span className="text-green-600">6 Skills</span> to Elevate Your Engineering Game
                    </h2>
                    <p className="text-700 text-white-alpha-80 text-xl mt-3 mb-5">
                    You might already possess some of these key skills, but there’s always room to level up and master what it takes to become a true pro in engineering!
                    </p>
                </div>
                <div className="flex pb-5 justify-content-center" style={{marginTop: "6rem"}}>
                    <div className="relative" style={{...(isMobile ? {width: "200px", height: "200px"} : { width: "400px", height: "400px" })}}>
                        <div className="absolute top-50 left-50 w-8rem h-8rem bg-green-900 border-circle flex align-items-center justify-content-center" style={{ transform: "translate(-50%, -50%)" }}>
                            <div className="text-center">
                                <h3 className="text-white-alpha-90 font-bold m-0">Holistic</h3>
                                <h3 className="text-white-alpha-90 font-bold m-0">Engineering</h3>
                            </div>
                        </div>
                        {skills.map((skill, index) => {
                            const base = isMobile ? 100 : 200;
                            const spread = isMobile ? 120 : 200;
                            const angle = (index * 60) * (Math.PI / 180);
                            const x = base + spread * Math.cos(angle);
                            const y = base + spread * Math.sin(angle);
                            return (
                                <div key={index}
                                     className="absolute cursor-pointer hover:scale-110 transition-transform bg-green-600 text-white border-circle flex align-items-center justify-content-center"
                                     style={{
                                         width: !isMobile ? "7.5rem" : "6rem",
                                         height: !isMobile ? "7.5rem" : "6rem",
                                         left: `${x}px`,
                                         top: `${y}px`,
                                         transform: "translate(-50%, -50%)"
                                     }}
                                     onClick={() => setActiveSkill(skill)}>
                                    <div className="text-center">
                                        <i className={`pi ${skill.icon} text-2xl mb-2`}></i>
                                        <div className="text-xs font-bold" dangerouslySetInnerHTML={{__html: String(skill.name).split(" ").join("<br />")}}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <Dialog style={{ width: "50vw" }} visible={!!activeSkill} onHide={() => setActiveSkill(null)} header={activeSkill?.name}>
                    <p className="m-0">{activeSkill?.description}</p>
                </Dialog>
            </div>
        </div>
    );
};

const styles = {
    container: {
        borderRadius: "20px",
        maxWidth: "1160px"
    },
    heading: {
        textAlign: "center" as "center", // Type assertion
        fontSize: "2.5rem"
    },
}

export default Engineering;