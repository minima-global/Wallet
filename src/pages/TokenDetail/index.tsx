import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardContent, Grid, Stack, Divider } from '@mui/material';

import GridLayout from '../../layout/GridLayout';

import { useAppSelector } from '../../minima/redux/hooks';
import { selectTokenWithID } from '../../minima/redux/slices/balanceSlice';
import CustomListItem from '../../shared/components/CustomListItem';
import { createPortal } from 'react-dom';
import ScaleIn from '../../components/UI/Animations/ScaleIn';
import FadeIn from '../../components/UI/Animations/FadeIn';
import NFTAuthenticity from '../components/tokens/NFTAuthenticity';

const TokenDetail = () => {
    const { tokenid } = useParams();
    const [fullscreenView, setFullScreenView] = useState(false);

    const token = useAppSelector(selectTokenWithID(tokenid));
    const loading = token === undefined;

    return (
        <>
            <GridLayout
                spacing={2}
                loading={loading}
                children={
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
                                                    {token && token.tokenid !== '0x00' && (
                                                        <div className="relative">
                                                            <img
                                                                className="h-auto w-auto rounded-lg relative w-full"
                                                                alt="token-icon"
                                                                src={
                                                                    'url' in token.token && token.token.url.length
                                                                        ? token.token.url
                                                                        : `https://robohash.org/${token.tokenid}`
                                                                }
                                                            />
                                                            <NFTAuthenticity token={token} />
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
                        <Grid container>
                            <Grid item xs={12}>
                                {token && (
                                    <Card variant="outlined">
                                        <CardHeader
                                            title={
                                                <div className="bg-white flex gap-4 rounded-lg">
                                                    {token.tokenid === '0x00' && (
                                                        <div className="relative">
                                                            <svg
                                                                className="absolute right-0 bottom-0"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                height="24"
                                                                viewBox="0 -960 960 960"
                                                                width="24"
                                                            >
                                                                <path
                                                                    fill="#3DA2FF"
                                                                    d="m344-60-76-128-144-32 14-148-98-112 98-112-14-148 144-32 76-128 136 58 136-58 76 128 144 32-14 148 98 112-98 112 14 148-144 32-76 128-136-58-136 58Zm94-278 226-226-56-58-170 170-86-84-56 56 142 142Z"
                                                                />
                                                            </svg>
                                                            <svg
                                                                className="rounded-l-lg min-h-[80px] min-w-[80px]"
                                                                width="80"
                                                                height="80"
                                                                viewBox="0 0 80 81"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <rect
                                                                    width="80"
                                                                    height="80"
                                                                    transform="translate(0 0.550781)"
                                                                    fill="#08090B"
                                                                />
                                                                <path
                                                                    d="M52.3627 30.187L50.5506 37.9909L48.2331 28.5753L40.1133 25.3689L37.9178 34.8015L35.9836 23.7402L27.8638 20.5508L19.5 56.5508H28.3691L30.9305 45.4895L32.8646 56.5508H41.7512L43.9292 47.1182L46.2467 56.5508H55.1158L60.5 33.3764L52.3627 30.187Z"
                                                                    fill="white"
                                                                />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    {token.tokenid !== '0x00' && (
                                                        <div className="relative">
                                                            <img
                                                                onClick={() =>
                                                                    'url' in token.token &&
                                                                    token.token.url.length &&
                                                                    token.token.url.includes('https')
                                                                        ? setFullScreenView(true)
                                                                        : null
                                                                }
                                                                className={`max-w-[80px] max-h-[80px] w-[80px] h-[80px] rounded-l-lg min-h-[80px] min-w-[80px] ${
                                                                    'url' in token.token &&
                                                                    token.token.url.length &&
                                                                    token.token.url.includes('https')
                                                                        ? 'hover:cursor-pointer hover:scale-105'
                                                                        : ''
                                                                }`}
                                                                alt="token-icon"
                                                                src={
                                                                    'url' in token.token && token.token.url.length
                                                                        ? token.token.url
                                                                        : `https://robohash.org/${token.tokenid}`
                                                                }
                                                            />
                                                            <NFTAuthenticity token={token} />
                                                        </div>
                                                    )}

                                                    <div className="my-auto">
                                                        {token.tokenid === '0x00' && (
                                                            <h6 className="text-lg font-bold">Minima</h6>
                                                        )}
                                                        {token.tokenid !== '0x00' && (
                                                            <h6 className="text-lg font-bold">
                                                                {token && 'name' in token.token
                                                                    ? token.token.name
                                                                    : 'Name not available'}
                                                            </h6>
                                                        )}
                                                        {token.tokenid === '0x00' && <p className="text-sm">MINIMA</p>}
                                                        {token.tokenid !== '0x00' && (
                                                            <>
                                                                {token &&
                                                                    'ticker' in token.token &&
                                                                    !!token.token.ticker.length && (
                                                                        <p className="text-sm">{token.token.ticker}</p>
                                                                    )}
                                                                {token &&
                                                                    'ticker' in token.token &&
                                                                    !token.token.ticker.length && (
                                                                        <div className="h-4 bg-white rounded-full dark:bg-white max-w-[360px]"></div>
                                                                    )}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            }
                                        />

                                        <CardContent>
                                            <Stack spacing={2}>
                                                {token.tokenid === '0x00' && (
                                                    <CustomListItem title="Name" value={token.token} />
                                                )}
                                                {token.tokenid !== '0x00' && (
                                                    <CustomListItem
                                                        title="Name"
                                                        value={token.token.name ? token.token.name : 'N/A'}
                                                    />
                                                )}

                                                {token.tokenid === '0x00' && (
                                                    <CustomListItem
                                                        title="Description"
                                                        value="Minima's Official Token"
                                                    />
                                                )}
                                                {token.tokenid !== '0x00' && (
                                                    <CustomListItem
                                                        title="Description"
                                                        value={
                                                            token.token.description ? token.token.description : 'N/A'
                                                        }
                                                    />
                                                )}

                                                <CustomListItem title="Total Minted" value={token.total} />

                                                <CustomListItem title="Token ID" value={token.tokenid} />

                                                <CustomListItem title="Coins" value={token.coins} />

                                                {token.tokenid !== '0x00' && (
                                                    <CustomListItem
                                                        title="Web Validation"
                                                        value={
                                                            token.token.webvalidate && token.token.webvalidate.length
                                                                ? token.token.webvalidate
                                                                : 'N/A'
                                                        }
                                                    />
                                                )}
                                            </Stack>

                                            <Divider sx={{ mt: 2 }}></Divider>
                                            <Stack mt={2} spacing={2}>
                                                <CustomListItem
                                                    title="Sendable"
                                                    value={token.sendable ? token.sendable : 'N/A'}
                                                />
                                                <CustomListItem
                                                    title="Confirmed"
                                                    value={token.confirmed ? token.confirmed : 'N/A'}
                                                />
                                                <CustomListItem
                                                    title="Unconfirmed"
                                                    value={token.unconfirmed ? token.unconfirmed : 'N/A'}
                                                />
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                )}

                                {!token && (
                                    <Stack m={2} textAlign="center">
                                        <p>
                                            Token details for <i>{tokenid}</i> not found
                                        </p>
                                        <p>Please go back and try again.</p>
                                    </Stack>
                                )}
                            </Grid>
                        </Grid>
                    </>
                }
            />
        </>
    );
};
export default TokenDetail;
