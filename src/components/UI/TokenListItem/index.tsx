import React from 'react';
import Decimal from 'decimal.js';
import useFormatMinimaNumber from '../../../__minima__/libs/utils/useMakeNumber';
import LockedIcon from '../Icons/LockedIcon';


const TokenListItem = ({ token }) => {
    const { makeMinimaNumber} = useFormatMinimaNumber();


    return (
        <li
            className={`grid grid-cols-[auto_1fr] items-center gap-2 bg-white dark:bg-[#1B1B1B] rounded rounded-r-none`}
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
                        {'name' in token.token && typeof token.token.name === 'string' ? token.token.name : 'N/A'}
                    </h6>
                    <input
                        readOnly
                        value={`${makeMinimaNumber(token.sendable, 2000)} ${
                            token.unconfirmed !== '0' ? '/' + makeMinimaNumber(token.unconfirmed, 2000) : ''
                        }`}
                        className="truncate w-full focus:outline-none bg-transparent text-sm tracking-wider dark:text-neutral-300"
                    />
                </div>
                {!new Decimal(new Decimal(token.confirmed).minus(token.sendable)).isZero() && (
                    <div className="flex items-start justify-center pr-1">
                        <p className="text-[14px] tracking-wide font-mono dark:text-neutral-300">
                            {makeMinimaNumber(new Decimal(token.confirmed).minus(token.sendable).toFixed(3), 2000)}
                        </p>
                        <span>
                            <LockedIcon fill="currentColor" />
                        </span>
                    </div>
                )}
            </div>
        </li>
    );
};

export default TokenListItem;
