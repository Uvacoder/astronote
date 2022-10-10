import { queryClient } from "@astronote/core";
import { QueryClientProvider } from "@tanstack/react-query";
import AppRouter from "./AppRouter";
import AlertProvider from "./contexts/alertContext";
import { ThemeProvider } from "./contexts/themeContext";

const AppInterface = () => {
  return (
    <ThemeProvider>
      <AlertProvider>
        <QueryClientProvider client={queryClient}>
          <AppRouter />
        </QueryClientProvider>
      </AlertProvider>
    </ThemeProvider>
  );
};

export default AppInterface;
