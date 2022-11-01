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
          "disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600 dark:disabled:bg-gray-700 dark:disabled:text-gray-400",
          {
            "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50":
              colorScheme === "default",
            "bg-primary-500 hover:bg-primary-600 text-white":
              colorScheme === "primary",
            "bg-red-500 text-white hover:bg-red-600": colorScheme === "danger",
            "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700":
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
