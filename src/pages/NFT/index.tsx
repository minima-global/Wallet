import { useContext, useState } from 'react';

import { appContext } from '../../AppContext';

import Grid from '../../components/UI/Grid';
import { createPortal } from 'react-dom';
import CardContent from '../../components/UI/CardContent';

import Masonry from 'react-masonry-css';
import NFTAuthenticity from '../components/tokens/NFTAuthenticity';

const breakpointColumnsObj = {
    default: 3,
    1100: 3,
    700: 2,
    500: 1,
};

const NFTs = () => {
    
    const [selectedTab, setSelectedTab] = useState(0);
    const [showDetail, setShowDetail] = useState<any | false>(false);
    const { NFTs, setOpenDrawer, toggleFavourite, _favoriteTokens } = useContext(appContext);

    const handleTabClick = (index: number) => {
        setSelectedTab(index);
    };

    return null;
    return (
        <Grid
            variant="lg"
            title={
                <>
                    <svg
                        onClick={(e: any) => {
                            e.stopPropagation();
                            setOpenDrawer(true);
                        }}
                        className="block md:hidden fill-white"
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        viewBox="0 -960 960 960"
                        width="24"
                    >
                        <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
                    </svg>
                    Non-fungible Tokens
                </>
            }
        >
            <div className="flex flex-col gap-1">
                {showDetail &&
                    createPortal(
                        <div
                            onClick={() => setShowDetail(false)}
                            className="ml-0 md:ml-[240px] absolute top-0 right-0 left-0 bottom-0 bg-black bg-opacity-50 animate-fadeIn"
                        >
                            <Grid
                                variant="lg"
                                title={
                                    <>
                                        <svg
                                            className="fill-white hover:cursor-pointer"
                                            onClick={(e: any) => {
                                                e.stopPropagation();
                                                setShowDetail(false);
                                            }}
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="24"
                                            viewBox="0 -960 960 960"
                                            width="24"
                                        >
                                            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                                        </svg>
                                        NFT Details
                                    </>
                                }
                            >
                                <div
                                    onClick={(e: any) => e.stopPropagation()}
                                    className="grid grid-cols-1 md:grid-cols-[1fr_1fr] bg-white rounded mx-8 my-4 h-max py-4 px-4 md:px-0 md:py-0 gap-2"
                                >
                                    <div className="flex justify-center items-start md:items-center">
                                        <div className="rounded border">
                                            {'url' in showDetail.name && !!showDetail.name.url.length && (
                                                <img
                                                    className="h-[378px] w-[378px] object-cover"
                                                    src={showDetail.name.url}
                                                    alt={`my_NFT_${showDetail.tokenid}`}
                                                />
                                            )}
                                            {(!showDetail.name.url ||
                                                ('url' in showDetail.name && showDetail.name.url.length === 0)) && (
                                                <h3 className="h-[378px] w-[378px] flex items-center justify-center text-slate-400">
                                                    No image set
                                                </h3>
                                            )}
                                        </div>
                                    </div>
                                    <div className="px-4 md:px-0 py-4 overflow-auto grid grid-rows-[2fr_1fr]">
                                        <div className="grid grid-rows-[1fr_1fr]">
                                            <div>
                                                <div className="animate-fadeIn text-inherit font-bold truncate w-full grid grid-cols-[auto_1fr] gap-1">
                                                    <h1 className="font-bold truncate text-left text-black text-xl">
                                                        {'name' in showDetail.name && showDetail.name.name}
                                                        {!('name' in showDetail.name) && 'N/A'}
                                                    </h1>
                                                    <div className="relative">
                                                        {showDetail.name.webvalidate &&
                                                            showDetail.name.webvalidate.length && (
                                                                <NFTAuthenticity
                                                                    relative
                                                                    tokenid={showDetail.tokenid}
                                                                />
                                                            )}
                                                    </div>
                                                </div>
                                                <p className="p-0 m-0 lowercase text-slate-500">
                                                    @
                                                    {'owner' in showDetail.name && showDetail.name.owner.length
                                                        ? showDetail.name.owner
                                                        : 'anon'}
                                                </p>
                                                <p className="whitespace-normal break-word">
                                                    {'description' in showDetail.name &&
                                                    showDetail.name.description.length
                                                        ? showDetail.name.description
                                                        : 'No description'}
                                                </p>
                                            </div>
                                            <div>
                                                {('external_url' in showDetail.name ||
                                                    'webvalidate' in showDetail.name) && (
                                                    <h3 className="font-extrabold text-lg">Extra data</h3>
                                                )}
                                                {'external_url' in showDetail.name && (
                                                    <div>
                                                        <h6>External Url</h6>
                                                        {showDetail.name.external_url.length ? (
                                                            <a
                                                                className="text-blue-500"
                                                                target="_blank"
                                                                href={showDetail.name.external_url}
                                                            >
                                                                {showDetail.name.external_url}
                                                            </a>
                                                        ) : (
                                                            <p className="text-sm text-slate-500">None set</p>
                                                        )}
                                                    </div>
                                                )}
                                                {'webvalidate' in showDetail.name && (
                                                    <div>
                                                        <h6>Webvalidate</h6>
                                                        {showDetail.name.webvalidate.length ? (
                                                            <a
                                                                className="text-blue-500"
                                                                target="_blank"
                                                                href={showDetail.name.webvalidate}
                                                            >
                                                                {showDetail.name.webvalidate}
                                                            </a>
                                                        ) : (
                                                            <p className="text-sm text-slate-500">None set</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-end mr-4">
                                            <button
                                                onClick={() => navigate('/send?tokenid=' + showDetail.tokenid)}
                                                className="bg-black hover:bg-opacity-90 w-full rounded-lg p-4 text-white h-max"
                                            >
                                                Transfer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Grid>
                        </div>,

                        document.body
                    )}

                <CardContent
                    header={
                        <>
                            <div className="flex justify-between items-center">
                                <div className="flex gap-2">
                                    <div className="bg-opacity-50 bg-white px-4 py-2">
                                        <h6 className="text-black opacity-60 text-sm">Total Collected</h6>
                                        <p className="text-black">{NFTs.length}</p>
                                    </div>
                                    <div className="bg-opacity-50 bg-white px-4 py-2">
                                        <h6 className="text-black opacity-60 text-sm">Total Favorited</h6>
                                        <p className="text-black">{_favoriteTokens.length}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate('createnft')}
                                    className={`flex text-sm text-black font-semibold hover:cursor-pointer hover:opacity-90 border-2 border-black rounded-lg py-2 px-4 hover:bg-black hover:text-white hover:fill-[#363AFF] transition-all delay-50 `}
                                >
                                    Create
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleTabClick(0)}
                                    className={`flex text-sm text-black font-semibold hover:cursor-pointer hover:opacity-90 border-2 border-black rounded-lg py-2 px-4 hover:bg-black hover:text-white hover:fill-[#363AFF] transition-all delay-50 ${
                                        selectedTab === 0 ? 'bg-black text-white' : ''
                                    }`}
                                >
                                    Collection
                                </button>
                                <button
                                    onClick={() => handleTabClick(1)}
                                    className={`flex text-sm text-black font-semibold hover:cursor-pointer hover:opacity-90 border-2 border-black rounded-lg py-2 px-4 hover:bg-black hover:text-white hover:fill-[#363AFF] transition-all delay-50 ${
                                        selectedTab === 1 ? 'bg-black text-white' : ''
                                    }`}
                                >
                                    Favorites
                                </button>
                            </div>
                        </>
                    }
                    content={
                        <>
                            {selectedTab === 0 && (
                                <Masonry
                                    breakpointCols={breakpointColumnsObj}
                                    className="my-masonry-grid"
                                    columnClassName="my-masonry-grid_column"
                                >
                                    {NFTs &&
                                        !!NFTs.length &&
                                        NFTs.map((w: any) => (
                                            <div
                                                onClick={() => setShowDetail(w)}
                                                key={`my_NFT_${w.tokenid}`}
                                                className="rounded bg-white hover:scale-95 delay-90 transition duration-300 ease-in-out"
                                            >
                                                <div className="relative group">
                                                    {'url' in w.name && !!w.name.url.length && (
                                                        <img
                                                            className="w-[-webkit-fill-available]"
                                                            src={w.name.url}
                                                            alt=""
                                                        />
                                                    )}
                                                    {(('url' in w.name && !w.name.url.length) || !w.name.url) && (
                                                        <div>
                                                            <img
                                                                className="w-[-webkit-fill-available]"
                                                                alt="token-icon"
                                                                src={`https://robohash.org/${w.tokenid}`}
                                                            />
                                                        </div>
                                                    )}

                                                    <div className="absolute group-hover:grid hidden animate-fadeIn bottom-0 text-inherit font-bold truncate w-full grid-cols-[1fr_auto]">
                                                        <h3 className="pl-2">
                                                            {'name' in w.name ? w.name.name : 'N/A'}
                                                        </h3>

                                                        {w.name.webvalidate && w.name.webvalidate.length && (
                                                            <NFTAuthenticity tokenid={w.tokenid} />
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="bg-white p-4">
                                                    <div className="grid grid-cols-[1fr_auto] gap-1">
                                                        <h3 className="lowercase font-semibold truncate">
                                                            @
                                                            {'owner' in w.name && w.name.owner.length
                                                                ? w.name.owner
                                                                : 'anon'}
                                                        </h3>
                                                        <div>
                                                            {_favoriteTokens.includes(w.tokenid) && (
                                                                <svg
                                                                    onClick={(e: any) => {
                                                                        e.stopPropagation();
                                                                        toggleFavourite(w.tokenid);
                                                                    }}
                                                                    className="fill-blue-400"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    height="24"
                                                                    viewBox="0 -960 960 960"
                                                                    width="24"
                                                                >
                                                                    <path d="m479.761-109-63.5-57.022q-101.957-91.717-168.555-158.434-66.597-66.718-105.717-119.816-39.12-53.098-54.74-97.815Q71.63-586.804 71.63-634q0-97.587 65.272-162.978 65.272-65.392 162.859-65.392 51.761 0 98.522 21.044 46.76 21.043 81.478 59.847 34.717-38.804 81.478-59.847Q608-862.37 659.761-862.37q97.587 0 163.098 65.392Q888.37-731.587 888.37-634q0 46.957-15.5 91.674-15.5 44.717-54.739 97.696-39.24 52.978-105.957 119.815-66.717 66.837-168.913 158.793L479.761-109Z" />
                                                                </svg>
                                                            )}
                                                            {!_favoriteTokens.includes(w.tokenid) && (
                                                                <svg
                                                                    onClick={(e: any) => {
                                                                        e.stopPropagation();
                                                                        toggleFavourite(w.tokenid);
                                                                    }}
                                                                    className="hover:cursor-pointer hover:animate-pulse hover:fill-red-600"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    height="24"
                                                                    viewBox="0 -960 960 960"
                                                                    width="24"
                                                                >
                                                                    <path d="M440-501Zm0 381L313-234q-72-65-123.5-116t-85-96q-33.5-45-49-87T40-621q0-94 63-156.5T260-840q52 0 99 22t81 62q34-40 81-62t99-22q81 0 136 45.5T831-680h-85q-18-40-53-60t-73-20q-51 0-88 27.5T463-660h-46q-31-45-70.5-72.5T260-760q-57 0-98.5 39.5T120-621q0 33 14 67t50 78.5q36 44.5 98 104T440-228q26-23 61-53t56-50l9 9 19.5 19.5L605-283l9 9q-22 20-56 49.5T498-172l-58 52Zm280-160v-120H600v-80h120v-120h80v120h120v80H800v120h-80Z" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </Masonry>
                            )}
                            {selectedTab === 1 && (
                                <Masonry
                                    breakpointCols={breakpointColumnsObj}
                                    className="my-masonry-grid"
                                    columnClassName="my-masonry-grid_column"
                                >
                                    {_favoriteTokens &&
                                        !!_favoriteTokens.length &&
                                        NFTs.filter((t: any) => _favoriteTokens.includes(t.tokenid)).map((w: any) => (
                                            <div
                                                onClick={() => setShowDetail(w)}
                                                key={`my_NFT_${w.tokenid}`}
                                                className="rounded bg-white hover:scale-95 delay-90 transition duration-300 ease-in-out"
                                            >
                                                <div className="relative group">
                                                    {'url' in w.name && !!w.name.url.length && (
                                                        <img
                                                            className="w-[-webkit-fill-available]"
                                                            src={w.name.url}
                                                            alt=""
                                                        />
                                                    )}
                                                    {(('url' in w.name && !w.name.url.length) || !w.name.url) && (
                                                        <div>
                                                            <img
                                                                className="w-[-webkit-fill-available]"
                                                                alt="token-icon"
                                                                src={`https://robohash.org/${w.tokenid}`}
                                                            />
                                                        </div>
                                                    )}

                                                    <div className="absolute group-hover:grid hidden animate-fadeIn bottom-0 text-inherit font-bold truncate w-full grid-cols-[1fr_auto]">
                                                        <h3 className="pl-2">
                                                            {'name' in w.name ? w.name.name : 'N/A'}
                                                        </h3>

                                                        {w.name.webvalidate && w.name.webvalidate.length && (
                                                            <NFTAuthenticity tokenid={w.tokenid} />
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="bg-white p-4">
                                                    <div className="grid grid-cols-[1fr_auto] gap-1">
                                                        <h3 className="lowercase font-semibold truncate">
                                                            @
                                                            {'owner' in w.name && w.name.owner.length
                                                                ? w.name.owner
                                                                : 'anon'}
                                                        </h3>
                                                        <div>
                                                            {_favoriteTokens.includes(w.tokenid) && (
                                                                <svg
                                                                    onClick={(e: any) => {
                                                                        e.stopPropagation();
                                                                        toggleFavourite(w.tokenid);
                                                                    }}
                                                                    className="fill-blue-400"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    height="24"
                                                                    viewBox="0 -960 960 960"
                                                                    width="24"
                                                                >
                                                                    <path d="m479.761-109-63.5-57.022q-101.957-91.717-168.555-158.434-66.597-66.718-105.717-119.816-39.12-53.098-54.74-97.815Q71.63-586.804 71.63-634q0-97.587 65.272-162.978 65.272-65.392 162.859-65.392 51.761 0 98.522 21.044 46.76 21.043 81.478 59.847 34.717-38.804 81.478-59.847Q608-862.37 659.761-862.37q97.587 0 163.098 65.392Q888.37-731.587 888.37-634q0 46.957-15.5 91.674-15.5 44.717-54.739 97.696-39.24 52.978-105.957 119.815-66.717 66.837-168.913 158.793L479.761-109Z" />
                                                                </svg>
                                                            )}
                                                            {!_favoriteTokens.includes(w.tokenid) && (
                                                                <svg
                                                                    onClick={(e: any) => {
                                                                        e.stopPropagation();
                                                                        toggleFavourite(w.tokenid);
                                                                    }}
                                                                    className="hover:cursor-pointer hover:animate-pulse hover:fill-red-600"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    height="24"
                                                                    viewBox="0 -960 960 960"
                                                                    width="24"
                                                                >
                                                                    <path d="M440-501Zm0 381L313-234q-72-65-123.5-116t-85-96q-33.5-45-49-87T40-621q0-94 63-156.5T260-840q52 0 99 22t81 62q34-40 81-62t99-22q81 0 136 45.5T831-680h-85q-18-40-53-60t-73-20q-51 0-88 27.5T463-660h-46q-31-45-70.5-72.5T260-760q-57 0-98.5 39.5T120-621q0 33 14 67t50 78.5q36 44.5 98 104T440-228q26-23 61-53t56-50l9 9 19.5 19.5L605-283l9 9q-22 20-56 49.5T498-172l-58 52Zm280-160v-120H600v-80h120v-120h80v120h120v80H800v120h-80Z" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </Masonry>
                            )}

                            {selectedTab === 0 && NFTs.length === 0 && (
                                <div className="text-center">
                                    <p>No NFTs yet</p>
                                </div>
                            )}
                            {selectedTab === 1 && _favoriteTokens.length === 0 && (
                                <div className="text-center">
                                    <p>No favorites yet</p>
                                </div>
                            )}
                        </>
                    }
                />
            </div>
        </Grid>
    );
};

export default NFTs;
