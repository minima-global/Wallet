import { useContext, useEffect, useState } from 'react';
import { copy } from '../shared/functions';
import QRCode from 'react-qr-code';

import Card from '../components/UI/Card';
import { Scripts } from '../@types/minima';
import Grid from '../components/UI/Grid';
import { appContext } from '../AppContext';

const Receive = () => {
    const { simpleAddresses, setOpenDrawer } = useContext(appContext);
    const [address, setAddress] = useState<Scripts>();
    const [showFullList, setShowFullList] = useState(false);
    const [copyState, setCopy] = useState(false);

    // const [validBuild, setValidBuild] = useState<boolean | undefined>(undefined);

    // useEffect(() => {
    //     getCurrentNodeVersion().then((v) => {
    //         const versionCheckAddressWasIntroduced = '1.0.21';
    //         const comparison = v.localeCompare(versionCheckAddressWasIntroduced);
    //         const isRunningSufficientVersion = comparison === 0 || comparison === 1;

    //         if (isRunningSufficientVersion) {
    //             setValidBuild(true);
    //         }
    //         if (!isRunningSufficientVersion) {
    //             setValidBuild(false);
    //         }
    //     });
    // }, []);

    useEffect(() => {
        if (simpleAddresses.length) {
            setAddress(simpleAddresses[Math.floor(Math.random() * simpleAddresses.length)]);
        }
    }, [simpleAddresses]);

    const handleCopyClick = () => {
        copy(address ? address.miniaddress : '');
        setCopy(true);
        setTimeout(() => {
            setCopy(false);
        }, 2500);
    };

    return (
        <>
            <Grid
                variant="lg"
                title={
                    <>
                        <svg
                            onClick={() => setOpenDrawer(true)}
                            className="block md:hidden fill-white"
                            xmlns="http://www.w3.org/2000/svg"
                            height="24"
                            viewBox="0 -960 960 960"
                            width="24"
                        >
                            <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
                        </svg>
                        Receive
                    </>
                }
            >
                <div>
                    <Card className="!p-0">
                        <div>
                            <div className="flex justify-center">
                                <QRCode
                                    className="rounded h-[240px] w-[240px] mt-8"
                                    value={address ? address?.miniaddress : ''}
                                    type="M"
                                />
                            </div>

                            <div className="bg-white p-4 mt-8">
                                <div className="grid grid-cols-[auto_1fr] grid-rows-1 gap-2 w-full">
                                    <h1 className="text-black font-semibold truncate">
                                        UnnamedUnnamedUnnamedUnnamedUnnamedUnnamedUnnamed
                                    </h1>
                                    <svg
                                        className="hover:cursor-pointer hover:scale-105 fill-purple-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="20"
                                        viewBox="0 -960 960 960"
                                        width="20"
                                    >
                                        <path d="M200-200h56l345-345-56-56-345 345v56Zm572-403L602-771l56-56q23-23 56.5-23t56.5 23l56 56q23 23 24 55.5T829-660l-57 57Zm-58 59L290-120H120v-170l424-424 170 170Zm-141-29-28-28 56 56-28-28Z" />
                                    </svg>
                                </div>

                                <div className="grid grid-cols-[auto_1fr] grid-rows-1 gap-1 items-center">
                                    <p className="text-black text-sm truncate">{address ? address.miniaddress : ''}</p>
                                    <button onClick={handleCopyClick}>
                                        {!copyState && (
                                            <svg
                                                className="fill-black"
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="20"
                                                viewBox="0 -960 960 960"
                                                width="20"
                                            >
                                                <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" />
                                            </svg>
                                        )}
                                        {copyState && (
                                            <svg
                                                className="fill-[#FFA010]"
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="20"
                                                viewBox="0 -960 960 960"
                                                width="20"
                                            >
                                                <path d="m438-240 226-226-58-58-169 169-84-84-57 57 142 142ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button
                                className="bg-black text-white w-full px-4 py-2 flex items-center justify-center"
                                onClick={() => setShowFullList((prevState) => !prevState)}
                            >
                                <svg
                                    className={`fill-white ${showFullList ? 'arrow-active' : 'arrow-passive'}`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24"
                                    viewBox="0 -960 960 960"
                                    width="24"
                                >
                                    <path d="m296-345-56-56 240-240 240 240-56 56-184-184-184 184Z" />
                                </svg>
                            </button>

                            <ul
                                aria-expanded={!showFullList}
                                className="accordion-content rounded bg-white max-h-[560px] divide-y-1"
                            >
                                {(simpleAddresses as Scripts[]).map((a) => (
                                    <li
                                        onClick={() => {
                                            setAddress(a);
                                            setShowFullList(false);
                                        }}
                                        className="truncate mb-2 px-4 p-4 first:mt-2 text-black hover:bg-slate-50 hover:cursor-pointer"
                                    >
                                        <h1 className="text-black font-semibold truncate">
                                            UnnamedUnnamedUnnamedUnnamedUnnamedUnnamedUnnamed
                                        </h1>
                                        <p className="text-black truncate text-sm">{a.miniaddress}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Card>
                </div>
            </Grid>
        </>
    );
};
export default Receive;
