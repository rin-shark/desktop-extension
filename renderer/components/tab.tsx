import React, { FC, useEffect, useState } from "react";
import { MdArrowBackIos, MdArrowForwardIos, MdRefresh } from "react-icons/md";

export const TabView: FC<{
    tabInfo: {
        id: string;
        viewId: string | null;
        iconUrl: string | null;
        title: string;
        url: string;
    };
}> = (props) => {
    const [url, setUrl] = useState(props.tabInfo?.url);

    useEffect(() => {
        setUrl(props.tabInfo.url);
    }, [props.tabInfo]);

    return (
        <div className="flex gap-x-3 w-full h-full p-2">
            <div className="text-gray-100 flex justify-between gap-x-5 px-5">
                <button
                    onClick={() => {
                        window.ipc.send("go-back", props?.tabInfo?.viewId);
                    }}
                >
                    <MdArrowBackIos size={20} />
                </button>
                <button
                    onClick={() => {
                        window.ipc.send("go-next", props?.tabInfo?.viewId);
                    }}
                >
                    <MdArrowForwardIos size={20} />
                </button>
                <button
                    onClick={() => {
                        window.ipc.send("view-reload", props?.tabInfo?.viewId);
                    }}
                >
                    <MdRefresh size={22} />
                </button>
            </div>

            <input
                className="bg-purple-100 w-full h-full text-gray-700 rounded-xl px-5 focus:outline-none"
                value={url}
                onChange={(e) => {
                    setUrl(e.target.value);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        window.ipc.send("load-view", {
                            view: props.tabInfo,
                            url,
                        });
                    }
                }}
            ></input>
        </div>
    );
};
