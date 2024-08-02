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
            <div className={`rounded-lg grid grid-rows-1 grid-cols-[120px_1fr] bg-neutral-300 border dark:border-[#1B1B1B] md:gap-2 items-center dark:bg-[#1B1B1B] dark:bg-opacity-60`}>
                <div className='truncate dark:border-r dark:border-r-neutral-800'>
                    <h3 className="text-center truncate p-2 font-bold bg-neutral-100 text-sm dark:bg-[#1B1B1B] dark:bg-opacity-10">{title}</h3>
                </div>
                <div className={`${clipboard && 'grid grid-cols-[1fr_auto] relative h-full items-center'}`}>
                    
                    
                    {truncate &&                    
                    <input readOnly value={value} className={`truncate px-2 md:p-0 text-center md:text-left text-sm break-word ${mono && 'font-mono'} bg-transparent focus:outline-none w-full`}/>
                    }
                    
                    {!truncate &&
                    <p className={` px-2 md:p-0 text-center md:text-left text-sm break-word ${mono && 'font-mono'}`}>
                        {value}
                    </p>                    
                
                    }
                    {clipboard && (
                        <div
                            onClick={handleCopyClick}
                            className="hover:bg-teal-400 hover:dark:bg-neutral-200 text-neutral-100 dark:text-black flex relative p-0 m-0 hover:cursor-pointer text-sm bg-teal-500 dark:bg-neutral-300 h-full w-[48px] items-center justify-center px-2 rounded-r"
                        >
                            <svg
                                onInput={() => {}}
                                className="absolute right-0 top-0"
                                style={{                                    
                                    position: 'absolute',
                                    top: 6,
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
                                strokeWidth="2"
                                stroke="currentColor"
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
                                    position: 'absolute',
                                    top: 6,
                                    right: 10,
                                    strokeDasharray: 50,
                                    strokeDashoffset: isCopied ? 0 : -50,
                                    transition: 'all 300ms ease-in-out',
                                }}
                                width="28"
                                height="24"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
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
                {/* {clipboard &&<div className="flex md:hidden"><button type="button" onClick={handleCopyClick} className={`${isCopied && "bg-teal-500 dark:bg-teal-300 font-bold transition-colors duration-100"} w-full text-sm text-black dark:text-white tracking-wider bg-neutral-100 dark:bg-[#1B1B1B] hover:dark:bg-black hover:dark:border dark:hover:border-teal-300 hover:dark:border-t-none rounded-t-none`}>{isCopied ? "Copied" : "Copy"}</button></div>} */}
            </div>
        </>
    );
};

export default KeyValue;
