import { useContext, useState } from 'react';

import { appContext } from '../../AppContext';

import Grid from '../../components/UI/Grid';
import Card from '../../components/UI/Card';
import { createPortal } from 'react-dom';
import Button from '../../components/UI/Button';
import KeyValue from '../../components/UI/KeyValue';
import { useNavigate } from 'react-router-dom';

const NFTs = () => {
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState(0);
    const [showDetail, setShowDetail] = useState<any | false>(false);

    const { NFTs, setOpenDrawer, toggleFavourite, _favoriteTokens } = useContext(appContext);

    const handleTabClick = (index: number) => {
        setSelectedTab(index);
    };

    console.log(_favoriteTokens);

    return (
        <Grid
            variant="lg"
            title={
                <>
                    <svg
                        onClick={() => setOpenDrawer(true)}
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
                        <div className="ml-0 md:ml-[240px] absolute top-0 right-0 left-0 bottom-0 bg-black bg-opacity-50 animate-fadeIn">
                            <Grid variant="lg" title={<></>}>
                                <div className="mx-4 rounded bg-white bg-opacity-90 p-4 h-max">
                                    <h1 className="text-black font-bold truncate mb-2 text-center">
                                        {showDetail.token.name.name}
                                    </h1>
                                    <div className="divide-y-2 mb-8">
                                        {!showDetail.token.name.url.length && (
                                            <div className=" bg-white flex flex-col gap-4 truncate">
                                                <div className="w-auto h-[50vh] flex items-center justify-center bg-slate-200">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        height="50vh"
                                                        viewBox="0 -960 960 960"
                                                        width="auto"
                                                    >
                                                        <path d="M360-390q-21 0-35.5-14.5T310-440q0-21 14.5-35.5T360-490q21 0 35.5 14.5T410-440q0 21-14.5 35.5T360-390Zm240 0q-21 0-35.5-14.5T550-440q0-21 14.5-35.5T600-490q21 0 35.5 14.5T650-440q0 21-14.5 35.5T600-390ZM480-160q134 0 227-93t93-227q0-24-3-46.5T786-570q-21 5-42 7.5t-44 2.5q-91 0-172-39T390-708q-32 78-91.5 135.5T160-486v6q0 134 93 227t227 93Zm0 80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-54-715q42 70 114 112.5T700-640q14 0 27-1.5t27-3.5q-42-70-114-112.5T480-800q-14 0-27 1.5t-27 3.5ZM177-581q51-29 89-75t57-103q-51 29-89 75t-57 103Zm249-214Zm-103 36Z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                        {showDetail.token.name.url.length && (
                                            <img
                                                className="h-auto w-full rounded-t-lg"
                                                src={showDetail.token.name.url}
                                                alt=""
                                            />
                                        )}
                                        <KeyValue
                                            title="Creator"
                                            value={
                                                showDetail.token.name.owner.length
                                                    ? showDetail.token.name.owner
                                                    : 'Anonymous'
                                            }
                                        />
                                        <KeyValue
                                            title="Description"
                                            value={
                                                showDetail.token.name.description.length
                                                    ? showDetail.token.name.description
                                                    : 'N/A'
                                            }
                                        />
                                        <KeyValue
                                            title="Web validation"
                                            value={
                                                <>
                                                    {!!showDetail.token.name.webvalidate.length && (
                                                        <div className="flex justify-between items-center">
                                                            <a
                                                                className="hover:cursor-pointer text-blue-400 hover:underline"
                                                                href={showDetail.token.name.webvalidate}
                                                                target="_blank"
                                                            >
                                                                {showDetail.token.name.webvalidate}
                                                            </a>
                                                        </div>
                                                    )}
                                                    {!showDetail.token.name.webvalidate.length && 'N/A'}
                                                </>
                                            }
                                        />
                                        <KeyValue
                                            title="External URL"
                                            value={
                                                <>
                                                    {!!showDetail.token.name.external_url.length && (
                                                        <a
                                                            className="hover:cursor-pointer text-blue-400 hover:underline"
                                                            href={showDetail.token.name.external_url}
                                                            target="_blank"
                                                        >
                                                            {showDetail.token.name.external_url}
                                                        </a>
                                                    )}
                                                    {!showDetail.token.name.external_url.length && 'N/A'}
                                                </>
                                            }
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Button
                                            onClick={() => navigate('/send?tokenid=' + showDetail.tokenid)}
                                            variant="primary"
                                        >
                                            Transfer
                                        </Button>
                                        <Button onClick={() => setShowDetail(false)} variant="secondary">
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </Grid>
                        </div>,

                        document.body
                    )}

                <Card>
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            <div className="bg-opacity-50 bg-white px-4 py-2">
                                <h6 className="text-black opacity-60 text-sm">Total collected</h6>
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
                </Card>
                <Card>
                    <>
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

                        {selectedTab === 0 && (
                            <ul
                                className={`grid grid-cols-2 ${
                                    NFTs.length > 2 ? 'md:grid-cols-3' : ''
                                } grid-rows-1 gap-2 mt-8 animate-fadeIn3`}
                            >
                                {NFTs.map((w: any) => (
                                    <li
                                        key={w.tokenid}
                                        className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                                    >
                                        {!!w.token.name.url.length && (
                                            <img
                                                onClick={() => setShowDetail(w)}
                                                className="rounded-t-lg w-[-webkit-fill-available]"
                                                src={w.token.name.url}
                                                alt=""
                                            />
                                        )}
                                        {!w.token.name.url.length && (
                                            <div
                                                className=" bg-white flex flex-col gap-4 truncate"
                                                onClick={() => setShowDetail(w)}
                                            >
                                                <div className="w-[-webkit-fill-available] flex items-center justify-center bg-slate-200">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        height="auto"
                                                        viewBox="0 -960 960 960"
                                                        width="auto"
                                                    >
                                                        <path d="M360-390q-21 0-35.5-14.5T310-440q0-21 14.5-35.5T360-490q21 0 35.5 14.5T410-440q0 21-14.5 35.5T360-390Zm240 0q-21 0-35.5-14.5T550-440q0-21 14.5-35.5T600-490q21 0 35.5 14.5T650-440q0 21-14.5 35.5T600-390ZM480-160q134 0 227-93t93-227q0-24-3-46.5T786-570q-21 5-42 7.5t-44 2.5q-91 0-172-39T390-708q-32 78-91.5 135.5T160-486v6q0 134 93 227t227 93Zm0 80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-54-715q42 70 114 112.5T700-640q14 0 27-1.5t27-3.5q-42-70-114-112.5T480-800q-14 0-27 1.5t-27 3.5ZM177-581q51-29 89-75t57-103q-51 29-89 75t-57 103Zm249-214Zm-103 36Z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}

                                        <div className="p-5">
                                            <div className="flex justify-between">
                                                <h5 className="text-sm font-bold tracking-tight text-gray-900 dark:text-white truncate">
                                                    {w.token.name.name}
                                                </h5>

                                                {_favoriteTokens.includes(w.tokenid) && (
                                                    <svg
                                                        onClick={() => toggleFavourite(w.tokenid)}
                                                        className="fill-red-700"
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
                                                        onClick={() => toggleFavourite(w.tokenid)}
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

                                            <p className="mb-3 font-light text-sm text-gray-700 dark:text-gray-400 truncate">
                                                {w.token.name.owner}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {selectedTab === 1 && (
                            <ul
                                className={`grid grid-cols-2 ${
                                    NFTs.length > 2 ? 'md:grid-cols-3' : ''
                                } grid-rows-1 gap-2 mt-8 animate-fadeIn3`}
                            >
                                {NFTs.filter((t: any) => _favoriteTokens.includes(t.tokenid)).map((w: any) => (
                                    <li
                                        key={w.tokenid}
                                        className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                                    >
                                        {!!w.token.name.url.length && (
                                            <img
                                                onClick={() => setShowDetail(w)}
                                                className="rounded-t-lg w-[-webkit-fill-available]"
                                                src={w.token.name.url}
                                                alt=""
                                            />
                                        )}
                                        {!w.token.name.url.length && (
                                            <div
                                                className=" bg-white flex flex-col gap-4 truncate"
                                                onClick={() => setShowDetail(w)}
                                            >
                                                <div className="w-[-webkit-fill-available] flex items-center justify-center bg-slate-200">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        height="auto"
                                                        viewBox="0 -960 960 960"
                                                        width="auto"
                                                    >
                                                        <path d="M360-390q-21 0-35.5-14.5T310-440q0-21 14.5-35.5T360-490q21 0 35.5 14.5T410-440q0 21-14.5 35.5T360-390Zm240 0q-21 0-35.5-14.5T550-440q0-21 14.5-35.5T600-490q21 0 35.5 14.5T650-440q0 21-14.5 35.5T600-390ZM480-160q134 0 227-93t93-227q0-24-3-46.5T786-570q-21 5-42 7.5t-44 2.5q-91 0-172-39T390-708q-32 78-91.5 135.5T160-486v6q0 134 93 227t227 93Zm0 80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-54-715q42 70 114 112.5T700-640q14 0 27-1.5t27-3.5q-42-70-114-112.5T480-800q-14 0-27 1.5t-27 3.5ZM177-581q51-29 89-75t57-103q-51 29-89 75t-57 103Zm249-214Zm-103 36Z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}

                                        <div className="p-5">
                                            <div className="flex justify-between">
                                                <h5 className="text-sm font-bold tracking-tight text-gray-900 dark:text-white truncate">
                                                    {w.token.name.name}
                                                </h5>

                                                {_favoriteTokens.includes(w.tokenid) && (
                                                    <svg
                                                        onClick={() => toggleFavourite(w.tokenid)}
                                                        className="fill-red-700"
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
                                                        onClick={() => toggleFavourite(w.tokenid)}
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

                                            <p className="mb-3 font-light text-sm text-gray-700 dark:text-gray-400 truncate">
                                                {w.token.name.owner}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>
                </Card>
            </div>
        </Grid>
    );
};

export default NFTs;

{
    /* <Card variant="outlined">
                <CardHeader
                    title={
                        <Stack spacing={1}>
                            <Stack flexDirection="row" alignItems="center" justifyContent="center">
                                <MiSearchBarWithIcon>
                                    <MiSearchBar
                                        value={filterText}
                                        onChange={(v: any) => {
                                            setFilterText(v.target.value);
                                        }}
                                        placeholder="Search by name, creator name or tokenid"
                                    />

                                    <Button
                                        variant="contained"
                                        disableElevation
                                        size="small"
                                        color="primary"
                                        onClick={() => navigate('/createnft')}
                                    >
                                        Create
                                    </Button>
                                </MiSearchBarWithIcon>
                            </Stack>
                            <Stack direction="column" justifyContent="space-between" spacing={1}>
                                <Tabs>
                                    <TabButton
                                        onClick={() => toggleTab(0)}
                                        className={tabs === 0 ? tabStyles['tab-open'] : undefined}
                                    >
                                        Collection
                                    </TabButton>
                                    <TabButton
                                        onClick={() => toggleTab(1)}
                                        className={tabs === 1 ? tabStyles['tab-open'] : undefined}
                                    >
                                        Favorited
                                    </TabButton>
                                </Tabs>
                            </Stack>
                        </Stack>
                    }
                /> */
}
{
    /* <CardContent>
                            <Stack spacing={3} sx={{ overflowY: 'auto' }}>
                                {tabs === 0 && (
                                    <Stack spacing={1}>
                                        {NFTs
                                            .filter(
                                                (t) =>
                                                    containsText(t.name.name, filterText) ||
                                                    containsText(t.tokenid, filterText) ||
                                                    ('owner' in t.name && containsText(t.name.owner, filterText))
                                            )
                                            .map((token) => (
                                                <NFTCard key={token.coinid} NFT={token} />
                                            ))}
                                        {!!filterText.length &&
                                            NFTs.filter(
                                                (t) =>
                                                    containsText(t.name.name, filterText) ||
                                                    containsText(t.tokenid, filterText) ||
                                                    ('owner' in t.name && containsText(t.name.owner, filterText))
                                            ).length === 0 && (
                                                <NoResults>
                                                    <h6>No results</h6>
                                                    <p>Please try your search again.</p>
                                                </NoResults>
                                            )}
                                        {NFTs.length === 0 && !filterText.length && (
                                            <NoResults>
                                                <h6>No NFTs in your collection yet</h6>
                                                <p>Click the create new button to create some</p>
                                            </NoResults>
                                        )}
                                    </Stack>
                                )}
                                {tabs === 1 && (
                                    <Stack spacing={1}>
                                        {NFTs
                                            .filter(
                                                (t) =>
                                                    containsText(t.name.name, filterText) ||
                                                    containsText(t.tokenid, filterText) ||
                                                    ('owner' in t.name && containsText(t.name.owner, filterText))
                                            )
                                            .map((token) => (
                                                <NFTCard key={token.coinid} NFT={token} />
                                            ))}
                                        {!!filterText.length &&
                                            NFTs.filter(
                                                (t) =>
                                                    containsText(t.name.name, filterText) ||
                                                    containsText(t.tokenid, filterText) ||
                                                    ('owner' in t.name && containsText(t.name.owner, filterText))
                                            ).length === 0 && (
                                                <NoResults>
                                                    <h6>No results</h6>
                                                    <p>Please try your search again.</p>
                                                </NoResults>
                                            )}
                                        {NFTs.length === 0 && !filterText.length && (
                                            <NoResults>
                                                <h6>No favorites saved</h6>
                                                <p>Click the heart on an NFT to favorite it</p>
                                            </NoResults>
                                        )}
                                    </Stack>
                                )}
                            </Stack>
                        </CardContent> */
}
{
    /* </Card> */
}
