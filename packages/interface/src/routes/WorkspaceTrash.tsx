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
        <button className="hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-xl w-8 h-8 rounded-md">
          <FiMoreHorizontal />
        </button>
      </PageHeader>
    </div>
  );
};

export default WorkspaceTrash;
