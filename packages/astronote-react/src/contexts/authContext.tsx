import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getCurrentUserAsync } from "../api/userApi";
import LoadingSpinner from "../components/loading-spinner";
import User from "../types/user";
import { useTheme } from "./themeContext";

export interface AuthContext {
  user: User | null;
  setUser: (user: User) => void;
  isLoading: boolean;
}

export const authContext = createContext<AuthContext | null>(null);

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isDark } = useTheme();

  const validateUser = useCallback(async () => {
    try {
      const user = await getCurrentUserAsync();
      setUser(user);
    } catch (e) {
      console.log("FAILED TO GET CURRENT USER", e);
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    validateUser();
  }, []);

  if (isLoading) {
    return (
      <div className="fixed z-50 flex h-screen w-screen items-center justify-center bg-white dark:bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <authContext.Provider
      value={{
        user,
        setUser,
        isLoading,
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) {
    throw "useContext must use inside AuthProvider";
  }

  return context;
};
