import { ReactElement, useState } from 'react';
import * as utils from '../../../utilities';

interface IProps {
    title: any;
    value: any;
    help?: ReactElement;
    clipboard?: boolean;
    mono?: boolean;
    truncate?: boolean;
}
const KeyValue = ({ title, value, help, clipboard, mono = false, truncate = true }: IProps) => {
    const [showHelp, setShowHelp] = useState(false);
    const [isCopied, setCopy] = useState(false);

    const handleCopyClick = () => {
        utils.copyToClipboard(value);
        setCopy(true);
        setTimeout(() => {
            setCopy(false);
        }, 2500);
    };

    return (
        <>
            <div className={`bg-white bg-opacity-5 rounded-lg grid grid-rows-2 md:grid-rows-1 md:grid-cols-[auto_1fr] md:gap-2 items-center`}>
                <h3 className="bg-black text-white bg-opacity-50 p-2 font-bold">{title}</h3>
                <div className={`${clipboard && 'grid grid-cols-[1fr_auto] relative h-full items-center'}`}>
                    <p className={`px-2 md:p-0 text-sm text-white break-word ${truncate && 'truncate'} ${mono && 'font-mono'}`}>
                        {value}
                    </p>
                    {clipboard && (
                        <div
                            onClick={handleCopyClick}
                            className="relative p-0 m-0 text-black hover:cursor-pointer text-sm bg-teal-300 dark:bg-teal-500 h-full w-[48px] flex items-center justify-center px-2 rounded-r"
                        >
                            <svg
                                onInput={() => {}}
                                className="absolute right-0 top-0"
                                style={{
                                    color: '#0809ab',
                                    position: 'absolute',
                                    top: 10,
                                    right: 12,
                                    strokeDasharray: 50,
                                    strokeDashoffset: isCopied ? -50 : 0,
                                    transition: 'all 300ms ease-in-out',
                                    opacity: isCopied ? 0 : 1,
                                }}
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                strokeWidth="3.5"
                                stroke="#2c3e50"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" />
                                <path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" />
                            </svg>
                            <svg
                                onClick={handleCopyClick}
                                xmlns="http://www.w3.org/2000/svg"
                                style={{
                                    color: 'black',
                                    position: 'absolute',
                                    top: 8,
                                    right: 10,
                                    strokeDasharray: 50,
                                    strokeDashoffset: isCopied ? 0 : -50,
                                    transition: 'all 300ms ease-in-out',
                                }}
                                width="28"
                                height="24"
                                viewBox="0 0 24 24"
                                strokeWidth="3"
                                stroke="currentColor"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M5 12l5 5l10 -10" />
                            </svg>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default KeyValue;
