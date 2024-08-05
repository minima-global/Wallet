import { useContext, useEffect, useRef, useState } from 'react';
import QRCode from 'react-qr-code';
import { Scripts } from '../@types/minima';
import { appContext } from '../AppContext';
import AnimatePageIn from '../components/UI/Animations/AnimatePageIn';
import { useLocation } from 'react-router-dom';
import Loading from '../components/UI/Lottie/Loading.json';
import Lottie from 'lottie-react';
import PrivateKey from './_components/PrivateKey';
import WalletAddress from './_components/WalletAddress';
import PrimaryButton from '../components/UI/PrimaryButton';
import AnimatedDialog from '../components/UI/AnimatedDialog';
import SecondaryButton from '../components/UI/SecondaryButton';
import CloseIcon from '../components/UI/Icons/CloseIcon';
import AddressItem from './_components/ReceiveAddressItem';

const Receive = () => {
    const location = useLocation();

    const { simpleAddresses, _nicknameAddress } = useContext(appContext);
    const [address, setAddress] = useState<Scripts | null>(null);
    const [showFullList, setShowFullList] = useState(false);
    const [filterText, setFilterText] = useState('');

    const [viewKey, setViewKey] = useState(false);
    const [remainingTime, setRemainingTime] = useState(5000);
    const [held, setHeld] = useState(false);
    const timeoutRef: any = useRef(null);

    const handleFilterTextChange = (evt: any) => {
        setFilterText(evt.target.value);
    };
    const handleStart = () => {
        timeoutRef.current = setInterval(() => {
            setRemainingTime((prevTime) => {
                if (prevTime <= 0) {
                    clearInterval(timeoutRef.current);
                    setHeld(true);
                    setViewKey(true);
                    return 0;
                }
                return prevTime - 1000;
            });
        }, 1000);
        setHeld(true);
    };

    const handleEnd = () => {
        setViewKey(false);
        clearInterval(timeoutRef.current);
        setRemainingTime(5000);
        setHeld(false);
    };

    useEffect(() => {
        if (simpleAddresses.length) {
            setAddress(simpleAddresses[Math.floor(Math.random() * simpleAddresses.length)]);
        }
    }, [simpleAddresses]);

    const filteredAddresses = (simpleAddresses as Scripts[]).filter(
        (a) =>
            a.miniaddress.includes(filterText) ||
            (_nicknameAddress &&
                _nicknameAddress[a.miniaddress] &&
                _nicknameAddress[a.miniaddress].includes(filterText))
    );

    return (
        <>
            <AnimatedDialog display={showFullList} dismiss={() => setShowFullList(false)}>
                <div className="modal-content">
                <div className="flex items-center justify-between p-4 border-b border-[#1B1B1B] dark:border-neutral-600">
                        <h3 className="font-bold text-lg">Your Addresses</h3>
                        <button onClick={() => setShowFullList(false)} aria-label="Close">
                            <CloseIcon fill="currentColor" />
                        </button>
                    </div>

                    <div className="my-3 px-3">
                        <input
                            onChange={handleFilterTextChange}
                            placeholder="Search address"
                            type="search"
                            className="bg-white rounded-full p-3 px-4 w-full focus:outline-none focus:border focus:border-black focus:dark:border-neutral-600  dark:placeholder:text-neutral-600 dark:bg-[#1B1B1B]"
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 md:p-0">
                        <ul className="overflow-y-auto">
                            {!filteredAddresses.length && (
                                <li className="truncate mb-2 px-4 p-4 first:mt-2 text-black hover:bg-slate-50 hover:cursor-pointer">
                                    <h1 className="text-center font-medium">No results found</h1>
                                </li>
                            )}
                            {filteredAddresses.map((a) => (
                                <AddressItem
                                    key={a.address}
                                    address={a}
                                    setAddress={setAddress}
                                    filterText={filterText}
                                    setFilterText={setFilterText}
                                    setShowFullList={setShowFullList}
                                />
                            ))}
                        </ul>
                    </div>
                </div>
            </AnimatedDialog>

            <AnimatePageIn display={location.pathname.includes('/dashboard/receive')}>
                <div className="mx-3 mt-8">
                    <div className="grid grid-cols-[1fr_auto] items-center">
                        <h6 className="font-bold tracking-wide dark:text-neutral-300">Receive</h6>
                    </div>
                    <p>These are all your default addresses</p>

                    {address ? (
                        <div>
                            <div>
                                <h3 className="text-center tracking-wide">
                                    {_nicknameAddress[address.miniaddress]
                                        ? '@' + _nicknameAddress[address.miniaddress]
                                        : null}
                                </h3>
                            </div>
                            <div className="flex justify-center">
                                <QRCode
                                    className="bg-white dark:bg-[#1B1B1B] p-2"
                                    size={250}
                                    value={address.miniaddress}
                                />
                            </div>

                            <div className="relative flex justify-center items-center flex-col my-4">
                                <div className="w-max">
                                    <WalletAddress _address={address.miniaddress} />
                                </div>
                                {!viewKey && (
                                    <button
                                        onMouseDown={handleStart}
                                        onMouseUp={handleEnd}
                                        onMouseLeave={handleEnd}
                                        onTouchStart={handleStart}
                                        onTouchEnd={handleEnd}
                                        className="mt-2 font-bold w-full max-w-[200px] rounded-lg text-white bg-purple-600"
                                    >
                                        {held
                                            ? `Hold to reveal... (${Math.ceil(remainingTime / 1000)}s)`
                                            : `View seed phrase`}
                                    </button>
                                )}
                                {viewKey && (
                                    <div className="my-2">
                                        <PrivateKey fullAddress />
                                        <div
                                            className="max-w-xs my-2 mx-auto bg-yellow-600 border border-yellow-600 text-white dark:text-[#1B1B1B] px-4 py-3 rounded relative"
                                            role="alert"
                                        >
                                            <strong className="font-bold mr-1">Warning</strong>
                                            <span className="block sm:inline">
                                                Never share your private key with anyone! Doing so could result in the
                                                loss of your funds.
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleEnd()}
                                            className="bg-[#1B1B1B] w-full dark:bg-black text-neutral-100 font-bold"
                                        >
                                            Done
                                        </button>
                                    </div>
                                )}

                                <div className="mt-4">
                                    <SecondaryButton type="button" onClick={() => setShowFullList(true)}>
                                        View All
                                    </SecondaryButton>
                                </div>

                                {window.navigator.userAgent.includes('Minima Browser') && (
                                    <div
                                        className="mt-4"
                                        onClick={() => {
                                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                            // @ts-ignore
                                            Android.shareText(_address);
                                        }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="icon icon-tabler icon-tabler-user-share"
                                            width="34"
                                            height="34"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M6 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                                            <path d="M18 6m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                                            <path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                                            <path d="M8.7 10.7l6.6 -3.4" />
                                            <path d="M8.7 13.3l6.6 3.4" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <Lottie
                                className="w-[64px] h-[64px] self-center place-self-center justify-self-center"
                                animationData={Loading}
                                loop={true}
                            />
                        </div>
                    )}
                </div>
            </AnimatePageIn>
        </>
    );
};
export default Receive;
