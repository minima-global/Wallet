import { ReactElement, useState } from 'react';
import { copy } from '../../../shared/functions';

interface IProps {
    title: any;
    value: any;
    clickable?: true;
    className?: string;
    help?: ReactElement;
    clipboard?: boolean;
    truncate?: boolean;
}
const KeyValue = ({ title, value, clickable, className, help, clipboard, truncate = true }: IProps) => {
    const [showHelp, setShowHelp] = useState(false);
    const [_copy, setCopy] = useState(false);

    const handleCopyClick = () => {
        copy(value);
        setCopy(true);
        setTimeout(() => {
            setCopy(false);
        }, 2500);
    };

    return (
        <div
            className={`bg-white p-4 overflow-hidden relative rounded flex flex-col md:grid md:items-center md:grid-cols-[auto_1fr] md:grid-rows-1 md:gap-2 ${
                clickable ? 'hover:bg-opacity-50 hover:cursor-pointer' : ''
            }`}
        >
            <div className={` ${help && showHelp ? 'grid grid-cols-[auto_1fr] grid-rows-1 gap-4' : ''}`}>
                <div className="flex gap-1 items-center overflow-x-scroll">
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
                <div className="overflow-x-auto">
                    {typeof value === 'string' || typeof value === 'number' ? (
                        <div className={`grid grid-cols-[1fr_${clipboard ? 'auto' : ''}] gap-5`}>
                            <p
                                className={`text-black animate-fadeIn truncate  ${
                                    className ? className : ''
                                }`}
                            >
                                {value}
                            </p>
                            {clipboard && (
                                <div className="flex items-center">
                                    {!_copy && (
                                        <svg
                                            onClick={handleCopyClick}
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            strokeWidth="2"
                                            stroke="currentColor"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
                                            <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
                                            <path d="M9 12h6" />
                                            <path d="M9 16h6" />
                                        </svg>
                                    )}
                                    {!!_copy && (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="animate-fadeIn"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            strokeWidth="2"
                                            stroke="#00B894"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
                                            <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
                                            <path className="animate-fadeIn3" d="M9 14l2 2l4 -4" />
                                        </svg>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="animate-fadeIn">{value}</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default KeyValue;
