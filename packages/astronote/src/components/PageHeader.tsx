import { FC, ReactNode } from "react";
import iBroadCrumb from "../types/broadCrumb";
import BroadCrumb from "./BroadCrumb";

export interface PageHeaderProps {
  broadCrumbs: iBroadCrumb[];
  activeId: string;
  children?: ReactNode;
}
const PageHeader: FC<PageHeaderProps> = (props) => {
  const { broadCrumbs, activeId, children } = props;

  return (
    <header className="sticky top-0 z-20 flex h-12 items-center gap-2 border-b border-gray-100 bg-white px-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-1 items-center gap-4 overflow-hidden">
        <BroadCrumb items={broadCrumbs} activeId={activeId} />
      </div>
      {children}
    </header>
  );
};

export default PageHeader;
