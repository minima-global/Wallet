import { MouseEventHandler, ReactNode } from 'react';

interface IProps {
    children: ReactNode;
    type: 'button' | 'submit' | 'reset' | undefined;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    extraClass?: string;
}
const PrimaryButton = ({ disabled, extraClass, onClick, children, type }: IProps) => {
    return (
        <button
            disabled={disabled}
            onClick={onClick ? onClick : () => null}
            className={`bg-teal-500 text-white dark:text-[#1B1B1B] dark:bg-teal-800 hover:bg-teal-400 dark:hover:bg-teal-700 font-bold tracking-wider w-full disabled:bg-opacity-10 disabled:hover:bg-opacity-10 ${extraClass && extraClass}`}
            type={type}
        >
            {children}
        </button>
    );
};

export default PrimaryButton;
