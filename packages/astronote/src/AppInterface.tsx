import { queryClient } from "@an/core";
import { QueryClientProvider } from "@tanstack/react-query";
import AppRouter from "./AppRouter";
import { ThemeProvider } from "./contexts/themeContext";

const AppInterface = () => {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <div className="draggable fixed left-0 right-0 top-0 -z-50 h-12"></div>
        <AppRouter />
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default AppInterface;
