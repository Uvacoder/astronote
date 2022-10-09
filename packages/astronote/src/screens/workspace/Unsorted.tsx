import { FiPlus, FiMoreHorizontal } from "react-icons/fi";
import PageHeader from "../../components/PageHeader";

export default function UnsortedScreen() {
  return (
    <div className="h-full w-full">
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
        <button className="flex h-8 w-8 items-center justify-center rounded-md text-xl hover:bg-gray-100 dark:hover:bg-gray-800">
          <FiPlus />
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-md text-xl hover:bg-gray-100 dark:hover:bg-gray-800">
          <FiMoreHorizontal />
        </button>
      </PageHeader>
    </div>
  );
}