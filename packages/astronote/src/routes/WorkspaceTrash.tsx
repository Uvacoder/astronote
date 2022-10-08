import { FiMoreHorizontal } from "react-icons/fi";
import PageHeader from "../components/PageHeader";

const WorkspaceTrash = () => {
  return (
    <div className="flex-1">
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
        <button className="flex h-8 w-8 items-center justify-center rounded-md text-xl hover:bg-gray-100 dark:hover:bg-gray-800">
          <FiMoreHorizontal />
        </button>
      </PageHeader>
    </div>
  );
};

export default WorkspaceTrash;
