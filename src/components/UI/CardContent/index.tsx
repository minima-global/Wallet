import { ReactElement } from 'react';

interface IProps {
    header: ReactElement;
    content: ReactElement;
    className?: string;
}
const CardContent = ({ header, content, className }: IProps) => {
    return (
        <div
            className={`flex h-max max-h-[calc(100%_-_16px)] flex-col gap-4 mx-4 rounded bg-white bg-opacity-50 p-4 mb-4 shadow-sm ${
                className ? className : ''
            }`}
        >
            {header}
            <div className="divide-y-2" />
            <div id="card-content" className="overflow-scroll overflow-x-hidden">
                {content}
            </div>
        </div>
    );
};

export default CardContent;
