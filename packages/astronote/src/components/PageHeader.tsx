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
    <header className="flex h-12 items-center gap-2 border-b border-gray-100 px-4 dark:border-gray-800">
      <div className="flex flex-1 items-center gap-4 overflow-hidden">
        <BroadCrumb items={broadCrumbs} activeId={activeId} />
      </div>
      {children}
    </header>
  );
};

export default PageHeader;
