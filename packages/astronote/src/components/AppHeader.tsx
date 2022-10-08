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
    <header className="flex h-14 w-full items-center gap-6 border-b border-gray-100 px-6 dark:border-gray-700">
      <Link to="/dashboard" className="text-xl font-medium">
        Astronote
      </Link>
      <nav className="flex flex-1 items-center justify-end gap-4">
        <button className="justify-centerp flex h-10 w-10 items-center justify-center rounded-md ring-gray-100 hover:bg-gray-50 hover:ring-1 dark:ring-gray-700 dark:hover:bg-gray-800">
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
      <button className="justify-centerp flex h-10 w-10 items-center justify-center rounded-md ring-gray-100 hover:bg-gray-50 hover:ring-1 dark:ring-gray-700 dark:hover:bg-gray-800">
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
          className="w-64 overflow-hidden rounded-lg border border-gray-100 bg-white p-1 shadow-xl dark:border-gray-700 dark:bg-gray-800"
        >
          <DM.Item asChild>
            <button className="flex w-full items-center gap-4 rounded-md px-4 py-2 text-left outline-none hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-700 dark:focus:bg-gray-700">
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
            <button className="flex w-full items-center gap-2 rounded-md px-4 py-2 text-left outline-none hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-700 dark:focus:bg-gray-700">
              <MdSettings className="text-xl" />
              <p className="flex-1 truncate">Settings</p>
            </button>
          </DM.Item>
          <DM.Separator className="my-2 h-px bg-gray-200 dark:bg-gray-700" />
          <div className="flex w-full items-center gap-2 rounded-md px-4 py-2 text-left outline-none">
            <MdFilterBAndW className="text-xl" />
            <p className="flex-1 truncate">Theme</p>
            <DM.Item asChild>
              <ThemeSwitch />
            </DM.Item>
          </div>
          <DM.Separator className="my-2 h-px bg-gray-200 dark:bg-gray-700" />
          <DM.Group>
            <DM.Item asChild>
              <button className="flex w-full items-center gap-2 rounded-md px-4 py-2 text-left outline-none hover:bg-red-500/10 hover:text-red-500 focus:bg-red-500/10 focus:text-red-500">
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
      <Select.Trigger className="flex items-center gap-2 rounded-md border border-gray-100 px-2 py-1 outline-none hover:bg-gray-100 focus:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:bg-gray-700">
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
        <Select.Content className="rounded-lg border border-gray-100 bg-white p-1 shadow-xl dark:border-gray-700 dark:bg-gray-800">
          <Select.Viewport>
            <Select.Item value="auto" asChild>
              <button className="flex w-full items-center gap-2 rounded-md px-2 py-1 outline-none hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                <MdLaptop className="text-xl" />
                <Select.ItemText>Auto</Select.ItemText>
                <Select.ItemIndicator>
                  <MdCheck className="text-lg" />
                </Select.ItemIndicator>
              </button>
            </Select.Item>
            <Select.Item value="light" asChild>
              <button className="flex w-full items-center gap-2 rounded-md px-2 py-1 outline-none hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                <MdLightMode className="text-xl" />
                <Select.ItemText>Light</Select.ItemText>
                <Select.ItemIndicator>
                  <MdCheck className="text-lg" />
                </Select.ItemIndicator>
              </button>
            </Select.Item>
            <Select.Item value="dark" asChild>
              <button className="flex w-full items-center gap-2 rounded-md px-2 py-1 outline-none hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-700 dark:focus:bg-gray-700">
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
