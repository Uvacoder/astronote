import { OperatingSystem, Platform, PlatformProvider } from "@an/core";
import AppInterface from "@an/react";

const App = () => {
  return (
    <PlatformProvider os={OperatingSystem.Browser} platform={Platform.Tauri}>
      <AppInterface />
    </PlatformProvider>
  );
};

export default App;
