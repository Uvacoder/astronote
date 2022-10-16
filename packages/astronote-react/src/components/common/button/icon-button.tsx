import clsx from "clsx";
import { forwardRef } from "react";
import ButtonBase, { ButtonBaseProps } from "./button-base";

export interface IconButtonProps extends ButtonBaseProps {}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (props, ref) => {
    const { children, className, size = "medium", ...rest } = props;
    return (
      <ButtonBase
        {...rest}
        className={clsx(
          "flex items-center justify-center",
          {
            "h-6 w-6 rounded text-lg": size === "small",
            "h-8 w-8 rounded-md text-xl": size === "medium",
            "h-10 w-10 rounded-lg text-2xl": size === "large",
          },
          className
        )}
        ref={ref}
      >
        {children}
      </ButtonBase>
    );
  }
);

export default IconButton;
