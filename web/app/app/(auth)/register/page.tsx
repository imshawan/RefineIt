import React from "react";
import RegisterationForm from "@refineit/components/register/RegisterationForm";
import { redirect } from "next/navigation";
import { getNextServerSession } from "@refineit/lib/auth";

const Register: React.FC = async () => {
    const session = await getNextServerSession();
    if (session) {
        redirect("/");
    }

    return (
        <div className="flex flex-wrap" style={{ minHeight: "100vh" }}>
            <div className={"hidden md:block md:w-6 lg:w-7 bg-primary"} style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}>
                <div className="h-full p-4" style={{
                    backdropFilter: "blur(5px)",
                    backgroundColor: "rgba(55, 55, 55, 0.5)"
                }}>
                    <div className="flex flex-column justify-content-center h-full">
                        <h2 className="text-5xl font-bold text-white mb-4">Join Our Community</h2>
                        <p className="text-white line-height-3 mb-4">
                            Refine.It is where developers come together to elevate their code. 
                            Sign up now to access powerful collaboration tools and expert reviews.
                        </p>
                        <ul className="list-none p-0 m-0 text-white">
                            <li className="flex align-items-center mb-3">
                                <i className="pi pi-check-circle mr-2"></i>
                                <span>Access to expert code reviewers</span>
                            </li>
                            <li className="flex align-items-center mb-3">
                                <i className="pi pi-check-circle mr-2"></i>
                                <span>Collaborate on projects in real-time</span>
                            </li>
                            <li className="flex align-items-center">
                                <i className="pi pi-check-circle mr-2"></i>
                                <span>Improve your coding skills</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="w-full md:w-6 lg:w-5 flex flex-column justify-content-between pb-3">
                <div className="p-4 md:pt-5 sm:px-8 md:px-5 lg:px-4 xl:px-8">
                    <div className="text-center mb-4">
                        <i className="pi pi-code text-5xl text-primary"></i>
                        <h2 className="text-3xl font-bold mb-1 mt-3">Create an Account</h2>
                        <p className="mt-0">Join our community of code reviewers and collaborators.</p>
                    </div>
                    <RegisterationForm />
                    <div className="text-center">
                        <span>Already have an account? </span>
                        <a href="/sign-in" className="font-medium hover:text-green-600" style={{
                            textDecoration: "none",
                            color: "var(--text-color)"
                        }}>Sign In</a>
                    </div>
                </div>
                <div className="flex justify-content-between px-4 sm:px-8 md:px-5 lg:px-4 xl:px-8">
                    <div className="text-center font-normal text-xs">
                        <span>&copy;</span> 2024 Refine.It. All rights reserved
                    </div>
                    <div className="font-semibold text-xs text-center">
                        <a href="#" className="hover:text-green-600" style={{
                            textDecoration: "none",
                            color: "var(--text-color)"
                        }}>Privacy Policy</a>
                        <span className="mx-2">•</span>
                        <a href="#" className="hover:text-green-600" style={{
                            textDecoration: "none",
                            color: "var(--text-color)"
                        }}>Terms & Conditions</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;