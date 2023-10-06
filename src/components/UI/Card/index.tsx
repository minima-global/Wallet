import { ReactElement } from 'react';

interface IProps {
    children: ReactElement;
    className?: string;
}
const Card = ({ children, className }: IProps) => {
    return (
        <div className={`bg-white h-max rounded p-4 bg-opacity-50 mx-4 animate-fadeIn ${className ? className : ''}`}>
            {children}
        </div>
    );
};

export default Card;
