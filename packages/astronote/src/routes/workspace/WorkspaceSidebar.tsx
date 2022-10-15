import { useNavigate } from "@tanstack/react-location";
import { FC, useCallback } from "react";
import { FiEdit, FiSearch } from "react-icons/fi";
import ButtonBase from "../../components/button-base";
import IconButton from "../../components/icon-button";
import useNotes from "../../store/useNotes";
import Workspcae from "../../types/workspace";
import getNotePath from "../../utils/getNotePath";
import MainMenu from "./MainMenu";
import Notebooks from "./Notebooks";
import PinnedNotes from "./PinnedNotes";
import WorkspaceSidebarHeader from "./WorkspaceSidebarHeader";

interface WorkspaceSidebarProps {
  workspace: Workspcae;
}

const WorkspaceSidebar: FC<WorkspaceSidebarProps> = ({ workspace }) => {
  const createNote = useNotes((state) => state.createNote);
  const navigate = useNavigate();

  const handleCreateQucikNote = useCallback(async () => {
    const note = await createNote({
      workspaceId: workspace.id,
    });
    navigate({
      to: getNotePath(note),
    });
  }, [createNote, workspace, navigate]);
  return (
    <aside className="workspace-sidebar flex h-full w-72 flex-col border-r border-gray-100 dark:border-gray-800">
      <WorkspaceSidebarHeader workspace={workspace} />
      <div className="flex-1 space-y-6 overflow-y-auto py-6">
        <div className="flex items-center gap-2 px-2">
          <ButtonBase
            className="flex h-9 flex-1 items-center justify-center gap-4 rounded-md border border-gray-100 px-4 dark:border-gray-800"
            onClick={handleCreateQucikNote}
          >
            <FiEdit className="text-xl" />
            <p>Quick Note</p>
          </ButtonBase>
          <IconButton className="h-9 w-9 border border-gray-100 dark:border-gray-800">
            <FiSearch />
          </IconButton>
        </div>
        <MainMenu />
        <PinnedNotes workspaceId={workspace.id} />
        <Notebooks workspaceId={workspace.id} />
      </div>
    </aside>
  );
};

export default WorkspaceSidebar;
