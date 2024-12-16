import React from "react";
import type { AppProps } from "next/app";

import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <div className="">
            <Component {...pageProps}></Component>
        </div>
    );
}

export default MyApp;
