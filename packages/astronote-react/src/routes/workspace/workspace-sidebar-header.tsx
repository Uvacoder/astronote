import Color from "color";
import { FC, useEffect } from "react";
import { Platform, usePlatform } from "@an/core";
import { FiChevronDown, FiSettings, FiSidebar } from "react-icons/fi";
import ButtonBase from "../../components/common/button/button-base";
import IconButton from "../../components/common/button/icon-button";
import Workspcae from "../../types/workspace";
import getSortName from "../../utils/getSortName";
import useApp from "../../store/useApp";
export interface WorkspaceSidebarHeaderProps {
  workspace: Workspcae;
}

const WorkspaceSidebarHeader: FC<WorkspaceSidebarHeaderProps> = (props) => {
  const { workspace } = props;
  const toggleSidebarHidden = useApp((state) => state.toggleSidebarHidden);
  const setSidebarHidden = useApp((state) => state.setSidebarHidden);
  const { platform } = usePlatform();

  useEffect(() => {
    const onWindowResize = () => {
      const width = window.innerWidth;

      if (width < 768) {
        setSidebarHidden(true);
      } else {
        setSidebarHidden(false);
      }
    };

    window.addEventListener("resize", onWindowResize);

    onWindowResize();

    return () => {
      window.removeEventListener("resize", onWindowResize);
    };
  }, [setSidebarHidden]);

  return (
    <header className="sticky top-0 z-20 flex h-12 w-full items-center">
      {platform === Platform.Electron && <div className="h-full w-20" />}
      <div className="flex h-full flex-1 items-center gap-2 overflow-hidden px-2">
        <ButtonBase className="flex h-8 flex-1 items-center gap-2 overflow-hidden rounded-md px-1.5 text-left">
          <div
            className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700"
            style={{
              backgroundColor: workspace.color || undefined,
              color: workspace.color
                ? Color(workspace.color).isDark()
                  ? "#fff"
                  : "#000"
                : undefined,
            }}
          >
            {workspace.emoji ? (
              <span className="mr-2 text-xl">{workspace.emoji}</span>
            ) : (
              getSortName(workspace.name)
            )}
          </div>
          <p className="flex-1 truncate">{workspace.name}</p>
          <FiChevronDown />
        </ButtonBase>
        <IconButton onClick={toggleSidebarHidden}>
          <FiSidebar />
        </IconButton>
      </div>
    </header>
  );
};

export default WorkspaceSidebarHeader;
