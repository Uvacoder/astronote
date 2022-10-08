import { useMemo } from "react";
import {
  MdPerson,
  MdMoreHoriz,
  MdSettings,
  MdLogout,
  MdDarkMode,
  MdLaptop,
  MdLightMode,
  MdCheck,
  MdExpandMore,
  MdFilterBAndW,
} from "react-icons/md";
import * as DM from "@radix-ui/react-dropdown-menu";
import * as Avatar from "@radix-ui/react-avatar";
import * as Select from "@radix-ui/react-select";
import { Link } from "@tanstack/react-location";
import { ColorMode, useTheme } from "../contexts/themeContext";

export default function AppHeader() {
  return (
    <header className="h-14 w-full border-b border-gray-100 dark:border-gray-700 flex items-center gap-6 px-6">
      <Link to="/dashboard" className="text-xl font-medium">
        Astronote
      </Link>
      <nav className="flex-1 flex items-center justify-end gap-4">
        <button className="hover:ring-1 hover:bg-gray-50 dark:hover:bg-gray-800 ring-gray-100 dark:ring-gray-700 rounded-md h-10 w-10 flex items-center justify-centerp justify-center">
          <MdMoreHoriz className="text-2xl" />
        </button>
        <PersonButton />
      </nav>
    </header>
  );
}
// <button className="hover:ring-1 hover:bg-gray-50 dark:hover:bg-gray-800 ring-gray-100 dark:ring-gray-700 rounded-md px-2 h-10 flex items-center justify-centerp gap-2">
//   <div className="w-7 h-7 rounded-full overflow-hidden relative flex items-center justify-center bg-primary-300 text-gray-900">
//     <MdPerson className="text-2xl" />
//   </div>
//   <p>Rohid's Workspace</p>
//   <MdExpandMore className="text-xl" />
// </button>

const PersonButton = () => {
  const buttonElement = useMemo(
    () => (
      <button className="hover:ring-1 hover:bg-gray-50 dark:hover:bg-gray-800 ring-gray-100 dark:ring-gray-700 rounded-md h-10 w-10 flex items-center justify-centerp justify-center">
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
          className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl rounded-lg overflow-hidden p-1 w-64"
        >
          <DM.Item asChild>
            <button className="rounded-md w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-4 outline-none focus:bg-gray-100 dark:focus:bg-gray-700">
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
            <button className="rounded-md w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 outline-none focus:bg-gray-100 dark:focus:bg-gray-700">
              <MdSettings className="text-xl" />
              <p className="flex-1 truncate">Settings</p>
            </button>
          </DM.Item>
          <DM.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-2" />
          <div className="rounded-md w-full text-left px-4 py-2 flex items-center gap-2 outline-none">
            <MdFilterBAndW className="text-xl" />
            <p className="flex-1 truncate">Theme</p>
            <DM.Item asChild>
              <ThemeSwitch />
            </DM.Item>
          </div>
          <DM.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-2" />
          <DM.Group>
            <DM.Item asChild>
              <button className="rounded-md w-full text-left px-4 py-2 hover:bg-red-500/10 flex items-center gap-2 outline-none focus:bg-red-500/10 hover:text-red-500 focus:text-red-500">
                <MdLogout className="text-xl" />
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
      <Select.Trigger className="outline-none gap-2 px-2 rounded-md py-1 flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 border border-gray-100 dark:border-gray-700">
        <Select.Icon asChild>
          {mode === ColorMode.Auto ? (
            <MdLaptop className="text-xl" />
          ) : mode === ColorMode.Light ? (
            <MdLightMode className="text-xl" />
          ) : (
            <MdDarkMode className="text-xl" />
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
        <Select.Content className="bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-100 dark:border-gray-700 shadow-xl">
          <Select.Viewport>
            <Select.Item value="auto" asChild>
              <button className="outline-none gap-2 px-2 rounded-md py-1 flex items-center w-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700">
                <MdLaptop className="text-xl" />
                <Select.ItemText>Auto</Select.ItemText>
                <Select.ItemIndicator>
                  <MdCheck className="text-lg" />
                </Select.ItemIndicator>
              </button>
            </Select.Item>
            <Select.Item value="light" asChild>
              <button className="outline-none gap-2 px-2 rounded-md py-1 flex items-center w-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700">
                <MdLightMode className="text-xl" />
                <Select.ItemText>Light</Select.ItemText>
                <Select.ItemIndicator>
                  <MdCheck className="text-lg" />
                </Select.ItemIndicator>
              </button>
            </Select.Item>
            <Select.Item value="dark" asChild>
              <button className="outline-none gap-2 px-2 rounded-md py-1 flex items-center w-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700">
                <MdDarkMode className="text-xl" />
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
