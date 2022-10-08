import { FiPlus, FiMoreHorizontal } from "react-icons/fi";
import PageHeader from "../components/PageHeader";

const WorkspaceUnsorted = () => {
  return (
    <div className="flex-1">
      <PageHeader
        activeId="unsorted"
        broadCrumbs={[
          {
            id: "unsorted",
            to: "",
            label: "Unsorted",
          },
        ]}
      >
        <button className="hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-xl w-8 h-8 rounded-md">
          <FiPlus />
        </button>
        <button className="hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-xl w-8 h-8 rounded-md">
          <FiMoreHorizontal />
        </button>
      </PageHeader>
    </div>
  );
};

export default WorkspaceUnsorted;
