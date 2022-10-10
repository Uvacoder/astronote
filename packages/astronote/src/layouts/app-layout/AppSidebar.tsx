import { Link } from "@tanstack/react-location";
import {
  MdAdd,
  MdCheck,
  MdExpandMore,
  MdFilterBAndW,
  MdPerson,
  MdSettings,
} from "react-icons/md";
import * as DM from "@radix-ui/react-dropdown-menu";
import * as Avatar from "@radix-ui/react-avatar";
import * as Select from "@radix-ui/react-select";
import color from "color";
import { useMemo } from "react";
import { useTheme, ColorMode } from "../../contexts/themeContext";
import { FiLogOut, FiMoon, FiSettings, FiSun, FiTablet } from "react-icons/fi";
import CreateWorkspaceDialog from "../../components/CreateWorkspaceDialog";
import getSortName from "../../utils/getSortName";
import useWroksapces from "../../store/useWorkspaces";

export default function AppSidebar() {
  const workspaces = useWroksapces((state) => state.workspaces);

  return (
    <aside className="flex h-full flex-col items-center overflow-y-auto border-r border-gray-100 p-3 dark:border-gray-800">
      <nav className="flex flex-col items-center gap-3">
        {workspaces.map((item) => (
          <Link
            key={item.id}
            to={item.id}
            className="flex h-10 w-10 items-center justify-center rounded-3xl bg-gray-900 text-lg font-medium text-white transition-all duration-150 ease-in-out hover:rounded-xl dark:bg-white dark:text-gray-900"
            getActiveProps={() => ({
              className:
                "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 ring-gray-900 dark:ring-white",
            })}
            style={{
              backgroundColor: item.color ? color(item.color).hex() : undefined,
              color: item.color
                ? color(item.color).isDark()
                  ? "#fff"
                  : "#000"
                : undefined,
            }}
          >
            {item.emoji ? (
              <span className="text-2xl">{item.emoji}</span>
            ) : (
              getSortName(item.name)
            )}
          </Link>
        ))}
        <CreateWorkspaceDialog>
          <button className="flex h-10 w-10 items-center justify-center rounded-3xl bg-gray-100 text-2xl text-gray-900 transition-all ease-in-out hover:rounded-xl hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-700">
            <MdAdd />
          </button>
        </CreateWorkspaceDialog>
        <button className="flex h-10 w-10 items-center justify-center rounded-3xl bg-gray-100 text-2xl text-gray-900 transition-all ease-in-out hover:rounded-xl hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-700">
          <MdSettings />
        </button>
      </nav>
    </aside>
  );
}

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
          align="start"
          side="top"
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
