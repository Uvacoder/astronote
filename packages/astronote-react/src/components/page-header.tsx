import clsx from "clsx";
import { FC, ReactNode } from "react";
import { FiSidebar } from "react-icons/fi";
import useApp from "../store/useApp";
import iBroadCrumb from "../types/broadCrumb";
import BroadCrumb from "./broad-crumb";
import IconButton from "./common/button/icon-button";

export interface PageHeaderProps {
  broadCrumbs: iBroadCrumb[];
  activeId: string;
  children?: ReactNode;
}
const PageHeader: FC<PageHeaderProps> = (props) => {
  const { broadCrumbs, activeId, children } = props;
  const sidebarHidden = useApp((state) => state.sidebarHidden);
  const toggleSidebarHidden = useApp((state) => state.toggleSidebarHidden);
  return (
    <header className="sticky top-0 z-20 flex h-12 items-center border-b border-gray-100 bg-white px-2 dark:border-gray-800 dark:bg-gray-900">
      <div
        className={clsx("transition-all duration-300", {
          "md:w-0": !sidebarHidden,
          "w-8 md:mr-2": sidebarHidden,
        })}
      >
        <IconButton
          onClick={toggleSidebarHidden}
          className={clsx("transition-transform duration-300", {
            "md:-translate-x-12": !sidebarHidden,
            "translate-x-0": sidebarHidden,
          })}
        >
          <FiSidebar />
        </IconButton>
      </div>
      <div className="flex flex-1 items-center gap-2 overflow-hidden">
        <BroadCrumb items={broadCrumbs} activeId={activeId} />
        {children}
      </div>
    </header>
  );
};

export default PageHeader;
