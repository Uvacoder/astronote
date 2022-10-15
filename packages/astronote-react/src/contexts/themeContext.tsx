import {
  type ReactNode,
  useCallback,
  useState,
  useEffect,
  useContext,
} from "react";
import { createContext } from "react";

export enum ColorMode {
  Auto = "auto",
  Light = "light",
  Dark = "dark",
}

export interface ThemeContext {
  mode: ColorMode;
  isDark: boolean;
  setMode: (mode: ColorMode) => void;
  toggleMode: () => void;
}

export const themeContext = createContext<ThemeContext | null>(null);
const { Provider } = themeContext;

export interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: ColorMode;
}

export const ThemeProvider = (props: ThemeProviderProps) => {
  const { children, defaultMode = ColorMode.Auto } = props;
  const [isDark, setIsDark] = useState(false);

  const [mode, setMode] = useState(defaultMode);
  const [initialized, setInitialized] = useState(false);

  const toggleMode = useCallback(() => {
    setMode((m) => {
      switch (m) {
        case ColorMode.Auto:
          return ColorMode.Light;
        case ColorMode.Light:
          return ColorMode.Dark;
        case ColorMode.Dark:
          return ColorMode.Auto;
      }
    });
  }, []);

  const applyTheme = useCallback(() => {
    const isDark =
      mode === ColorMode.Dark ||
      (mode === ColorMode.Auto &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
    setIsDark(isDark);
  }, [mode]);

  useEffect(() => {
    if (!initialized) {
      const theme = localStorage.getItem("theme");
      switch (theme) {
        case "light":
          setMode(ColorMode.Light);
          break;
        case "dark":
          setMode(ColorMode.Dark);
          break;
        case "auto":
          setMode(ColorMode.Auto);
          break;
        default:
          setMode(defaultMode);
          break;
      }
      setInitialized(true);
      return;
    }

    switch (mode) {
      case ColorMode.Light:
        localStorage.setItem("theme", "light");
        break;
      case ColorMode.Dark:
        localStorage.setItem("theme", "dark");
        break;
      case ColorMode.Auto:
        localStorage.setItem("theme", "auto");
        break;
      default:
        localStorage.removeItem("theme");
        break;
    }

    applyTheme();

    const colorSchemeChange = () => {
      applyTheme();
    };

    const prefersColorScheme = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    if (mode === ColorMode.Auto) {
      prefersColorScheme.addEventListener("change", colorSchemeChange);
    }

    return () => {
      prefersColorScheme.removeEventListener("change", colorSchemeChange);
    };
  }, [mode, defaultMode, initialized, applyTheme]);

  return (
    <Provider
      value={{
        mode,
        setMode,
        toggleMode,
        isDark,
      }}
    >
      {children}
    </Provider>
  );
};

export const useTheme = () => {
  const context = useContext(themeContext);
  if (!context) {
    throw "useTheme must use inside ThemeProvider!";
  }

  return context;
};
