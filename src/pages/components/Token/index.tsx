import { Decimal } from 'decimal.js';
import { Lock } from 'lucide-react';
import NFTAuthenticity from '../tokens/NFTAuthenticity';
import useFormatMinimaNumber from '../../../__minima__/libs/utils/useMakeNumber';

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
  handleClick?: () => void;
  setTokenInformation?: (info: { confirmed: string; sendable: string; unconfirmed: string }) => void;
}

export default function Token({ t, setTokenInformation, handleClick }: TokenProps) {
  const { makeMinimaNumber } = useFormatMinimaNumber();

  const isMinima = t.tokenid === '0x00';
  const tokenName = isMinima ? 'Minima' : t.token?.name || 'N/A';
  const tokenTicker = isMinima ? 'MINIMA' : t.token?.ticker || '';
  const tokenImage = isMinima
    ? "./assets/token.svg"
    : t.token?.url?.length
    ? decodeURIComponent(t.token.url)
    : `https://robohash.org/${t.tokenid}`;

  const lockedAmount = new Decimal(t.confirmed).minus(t.sendable);
  const hasUnconfirmed = t.unconfirmed !== '0';

  return (
    <li
      key={t.tokenid}
      onClick={handleClick}
      className="flex items-center space-x-4 hover:bg-primary/5 cursor-pointer border border-border bg-background rounded-lg mb-4 p-3 transition-colors duration-200"
    >
      <div className="flex-shrink-0 w-12 h-12 overflow-hidden rounded-md">
        <div className="relative w-full h-full">
          <img
            className="w-full h-full object-cover"
            alt={`${tokenName} icon`}
            src={tokenImage}
          />
          {!isMinima && t.token?.webvalidate && !!t.token.webvalidate.length && (
            <NFTAuthenticity tokenid={t.tokenid} />
          )}
        </div>
      </div>
      <div className="flex-grow min-w-0">
        <h3 className="font-bold text-foreground truncate">{tokenName}</h3>
        <p className="text-sm text-muted-foreground truncate">{tokenTicker}</p>
      </div>
      <div className="flex-shrink-0 flex flex-col items-end space-y-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (setTokenInformation) setTokenInformation(t);
          }}
          className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors duration-200"
          aria-label="View locked amount"
        >
          <span className="text-xs font-medium">
            {lockedAmount.isZero() ? "-" : makeMinimaNumber(lockedAmount.toString(), 1)}
          </span>
          <Lock className="h-4 w-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (setTokenInformation) setTokenInformation(t);
          }}
          className="flex items-center space-x-1"
          aria-label="View token details"
        >
          <span className={`text-sm font-bold ${hasUnconfirmed ? 'text-primary' : 'text-foreground'}`}>
            {makeMinimaNumber(t.sendable, 3)}
          </span>
          {hasUnconfirmed && (
            <span className="text-xs font-medium text-yellow-500 animate-pulse">
              / {makeMinimaNumber(t.unconfirmed, 3)}
            </span>
          )}
        </button>
      </div>
    </li>
  );
}