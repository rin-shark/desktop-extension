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
    const [isDragging, setIsDragging] = useState(false);

    const startX = useRef(null);
    const startY = useRef(null);

    // const [startX, setStartX] = useState(null);
    // const [startY, setStartY] = useState(null);

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

    useEffect(() => {
        // window.addEventListener("mousedown", (event) => {
        //     setIsDragging(true);

        //     setStartX(event.screenX);
        //     setStartY(event.screenY);

        //     document.body.style.cursor = "grabbing";
        // });

        // Mouse move event
        const mouseMoveHandler = (event) => {
            if (!isDragging || startX == null || startY == null) return;

            const offsetX = event.screenX - startX.current;
            const offsetY = event.screenY - startY.current;

            startX.current = event.screenX;
            startY.current = event.screenY;

            // setStartX(event.screenX);
            // setStartY(event.screenY);

            // Send offset to the main process
            window.ipc.send("move-window", { offsetX, offsetY });
        };
        window.addEventListener("mousemove", mouseMoveHandler);
        window.addEventListener("mouseleave", mouseMoveHandler);

        // Mouse up event
        window.addEventListener("mouseup", () => {
            setIsDragging(false);
            document.body.style.cursor = "grab";
            window.removeEventListener("mousemove", mouseMoveHandler);
            window.removeEventListener("mouseleave", mouseMoveHandler);
        });
        // window.addEventListener("mouseout", () => {
        //     setIsDragging(false);
        //     document.body.style.cursor = "grab";
        //     window.removeEventListener("mousemove", mouseMoveHandler);
        //     window.removeEventListener("mouseleave", mouseMoveHandler);
        // });

        // return () => {
        //     window.removeEventListener("mousemove", mouseMoveHandler);
        //     window.removeEventListener("mouseleave", mouseMoveHandler);
        // };
    }, [isDragging]);

    return (
        <React.Fragment>
            <Head>
                <title>{"HOME"}</title>
            </Head>
            <div>
                <div
                    className="flex justify-between items-center h-12 bg-white text-gray-700"
                    onMouseDown={(event) => {
                        setIsDragging(true);

                        startX.current = event.screenX;
                        startY.current = event.screenY;
                        // setStartX(event.screenX);
                        // setStartY(event.screenY);

                        document.body.style.cursor = "grabbing";
                    }}
                    // onMouseMove={(event) => {
                    //     if (!isDragging) return;

                    //     const offsetX = event.screenX - startX;
                    //     const offsetY = event.screenY - startY;

                    //     // Send offset to the main process
                    //     window.ipc.send("move-window", { offsetX, offsetY });

                    //     setStartX(event.screenX);
                    //     setStartY(event.screenY);
                    // }}
                    // onMouseUp={(event) => {
                    //     setIsDragging(false);
                    //     document.body.style.cursor = "grab";
                    // }}
                    // onMouseLeave={(event) => {
                    //     if (!isDragging) return;

                    //     const offsetX = event.screenX - startX;
                    //     const offsetY = event.screenY - startY;

                    //     // Send offset to the main process
                    //     window.ipc.send("move-window", { offsetX, offsetY });

                    //     setStartX(event.screenX);
                    //     setStartY(event.screenY);
                    // }}
                    // onMouseOut={(event) => {
                    //     setIsDragging(false);
                    //     document.body.style.cursor = "grab";
                    // }}
                >
                    <div className="flex justify-start gap-x-4 h-full p-2">
                        {tabs?.map((t, idx) => {
                            return (
                                <div
                                    onClick={() => {
                                        setCurent(idx);
                                    }}
                                    className={`cursor-pointer flex items-center h-full w-52 px-2 ${
                                        current === idx ? "bg-blue-300" : "bg-gray-300"
                                    }`}
                                    key={idx}
                                >
                                    <img
                                        className="h-5 w-5"
                                        src={t.iconUrl || ""}
                                        alt="icon.url"
                                    ></img>
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
