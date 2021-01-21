import type {AppProps} from 'next/app'
import React from "react";

import "tailwindcss/tailwind.css";
import '../styles/globals.css'
import Head from "next/head";
import ProjectLogo from "../components/ProjectLogo";

function MyApp({Component, pageProps}: AppProps) {
    return (
        <>
            <Head>
                <link rel="preconnect" href="https://fonts.gstatic.com"/>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Goldman:wght@400;700&amp;display=swap"/>
                <title>RUSTplatz</title>
                <meta name="description" content={"Rust-Streamerserver von Bonjwa, RocketBeans und Dhalucard"} />
            </Head>
            <header className="pt-10 px-8">
                <ProjectLogo/>
                <div className="text-2xl text-center mt-5 md:mt-10">
                    Rust-Streamerserver von Bonjwa, RocketBeans und Dhalucard
                </div>
                <div className="text-center mt-4 text-base">
                    Diese Seite basiert auf dem original von <a href="https://twitter.com/moritz_ruth">@moritz_ruth</a>
                </div>
            </header>
            <main className="p-5 text-lg space-y-8">

            <Component {...pageProps} />
            </main>
            <footer className="flex flex-col text-center px-4 py-2">
                <span>Inoffizielle Seite.</span>
                <a href="https://github.com/zlokomatic/rustplatz_react">Source Code</a>
            </footer>
        </>
    )
}

export default MyApp;
