import { useState } from "react";
import useTranslation from "../../hooks/useTranslation";

interface InputProps {
    label?: string;
    optionalLabel?: string;
    placeholder?: string;
    value: string;
    onChange?: (value: string) => void;
    info?: string;
    inverse?: boolean;
    validation?: string | ((value: string) => boolean);
    validationMessage?: string;
    copy?: boolean;
    required?: boolean;
    className?: string;
    clearable?: boolean;
    readOnly?: boolean;
    copyValueOverride?: string;
    action?: true | (() => void);
    max?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  optionalLabel,
  placeholder,
  value,
  onChange,
  required = false,
  info,
  inverse,
  validation,
  validationMessage,
  copy,
  className = '',
  clearable = false,
  readOnly = false,
  copyValueOverride,
  action = false,
  max = '',
}) => {
    const { t } = useTranslation();
    const [valid, setValid] = useState<boolean | null>(null);
    const [copied, setCopied] = useState(false);

    const handleValidate = (value: string)  => {
        if (validation) {
            if (required === false && value.length === 0) {
                setValid(true);
                return;
            }

            if (typeof validation === 'function') {
                return setValid(validation(value));
            }

            const invalid = new RegExp(validation, 'gmi').test(value.toString());
            setValid(invalid);
        }
    }

    const handleOnBlur = (evt: React.FocusEvent<HTMLInputElement>) => {
        handleValidate(evt.target.value);
    }

    const copyToClipboard = () => {
        if (copy && (value || copyValueOverride)) {
            setCopied(true);

            navigator.clipboard.writeText(copyValueOverride || value);

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        }
    }

    const handleMax = () => {
        onChange?.(max);
        handleValidate(max);
    }

    const handleClear = () => {
        onChange?.('');
    }

    return (
        <div className={`relative ${className}`}>
            {label && (
                <div className="text-grey40 mb-2">
                    <div className="flex items-center">
                        <div>
                            {label}
                            {optionalLabel ? <span className="pl-1 text-xs text-grey80">({optionalLabel})</span> : ''}
                        </div>
                        {action && (
                            <div className="grow flex justify-end mb-1.5">
                                <button onClick={() => typeof action === 'function' ? action() : null} className="cursor-pointer text-xs flex bg-contrast1.5 hover:bg-contrast2 transition-all duration-100 border border-contrast2 rounded-full flex items-center gap-3 w-fit px-3.5 py-1 text-white cursor-pointer select-none origin-center active:scale-[0.95] transition-all duration-100">
                                    {t('edit')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <div className={`px-4 py-3.5 rounded border border-transparent ${validation && valid === false ? "!border-red" : ""} ${inverse ? 'bg-contrast2' : 'bg-contrast1'}`}>
                <div className="flex relative">
                    <input readOnly={readOnly} required={required} name="amount" onBlur={handleOnBlur} placeholder={placeholder} className={`text-sm bg-transparent w-full placeholder-grey60 appearance-none outline-none ${copy || clearable || info ? "pr-4 md:pr-8" : ""} ${max ? "pr-12" : ""}`} value={value} onChange={(e) => onChange?.(e.target.value)} />
                    {info &&
                        <div className="relative group z-[30]">
                            <div className="text-sm text-grey60">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.25 14.4492H10.75V8.69922H9.25V14.4492ZM10 6.98772C10.2288 6.98772 10.4207 6.9103 10.5755 6.75547C10.7303 6.60064 10.8077 6.4088 10.8077 6.17997C10.8077 5.95114 10.7303 5.7593 10.5755 5.60447C10.4207 5.4498 10.2288 5.37247 10 5.37247C9.77117 5.37247 9.57933 5.4498 9.4245 5.60447C9.26967 5.7593 9.19225 5.95114 9.19225 6.17997C9.19225 6.4088 9.26967 6.60064 9.4245 6.75547C9.57933 6.9103 9.77117 6.98772 10 6.98772ZM10.0017 19.1992C8.68775 19.1992 7.45267 18.9499 6.2965 18.4512C5.14033 17.9526 4.13467 17.2758 3.2795 16.421C2.42433 15.5661 1.74725 14.5609 1.24825 13.4052C0.749417 12.2496 0.5 11.0148 0.5 9.70097C0.5 8.38697 0.749333 7.15189 1.248 5.99572C1.74667 4.83955 2.42342 3.83389 3.27825 2.97872C4.13308 2.12355 5.13833 1.44647 6.294 0.947469C7.44967 0.448635 8.68442 0.199219 9.99825 0.199219C11.3123 0.199219 12.5473 0.448552 13.7035 0.947218C14.8597 1.44589 15.8653 2.12264 16.7205 2.97747C17.5757 3.8323 18.2528 4.83755 18.7518 5.99322C19.2506 7.14889 19.5 8.38364 19.5 9.69747C19.5 11.0115 19.2507 12.2466 18.752 13.4027C18.2533 14.5589 17.5766 15.5646 16.7218 16.4197C15.8669 17.2749 14.8617 17.952 13.706 18.451C12.5503 18.9498 11.3156 19.1992 10.0017 19.1992ZM10 17.6992C12.2333 17.6992 14.125 16.9242 15.675 15.3742C17.225 13.8242 18 11.9326 18 9.69922C18 7.46589 17.225 5.57422 15.675 4.02422C14.125 2.47422 12.2333 1.69922 10 1.69922C7.76667 1.69922 5.875 2.47422 4.325 4.02422C2.775 5.57422 2 7.46589 2 9.69922C2 11.9326 2.775 13.8242 4.325 15.3742C5.875 16.9242 7.76667 17.6992 10 17.6992Z" fill="#91919D" />
                                </svg>
                            </div>
                            <div className="group-hover:opacity-100 pointer-events-none text-white opacity-0 bg-contrast1.5 rounded-md px-3 py-2 absolute text-sm w-full min-w-[210px] top-[calc(100%+12px)] right-[-4px] text-sm text-grey60 before:content-[''] before:absolute before:top-[-4px] before:right-[10px] before:w-[8px] before:h-[8px] before:rotate-45 before:bg-contrast1.5">{info}</div>
                        </div>
                    }
                    {clearable && value && (
                        <button onClick={handleClear} className="text-sm text-white hover:text-grey80 absolute top-0 right-0 flex h-full items-center z-10">
                            <svg className="h-4 w-4 cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    )}
                    {copy && (
                        <div onClick={copyToClipboard} className="text-sm text-grey60 absolute top-0 right-0 flex h-full items-center z-10">
                            <div>
                                {!copied && (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 cursor-pointer stroke-grey hover:stroke-white"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                )}
                                {copied && (
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.58075 14.2538L15.3038 7.53075L14.25 6.47693L8.58075 12.1462L5.73075 9.29615L4.67693 10.35L8.58075 14.2538ZM10.0016 19.5C8.68772 19.5 7.45268 19.2506 6.29655 18.752C5.1404 18.2533 4.13472 17.5765 3.2795 16.7217C2.42427 15.8669 1.74721 14.8616 1.24833 13.706C0.749442 12.5504 0.5 11.3156 0.5 10.0017C0.5 8.68772 0.749334 7.45268 1.248 6.29655C1.74667 5.1404 2.42342 4.13472 3.27825 3.2795C4.1331 2.42427 5.13834 1.74721 6.29398 1.24833C7.44959 0.749442 8.68437 0.5 9.9983 0.5C11.3122 0.5 12.5473 0.749333 13.7034 1.248C14.8596 1.74667 15.8652 2.42342 16.7205 3.27825C17.5757 4.1331 18.2527 5.13834 18.7516 6.29398C19.2505 7.44959 19.5 8.68437 19.5 9.9983C19.5 11.3122 19.2506 12.5473 18.752 13.7034C18.2533 14.8596 17.5765 15.8652 16.7217 16.7205C15.8669 17.5757 14.8616 18.2527 13.706 18.7516C12.5504 19.2505 11.3156 19.5 10.0016 19.5Z" fill="#4FE3C1"></path></svg>
                                )}
                            </div>
                        </div>
                    )}
                    {max && (
                        <div onClick={handleMax} className="text-sm cursor-pointer font-bold text-grey40 hover:text-grey80 transition-all duration-200 absolute top-0 right-0 flex h-full items-center z-10">
                            Max
                        </div>
                    )}
                </div>
            </div>
            {validation && valid === false && (
                <div className="text-red text-sm mt-2.5 font-bold">
                    {validationMessage || t("invalid_input")}
                </div>
            )}
        </div>
    )
}

export default Input