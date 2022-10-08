import clsx from "clsx";
import { DetailedHTMLProps, ButtonHTMLAttributes, forwardRef } from "react";

export interface SubmitButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  loading?: boolean;
}

const SubmitButton = forwardRef<HTMLButtonElement, SubmitButtonProps>(
  (props, ref) => {
    const { children, className, loading, disabled, ...rest } = props;

    return (
      <button
        {...rest}
        ref={ref}
        type="submit"
        className={clsx(
          "px-4 h-10 rounded-md flex items-center justify-center mt-6 mb-4",
          {
            "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed":
              disabled,
            "bg-indigo-500 hover:bg-indigo-600 dark:hover:bg-indigo-400 text-white":
              !disabled,
          },
          className
        )}
        disabled={loading || disabled}
      >
        {loading ? "Loading..." : children}
      </button>
    );
  }
);

SubmitButton.displayName = "SubmitButton";

export default SubmitButton;
