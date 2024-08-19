import { Inter } from "next/font/google"
import { NextAppDirEmotionCacheProvider } from "tss-react/next/appDir";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "../globals.css";

const inter = Inter({
    variable: "--font-inter",
    preload: false,
    subsets: ["latin"]
});

export default function AuthRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={inter.variable}>
            <head>
                <link id="theme-link" rel="stylesheet" href="https://primereact.org/themes/lara-light-cyan/theme.css" />
            </head>
            <body className="">
                <NextAppDirEmotionCacheProvider options={{ key: "css" }}>
                    {children}
                </NextAppDirEmotionCacheProvider>
            </body>
        </html>
    );
}