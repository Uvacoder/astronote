import {
  createBrowserHistory,
  Link,
  Navigate,
  Outlet,
  ReactLocation,
  Route,
  Router,
} from "@tanstack/react-location";
import { useMemo } from "react";
import AuthLayout from "./layouts/auth-layout";
import AppLayout from "./layouts/app-layout";
import { LocationGenerics } from "./types/locationGenerics";
import SignUpScreen from "./screens/auth/SignUp";
import LogInScreen from "./screens/auth/LogIn";
import AlertProvider from "./contexts/alertContext";
import DialogsProvider from "./contexts/dialogContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import NoWorkspaceSelected from "./screens/NoWorkspaceSelected";
import Workspace from "./routes/workspace";
import AllNotes from "./routes/all-notes";
import UnsortedNotes from "./routes/unsorted-notes";
import Trash from "./routes/trashed-notes";
import StarredNotes from "./routes/starred-notes";
import Notebook from "./routes/notebook";
import Note from "./routes/note";

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
        element: <Navigate to="workspaces" replace />,
      },
      {
        path: "workspaces",
        element: <AppLayout />,
        children: [
          {
            path: "/",
            element: <NoWorkspaceSelected />,
          },
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
                element: <AllNotes />,
              },
              {
                path: "unsorted",
                element: <UnsortedNotes />,
              },
              {
                path: "starred",
                element: <StarredNotes />,
              },
              {
                path: "trash",
                element: <Trash />,
              },
              {
                path: "notebooks/:notebookId",
                element: <Notebook />,
              },
              {
                path: "notes/:noteId",
                element: <Note />,
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
        element: (
          <div>
            <p>Page Not Found</p>
            <Link to="/">go home</Link>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <Router location={location} routes={routes}>
      <DndProvider backend={HTML5Backend}>
        <AlertProvider>
          <DialogsProvider>
            <Outlet />
          </DialogsProvider>
        </AlertProvider>
      </DndProvider>
    </Router>
  );
};

export default AppRouter;
