"use client"

import React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navigation from "@refineit/components/Navbar";

export default function Home() {
    const { data, status } = useSession();
    const router = useRouter();

    React.useEffect(() => {
        if (status === "loading") {
            // Still loading session, do nothing
            return;
        }

        if (!data) {
            // Redirect to sign-in page if not authenticated
            router.push("/sign-in");
        } else if (data) {
            // Optionally, redirect logged-in users to a different page
            // router.push("/dashboard");
        }
    }, [data, status, router]);

    if (status !== "authenticated") {
        return <div>Loading...</div>;
    }

    return (
        <React.Fragment>
            <Navigation />
            <div className="container">
                <h1 className="text-4xl">Home</h1>
            </div>
        </React.Fragment>
    )
}