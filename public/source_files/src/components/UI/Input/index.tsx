interface IProps {
  placeholder: string;
  type: string;
  value?: any;
  name: string;
  id: string;
  autoComplete?: string;
  extraClass?: string;
  accept?: string;
  onChange?: any;
  onBlur?: any;
  showPassword?: boolean;
  endIcon?: any;
  startIcon?: any;
  error?: string | false;
  webbie?: boolean;
  onKeyUp?: any;
  handleEndIconClick?: () => void;
  formikProps?: any;
  disabled: boolean;
  ref?: any;
}
const Input = ({
  accept,
  onChange,
  onBlur,
  placeholder,
  autoComplete,
  type,
  name,
  id,
  extraClass,
  value,
  endIcon,
  error,
  handleEndIconClick,
  onKeyUp,
  formikProps,
  disabled,
  ref,
}: IProps) => {
  let base =
    "w-full p-4  bg-white text-base color-typing placeholder-core-grey-60 rounded disabled:opacity-40 disabled:cursor-not-allowed focus:outline-[#3DA2FF]";

  if (extraClass) {
    base += ` ${extraClass}`;
  }
  if (error) {
    base += " form-error-border red-bad";
  }

  return (
    <div className={`flex flex-col`}>
      <div className="relative w-full">
        <input
          ref={ref}
          disabled={disabled}
          autoComplete={autoComplete ? autoComplete : ""}
          name={name}
          id={id}
          value={value}
          type={type}
          placeholder={placeholder}
          className={base}
          onChange={onChange}
          accept={accept}
          onKeyUp={onKeyUp}
          onBlur={onBlur}
          {...formikProps}
        />

        {!!endIcon && (
          <div
            onClick={handleEndIconClick}
            className="pr-4 absolute right-[1px] top-4 bottom-0 color-core-black-2"
          >
            {endIcon}
          </div>
        )}
      </div>

      {error && (
        <div className="text-sm form-error-message text-left mb-4">{error}</div>
      )}
    </div>
  );
};

export default Input;
