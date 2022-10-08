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
            "text-gray-600 dark:text-gray-300 mb-2 inline-block",
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
          "w-full h-10 rounded-md border border-gray-200 dark:border-gray-700 px-4 bg-transparent focus:bg-white dark:focus:bg-gray-900 bg-gray-100 dark:bg-gray-800 outline-none focus:ring-4 ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500",
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
            "text-red-500 dark:text-red-400 text-sm mt-1",
            errorTextClassName
          )}
        >
          {errorText}
        </p>
      ) : !!hintText ? (
        <p
          className={clsx(
            "text-gray-500 dark:text-gray-400 text-sm mt-1",
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
