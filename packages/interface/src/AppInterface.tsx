import { queryClient } from "@an/core";
import { QueryClientProvider } from "@tanstack/react-query";
import AppRouter from "./AppRouter";
import { ThemeProvider } from "./contexts/themeContext";

const AppInterface = () => {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default AppInterface;
