import path from "path";
import {
    app,
    BaseWindow,
    BrowserWindow,
    ipcMain,
    Menu,
    MenuItem,
    View,
    WebContentsView,
} from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";

const isProd = process.env.NODE_ENV === "production";

if (isProd) {
    serve({ directory: "app" });
} else {
    app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
    await app.whenReady();

    // const win = new BaseWindow({ width: 800, height: 600 });

    const mainWindow = createWindow("main", {
        // fullscreen: true,
        fullscreenable: true,
        // height: 700,
        // width: 900,
        // titleBarStyle: "hidden",
        autoHideMenuBar: true,

        icon: "resources/icon.ico",
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, "preload.js"),
            webSecurity: false,
        },
    });

    if (isProd) {
        await mainWindow.loadURL("app://./home");
    } else {
        const port = process.argv[2];
        const startUrl = `http://localhost:${port}/home`;

        await mainWindow.loadURL(startUrl);
    }

    ipcMain.on("load-view", async (_e, data) => {
        if (!data?.view?.viewId) {
            const view = new WebContentsView();
            mainWindow.contentView.addChildView(view);
            view.setBounds({
                x: 0,
                y: 100,
                width: mainWindow.getSize()[0],
                height: mainWindow.getSize()[1],
            });

            mainWindow.on("resize", () => {
                view.setBounds({
                    x: 0,
                    y: 100,
                    width: mainWindow.getSize()[0],
                    height: mainWindow.getSize()[1],
                });
            });
            view.webContents.loadURL(data.url);

            view.webContents.on("did-navigate-in-page", (event, url) => {
                console.log("In-page navigation to:", url);
                const viewInfo = {
                    id: data.view.id,
                    viewId: view.webContents.id,
                    title: view.webContents.getTitle(),
                    url: view.webContents.getURL(),
                };
                mainWindow.webContents.send("view-loading-return", viewInfo);
            });

            view.webContents.on("page-title-updated", (event, title) => {
                console.log("Page title updated:", title);
                const viewInfo = {
                    id: data.view.id,
                    viewId: view.webContents.id,
                    title: view.webContents.getTitle(),
                    url: view.webContents.getURL(),
                };
                console.log("🚀 ~ view.webContents.on ~ viewInfo:", viewInfo);
                mainWindow.webContents.send("view-loading-return", viewInfo);
            });

            return;
        }

        const views = mainWindow.contentView.children;
        views?.forEach((element: WebContentsView) => {
            if (element.webContents.id === data.view.viewId) {
                element.webContents.loadURL(data.url);
            } else {
                element.setVisible(false);
            }
        });
    });

    ipcMain.on("get-view", async (_e, viewId: number) => {
        //
    });

    ipcMain.on(
        "set-view",
        async (
            _e,
            data: {
                viewId: number;
            }
        ) => {
            const views = mainWindow.contentView.children;
            views?.forEach((element: WebContentsView) => {
                if (element.webContents.id === data.viewId) {
                    element.setVisible(true);
                } else {
                    element.setVisible(false);
                }
            });
        }
    );

    ipcMain.on("open-dev-tool", () => {
        mainWindow.webContents.openDevTools();
    });
})();

app.on("window-all-closed", () => {
    app.quit();
});

ipcMain.on("message", async (event, arg) => {
    event.reply("message", `${arg} World!`);
});
