import React, { useEffect, useRef, useState } from "react";
import { TabView } from "../components/tab";
import Head from "next/head";

export default function HomePage() {
    const [tabs, setTabs] = useState<
        Array<{
            id: number;
            viewId: string | null;
            iconUrl: string | null;
            title: string;
            url: string;
        }>
    >([
        {
            id: 1,
            viewId: null,
            title: "A",
            url: "https://www.youtube.com/",
            iconUrl: "",
        },
        {
            id: 2,
            viewId: null,
            title: "B",
            url: "https://chatgpt.com/",
            iconUrl: null,
        },
        {
            id: 3,
            viewId: null,
            title: "C",
            url: "https://www.google.com/search?q=ashd&ie=UTF-8",
            iconUrl: null,
        },
    ]);

    const [current, setCurent] = useState(0);

    const addTab = () => {
        setTabs([
            ...tabs,
            {
                id: tabs?.length,
                viewId: null,
                title: "New Tab",
                url: "https://localhost:1000",
                iconUrl: null,
            },
        ]);
        setCurent(tabs.length);
    };
    const removeTab = (tabInfo) => {
        setCurent(0);
        const newList = tabs?.filter((t) => t.id !== tabInfo.id);
        setTabs(newList);
        window.ipc.send("remove-view", tabInfo.viewId);
    };

    useEffect(() => {
        window.ipc.on("view-loading-return", (view: any) => {
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
        if (tabs?.[current]?.viewId) {
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
            <div className="w-screen">
                <div className="draggable flex justify-between items-center h-12 bg-white text-gray-700">
                    <div className="flex justify-start gap-x-3 h-full p-2 w-full">
                        <div className="flex justify-start gap-x-4 w-full">
                            {tabs?.map((t, idx) => {
                                return (
                                    <div
                                        className={`flex-1 tab-view cursor-pointer flex items-center justify-between h-full max-w-52 overflow-hidden w-1 ${
                                            current === idx ? "bg-blue-300" : "bg-gray-300"
                                        }`}
                                        key={idx}
                                    >
                                        <div
                                            onClick={() => {
                                                setCurent(idx);
                                            }}
                                            className="w-full flex items-center justify-start"
                                        >
                                            <img
                                                className="h-5 w-5"
                                                src={t.iconUrl || ""}
                                                alt="icon.url"
                                            ></img>
                                            <p className="overflow-hidden text-nowrap">{t.title}</p>
                                        </div>
                                        <button
                                            className="p-2 bg-blue-200"
                                            onClick={() => {
                                                removeTab(t);
                                            }}
                                        >
                                            X
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        <button
                            className="p-2 aspect-square rounded-full bg-gray-200 flex justify-center items-center w-10"
                            onClick={() => {
                                addTab();
                            }}
                        >
                            +
                        </button>
                    </div>
                    <div className="w-20"></div>
                    <div className="bg-gray-300 flex items-center gap-x-10 w-20">
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
