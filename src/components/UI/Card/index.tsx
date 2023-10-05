import { ReactElement } from 'react';

interface IProps {
    children: ReactElement;
    className?: string;
}
const Card = ({ children, className }: IProps) => {
    return <div className={`bg-white rounded p-4 mb-8 bg-opacity-50 mx-4 animate-fadeIn ${className}`}>{children}</div>;
};

export default Card;
