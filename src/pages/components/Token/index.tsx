import { Decimal } from 'decimal.js';
import NFTAuthenticity from '../tokens/NFTAuthenticity';

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

export default function Token({ t, setTokenInformation, handleClick }: TokenProps) {
    const makeMinimaNumber = (value: string, decimals: number) => {
        return new Decimal(value).toFixed(decimals);
    };

    return (
        <li
            key={t.tokenid}
            onClick={handleClick}
            className="flex items-center space-x-2 hover:bg-slate-100 hover:cursor-pointer border border-neutral-200 bg-neutral-50 rounded-lg mb-4 pr-3"
        >
            <div className="flex-shrink-0 w-12 h-12 overflow-hidden rounded-l-md">
                {t.tokenid === '0x00' ? (
                    <img className="w-full h-full object-cover" src="./assets/token.svg" alt="Minima token" />
                ) : (
                    <div className="relative w-full h-full">
                        <img
                            className="w-full h-full object-cover"
                            alt="token-icon"
                            src={t.token?.url?.length ? decodeURIComponent(t.token.url) : `https://robohash.org/${t.tokenid}`}
                        />
                        {t.tokenid !== '0x00' && t.token?.webvalidate && !!t.token.webvalidate.length && (
                            <NFTAuthenticity tokenid={t.tokenid} />
                        )}
                    </div>
                )}
            </div>
            <div className="flex-grow min-w-0 mr-2">
                <h6 className="font-bold truncate">{t.tokenid === '0x00' ? 'Minima' : t.token?.name || 'N/A'}</h6>
                <p className="font-bold text-sm text-neutral-500 truncate">
                    {t.tokenid === '0x00' ? 'MINIMA' : t.token?.ticker || ''}
                </p>
            </div>
            <div className="flex-shrink-0 flex flex-col items-end mr-4">
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        if (setTokenInformation) setTokenInformation(t);
                    }}
                    className="flex items-center space-x-1"
                >
                    <p className="text-xs">
                        {new Decimal(t.confirmed).minus(t.sendable).isZero() ? "-" : makeMinimaNumber(new Decimal(t.confirmed).minus(t.sendable).toString(), 1)}
                    </p>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path
                            d="M12 2c-.218 0 -.432 .002 -.642 .005l-.616 .017l-.299 .013l-.579 .034l-.553 .046c-4.785 .464 -6.732 2.411 -7.196 7.196l-.046 .553l-.034 .579c-.005 .098 -.01 .198 -.013 .299l-.017 .616l-.004 .318l-.001 .324c0 .218 .002 .432 .005 .642l.017 .616l.013 .299l.034 .579l.046 .553c.464 4.785 2.411 6.732 7.196 7.196l.553 .046l.579 .034c.098 .005 .198 .01 .299 .013l.616 .017l.642 .005l.642 -.005l.616 -.017l.299 -.013l.579 -.034l.553 -.046c4.785 -.464 6.732 -2.411 7.196 -7.196l.046 -.553l.034 -.579c.005 -.098 .01 -.198 .013 -.299l.017 -.616l.005 -.642l-.005 -.642l-.017 -.616l-.013 -.299l-.034 -.579l-.046 -.553c-.464 -4.785 -2.411 -6.732 -7.196 -7.196l-.553 -.046l-.579 -.034a28.058 28.058 0 0 0 -.299 -.013l-.616 -.017l-.318 -.004l-.324 -.001zm0 4a3 3 0 0 1 2.995 2.824l.005 .176v1a2 2 0 0 1 1.995 1.85l.005 .15v3a2 2 0 0 1 -1.85 1.995l-.15 .005h-6a2 2 0 0 1 -1.995 -1.85l-.005 -.15v-3a2 2 0 0 1 1.85 -1.995l.15 -.005v-1a3 3 0 0 1 3 -3zm3 6h-6v3h6v-3zm-3 -4a1 1 0 0 0 -.993 .883l-.007 .117v1h2v-1a1 1 0 0 0 -1 -1z"
                            fill="currentColor"
                            strokeWidth="0"
                        />
                    </svg>
                </div>
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        if (setTokenInformation)
                            setTokenInformation({
                                confirmed: t.confirmed,
                                sendable: t.sendable,
                                unconfirmed: t.unconfirmed,
                            });
                    }}
                    className="flex items-center"
                >
                    <p
                        className={`${
                            t.unconfirmed !== '0' ? 'px-2 animate-pulse' : ''
                        } text-xs rounded-full font-bold`}
                    >
                        {makeMinimaNumber(t.sendable, 3)}
                        <span className="font-light text-yellow-500">
                            {t.unconfirmed !== '0' && ' / ' + makeMinimaNumber(t.unconfirmed, 3)}
                        </span>
                    </p>
                </div>
            </div>
        </li>
    );
}
