import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import {useBreakpoints} from "../hooks/MediaQuery";
import { Toast } from "primereact/toast";

const Footer: React.FC = () => {
    const [email, setEmail] = useState("");
    const breakpoints = useBreakpoints();

    const isXs = breakpoints("xs");
    const isDesktop = breakpoints("desktop");
    const toast = React.useRef<Toast>(null);
    
    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        toast.current?.show({ severity: "success", summary: "Success", detail: "Subscribed with email "+ email, life: 3000 });
    };

    return (
        <div className="flex justify-content-center mx-4 md:mx-0">
            <footer style={styles.container} className="border-top-1 surface-border py-6">
                <div className="mx-auto">
                    <div className="flex flex-wrap justify-content-between align-items-center gap-4 mb-6">
                        <div className="mb-4">
                            <div className="text-3xl font-semibold flex flex align-items-center mb-2">
                                <i className="pi pi-circle-fill text-primary mr-2"></i>
                                <span className="">Refine.It</span>
                            </div>
                            <div className="text-900 text-2xl mb-4">
                                Elevating code quality and collaboration, one review at a time.
                            </div>
                            <nav className="flex flex-wrap gap-4">
                                {["Home", "Features", "Help", "Privacy", "About us"].map((item) => (
                                    <a key={item} href="#" className="text-600 hover:text-900 no-underline">{item}</a>
                                ))}
                            </nav>
                        </div>
                        <div className="flex justify-content-center w-full lg:block lg:w-auto">
                            <div style={styles.email} className={"w-full lg:p-auto lg:block block sm:flex lg:w-auto justify-content-center xl:w-30rem " + ((isXs || isDesktop) ? "surface-border" : "surface-card p-2") }>
                                <div className="text-600 whitespace-nowrap mb-2 sm:my-auto lg:mb-2 md:my-auto w-full lg:w-auto mr-auto md:mr-1">Subscribe & stay up to date</div>
                                <form onSubmit={handleSubscribe} className="p-inputgroup flex flex-row">
                                    <InputText
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        type="email"
                                        name="email"
                                        className="p-inputtext-sm border-round-left border-black-alpha-90"
                                        style={styles.input}
                                        required
                                    />
                                    <Button
                                        type="submit"
                                        label="Subscribe"
                                        className="p-button-sm border-round-right button-dark p-button-secondary"
                                    />
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-content-between align-items-center gap-4">
                        <div className="">
                            <div className="text-sm text-600 mb-2">© 2024 Refine.It. All rights reserved.</div>
                            <div className="text-sm text-600">Designed and developed by Shawan Mandal</div>
                        </div>
                        <div className="flex gap-4">
                            {["Terms", "Privacy", "Cookies"].map((item) => (
                                <a key={item} href="#" className="text-600 hover:text-900 text-sm no-underline">{item}</a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
            <Toast ref={toast} />
        </div>
    );
};

const styles = {
    container: {
        // maxWidth: "1162px"
    },
    input: {
        backgroundColor: "var(--surface-100)", 
        borderColor: "var(--surface-200)" 
    },
    email: {
        borderRadius: "var(--border-radius)",
    },
};

export default Footer;