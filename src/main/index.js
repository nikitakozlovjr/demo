import { app, shell, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";
// import client from "./db.js";
import pg from 'pg';
const { Client } = pg;

// async function getPartners() {
//   const response = client.query('SELECT * FROM partners');
//   console.log(response);
// }

async function getPartners() {
  const client = new Client({
    user: 'postgres', 
    password: '270202', 
    host: 'localhost', 
    port: '5432', 
    database: 'demo'
  });

  await client.connect();

  try {
    const response = await client.query('SELECT * FROM partners');
    return response.rows
  } catch (error) {
    console.log(error);
  }
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
    // getPartners()
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.electron");

  ipcMain.handle('getPartners', async function getPartners() {
    const {Client} = pg;
    const client = new Client({
      user: 'postgres', 
      password: '270202', 
      host: 'localhost', 
      port: '5432', 
      database: 'demo'
    })

    await client.connect();
    try {
      const { rows } = await client.query('SELECT * FROM partners');
      return (rows)
    } catch (error) {
      console.log(error);
    }
  })

  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  ipcMain.on("ping", () => console.log("pong"));

  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
