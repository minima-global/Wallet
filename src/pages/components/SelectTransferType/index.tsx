import { useContext, useEffect, useRef, useState } from 'react';
import { useSpring, animated, config } from 'react-spring';
import { appContext } from '../../../AppContext';

const SelectTransferType = () => {
    const [active, setActive] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { _transferType, selectTransferType } = useContext(appContext);

    const springProps = useSpring({
        opacity: active ? 1 : 0,
        transform: active ? 'translateY(0%)' : 'translateY(-50%)',
        config: config.stiff,
    });

    const handleButtonClick = () => {
        setActive((prevState) => !prevState);
    };

    const handleSelect = (type: 'value' | 'split' | 'consolidate') => {
        selectTransferType(type);
        setActive(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActive(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={dropdownRef} className="relative inline-block w-full">
            <button
                type="button"
                id="options-menu"
                aria-haspopup="true"
                aria-expanded="true"
                onClick={handleButtonClick}
                className="mt-4 border-4 border-[#464C4F] items-center grid gap-2 grid-cols-[1fr_auto] break-all p-4 rounded-full hover:!border-teal-500 w-full  focus:outline-none focus:border-teal-500"
            >
                <div className="flex flex-col text-left text-black dark:text-white">
                    {_transferType === 'value'
                        ? 'Value Transfer'
                        : _transferType === 'split'
                        ? 'Split Coins'
                        : _transferType === 'consolidate'
                        ? 'Join Coins'
                        : 'None'}
                </div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-black dark:text-white"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="2.5"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path
                        d="M18 9c.852 0 1.297 .986 .783 1.623l-.076 .084l-6 6a1 1 0 0 1 -1.32 .083l-.094 -.083l-6 -6l-.083 -.094l-.054 -.077l-.054 -.096l-.017 -.036l-.027 -.067l-.032 -.108l-.01 -.053l-.01 -.06l-.004 -.057v-.118l.005 -.058l.009 -.06l.01 -.052l.032 -.108l.027 -.067l.07 -.132l.065 -.09l.073 -.081l.094 -.083l.077 -.054l.096 -.054l.036 -.017l.067 -.027l.108 -.032l.053 -.01l.06 -.01l.057 -.004l12.059 -.002z"
                        stroke-width="0"
                        fill="currentColor"
                    />
                </svg>
            </button>

            {active && (
                <animated.div
                    style={springProps}
                    className="origin-top-right z-[50] w-full absolute right-0 mt-2 rounded-md shadow-lg bg-black dark:bg-white"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                >
                    <ul>
                        <li
                            onClick={() => handleSelect('value')}
                            className="p-4 grid grid-cols-[auto_1fr] gap-2 items-center break-all hover:bg-white  hover:bg-opacity-10 dark:hover:bg-opacity-10 dark:hover:bg-teal-300"
                        >
                            <div>
                                <h6 className="m-0 p-0 font-bold text-white dark:text-black">Value</h6>
                            </div>
                        </li>
                        <li
                            onClick={() => handleSelect('split')}
                            className="p-4 grid grid-cols-[auto_1fr] gap-2 items-center break-all hover:bg-white hover:bg-opacity-10 dark:hover:bg-opacity-10 dark:hover:bg-teal-300"
                        >
                            <div>
                                <h6 className="m-0 p-0 font-bold text-white dark:text-black">Split</h6>
                            </div>
                        </li>
                        <li
                            onClick={() => handleSelect('consolidate')}
                            className="p-4 grid grid-cols-[auto_1fr] gap-2 items-center break-all hover:bg-white hover:bg-opacity-10 dark:hover:bg-opacity-10 dark:hover:bg-teal-300"
                        >
                            <div>
                                <h6 className="m-0 p-0 font-bold text-white dark:text-black">Consolidate</h6>
                            </div>
                        </li>
                    </ul>
                </animated.div>
            )}
        </div>
    );
};

export default SelectTransferType;
