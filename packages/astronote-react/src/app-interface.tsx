import { Platform, queryClient, usePlatform } from "@an/core";
import { QueryClientProvider } from "@tanstack/react-query";
import AppRouter from "./app-router";
import AuthProvider from "./contexts/authContext";
import { ThemeProvider } from "./contexts/themeContext";

const AppInterface = () => {
  const { platform } = usePlatform();
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        {platform === Platform.Electron && (
          <div className="draggable fixed left-0 right-0 top-0 -z-50 h-12"></div>
        )}
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default AppInterface;
