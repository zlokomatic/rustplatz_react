import type {AppProps} from 'next/app'
import React from "react";

import "tailwindcss/tailwind.css";
import '../styles/globals.css'
import Head from "next/head";

function MyApp({Component, pageProps}: AppProps) {
    return (
        <>
            <Head>
                <link rel="preconnect" href="https://fonts.gstatic.com"/>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Goldman:wght@400;700&amp;display=block"/>
                <title>RUSTplatz</title>
            </Head>
            <Component {...pageProps} />
        </>
    )
}

export default MyApp;
