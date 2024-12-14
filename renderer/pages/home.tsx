import React, { useEffect, useState } from "react";
import { TabView } from "../components/tab";
import Head from "next/head";

export default function HomePage() {
    const [tabs, setTabs] = useState<
        Array<{ id: number; viewId: string | null; title: string; url: string }>
    >([
        {
            id: 1,
            viewId: null,
            title: "A",
            url: "https://www.youtube.com/",
        },
        {
            id: 2,
            viewId: null,
            title: "B",
            url: "https://github.com/",
        },
        {
            id: 3,
            viewId: null,
            title: "C",
            url: "https://www.google.com/search?q=ashd&oq=ashd&gs_lcrp=EgZjaHJvbWUyBggAEEUYOdIBBzM2M2owajeoAgCwAgA&sourceid=chrome&ie=UTF-8",
        },
    ]);

    const [current, setCurent] = useState(0);

    useEffect(() => {
        window.ipc.on("view-loading-return", (view: any) => {
            console.log("🚀 ~ window.ipc.on ~ view:", view);
            const newlists = tabs.map((t) => {
                if (t.id === view.id || t.viewId === view.viewId) {
                    return {
                        ...t,
                        ...view,
                    };
                }
                return t;
            });
            setTabs(newlists);
        });
    }, [tabs]);

    useEffect(() => {
        if (tabs[current].viewId) {
            window.ipc.send("set-view", {
                viewId: tabs[current].viewId,
            });
        } else {
            window.ipc.send("load-view", {
                view: tabs[current],
                url: tabs[current].url,
            });
        }
    }, [current]);

    return (
        <React.Fragment>
            <Head>
                <title>{"HOME"}</title>
            </Head>
            <div>
                <div className="flex justify-between items-center h-12 bg-white text-gray-700">
                    <div className="flex justify-start gap-x-4 h-full p-2">
                        {tabs?.map((t, idx) => {
                            return (
                                <div
                                    onClick={() => {
                                        setCurent(idx);
                                    }}
                                    className={`flex items-center h-full w-52 px-2 ${
                                        current === idx ? "bg-blue-300" : "bg-gray-300"
                                    }`}
                                    key={idx}
                                >
                                    <p className="truncate">{t.title}</p>
                                </div>
                            );
                        })}
                    </div>
                    <div className="bg-gray-300 flex items-center gap-x-10 px-5">
                        <button
                            onClick={() => {
                                window.ipc.send("open-dev-tool", {});
                            }}
                        >
                            dev
                        </button>
                        <button onClick={() => {}}>x</button>
                    </div>
                </div>

                <div className="relative">
                    {tabs?.map((t, idx) => {
                        return (
                            <div
                                className={`absolute h-full w-full top-0 right-0 ${
                                    current === idx ? "z-50" : "z-0"
                                }`}
                                key={idx}
                            >
                                <TabView tabInfo={t}></TabView>
                            </div>
                        );
                    })}
                </div>
            </div>
        </React.Fragment>
    );
}
