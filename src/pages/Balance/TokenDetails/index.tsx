import KeyValue from '../../../components/UI/KeyValue';
import { useContext, useState } from 'react';
import CloseIcon from '../../../components/UI/Icons/CloseIcon';
import VerifiedIcon from '../../../components/UI/Icons/VerifiedIcon';
import Decimal from 'decimal.js';
import FireIcon from '../../../components/UI/Icons/FireIcon';
import AnimatedDialog from '../../../components/UI/AnimatedDialog';
import Burn from '../Burn';
import SecondaryButton from '../../../components/UI/SecondaryButton';
import PrimaryButton from '../../../components/UI/PrimaryButton';
import Hide from '../Hide';
import { appContext } from '../../../AppContext';

const TokenDetails = ({ token, display, dismiss }: any) => {
    const { _hiddenTokens } = useContext(appContext);
    const [_promptBurn, setPromptBurn] = useState(false);
    const [_promptHide, setPromptHide] = useState(false);

    const promptBurn = () => {
        dismiss();
        setPromptBurn((prevState) => !prevState);
    };

    const promptHide = () => {
        dismiss();
        setPromptHide((prevState) => !prevState);
    };

    if (!token) {
        return null;
    }

    const isCustomTokenWithUrl =
        token && typeof token.token === 'object' && token.token.url && typeof token.token.url === 'string';
    const isCustomTokenWithTicker =
        token && typeof token.token === 'object' && token.token.ticker && typeof token.token.ticker === 'string';
    const isCustomTokenWithDescription =
        token &&
        typeof token.token === 'object' &&
        token.token.description &&
        typeof token.token.description === 'string';
    const isMinima = token && token.tokenid === '0x00';

    return (
        <>
            <Burn token={token} display={_promptBurn} dismiss={promptBurn} />
            <Hide
                token={token}
                display={_promptHide}
                dismiss={promptHide}
                fullDismiss={() => {
                    setPromptHide(false);
                    dismiss();
                }}
            />

            <AnimatedDialog display={display} dismiss={dismiss}>
                <div className="modal-content">
                    <div className="flex items-center justify-between p-4 border-b border-[#1B1B1B] dark:border-neutral-600">
                        <h3 className="font-bold text-lg">Token Details</h3>
                        <button onClick={dismiss} aria-label="Close">
                            <CloseIcon fill="currentColor" />
                        </button>
                    </div>
                    <div className="mt-6 mx-3 md:mx-0">
                        <div className="grid grid-cols-[1fr_auto] items-center">
                            <div className="flex items-center">
                                <div className="grid grid-cols-[auto_1fr] gap-2 bg-neutral-100 dark:bg-[#1B1B1B] dark:bg-opacity-50 w-full">
                                    {!isMinima && isCustomTokenWithUrl && (
                                        <img
                                            alt="token-icon"
                                            src={decodeURIComponent(token.token.url)}
                                            className="bg-black dark:bg-[#1B1B1B] w-[56px] min-w-[56px] h-[56px] min-h-[56px]"
                                        />
                                    )}
                                    {!isMinima && !isCustomTokenWithUrl && (
                                        <img
                                            alt="token-icon"
                                            src={`https://robohash.org/${token.tokenid}`}
                                            className="bg-black dark:bg-[#1B1B1B] w-[56px] min-w-[56px] h-[56px] min-h-[56px]"
                                        />
                                    )}
                                    {isMinima && (
                                        <img
                                            alt="token-icon"
                                            src="./assets/token.svg"
                                            className="w-14 min-w-14 dark:border-r dark:border-r-neutral-800"
                                        />
                                    )}
                                    <div className="grid grid-rows-[auto_1fr] my-auto">
                                        <div className="flex items-center">
                                            <h1 className="text-sm font-bold tracking-wide">
                                                {token && token.tokenid === '0x00' && 'Minima'}
                                                {token &&
                                                    token.tokenid !== '0x00' &&
                                                    typeof token.token === 'object' &&
                                                    typeof token.token.name === 'string' &&
                                                    token.token.name}
                                            </h1>
                                            {isMinima && (
                                                <span className="my-auto text-black dark:text-black">
                                                    <VerifiedIcon fill="currentColor" />
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm tracking-widest">
                                            {isMinima && 'MINIMA'}
                                            {!isMinima && isCustomTokenWithTicker && token.token.ticker}
                                            {!isMinima && !isCustomTokenWithTicker && ''}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-3">
                            <h3 className="break-word text-white">
                                {!isMinima && isCustomTokenWithDescription && token.token.description}
                            </h3>
                            <KeyValue clipboard mono title="Token ID" value={token.tokenid} />
                            <KeyValue mono title="Total Supply" value={token.total} />
                            <KeyValue mono title="Total Coins" value={token.coins} />
                            <div className="flex items-center justify-center">
                                <hr className="border border-neutral-300 dark:border-[#1B1B1B] my-1 w-full" />
                                <span className="mx-4 text-center text-black dark:text-white font-bold text-[12px]">
                                    Balance
                                </span>
                                <hr className="border border-neutral-300 dark:border-[#1B1B1B] my-1 w-full" />
                            </div>
                            <KeyValue mono title="Available" value={token.sendable} />
                            <KeyValue
                                mono
                                title="Locked"
                                value={new Decimal(token.confirmed).minus(token.sendable).toString()}
                            />
                            <KeyValue mono title="Pending" value={token.unconfirmed} />

                            <div className={`grid grid-cols-[1fr,_2fr,_3fr] gap-2 !my-8 ${isMinima && '!grid-cols-1'}`}>
                                {!isMinima && (
                                    <button
                                        onClick={promptBurn}
                                        type="button"
                                        className="bg-orange-500 text-white dark:text-[#1B1B1B] dark:bg-neutral-100 font-bold tracking-wider w-full flex justify-center"
                                    >
                                        <FireIcon size={22} fill="currentColor" />
                                    </button>
                                )}
                                {!isMinima && (
                                    <SecondaryButton onClick={promptHide} type="button">
                                        {_hiddenTokens[token.tokenid] && 'Unhide'}
                                        {!_hiddenTokens[token.tokenid] && 'Hide'}
                                    </SecondaryButton>
                                )}
                                <PrimaryButton type="button">Transfer</PrimaryButton>
                            </div>
                        </div>
                    </div>
                </div>
            </AnimatedDialog>
        </>
    );
};

export default TokenDetails;
