import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPortal } from 'react-dom';

import Grid from '../../components/UI/Grid';
import FadeIn from '../../components/UI/Animations/FadeIn';
import NFTAuthenticity from '../components/tokens/NFTAuthenticity';
import { appContext } from '../../AppContext';
import { MinimaToken } from '../../@types/minima';
import KeyValue from '../../components/UI/KeyValue';
import CardContent from '../../components/UI/CardContent';

import useFormatMinimaNumber from '../../__minima__/libs/utils/useMakeNumber';

const TokenDetail = () => {
    const navigate = useNavigate();
    const { tokenid } = useParams();

    const { makeMinimaNumber } = useFormatMinimaNumber();
    const { balance } = useContext(appContext);
    const [viewingToken, setViewingToken] = useState<null | MinimaToken>(null);

    const [fullscreenView, setFullScreenView] = useState(false);

    useEffect(() => {
        if (tokenid) {
            setViewingToken(balance.find((b: MinimaToken) => b.tokenid === tokenid));
        }
    }, [tokenid, balance]);

    return (
        <Grid
            variant="lg"
            title={
                <>
                    {
                        <>
                            <svg
                                onClick={(e: any) => {
                                    e.stopPropagation();
                                    navigate(-1);
                                }}
                                className="fill-white hover:cursor-pointer"
                                xmlns="http://www.w3.org/2000/svg"
                                height="24"
                                viewBox="0 -960 960 960"
                                width="24"
                            >
                                <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
                            </svg>
                            Token details
                        </>
                    }
                </>
            }
        >
            <>
                {fullscreenView &&
                    createPortal(
                        <div
                            onClick={() => setFullScreenView(false)}
                            className="sm:ml-[240px] backdrop-blur-sm absolute left-0 right-0 bottom-0 top-0 grid grid-cols-[1fr_minmax(0,_560px)_1fr] grid-rows-1"
                        >
                            {/* IMAGE  */}
                            <div />
                            <div>
                                <div>
                                    <FadeIn isOpen={true}>
                                        <div className="mx-4 rounded-lg  max-h-fit flex flex-col mt-16 hover:drop-shadow-2xl shadow-2xl">
                                            {viewingToken && viewingToken.tokenid !== '0x00' && (
                                                <div className="relative">
                                                    <img
                                                        className="h-auto rounded-lg relative w-full"
                                                        alt="token-icon"
                                                        src={
                                                            'url' in viewingToken.token && viewingToken.token.url.length
                                                                ? decodeURIComponent(viewingToken.token.url)
                                                                : `https://robohash.org/${viewingToken.tokenid}`
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </FadeIn>
                                </div>
                                <div />
                            </div>
                        </div>,
                        document.body
                    )}
                {viewingToken && (
                    <CardContent
                        header={
                            <div className="flex space-x-2 hover:bg-slate-100 hover:cursor-pointer border border-neutral-200 bg-neutral-50 rounded-lg mb-4 whitespace-nowrap">
                                {viewingToken.tokenid === '0x00' && (
                                    <div className="aspect-square w-20 h-20 overflow-hidden rounded-l-md">
                                        <img className="w-full h-full" src="./assets/token.svg" />
                                    </div>
                                )}
                                {viewingToken.tokenid !== '0x00' && (
                                    <div className="aspect-square w-20 h-20 overflow-hidden rounded-l-md">
                                        <img
                                            onClick={() =>
                                                'url' in viewingToken.token &&
                                                viewingToken.token.url.length &&
                                                decodeURIComponent(viewingToken.token.url).includes('https')
                                                    ? setFullScreenView(true)
                                                    : null
                                            }
                                            className={`w-full h-full rounded-l-md ${
                                                'url' in viewingToken.token &&
                                                viewingToken.token.url.length &&
                                                viewingToken.token.url.includes('https')
                                                    ? 'hover:cursor-pointer hover:scale-105 temporary-pulse animate-pulse '
                                                    : ''
                                            }`}
                                            alt="token-icon"
                                            src={
                                                'url' in viewingToken.token && viewingToken.token.url.length
                                                    ? decodeURIComponent(viewingToken.token.url)
                                                    : `https://robohash.org/${viewingToken.tokenid}`
                                            }
                                        />

                                        {viewingToken.tokenid !== '0x00' &&
                                            viewingToken.token.webvalidate &&
                                            viewingToken.token.webvalidate.length && (
                                                <NFTAuthenticity tokenid={viewingToken.tokenid} />
                                            )}
                                    </div>
                                )}

                                <div className="my-auto overflow-x-hidden">
                                    {viewingToken.tokenid === '0x00' && <h6 className="font-bold truncate">Minima</h6>}
                                    {viewingToken.tokenid !== '0x00' && (
                                        <h6 className="font-bold truncate">
                                            {viewingToken && 'name' in viewingToken.token
                                                ? viewingToken.token.name
                                                : 'Name not available'}
                                        </h6>
                                    )}
                                    {viewingToken.tokenid === '0x00' && (
                                        <p className="font-bold text-sm text-neutral-500 truncate">MINIMA</p>
                                    )}
                                    {viewingToken.tokenid !== '0x00' && (
                                        <>
                                            {viewingToken &&
                                                'ticker' in viewingToken.token &&
                                                !!viewingToken.token.ticker.length && (
                                                    <p className="font-bold text-sm text-neutral-500 truncate">
                                                        {viewingToken.token.ticker}
                                                    </p>
                                                )}
                                            {viewingToken &&
                                                'ticker' in viewingToken.token &&
                                                !viewingToken.token.ticker.length && (
                                                    <div className="h-4 bg-white rounded-full dark:bg-white max-w-[360px] text-black"></div>
                                                )}
                                        </>
                                    )}
                                </div>
                            </div>
                        }
                        content={
                            <>
                                <div className="mt-4 divide-solid divide-y-4">
                                    <div className="flex flex-col divide-solid divide-y-2">
                                        {viewingToken.tokenid === '0x00' && (
                                            <KeyValue title="Name" value={viewingToken.token} />
                                        )}
                                        {viewingToken.tokenid !== '0x00' && (
                                            <KeyValue
                                                title="Name"
                                                value={viewingToken.token.name ? viewingToken.token.name : 'N/A'}
                                            />
                                        )}

                                        {viewingToken.tokenid === '0x00' && (
                                            <KeyValue title="Description" value="Minima's Official Token" />
                                        )}
                                        {viewingToken.tokenid !== '0x00' && (
                                            <KeyValue
                                                title="Description"
                                                value={
                                                    viewingToken.token.description
                                                        ? viewingToken.token.description
                                                        : 'N/A'
                                                }
                                            />
                                        )}

                                        <KeyValue title="Token ID" value={viewingToken.tokenid} clipboard />

                                        <KeyValue
                                            title="Total Minted"
                                            value={makeMinimaNumber(viewingToken.total, 2000)}
                                        />

                                        <KeyValue
                                            title="Total Coins"
                                            value={makeMinimaNumber(viewingToken.coins, 2000)}
                                        />

                                        {viewingToken.tokenid !== '0x00' && (
                                            <KeyValue
                                                help={
                                                    <p className="p-4 bg-black text-white rounded-lg animate-fadeIn text-sm">
                                                        A web validated token would mean that the tokenid of this token
                                                        was put in a public .txt file on a URL you have provided after
                                                        minting was successful. If valid it will display{' '}
                                                        <svg
                                                            className="fill-green-400 inline"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            height="16"
                                                            viewBox="0 -960 960 960"
                                                            width="16"
                                                        >
                                                            <path d="m438-338 226-226-57-57-169 169-84-84-57 57 141 141Zm42 258q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Zm0-84q104-33 172-132t68-220v-189l-240-90-240 90v189q0 121 68 220t172 132Zm0-316Z" />
                                                        </svg>{' '}
                                                        and if invalid{' '}
                                                        <svg
                                                            className="fill-red-700 inline"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            height="16"
                                                            viewBox="0 -960 960 960"
                                                            width="16"
                                                        >
                                                            <path d="M200-120v-680h360l16 80h224v400H520l-16-80H280v280h-80Zm300-440Zm86 160h134v-240H510l-16-80H280v240h290l16 80Z" />
                                                        </svg>{' '}
                                                        on the token's icon.
                                                    </p>
                                                }
                                                title="Web validation"
                                                value={
                                                    <>
                                                        {viewingToken.token.tokenid !== '0x00' &&
                                                        viewingToken.token.webvalidate &&
                                                        !!viewingToken.token.webvalidate.length ? (
                                                            <a
                                                                className="hover:cursor-pointer text-blue-400 hover:underline break-all"
                                                                href={viewingToken.token.webvalidate}
                                                                target="_blank"
                                                            >
                                                                {viewingToken.token.webvalidate}
                                                            </a>
                                                        ) : (
                                                            'N/A'
                                                        )}
                                                    </>
                                                }
                                            />
                                        )}
                                    </div>

                                    <div className="flex flex-col divide-solid divide-y-2">
                                        <KeyValue
                                            title="Sendable"
                                            value={makeMinimaNumber(viewingToken.sendable, 2000)}
                                        />
                                        <KeyValue
                                            title="Confirmed"
                                            value={makeMinimaNumber(viewingToken.confirmed, 2000)}
                                        />
                                        <KeyValue
                                            title="Unconfirmed"
                                            value={makeMinimaNumber(viewingToken.unconfirmed, 2000)}
                                        />
                                    </div>
                                </div>
                            </>
                        }
                    />
                )}
            </>
        </Grid>
    );
};
export default TokenDetail;
