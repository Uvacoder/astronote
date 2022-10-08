import { Link } from "@tanstack/react-location";
import { useQuery } from "@tanstack/react-query";
import {
  MdAdd,
  MdCheck,
  MdExpandMore,
  MdFilterBAndW,
  MdPerson,
} from "react-icons/md";
import { getAllWorkspacesAsync } from "../api/workspaceApi";
import * as DM from "@radix-ui/react-dropdown-menu";
import * as Avatar from "@radix-ui/react-avatar";
import * as Select from "@radix-ui/react-select";
import color from "color";
import { useMemo } from "react";
import { useTheme, ColorMode } from "../contexts/themeContext";
import { FiLogOut, FiMoon, FiSettings, FiSun, FiTablet } from "react-icons/fi";
import CreateWorkspaceDialog from "./CreateWorkspaceDialog";

const WorkspaceListBar = () => {
  const workspacesQuery = useQuery(["workspaces"], getAllWorkspacesAsync);
  const getName = (name: string) => {
    return name
      .split(" ")
      .map((item) => item[0])
      .join("")
      .slice(0, 2);
  };

  return (
    <aside className="h-full border-r border-gray-100 dark:border-gray-800 flex flex-col items-center">
      <div className="flex-1 overflow-y-auto p-3 w-full">
        <nav className="flex flex-col gap-3 items-center">
          {workspacesQuery.isLoading ? (
            <>
              <div className="w-10 h-10 rounded-md bg-gray-100 dark:bg-gray-800"></div>
              <div className="w-10 h-10 rounded-md bg-gray-100 dark:bg-gray-800"></div>
              <div className="w-10 h-10 rounded-md bg-gray-100 dark:bg-gray-800"></div>
              <div className="w-10 h-10 rounded-md bg-gray-100 dark:bg-gray-800"></div>
            </>
          ) : (
            workspacesQuery.data?.map((item) => (
              <Link
                key={item.id}
                to={item.id}
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                getActiveProps={() => ({
                  className:
                    "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 ring-gray-900 dark:ring-white",
                })}
                style={{
                  backgroundColor: item.color
                    ? color(item.color).hex()
                    : undefined,
                  color: item.color
                    ? color(item.color).isDark()
                      ? "#fff"
                      : "#000"
                    : undefined,
                }}
              >
                {item.emoji || getName(item.name)}
              </Link>
            ))
          )}
          <CreateWorkspaceDialog>
            <button className="w-10 h-10 rounded-md flex items-center justify-center text-2xl text-gray-900 dark:text-gray-50 bg-gray-100 dark:bg-gray-800">
              <MdAdd />
            </button>
          </CreateWorkspaceDialog>
        </nav>
      </div>
      <div className="p-3">
        <PersonButton />
      </div>
    </aside>
  );
};

export default WorkspaceListBar;

const PersonButton = () => {
  const buttonElement = useMemo(
    () => (
      <button className="hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md h-10 w-10 flex items-center justify-centerp justify-center">
        <Avatar.Root className="w-8 h-8 rounded-full overflow-hidden relative flex items-center justify-center text-gray-900 dark:text-gray-50 bg-gray-200 dark:bg-gray-600">
          <Avatar.Image></Avatar.Image>
          <Avatar.Fallback>
            <MdPerson className="text-2xl" />
          </Avatar.Fallback>
        </Avatar.Root>
      </button>
    ),
    []
  );

  return (
    <DM.Root>
      <DM.Trigger asChild>{buttonElement}</DM.Trigger>
      <DM.Portal>
        <DM.Content
          align="end"
          side="right"
          className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl rounded-lg overflow-hidden p-1 w-64"
        >
          <DM.Item asChild>
            <button className="rounded-md w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-4 outline-none focus:bg-gray-100 dark:focus:bg-gray-800">
              <Avatar.Root className="flex items-center justify-center w-12 h-12 relative rounded-full overflow-hidden text-gray-900 dark:text-gray-50 bg-gray-200 dark:bg-gray-600">
                <Avatar.Image></Avatar.Image>
                <Avatar.Fallback>
                  <MdPerson className="text-3xl" />
                </Avatar.Fallback>
              </Avatar.Root>
              <div className="flex-1">
                <p className="truncate">Rohidul Islam</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  @rohid123
                </p>
              </div>
            </button>
          </DM.Item>
          <DM.Item asChild>
            <button className="rounded-md w-full text-left px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 outline-none focus:bg-gray-100 dark:focus:bg-gray-800">
              <FiSettings className="text-xl" />
              <p className="flex-1 truncate">Settings</p>
            </button>
          </DM.Item>
          <DM.Separator className="h-px bg-gray-200 dark:bg-gray-800 my-2" />
          <div className="rounded-md w-full text-left px-3 py-1.5 flex items-center gap-3 outline-none">
            <MdFilterBAndW className="text-xl" />
            <p className="flex-1 truncate">Theme</p>
            <DM.Item asChild>
              <ThemeSwitch />
            </DM.Item>
          </div>
          <DM.Separator className="h-px bg-gray-200 dark:bg-gray-800 my-2" />
          <DM.Group>
            <DM.Item asChild>
              <button className="rounded-md w-full text-left px-3 py-1.5 hover:bg-red-500/5 flex items-center gap-3 outline-none focus:bg-red-500/5 hover:text-red-500 focus:text-red-500">
                <FiLogOut className="text-xl" />
                <p className="flex-1 truncate">Sign Out</p>
              </button>
            </DM.Item>
          </DM.Group>
        </DM.Content>
      </DM.Portal>
    </DM.Root>
  );
};

const ThemeSwitch = () => {
  const { mode, setMode } = useTheme();

  return (
    <Select.Root
      defaultValue={
        mode === ColorMode.Auto
          ? "auto"
          : mode === ColorMode.Light
          ? "light"
          : "dark"
      }
      onValueChange={(value) => {
        switch (value) {
          case "light":
            setMode(ColorMode.Light);
            break;
          case "dark":
            setMode(ColorMode.Dark);
            break;
          default:
            setMode(ColorMode.Auto);
            break;
        }
      }}
    >
      <Select.Trigger className="outline-none gap-2 px-2 rounded-md py-1 flex items-center hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800 border border-gray-100 dark:border-gray-800">
        <Select.Icon asChild>
          {mode === ColorMode.Auto ? (
            <FiTablet className="text-xl" />
          ) : mode === ColorMode.Light ? (
            <FiSun className="text-xl" />
          ) : (
            <FiMoon className="text-xl" />
          )}
        </Select.Icon>
        <Select.Value className="flex-1 truncate">
          {mode === ColorMode.Auto
            ? "Auto"
            : mode === ColorMode.Light
            ? "Light"
            : "Dark"}
        </Select.Value>
        <MdExpandMore className="text-lg" />
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="bg-white dark:bg-gray-900 p-1 rounded-lg border border-gray-100 dark:border-gray-800 shadow-xl">
          <Select.Viewport>
            <Select.Item value="auto" asChild>
              <button className="outline-none gap-2 px-2 rounded-md py-1 flex items-center w-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800">
                <FiTablet className="text-xl" />
                <Select.ItemText>Auto</Select.ItemText>
                <Select.ItemIndicator>
                  <MdCheck className="text-lg" />
                </Select.ItemIndicator>
              </button>
            </Select.Item>
            <Select.Item value="light" asChild>
              <button className="outline-none gap-2 px-2 rounded-md py-1 flex items-center w-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800">
                <FiSun className="text-xl" />
                <Select.ItemText>Light</Select.ItemText>
                <Select.ItemIndicator>
                  <MdCheck className="text-lg" />
                </Select.ItemIndicator>
              </button>
            </Select.Item>
            <Select.Item value="dark" asChild>
              <button className="outline-none gap-2 px-2 rounded-md py-1 flex items-center w-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800">
                <FiMoon className="text-xl" />
                <Select.ItemText>Dark</Select.ItemText>
                <Select.ItemIndicator>
                  <MdCheck className="text-lg" />
                </Select.ItemIndicator>
              </button>
            </Select.Item>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};
