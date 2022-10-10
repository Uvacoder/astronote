import {
  createBrowserHistory,
  Navigate,
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

  return <Router location={location} routes={routes} />;
};

export default AppRouter;
