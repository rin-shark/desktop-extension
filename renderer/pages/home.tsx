import React, { useEffect, useRef, useState } from "react";
import { TabView } from "../components/tab";
import Head from "next/head";
import { nanoid } from "nanoid";
import { MdOutlineClose } from "react-icons/md";
import { BsFullscreen } from "react-icons/bs";

export default function HomePage() {
    const [tabs, setTabs] = useState<
        Array<{
            id: string;
            viewId: string | null;
            iconUrl: string | null;
            title: string;
            url: string;
        }>
    >([
        {
            id: "A",
            viewId: null,
            title: "A",
            url: "https://www.youtube.com/",
            iconUrl: "",
        },
        {
            id: "B",
            viewId: null,
            title: "B",
            url: "https://chatgpt.com/",
            iconUrl: null,
        },
        {
            id: "C",
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
                id: nanoid(),
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
                url: tabs[current]?.url,
            });
        }
    }, [current]);

    useEffect(() => {
        window.ipc.on("create-new-tab", () => {
            addTab();
        });
        window.ipc.on("close-current-tab", () => {
            removeTab(tabs?.[current]);
        });
    }, [tabs, current]);

    return (
        <React.Fragment>
            <Head>
                <title>{"HOME"}</title>
            </Head>
            <div className="w-screen !rounded-t-md bg-white">
                <div className="draggable flex justify-between items-center h-12 text-gray-700 p-2">
                    <div className="flex justify-start gap-x-3 w-full h-full">
                        {tabs?.map((t, idx) => {
                            return (
                                <div
                                    className={`flex-1 tab-view cursor-pointer flex items-center justify-between h-full max-w-52 w-1 ${
                                        current === idx
                                            ? "bg-purple-300 rounded-xl"
                                            : "bg-gray-300 rounded-xl"
                                    }`}
                                    key={idx}
                                >
                                    <div
                                        className="flex items-center justify-start gap-x-2 overflow-hidden w-full rounded-l-xl py-1 ps-2 pr-1"
                                        onClick={() => {
                                            setCurent(idx);
                                        }}
                                    >
                                        <img
                                            className="h-5 w-5"
                                            src={t.iconUrl || ""}
                                            alt="icon.url"
                                        ></img>
                                        <p className="overflow-hidden text-nowrap text-base">
                                            {t.title}
                                        </p>
                                    </div>
                                    <button
                                        className="rounded-full py-1 ps-1 pr-2"
                                        onClick={() => {
                                            removeTab(t);
                                        }}
                                    >
                                        <MdOutlineClose size={18} />
                                    </button>
                                </div>
                            );
                        })}

                        <button
                            className="p-2 rounded-full bg-gray-200 flex justify-center items-center w-10"
                            onClick={() => {
                                addTab();
                            }}
                        >
                            +
                        </button>
                    </div>
                    <div className="flex items-center justify-end w-40 gap-x-4">
                        <button
                            className=""
                            onClick={() => {
                                window.ipc.send("toggle-full-screen", {});
                            }}
                        >
                            <BsFullscreen size={16} />
                        </button>
                        <button
                            className=""
                            onClick={() => {
                                window.ipc.send("quit", {});
                            }}
                        >
                            <MdOutlineClose size={24} />
                        </button>
                    </div>
                </div>

                <div className="relative h-12 bg-purple-300">
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
