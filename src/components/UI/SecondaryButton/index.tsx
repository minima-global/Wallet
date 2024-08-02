import { MouseEventHandler, ReactNode } from 'react';

interface IProps {
    onClick: MouseEventHandler<HTMLButtonElement>;
    children: ReactNode;
    type: 'button' | 'submit' | 'reset' | undefined;
}
const SecondaryButton = ({ onClick, children, type }: IProps) => {
    return (
        <button
            onClick={onClick}
            className="bg-transparent border border-neutral-300 text-[#1B1B1B] dark:border-[#1B1B1B]  dark:text-neutral-200 hover:border-neutral-400 dark:bg-[#1B1B1B] font-bold tracking-wider w-full dark:hover:border-neutral-600 truncate min-w-max"
            type={type}
        >
            {children}
        </button>
    );
};

export default SecondaryButton;
