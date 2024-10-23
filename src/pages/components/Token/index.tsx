import React from 'react';
import { Decimal } from 'decimal.js';
import NFTAuthenticity from '../tokens/NFTAuthenticity';
import useFormatMinimaNumber from '../../../__minima__/libs/utils/useMakeNumber';
import { CheckCircle, Lock } from 'lucide-react';

interface TokenProps {
  t: {
    tokenid: string;
    token: {
      name?: string;
      ticker?: string;
      url?: string;
      webvalidate?: string;
    };
    confirmed: string;
    sendable: string;
    unconfirmed: string;
  };
  handleClick?: any;
  setTokenInformation?: (info: { confirmed: string; sendable: string; unconfirmed: string }) => void;
}

const renderIcon = (t: any) => {
    return (
        <div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded-l-md">
            {t.tokenid === '0x00' ? (
                <div className="relative w-full h-full">
                    <img className="w-full h-full object-cover" src="./assets/token.svg" alt="Minima token" />
                    <span className="absolute right-1 bottom-1 text-white">
                        <CheckCircle className="w-4 h-4 fill-blue-600" />
                    </span>
                </div>
            ) : (
                <div className="relative w-full h-full">
                    <img
                        className="w-full h-full object-cover"
                        alt="token-icon"
                        src={
                            t.token?.url?.length
                                ? decodeURIComponent(t.token.url)
                                : `https://robohash.org/${t.tokenid}`
                        }
                    />
                    {t.tokenid !== '0x00' && t.token?.webvalidate && !!t.token.webvalidate.length && (
                        <NFTAuthenticity tokenid={t.tokenid} />
                    )}
                </div>
            )}
        </div>
    );
};

const renderName = (t: any) => {
    return (
        <div className="flex-grow min-w-0 mr-2">
            <h6 className="font-bold truncate">{t.tokenid === '0x00' ? 'Minima' : t.token?.name || 'N/A'}</h6>
            <p className="font-bold text-sm text-neutral-500 truncate">
                {t.tokenid === '0x00' ? 'MINIMA' : t.token?.ticker || ''}
            </p>
        </div>
    );
};

const renderBalance = (token: any, makeMinimaNumber: any) => {
    const lockedAmount = new Decimal(token.confirmed).minus(token.sendable).abs();

    return (
        <div className="flex flex-col flex-grow items-end mr-4 max-w-[120px]">
            <div className="w-full truncate text-right">
                <p
                    className={`${
                        token.unconfirmed !== '0' ? 'px-2 animate-pulse' : ''
                    } text-xs rounded-full font-bold`}
                >
                    <span className="truncate inline-block max-w-full">
                        {makeMinimaNumber(token.sendable, 3)}
                    </span>
                    {token.unconfirmed !== '0' && (
                        <span className="font-light text-yellow-500 ml-1 truncate inline-block max-w-full">
                            / {makeMinimaNumber(token.unconfirmed, 3)}
                        </span>
                    )}
                </p>
            </div>
            {lockedAmount.greaterThan(0) && (
                <div className="flex items-center space-x-1 w-full justify-end">
                    <p className="text-xs truncate">
                        {lockedAmount.isZero() ? '-' : makeMinimaNumber(lockedAmount.toString(), 1)}
                    </p>
                    <Lock className="h-4 w-4 flex-shrink-0" />
                </div>
            )}
        </div>
    );
};

export default function Token({ t, setTokenInformation, handleClick }: TokenProps) {
  const { makeMinimaNumber } = useFormatMinimaNumber();

  return (
    <li
        key={t.tokenid}
        onClick={handleClick}
        className="flex items-center space-x-2 hover:bg-slate-100 hover:cursor-pointer border border-neutral-200 bg-neutral-50 rounded-lg mb-4 pr-3 overflow-hidden"
    >
        {renderIcon(t)}
        {renderName(t)}
        {renderBalance(t, makeMinimaNumber)}
    </li>
  );
}