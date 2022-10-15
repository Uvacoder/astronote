import { FC } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import IconButton from "../../components/icon-button";
import PageHeader from "../../components/PageHeader";

export interface TrashedNotesHeaderProps {
  workspaceId: string;
}

const TrashedNotesHeader: FC<TrashedNotesHeaderProps> = ({ workspaceId }) => {
  return (
    <PageHeader
      activeId="trash"
      broadCrumbs={[
        {
          id: "trash",
          to: "",
          label: "Trash",
        },
      ]}
    >
      <IconButton className="cursor-default">
        <FiMoreHorizontal />
      </IconButton>
    </PageHeader>
  );
};

export default TrashedNotesHeader;
