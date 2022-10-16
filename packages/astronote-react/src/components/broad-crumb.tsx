import { Link } from "@tanstack/react-location";
import { FC, Fragment } from "react";
import { FiChevronRight } from "react-icons/fi";
import iBroadCrumb from "../types/broadCrumb";

export interface BroadCrumb {
  items: iBroadCrumb[];
  activeId: string;
}

const BroadCrumb: FC<BroadCrumb> = (props) => {
  const { items, activeId } = props;
  return (
    <div className="flex flex-1 items-center overflow-hidden">
      {items.map((item, i) => (
        <Fragment key={item.to}>
          {i !== 0 && (
            <FiChevronRight className="text-gray-500 dark:text-gray-400" />
          )}
          {item.id === activeId ? (
            <p className="flex-1 truncate px-2 py-0.5">{item.label}</p>
          ) : (
            <Link
              to={item.to}
              className="flex truncate rounded px-2 py-0.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
            >
              {item.label}
            </Link>
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default BroadCrumb;
