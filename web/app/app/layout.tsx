"use client"

import React from "react";
import { store } from "@refineit/store"
import { Provider } from "react-redux"
import { PrimeReactProvider } from "primereact/api";
import { Inter } from "next/font/google";
import { SessionProvider, SessionProviderProps } from "next-auth/react";
import { Toaster } from "sonner";
import { NextAppDirEmotionCacheProvider } from "tss-react/next/appDir";

import "primereact/resources/themes/saga-blue/theme.css";   // or any other theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "./globals.css";

const inter = Inter({
    variable: "--font-inter",
    preload: false,
    subsets: ["latin"],
});

export default function RootLayout({ children, session }: {
    children: React.ReactNode;
    session: SessionProviderProps["session"];
}) {

    return (
        <html lang="en" className={inter.variable}>
            <head>
                <link id="theme-link" rel="stylesheet" href="https://primereact.org/themes/lara-light-cyan/theme.css" />
            </head>
            <body>
                <SessionProvider session={session}>
                    <Provider store={store}>
                        <PrimeReactProvider value={{ appendTo: "self", ripple: true }}>
                            <NextAppDirEmotionCacheProvider options={{ key: "css" }}>
                                {children}
                            </NextAppDirEmotionCacheProvider>
                            <Toaster position="top-right" richColors />
                        </PrimeReactProvider>
                    </Provider>
                </SessionProvider>
            </body>
        </html>
    )
}
