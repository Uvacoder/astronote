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
    <header className="h-12 border-b border-gray-100 dark:border-gray-800 flex px-4 items-center gap-2">
      <div className="flex-1 flex items-center gap-4 overflow-hidden">
        <BroadCrumb items={broadCrumbs} activeId={activeId} />
      </div>
      {children}
    </header>
  );
};

export default PageHeader;
