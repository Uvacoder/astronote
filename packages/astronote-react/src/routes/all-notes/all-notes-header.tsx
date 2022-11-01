import { useNavigate } from "@tanstack/react-location";
import { FC, useCallback } from "react";
import { FiPlus, FiMoreHorizontal } from "react-icons/fi";
import IconButton from "../../components/common/button/icon-button";
import PageHeader from "../../components/page-header";
import useNotes from "../../store/useNotes";
import getNotePath from "../../utils/getNotePath";

export interface AllNotesHeaderProps {
  workspaceId: string;
}

const AllNotesHeader: FC<AllNotesHeaderProps> = (props) => {
  const { workspaceId } = props;
  const createNote = useNotes((state) => state.createNote);
  const navigate = useNavigate();

  const handleCreateNote = useCallback(async () => {
    const note = await createNote({
      workspaceId,
    });
    navigate({
      to: getNotePath(note),
    });
  }, [createNote, workspaceId, navigate]);

  return (
    <PageHeader
      activeId="all"
      broadCrumbs={[
        {
          id: "all",
          to: "",
          label: "All Notes",
        },
      ]}
    >
      <IconButton onClick={handleCreateNote}>
        <FiPlus />
      </IconButton>
      <IconButton>
        <FiMoreHorizontal />
      </IconButton>
    </PageHeader>
  );
};

export default AllNotesHeader;
