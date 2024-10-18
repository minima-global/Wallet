import { ReactElement, useState } from 'react';

interface InputProps {
  placeholder: string;
  type: string;
  value?: any;
  name: string;
  id: string;
  autoComplete?: string;
  extraClass?: string;
  accept?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  endIcon?: ReactElement;
  error?: string | false;
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleEndIconClick?: () => void;
  formikProps?: any;
  disabled?: boolean;
  max?: number;
  help?: ReactElement;
}

export default function Input({
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
  max,
  help,
}: InputProps) {
  const [showHelp, setShowHelp] = useState(false);

  const baseClasses = `
    w-full px-4 py-3 bg-white text-base text-gray-900 rounded
    border border-gray-300
    disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    transition-all duration-200 ease-in-out
    ${extraClass || ''}
    ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
  `;

  return (
    <div className="flex flex-col space-y-2">
      {help && (
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowHelp(!showHelp)}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            {showHelp ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          {showHelp && <div className="text-sm text-gray-600">{help}</div>}
        </div>
      )}
      <div className="relative">
        <input
          max={max}
          disabled={disabled}
          autoComplete={autoComplete || 'off'}
          name={name}
          id={id}
          value={value}
          type={type}
          placeholder={placeholder}
          className={baseClasses}
          onChange={onChange}
          accept={accept}
          onKeyUp={onKeyUp}
          onBlur={onBlur}
          {...formikProps}
        />
        {endIcon && (
          <div
            onClick={handleEndIconClick}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
          >
            {endIcon}
          </div>
        )}
      </div>
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
    </div>
  );
}