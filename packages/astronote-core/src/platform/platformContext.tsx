import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
} from "react";
import { PlatformContext } from "./types";

export const platformContext = createContext<PlatformContext | null>(null);

export const PlatformProvider: FC<PropsWithChildren<PlatformContext>> = (
  props
) => {
  const { children, ...rest } = props;

  useEffect(() => {
    document.documentElement.classList.add(
      `platform-${rest.platform}`,
      `os-${rest.os}`
    );
  }, [rest]);
  return (
    <platformContext.Provider value={rest}>{children}</platformContext.Provider>
  );
};

export const usePlatform = () => {
  const context = useContext(platformContext);
  if (!context) throw "usePlaftform must use inside PlatformProvider";
  return context;
};
