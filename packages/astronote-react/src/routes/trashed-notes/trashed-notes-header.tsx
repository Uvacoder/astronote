import { FC } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import IconButton from "../../components/common/button/icon-button";
import PageHeader from "../../components/page-header";

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
      <IconButton>
        <FiMoreHorizontal />
      </IconButton>
    </PageHeader>
  );
};

export default TrashedNotesHeader;
