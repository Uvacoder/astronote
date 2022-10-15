export enum OperatingSystem {
  Browser = "browser",
  Windows = "windows",
  MacOS = "macos",
  Linux = "linux",
  IOS = "ios",
  Android = "android",
  Unknown = "unknown",
}

export enum Platform {
  Web = "web",
  Electron = "electron",
  Tauri = "tauri",
  ReactNative = "react-native",
}

export interface PlatformContext {
  os: OperatingSystem;
  platform: Platform;
}
