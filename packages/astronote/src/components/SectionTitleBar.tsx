import { FC, PropsWithChildren } from "react";

const SectionTitleBar: FC<PropsWithChildren<{ title: string }>> = (props) => {
  return (
    <div className="mb-2 flex items-center gap-2 px-4">
      <p className="flex-1 truncate text-gray-500 dark:text-gray-400">
        {props.title}
      </p>
      {props.children}
    </div>
  );
};
export default SectionTitleBar;
