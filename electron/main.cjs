const { app, BrowserWindow, ipcMain, Menu, Tray } = require("electron");
const path = require("path");
const url = require("url");

// 保持对窗口对象的全局引用，避免JavaScript对象被垃圾回收时，窗口被自动关闭
let mainWindow;
let tray = null;

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 900,
    height: 1400,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: path.join(__dirname, "icons/icon.png"),
  });

  // 加载应用
  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(__dirname, "../dist/index.html"),
      protocol: "file:",
      slashes: true,
    });

  mainWindow.loadURL(startUrl);

  // 打开开发者工具，调试时可以打开
  // mainWindow.webContents.openDevTools()

  // 当窗口关闭时调用的事件处理函数
  mainWindow.on("closed", function () {
    // 解除窗口对象的引用
    mainWindow = null;
  });

  // 当应用最小化时，创建托盘图标
  mainWindow.on("minimize", function (event) {
    event.preventDefault();
    mainWindow.hide();
    createTray();
  });
}

// 创建系统托盘图标
function createTray() {
  if (tray) return;

  tray = new Tray(path.join(__dirname, "icons/icon.png"));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "打开应用",
      click: function () {
        mainWindow.show();
      },
    },
    {
      label: "退出",
      click: function () {
        app.quit();
      },
    },
  ]);

  tray.setToolTip("任务计时 Todo List");
  tray.setContextMenu(contextMenu);

  tray.on("click", () => {
    mainWindow.show();
  });
}

// 当Electron完成初始化并准备创建浏览器窗口时调用此方法
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // 在macOS上，当dock图标被点击并且没有其他窗口打开时，
    // 通常会在应用程序中重新创建一个窗口
    if (mainWindow === null) createWindow();
  });
});

// 当所有窗口关闭时退出应用
app.on("window-all-closed", function () {
  // 在macOS上，除非用户用Cmd + Q确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活
  if (process.platform !== "darwin") app.quit();
});

// 监听来自渲染进程的消息
ipcMain.on("app-quit", () => {
  app.quit();
});
