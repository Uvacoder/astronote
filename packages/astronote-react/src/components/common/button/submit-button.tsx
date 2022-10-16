import clsx from "clsx";
import { DetailedHTMLProps, ButtonHTMLAttributes, forwardRef } from "react";
import ButtonBase from "./button-base";

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
      <ButtonBase
        {...rest}
        ref={ref}
        type="submit"
        className={clsx(
          "mt-6 mb-4 flex h-10 items-center justify-center rounded-md px-4",
          {
            "cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500":
              disabled,
            "bg-indigo-500 text-white hover:bg-indigo-600 dark:hover:bg-indigo-400":
              !disabled,
          },
          className
        )}
        disabled={loading || disabled}
      >
        {loading ? "Loading..." : children}
      </ButtonBase>
    );
  }
);

SubmitButton.displayName = "SubmitButton";

export default SubmitButton;
