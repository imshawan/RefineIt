import React from "react";
import { Button } from "primereact/button";
import { SpeedDial } from "primereact/speeddial";
import Navigation from "../../components/Navigation";
import EngineeringSkills from "./Engineering";
import FeatureSection from "./Features";
import ProcessFlow from "./ProcessFlow";
import ContactUs from "./ContactUs";
import Footer from "../../components/Footer";
import BackToTopButton from "../../components/BacktoTop";

const LandingPage: React.FC = () => {
    return (
        <React.Fragment>
            <div id="home" className="landing-page">
                <Navigation />
                <section className="hero grid grid-nogutter py-8 mb-8 text-800">
                    <div className="col-12 lg:col-6 lg:text-left justify-content-center flex align-items-center ">
                        <div className="hero-content">
                            <h1 className="">
                                Enhance your<br />
                                code <span className="highlight">quality</span><br />
                                with <br/> Refine<span className="text-green-600">.it</span>
                            </h1>
                            <h4 className="font-normal" style={styles.subtext}>
                                Community-driven code review processes that <br />
                                enhance efficiency for you and your development team.
                            </h4>
                            <div className="md:justify-content-center">
                                <Button label="Get started" icon="pi pi-arrow-right" iconPos="right" className="button-dark p-button-secondary p-button-lg" />
                            </div>
                        </div>
                    </div>
                    <div className="col-12 md:col-6 overflow-hidden hidden lg:block">
                        <img src="/images/11073183.png" className="md:ml-auto block md:w-full" style={{ clipPath: "polygon(8% 0, 100% 0%, 100% 100%, 0 100%)" }} />
                    </div>
                </section>
            
            </div>
            <EngineeringSkills />
            <FeatureSection />
            <ProcessFlow />
            <ContactUs />
            <Footer />
            <BackToTopButton />
        </React.Fragment>
    );
};

const styles = {
    subtext: {
        marginBottom: "30px"
    }
}

export default LandingPage;