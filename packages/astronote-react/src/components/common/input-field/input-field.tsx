import clsx from "clsx";
import {
  DetailedHTMLProps,
  forwardRef,
  InputHTMLAttributes,
  useId,
} from "react";

export interface InputProps
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

const InputField = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
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
      {!!label && (
        <label
          htmlFor={id}
          className={clsx(
            "mb-2 inline-block text-gray-600 dark:text-gray-300",
            labelClassName
          )}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        {...rest}
        className={clsx(
          "h-10 w-full rounded-md border border-gray-200 bg-transparent bg-gray-100 px-4 outline-none ring-indigo-500/20 focus:border-indigo-500 focus:bg-white focus:ring-4 dark:border-gray-700 dark:bg-gray-800 dark:focus:border-indigo-500 dark:focus:bg-gray-900",
          {
            "border-red-500 dark:border-red-400": !!errorText,
          },
          className
        )}
        ref={ref}
      />
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

InputField.displayName = "Input";

export default InputField;
