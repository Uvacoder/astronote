import clsx from "clsx";
import * as React from "react";

export interface ButtonBaseProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  size?: "small" | "medium" | "large";
  colorScheme?:
    | "default"
    | "primary"
    | "secondary"
    | "danger"
    | "warning"
    | "info";
}

const ButtonBase = React.forwardRef<HTMLButtonElement, ButtonBaseProps>(
  (props, ref) => {
    const {
      size = "medium",
      colorScheme = "default",
      className,
      ref: r,
      ...rest
    } = props;
    return (
      <button
        {...rest}
        className={clsx(
          {
            "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50":
              colorScheme === "default",
            "bg-primary-500 dark:bg-primary-400 hover:bg-primary-600 dark:hover:bg-primary-300 text-gray-50 dark:text-gray-900":
              colorScheme === "primary",
          },
          className
        )}
        ref={ref}
      />
    );
  }
);

export default ButtonBase;
