import {
  createBrowserHistory,
  Navigate,
  Outlet,
  ReactLocation,
  Route,
  Router,
} from "@tanstack/react-location";
import { useMemo } from "react";
import AuthLayout from "./layouts/auth-layout";
import WorkspaceLayout from "./layouts/workspace-layout";
import AppLayout from "./layouts/app-layout";
import { LocationGenerics } from "./types/locationGenerics";
import AllNotesScreen from "./screens/workspace/AllNotes";
import StarredScreen from "./screens/workspace/Starred";
import SignUpScreen from "./screens/auth/SignUp";
import LogInScreen from "./screens/auth/LogIn";
import TrashScreen from "./screens/workspace/Trash";
import NoteScreen from "./screens/Note";
import NotebookScreen from "./screens/Notebook";
import UnsortedScreen from "./screens/workspace/Unsorted";
import AlertProvider from "./contexts/alertContext";
import DialogsProvider from "./contexts/dialogContext";

const history = createBrowserHistory();

const location = new ReactLocation<LocationGenerics>({
  history,
});

const AppRouter = () => {
  const routes = useMemo(
    (): Route<LocationGenerics>[] => [
      {
        path: "login",
        element: <AuthLayout />,
        children: [
          {
            path: "/",
            element: <LogInScreen />,
          },
        ],
      },
      {
        path: "signup",
        element: <AuthLayout />,
        children: [
          {
            path: "/",
            element: <SignUpScreen />,
          },
        ],
      },
      {
        path: "/",
        element: <AppLayout />,
        children: [
          {
            path: ":workspaceId",
            element: <WorkspaceLayout />,
            children: [
              {
                path: "/",
                element: <Navigate to="all" replace />,
              },
              {
                path: "all",
                element: <AllNotesScreen />,
              },
              {
                path: "unsorted",
                element: <UnsortedScreen />,
              },
              {
                path: "starred",
                element: <StarredScreen />,
              },
              {
                path: "trash",
                element: <TrashScreen />,
              },
              {
                path: "notebooks/:notebookId",
                element: <NotebookScreen />,
              },
              {
                path: "notes/:noteId",
                element: <NoteScreen />,
              },
              {
                path: "*",
                element: "Not found",
              },
            ],
          },
        ],
      },
      {
        path: "*",
        element: "Page Not Found",
      },
    ],
    []
  );

  return (
    <Router location={location} routes={routes}>
      <AlertProvider>
        <DialogsProvider>
          <Outlet />
        </DialogsProvider>
      </AlertProvider>
    </Router>
  );
};

export default AppRouter;
