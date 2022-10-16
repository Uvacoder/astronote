import clsx from "clsx";
import { DetailedHTMLProps, forwardRef, useMemo } from "react";
import LoadingSpinner from "../../loading-spinner";

export interface ButtonBaseProps
  extends DetailedHTMLProps<
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
  loading?: boolean;
}

const ButtonBase = forwardRef<HTMLButtonElement, ButtonBaseProps>(
  (props, ref) => {
    const {
      size = "medium",
      colorScheme = "default",
      className,
      ref: r,
      disabled,
      loading,
      children,
      ...rest
    } = props;
    const isDisabled = useMemo(() => disabled || loading, [disabled, loading]);

    return (
      <button
        {...rest}
        disabled={isDisabled}
        className={clsx(
          "cursor-default disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600 dark:disabled:bg-gray-700 dark:disabled:text-gray-400",
          {
            "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50":
              colorScheme === "default",
            "bg-primary-500 dark:bg-primary-400 text-gray-50 active:opacity-80 dark:text-gray-900":
              colorScheme === "primary",
            "bg-red-500 text-gray-50 active:opacity-80 dark:bg-red-400 dark:text-gray-900":
              colorScheme === "danger",
            "bg-gray-100 active:opacity-80 dark:bg-gray-800":
              colorScheme === "secondary",
          },
          className
        )}
        ref={ref}
      >
        {loading ? <LoadingSpinner /> : children}
      </button>
    );
  }
);

export default ButtonBase;
