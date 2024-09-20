import { ReactElement, useState } from 'react';

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
    max?: number;
    help?: ReactElement;
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
    max,
    help,
}: IProps) => {
    const [showHelp, setShowHelp] = useState(false);

    let base =
        'w-full px-4 py-3  bg-white text-base text-black rounded disabled:bg-opacity-40 disabled:cursor-not-allowed focus:shadow-gray-100 focus:outline-none focus:border focus:border-neutral-200';

    if (extraClass) {
        base += ` ${extraClass}`;
    }
    if (error) {
        base += ' border-2 border-red-500';
    }

    return (
        <div className="flex flex-col">
            <div className="relative w-full">
                {help && (
                    <div className="flex flex-col gap-1 mb-2">
                        <div className=" flex">
                            {!showHelp && (
                                <svg
                                    onClick={() => setShowHelp(true)}
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="fill-gray-400 hover:cursor-pointer hover:scale-110"
                                    height="20"
                                    viewBox="0 -960 960 960"
                                    width="20"
                                >
                                    <path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                                </svg>
                            )}
                            {showHelp && (
                                <svg
                                    className="fill-gray-400 hover:cursor-pointer hover:scale-110"
                                    onClick={() => setShowHelp(false)}
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="20"
                                    viewBox="0 -960 960 960"
                                    width="20"
                                >
                                    <path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                                </svg>
                            )}
                        </div>

                        {showHelp && help}
                    </div>
                )}
                <input
                    max={max}
                    ref={ref}
                    disabled={disabled}
                    autoComplete={autoComplete ? autoComplete : ''}
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
                <div className="text-left mt-3 bg-red-500 text-red-100 rounded px-2 py-1 text-[12px]">{error}</div>
            )}
        </div>
    );
};

export default Input;
