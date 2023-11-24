import { ReactElement } from 'react';

interface IProps {
    header: ReactElement;
    content: ReactElement;
    className?: string;
}
const CardContent = ({ header, content, className }: IProps) => {
    return (
        <div
            className={`flex h-max flex-col gap-4 mx-4 rounded bg-white bg-opacity-70 p-4 shadow-sm mb-4 ${
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
