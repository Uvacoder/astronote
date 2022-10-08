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
    <aside className="flex h-full flex-col items-center border-r border-gray-100 dark:border-gray-800">
      <div className="w-full flex-1 overflow-y-auto p-3">
        <nav className="flex flex-col items-center gap-3">
          {workspacesQuery.isLoading ? (
            <>
              <div className="h-10 w-10 rounded-md bg-gray-100 dark:bg-gray-800"></div>
              <div className="h-10 w-10 rounded-md bg-gray-100 dark:bg-gray-800"></div>
              <div className="h-10 w-10 rounded-md bg-gray-100 dark:bg-gray-800"></div>
              <div className="h-10 w-10 rounded-md bg-gray-100 dark:bg-gray-800"></div>
            </>
          ) : (
            workspacesQuery.data?.map((item) => (
              <Link
                key={item.id}
                to={item.id}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900 text-xl text-white dark:bg-white dark:text-gray-900"
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
            <button className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100 text-2xl text-gray-900 dark:bg-gray-800 dark:text-gray-50">
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
      <button className="justify-centerp flex h-10 w-10 items-center justify-center rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
        <Avatar.Root className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-gray-900 dark:bg-gray-600 dark:text-gray-50">
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
          className="w-64 overflow-hidden rounded-lg border border-gray-100 bg-white p-1 shadow-xl dark:border-gray-800 dark:bg-gray-900"
        >
          <DM.Item asChild>
            <button className="flex w-full items-center gap-4 rounded-md px-4 py-2 text-left outline-none hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-800 dark:focus:bg-gray-800">
              <Avatar.Root className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-gray-900 dark:bg-gray-600 dark:text-gray-50">
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
            <button className="flex w-full items-center gap-3 rounded-md px-3 py-1.5 text-left outline-none hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-800 dark:focus:bg-gray-800">
              <FiSettings className="text-xl" />
              <p className="flex-1 truncate">Settings</p>
            </button>
          </DM.Item>
          <DM.Separator className="my-2 h-px bg-gray-200 dark:bg-gray-800" />
          <div className="flex w-full items-center gap-3 rounded-md px-3 py-1.5 text-left outline-none">
            <MdFilterBAndW className="text-xl" />
            <p className="flex-1 truncate">Theme</p>
            <DM.Item asChild>
              <ThemeSwitch />
            </DM.Item>
          </div>
          <DM.Separator className="my-2 h-px bg-gray-200 dark:bg-gray-800" />
          <DM.Group>
            <DM.Item asChild>
              <button className="flex w-full items-center gap-3 rounded-md px-3 py-1.5 text-left outline-none hover:bg-red-500/5 hover:text-red-500 focus:bg-red-500/5 focus:text-red-500">
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
      <Select.Trigger className="flex items-center gap-2 rounded-md border border-gray-100 px-2 py-1 outline-none hover:bg-gray-100 focus:bg-gray-100 dark:border-gray-800 dark:hover:bg-gray-800 dark:focus:bg-gray-800">
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
        <Select.Content className="rounded-lg border border-gray-100 bg-white p-1 shadow-xl dark:border-gray-800 dark:bg-gray-900">
          <Select.Viewport>
            <Select.Item value="auto" asChild>
              <button className="flex w-full items-center gap-2 rounded-md px-2 py-1 outline-none hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-800 dark:focus:bg-gray-800">
                <FiTablet className="text-xl" />
                <Select.ItemText>Auto</Select.ItemText>
                <Select.ItemIndicator>
                  <MdCheck className="text-lg" />
                </Select.ItemIndicator>
              </button>
            </Select.Item>
            <Select.Item value="light" asChild>
              <button className="flex w-full items-center gap-2 rounded-md px-2 py-1 outline-none hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-800 dark:focus:bg-gray-800">
                <FiSun className="text-xl" />
                <Select.ItemText>Light</Select.ItemText>
                <Select.ItemIndicator>
                  <MdCheck className="text-lg" />
                </Select.ItemIndicator>
              </button>
            </Select.Item>
            <Select.Item value="dark" asChild>
              <button className="flex w-full items-center gap-2 rounded-md px-2 py-1 outline-none hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-800 dark:focus:bg-gray-800">
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
