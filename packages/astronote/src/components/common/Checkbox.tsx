import clsx from "clsx";
import {
  DetailedHTMLProps,
  forwardRef,
  InputHTMLAttributes,
  useId,
} from "react";

export interface CheckboxProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  errorText?: string;
  hintText?: string;
  label?: string;
  labelClassName?: string;
  containerClassName?: string;
  hintTextClassName?: string;
  errorTextClassName?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>((props, ref) => {
  const {
    className,
    errorText,
    hintText,
    label,
    labelClassName,
    containerClassName,
    hintTextClassName,
    errorTextClassName,
    ...rest
  } = props;
  const id = useId();
  return (
    <div className={clsx("mb-4", containerClassName)}>
      <div>
        <input
          id={id}
          {...rest}
          ref={ref}
          type="checkbox"
          className={clsx("mr-2 cursor-pointer", className)}
        />
        {!!label && (
          <label
            htmlFor={id}
            className={clsx("text-gray-600 dark:text-gray-300", labelClassName)}
          >
            {label}
          </label>
        )}
      </div>
      {!!errorText ? (
        <p
          className={clsx(
            "mt-1 text-sm text-red-500 dark:text-red-400",
            errorTextClassName
          )}
        >
          {errorText}
        </p>
      ) : !!hintText ? (
        <p
          className={clsx(
            "mt-1 text-sm text-gray-500 dark:text-gray-400",
            hintTextClassName
          )}
        >
          {hintText}
        </p>
      ) : null}
    </div>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;
