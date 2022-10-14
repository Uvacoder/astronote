const { BrowserWindow, app } = require("electron");

let window;

const startApp = () => {
  window = new BrowserWindow({
    title: "Astronote",
    width: 1280,
    height: 720,
    titleBarStyle: "hiddenInset",
    trafficLightPosition: {
      x: 16,
      y: 16,
    },
  });
  window.loadURL("http://localhost:3001");
};

app.on("ready", startApp);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
