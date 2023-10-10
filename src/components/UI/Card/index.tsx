import { ReactElement } from 'react';

interface IProps {
    children: ReactElement;
    className?: string;
}
const Card = ({ children, className }: IProps) => {
    return (
        <div
            className={`bg-white max-h-[calc(100%_-_16px)] rounded p-4 bg-opacity-50 mx-4 animate-fadeIn overflow-hidden ${
                className ? className : ''
            }`}
        >
            {children}
        </div>
    );
};

export default Card;
