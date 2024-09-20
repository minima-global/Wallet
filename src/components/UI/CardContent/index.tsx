import { ReactElement } from 'react';

interface IProps {
    header: ReactElement;
    content: ReactElement;
    className?: string;
    onClick?: any;
}
const CardContent = ({ header, content, className, onClick }: IProps) => {
    return (
        <div
            onClick={onClick}
            className={`flex h-max flex-col gap-4 mx-4 rounded bg-neutral-100 p-4 shadow-sm mb-4 ${
                className ? className : ''
            }`}
        >
            {header}
            <div className="divide-y-2" />
            <div id="card-content" className="h-max">
                {content}
            </div>
        </div>
    );
};

export default CardContent;
