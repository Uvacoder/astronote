import { FC, forwardRef, Fragment, ReactNode } from "react";
import * as CM from "@radix-ui/react-context-menu";
import { FiChevronRight } from "react-icons/fi";
import clsx from "clsx";

export type MenuButtonItem = {
  type: "button";
  label: string;
  onClick?: () => void;
};
export type MenuSeparator = {
  type: "separator";
};
export type MenuLabel = {
  type: "label";
  label: string;
};
export type MenuGroup = {
  type: "group";
  items: MenuItem[];
};
export type MenuSub = {
  type: "sub";
  label: string;
  items: MenuItem[];
};

export type MenuItem =
  | MenuButtonItem
  | MenuSeparator
  | MenuLabel
  | MenuGroup
  | MenuSub;

export interface ContextMenuWrapperProps {
  children: ReactNode;
  items: MenuItem[];
}

export const ContextMenu: FC<ContextMenuWrapperProps> = (props) => {
  const { children, items } = props;
  return (
    <CM.Root>
      <CM.Trigger asChild>{children}</CM.Trigger>
      <CM.Portal>
        <CM.Content className="min-w-[120px] max-w-xs rounded-lg border border-gray-200 bg-white p-1.5 shadow-2xl shadow-black/50 dark:border-gray-700 dark:bg-gray-900">
          <ContextMenuItems items={items} />
        </CM.Content>
      </CM.Portal>
    </CM.Root>
  );
};

export default ContextMenu;

export const ContextMenuItems: FC<{
  items: MenuItem[];
}> = (props) => {
  const { items } = props;

  return (
    <Fragment>
      {items.map((item, i) => {
        switch (item.type) {
          case "button":
            return <ContextMenuButton key={i} {...item} />;
          case "separator":
            return <ContextMenuSeparator key={i} {...item} />;
          case "group":
            return <ContextMenuGroup key={i} {...item} />;
          case "label":
            return <ContextMenuLabel key={i} {...item} />;
          case "sub":
            return <ContextMenuSub key={i} {...item} />;
        }
      })}
    </Fragment>
  );
};

export const ContextMenuSub: FC<MenuSub> = (props) => {
  const { items, label } = props;
  return (
    <CM.Sub>
      <CM.SubTrigger asChild>
        <ItemButton label={label}>
          <FiChevronRight className="text-lg" />
        </ItemButton>
      </CM.SubTrigger>
      <CM.SubContent className="min-w-[120px] max-w-xs rounded-lg border border-gray-200 bg-white p-1.5 shadow-2xl shadow-black/50 dark:border-gray-700 dark:bg-gray-900">
        <ContextMenuItems items={items} />
      </CM.SubContent>
    </CM.Sub>
  );
};

export const ContextMenuGroup: FC<MenuGroup> = (props) => {
  const { items } = props;
  return (
    <CM.Group>
      <ContextMenuItems items={items} />
    </CM.Group>
  );
};

export const ContextMenuSeparator: FC<MenuSeparator> = (props) => (
  <CM.Separator className="my-2 h-px w-full bg-gray-200 dark:bg-gray-700" />
);

export const ContextMenuButton: FC<MenuButtonItem> = (props) => {
  return (
    <CM.Item asChild>
      <ItemButton {...props} />
    </CM.Item>
  );
};

export const ContextMenuLabel: FC<MenuLabel> = (props) => {
  const { label } = props;
  return <CM.Label>{label}</CM.Label>;
};

interface ItemButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  label: string;
}

export const ItemButton = forwardRef<HTMLButtonElement, ItemButtonProps>(
  (props, ref) => {
    const { label, children, className, ...rest } = props;
    return (
      <button
        className={clsx(
          "hover:bg-primary-500 focus:bg-primary-500 dark:hover:bg-primary-400 dark:focus:bg-primary-400 flex h-8 w-full cursor-default items-center rounded px-3 text-left text-gray-600 outline-none hover:text-white focus:text-white dark:text-gray-300 dark:hover:text-black dark:focus:text-black",
          className
        )}
        {...rest}
        ref={ref}
      >
        <p className="flex-1 truncate">{label}</p>
        {children}
      </button>
    );
  }
);
