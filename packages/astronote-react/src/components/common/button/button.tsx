import clsx from "clsx";
import { forwardRef } from "react";
import ButtonBase, { ButtonBaseProps } from "./button-base";

export interface ButtonProps extends ButtonBaseProps {
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    className,
    ref: r,
    size = "medium",
    fullWidth,
    children,
    ...rest
  } = props;

  return (
    <ButtonBase
      {...rest}
      ref={ref}
      size={size}
      className={clsx(
        "flex items-center gap-2 text-left",
        {
          "h-8 rounded px-3": size === "small",
          "h-10 rounded-md px-4": size === "medium",
          "h-12 rounded-lg px-6": size === "large",
          "w-full justify-center text-center": fullWidth,
        },
        className
      )}
    >
      <p
        className={clsx("flex-1 truncate", {
          "text-sm font-light": size === "small",
          "font-medium": size === "medium",
          "text-lg font-medium": size === "large",
        })}
      >
        {children}
      </p>
    </ButtonBase>
  );
});

export default Button;
