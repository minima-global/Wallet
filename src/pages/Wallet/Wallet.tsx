import { useContext } from 'react';
import { appContext } from '../../AppContext';
import useFormatMinimaNumber from '../../__minima__/libs/utils/useMakeNumber';

import * as utils from '../../utilities';
import Decimal from 'decimal.js';
import LockedIcon from '../../components/UI/Icons/LockedIcon';
import VerifiedIcon from '../../components/UI/Icons/VerifiedIcon';
import Lottie from 'lottie-react';
import Loading from '../../components/UI/Lottie/Loading.json';

interface IProps {
    selectionMode: boolean;
    detailsMode: boolean;
    selectToken?: any;
    filterText: string;
}
const Wallet = ({ selectToken, selectionMode = false, detailsMode = false, filterText }: IProps) => {
    const { makeMinimaNumber } = useFormatMinimaNumber();
    const { balance, loading } = useContext(appContext);

    if (loading) {
        return (
            <div className="flex justify-center flex-col my-4 items-center">
                <Lottie className="w-[64px] h-[64px]" animationData={Loading} loop={true} />
            </div>
        );
    }

    if (!balance) {
        return (
            <div>
                <p className="text-sm text-center">No tokens available</p>
            </div>
        );
    }

    if (
        balance.filter(
            (t: any) =>
                utils.containsText(
                    t.tokenid === '0x00' ? t.token : 'name' in t.token ? t.token.name : '',
                    filterText
                ) || utils.containsText(t.tokenid, filterText)
        ).length === 0
    ) {
        return (
            <div>
                <p className="text-sm text-center">No results found</p>
            </div>
        );
    }

    return (
        <div>
            {balance.length > 0 && (
                <>
                    <ul className="">
                        {balance
                            .filter(
                                (t: any) =>
                                    utils.containsText(
                                        t.tokenid === '0x00' ? t.token : 'name' in t.token ? t.token.name : '',
                                        filterText
                                    ) || utils.containsText(t.tokenid, filterText)
                            )
                            .map((token: any) =>
                                token.tokenid === '0x00' ? (
                                    <li
                                        onClick={
                                            selectToken
                                                ? () => selectToken(token)
                                                : detailsMode
                                                ? selectToken(token)
                                                : () => null
                                        }
                                        className={`grid grid-cols-[auto_1fr] items-center gap-2 bg-white dark:bg-[#1B1B1B] mb-2 rounded ${
                                            selectionMode ? 'hover:bg-teal-500 border-teal-500 border' : ''
                                        }`}
                                        key={token.tokenid}
                                    >
                                        <img alt="token-icon" src="./assets/token.svg" className="w-14 min-w-14" />
                                        <div className="overflow-hidden grid grid-cols-[1fr_auto]">
                                            <div>
                                                <div className="grid grid-cols-[auto_1fr]">
                                                    <h6 className="font-bold truncate tracking-wide dark:text-neutral-300">
                                                        Minima
                                                    </h6>
                                                    <span className="my-auto text-black dark:text-[#1B1B1B]">
                                                        <VerifiedIcon fill="currentColor" />
                                                    </span>
                                                </div>

                                                {!selectionMode && (
                                                    <input
                                                        readOnly
                                                        value={`${makeMinimaNumber(token.sendable, 2000)} ${
                                                            token.unconfirmed != '0'
                                                                ? '/' + makeMinimaNumber(token.unconfirmed, 2000)
                                                                : ''
                                                        }`}
                                                        className="truncate w-full focus:outline-none bg-transparent text-sm tracking-wider dark:text-neutral-300"
                                                    />
                                                )}
                                                {selectionMode && (
                                                    <p className="font-bold text-sm dark:text-neutral-300">MINIMA</p>
                                                )}
                                            </div>
                                            {!selectionMode &&
                                                !new Decimal(
                                                    new Decimal(token.confirmed).minus(token.sendable)
                                                ).isZero() && (
                                                    <div className="flex items-start justify-center pr-1">
                                                        <p className="text-[14px] tracking-wide font-mono">
                                                            {makeMinimaNumber(
                                                                new Decimal(token.confirmed)
                                                                    .minus(token.sendable)
                                                                    .toFixed(3),
                                                                2000
                                                            )}
                                                        </p>
                                                        <span>
                                                            <LockedIcon fill="currentColor" />
                                                        </span>
                                                    </div>
                                                )}
                                        </div>
                                    </li>
                                ) : (
                                    <li
                                        onClick={
                                            selectToken
                                                ? () => selectToken(token)
                                                : detailsMode
                                                ? selectToken(token)
                                                : () => null
                                        }
                                        className={`grid grid-cols-[auto_1fr] items-center gap-2 bg-white dark:bg-[#1B1B1B] mb-2 rounded ${
                                            selectionMode ? 'hover:bg-teal-500 border-teal-500 border' : ''
                                        }`}
                                        key={token.tokenid}
                                    >
                                        <img
                                            alt="token-icon"
                                            src={
                                                'url' in token.token && token.token.url.length
                                                    ? decodeURIComponent(token.token.url)
                                                    : `https://robohash.org/${token.tokenid}`
                                            }
                                            className="bg-[#080A0B] w-[56px] min-w-[56px] h-[56px] min-h-[56px]"
                                        />
                                        <div className="overflow-hidden grid grid-cols-[1fr_auto]">
                                            <div>
                                                <h6 className="font-bold truncate dark:text-neutral-300">
                                                    {'name' in token.token && typeof token.token.name === 'string'
                                                        ? token.token.name
                                                        : 'N/A'}
                                                </h6>
                                                {!selectionMode && (
                                                    <input
                                                        readOnly
                                                        value={`${makeMinimaNumber(token.sendable, 2000)} ${
                                                            token.unconfirmed != '0'
                                                                ? '/' + makeMinimaNumber(token.unconfirmed, 2000)
                                                                : ''
                                                        }`}
                                                        className="truncate w-full focus:outline-none bg-transparent text-sm tracking-wider dark:text-neutral-300"
                                                    />
                                                )}
                                                {selectionMode && (
                                                    <p className="text-sm font-bold dark:text-neutral-300">
                                                        {token.token && 'ticker' in token.token
                                                            ? token.token.ticker
                                                            : ''}
                                                    </p>
                                                )}
                                            </div>
                                            {!selectionMode &&
                                                !new Decimal(
                                                    new Decimal(token.confirmed).minus(token.sendable)
                                                ).isZero() && (
                                                    <div className="flex items-start justify-center pr-1">
                                                        <p className="text-[14px] tracking-wide font-mono dark:text-neutral-300">
                                                            {makeMinimaNumber(
                                                                new Decimal(token.confirmed)
                                                                    .minus(token.sendable)
                                                                    .toFixed(3),
                                                                2000
                                                            )}
                                                        </p>
                                                        <span>
                                                            <LockedIcon fill="currentColor" />
                                                        </span>
                                                    </div>
                                                )}
                                        </div>
                                    </li>
                                )
                            )}
                    </ul>
                </>
            )}
        </div>
    );
};

export default Wallet;
