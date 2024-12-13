import React from "react";
import Head from "next/head";
import Link from "next/link";

export default function HomePage() {
    return (
        <React.Fragment>
            <Head>
                <title>Home - Nextron</title>
            </Head>
            <div className=""></div>
            <div className="w-full flex-wrap flex justify-center">
                <Link href="https://">Go to next page</Link>
            </div>
        </React.Fragment>
    );
}
