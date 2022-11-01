import { useNavigate } from "@tanstack/react-location";
import clsx from "clsx";
import { FC, useCallback } from "react";
import { FiEdit, FiSearch } from "react-icons/fi";
import ButtonBase from "../../components/common/button/button-base";
import IconButton from "../../components/common/button/icon-button";
import useApp from "../../store/useApp";
import useNotes from "../../store/useNotes";
import Workspcae from "../../types/workspace";
import getNotePath from "../../utils/getNotePath";
import MainMenu from "./main-menu";
import Notebooks from "./notebooks";
import PinnedNotes from "./pinned-notes";
import WorkspaceSidebarHeader from "./workspace-sidebar-header";

interface WorkspaceSidebarProps {
  workspace: Workspcae;
}

const WorkspaceSidebar: FC<WorkspaceSidebarProps> = ({ workspace }) => {
  const createNote = useNotes((state) => state.createNote);
  const navigate = useNavigate();
  const sidebarHidden = useApp((state) => state.sidebarHidden);
  const setSidebarHidden = useApp((state) => state.setSidebarHidden);
  const handleCreateQucikNote = useCallback(async () => {
    const note = await createNote({
      workspaceId: workspace.id,
    });
    navigate({
      to: getNotePath(note),
    });
  }, [createNote, workspace, navigate]);

  return (
    <>
      <div
        className={clsx(
          "absolute inset-0 z-30 transition-all duration-300 md:pointer-events-none md:bg-transparent",
          {
            "bg-black/50": !sidebarHidden,
            "pointer-events-none bg-black/0": sidebarHidden,
          }
        )}
        onClick={() => setSidebarHidden(true)}
      ></div>
      <aside
        className={clsx(
          "workspace-sidebar absolute left-0 top-0 bottom-0 z-30 flex h-full w-72 flex-col border-r border-gray-100 bg-white transition-transform duration-300 dark:border-gray-800 dark:bg-gray-900",
          {
            "-translate-x-72": sidebarHidden,
          }
        )}
      >
        <WorkspaceSidebarHeader workspace={workspace} />
        <div className="flex-1 space-y-6 overflow-y-auto py-6">
          <div className="flex items-center gap-2 px-2">
            <ButtonBase
              className="flex h-8 flex-1 items-center justify-center gap-4 rounded-md border border-gray-100 px-4 dark:border-gray-800"
              onClick={handleCreateQucikNote}
            >
              <FiEdit className="text-xl" />
              <p>Quick Note</p>
            </ButtonBase>
            <IconButton className="border border-gray-100 dark:border-gray-800">
              <FiSearch />
            </IconButton>
          </div>
          <MainMenu workspaceId={workspace.id} />
          <PinnedNotes workspaceId={workspace.id} />
          <Notebooks workspaceId={workspace.id} />
        </div>
      </aside>
    </>
  );
};

export default WorkspaceSidebar;
