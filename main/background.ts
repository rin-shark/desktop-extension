import path from "path";
import {
    app,
    BaseWindow,
    BrowserWindow,
    ipcMain,
    Menu,
    MenuItem,
    View,
    webContents,
    screen,
    WebContentsView,
    globalShortcut,
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

    const mainWindow = createWindow("main", {
        frame: false,
        transparent: true,
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

            view.webContents.on("page-title-updated", async (event, title) => {
                console.log("Page title updated:", title);
                const icon = await getFaviconUrl(view.webContents);

                const viewInfo = {
                    id: data.view.id,
                    viewId: view.webContents.id,
                    title: view.webContents.getTitle(),
                    url: view.webContents.getURL(),
                    iconUrl: icon,
                };

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

    ipcMain.on("go-back", async (_e, viewId: number) => {
        const views = mainWindow.contentView.children;
        views?.forEach((element: WebContentsView) => {
            if (element.webContents.id === viewId) {
                element.webContents.goBack();
            }
        });
    });

    ipcMain.on("go-next", async (_e, viewId: number) => {
        const views = mainWindow.contentView.children;
        views?.forEach((element: WebContentsView) => {
            if (element.webContents.id === viewId) {
                element.webContents.goForward();
            }
        });
    });

    ipcMain.on("view-reload", async (_e, viewId: number) => {
        const views = mainWindow.contentView.children;
        views?.forEach((element: WebContentsView) => {
            if (element.webContents.id === viewId) {
                element.webContents.reload();
            }
        });
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

    // Function to extract the favicon URL
    async function getFaviconUrl(webContents) {
        // Execute JavaScript in the web page to get the favicon URL
        try {
            const result = await webContents.executeJavaScript(`
        (() => {
          const link = document.querySelector('link[rel="icon"]') || document.querySelector('link[rel="shortcut icon"]');
          return link ? link.href : null;
        })();
      `);
            if (!result) {
                // If it's not a data URL, make it absolute using the page's base URL
                const pageUrl = webContents.getURL();
                const faviconUrl = new URL("/favicon.ico", pageUrl).href;
                return faviconUrl;
            }
            return result;
        } catch (error) {
            console.error("Error fetching favicon URL:", error);
            return null;
        }
    }

    ipcMain.on("remove-view", (_e, viewId: number) => {
        const views = mainWindow.contentView.children;
        views?.forEach((element: WebContentsView) => {
            if (element.webContents.id === viewId) {
                mainWindow.contentView.removeChildView(element);
            }
        });
    });

    ipcMain.on("toggle-full-screen", () => {
        if (mainWindow.isFocused()) {
            mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }
    });

    ipcMain.on("quit", () => {
        app.quit();
    });

    mainWindow.webContents.on("before-input-event", (event, input) => {
        if (input.control && input.key.toLowerCase() === "t") {
            console.log("Pressed Control+T");
            mainWindow.webContents.send("create-new-tab");
            event.preventDefault();
        }
    });
    mainWindow.webContents.on("before-input-event", (event, input) => {
        if (input.control && input.key.toLowerCase() === "w") {
            console.log("Pressed Control+w");
            mainWindow.webContents.send("close-current-tab");
            event.preventDefault();
        }
    });
    mainWindow.webContents.on("before-input-event", (event, input) => {
        if (input.control && input.key.toLowerCase() === "f12") {
            console.log("Pressed Control+f12");
            mainWindow.webContents.openDevTools();
            event.preventDefault();
        }
    });
})();

app.on("window-all-closed", () => {
    app.quit();
});

ipcMain.on("message", async (event, arg) => {
    event.reply("message", `${arg} World!`);
});
