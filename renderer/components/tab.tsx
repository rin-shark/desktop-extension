import React, { FC, useEffect, useState } from "react";

export const TabView: FC<{
    tabInfo: { id: number; viewId: string | null; title: string; url: string };
}> = (props) => {
    const [url, setUrl] = useState(props.tabInfo?.url);

    useEffect(() => {
        setUrl(props.tabInfo.url);
    }, [props.tabInfo]);

    return (
        <div>
            <div className="flex gap-x-3 w-full p-2">
                <div className="text-gray-700 flex justify-between gap-x-5 px-5 border border-gray-100 rounded-md">
                    <button>pre</button>
                    <button>next</button>
                    <button>refresh</button>
                </div>

                <input
                    className="bg-gray-100 w-full h-10 text-gray-700 rounded-md px-5"
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
        </div>
    );
};
