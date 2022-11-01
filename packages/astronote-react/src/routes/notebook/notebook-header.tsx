import { useNavigate } from "@tanstack/react-location";
import { FC, useCallback, useMemo } from "react";
import { FiFilePlus, FiFolderPlus, FiMoreHorizontal } from "react-icons/fi";
import CreateOrUpdateNotebookDialog from "../../components/dialogs/create-or-update-notebook-dialog";
import IconButton from "../../components/common/button/icon-button";
import PageHeader from "../../components/page-header";
import { useDialogs } from "../../contexts/dialogContext";
import useNotebooks from "../../store/useNotebooks";
import useNotes from "../../store/useNotes";
import iBroadCrumb from "../../types/broadCrumb";
import Notebook from "../../types/notebook";
import getNotebookPath from "../../utils/getNotebookPath";
import getNotePath from "../../utils/getNotePath";

export interface NotebookHeaderProps {
  notebook: Notebook;
}

const NotebookHeader: FC<NotebookHeaderProps> = ({ notebook }) => {
  const navigate = useNavigate();
  const allNotebooks = useNotebooks((state) =>
    state.notebooks.filter((item) => item.workspaceId === notebook.workspaceId)
  );
  const createNote = useNotes((state) => state.createNote);
  const dialog = useDialogs();

  const broadCrumbs = useMemo(() => {
    const getParenNotebook = (file: Notebook): iBroadCrumb[] => {
      const parent = allNotebooks.find((item) => item.id === file.parentId);
      return [
        {
          id: file.id,
          label: `${file.emoji ? `${file.emoji} ` : ""}${file.name}`,
          to: getNotebookPath(file),
        },
        ...(!parent
          ? []
          : parent.parentId
          ? getParenNotebook(parent)
          : [
              {
                id: parent.id,
                label: `${parent.emoji ? `${parent.emoji} ` : ""}${
                  parent.name
                }`,
                to: getNotebookPath(parent),
              },
            ]),
      ];
    };
    if (notebook) return getParenNotebook(notebook).reverse();
    else return [];
  }, [allNotebooks, notebook]);

  const handleCreateNote = useCallback(async () => {
    if (!notebook) return;
    const note = await createNote({
      workspaceId: notebook.workspaceId,
      notebookId: notebook.id,
    });
    navigate({
      to: getNotePath(note),
    });
  }, [createNote, notebook, navigate]);

  const handleCreateNotebook = useCallback(() => {
    dialog.showDialog({
      title: "Create Notebook",
      content: (
        <CreateOrUpdateNotebookDialog
          type="create"
          parentId={notebook.id}
          workspaceId={notebook.workspaceId}
        />
      ),
    });
  }, [dialog, notebook]);

  return (
    <PageHeader broadCrumbs={broadCrumbs} activeId={notebook.id}>
      <IconButton onClick={handleCreateNotebook}>
        <FiFolderPlus />
      </IconButton>
      <IconButton onClick={handleCreateNote}>
        <FiFilePlus />
      </IconButton>
      <IconButton>
        <FiMoreHorizontal />
      </IconButton>
    </PageHeader>
  );
};

export default NotebookHeader;
