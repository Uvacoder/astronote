import {
  createBrowserHistory,
  Navigate,
  ReactLocation,
  Route,
  Router,
} from "@tanstack/react-location";
import { useMemo } from "react";
import AuthLayout from "./layouts/AuthLayout";
import LogIn from "./routes/login";
import SignUp from "./routes/signup";
import Workspace from "./routes/workspace";
import { LocationGenerics } from "./types/locationGenerics";
import NotePage from "./routes/note";
import NotebookPage from "./routes/notebook";
import AppLayout from "./layouts/AppLayout";
import WorkspaceHome from "./routes/WorkspaceHome";
import WorkspcaeStarred from "./routes/WorkspcaeStarred";
import WorkspaceTrash from "./routes/WorkspaceTrash";
import WorkspaceUnsorted from "./routes/WorkspaceUnsorted";

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
            element: <LogIn />,
          },
        ],
      },
      {
        path: "signup",
        element: <AuthLayout />,
        children: [
          {
            path: "/",
            element: <SignUp />,
          },
        ],
      },
      {
        path: "/",
        element: <AppLayout />,
        children: [
          {
            path: ":workspaceId",
            element: <Workspace />,
            children: [
              {
                path: "/",
                element: <Navigate to="all" replace />,
              },
              {
                path: "all",
                element: <WorkspaceHome />,
              },
              {
                path: "starred",
                element: <WorkspcaeStarred />,
              },
              {
                path: "unsorted",
                element: <WorkspaceUnsorted />,
              },
              {
                path: "trash",
                element: <WorkspaceTrash />,
              },
              {
                path: "notebooks/:notebookId",
                element: <NotebookPage />,
              },
              {
                path: "notes/:noteId",
                element: <NotePage />,
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
