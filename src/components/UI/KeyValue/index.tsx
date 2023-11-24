import { ReactElement, useState } from 'react';

interface IProps {
    title: any;
    value: any;
    clickable?: true;
    className?: string;
    help?: ReactElement;
}
const KeyValue = ({ title, value, clickable, className, help }: IProps) => {
    const [showHelp, setShowHelp] = useState(false);

    return (
        <div
            className={`bg-white p-4 overflow-hidden relative rounded flex flex-col md:grid md:items-center md:grid-cols-[auto_1fr] md:grid-rows-1 md:gap-2 ${
                clickable ? 'hover:bg-opacity-50 hover:cursor-pointer' : ''
            }`}
        >
            <div className={` ${help && showHelp ? 'grid grid-cols-[auto_1fr] grid-rows-1 gap-4' : ''}`}>
                <div className="flex gap-1 items-center">
                    {typeof title === 'string' && <h3 className="text-black truncate font-bold">{title}</h3>}
                    {typeof title !== 'string' && title}
                    {help && !showHelp && (
                        <svg
                            onClick={() => setShowHelp(true)}
                            xmlns="http://www.w3.org/2000/svg"
                            className="fill-gray-400 hover:cursor-pointer hover:scale-110"
                            height="20"
                            viewBox="0 -960 960 960"
                            width="20"
                        >
                            <path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                        </svg>
                    )}
                    {help && showHelp && (
                        <svg
                            className="fill-gray-400 hover:cursor-pointer hover:scale-110"
                            onClick={() => setShowHelp(false)}
                            xmlns="http://www.w3.org/2000/svg"
                            height="20"
                            viewBox="0 -960 960 960"
                            width="20"
                        >
                            <path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                        </svg>
                    )}
                </div>
                {help && showHelp && help}
            </div>
            {!showHelp && (
                <>
                    {typeof value === 'string' || typeof value === 'number' ? (
                        <p className={`text-black animate-fadeIn truncate ${className ? className : ''}`}>{value}</p>
                    ) : (
                        <div className="animate-fadeIn">{value}</div>
                    )}
                </>
            )}
        </div>
    );
};

export default KeyValue;
