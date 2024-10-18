
import { useState, useContext, useMemo, ReactElement, useEffect } from 'react';
import { appContext } from '../../AppContext';
import { useNavigate } from 'react-router-dom';
import Masonry from 'react-masonry-css';
import useIsMinimaBrowser from '../../hooks/useIsMinimaBrowser';
import { Search, X, CheckCircle, ExternalLink } from 'lucide-react';
import Grid from '../../components/UI/Grid';

type NFT = {
  token: {
    name: string;
    url: string;
    description: string;
    owner: string;
    webvalidate?: string;
    [key: string]: any;
  };
  tokenid: string;
  confirmed: string;
  unconfirmed: string;
  sendable: string;
  coins: string;
  total: string;
  details: {
    decimals: number;
    script: string;
    totalamount: string;
    scale: string;
    created: string;
  };
};

const breakpointColumnsObj = {
  default: 3,
  1100: 3,
  700: 2,
  500: 1,
};

const Avatar = ({ src }: { src: string }) => (
  <img src={src} alt="Avatar" className="w-8 h-8 rounded-full" />
);

const NFTCard = ({ nft, onFavoriteToggle, isFavorite, isVerified }: { nft: NFT; onFavoriteToggle: () => void; isFavorite: boolean; isVerified: boolean }) => (
  <div className="w-full bg-white rounded-lg overflow-hidden shadow-lg transition-shadow hover:shadow-xl flex flex-col h-full">
    <div className="aspect-square relative">
      <img
        src={nft.token.url || `https://robohash.org/${nft.tokenid}`}
        alt={nft.token.name}
        className="w-full h-full object-cover"
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          onFavoriteToggle();
        }}
        className="absolute top-2 right-2 p-2 bg-white bg-opacity-70 rounded-full hover:bg-opacity-100 transition-all duration-200 focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-6 w-6 ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}
          fill={isFavorite ? 'currentColor' : 'none'}
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
      {isVerified && (
        <div className="absolute bottom-2 left-2 bg-white bg-opacity-70 rounded-full p-1">
          <CheckCircle className="h-5 w-5 text-green-500" />
        </div>
      )}
    </div>
    <div className="p-4 flex-grow flex flex-col justify-between">
      <div className="space-y-3">
        <h2 className="font-bold text-lg text-black truncate">{nft.token.name}</h2>
        <div className="flex items-center">
          <Avatar src="./assets/token.svg" />
          <p className="flex-grow text-neutral-800 pl-2 truncate">@{nft.token.owner || 'anon'}</p>
        </div>
      </div>
    </div>
  </div>
);

interface IProps {
  title: ReactElement;
  children: ReactElement;
  variant: 'sm' | 'lg';
}


export default function NFTDisplay() {
  const navigate = useNavigate();
  const [showDetail, setShowDetail] = useState<NFT | null>(null);
  const { NFTs, toggleFavourite, _favoriteTokens, setOpenDrawer } = useContext(appContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [verifiedTokens, setVerifiedTokens] = useState<string[]>([]);

  useEffect(() => {
    NFTs.forEach((nft) => {
      if (nft.token.webvalidate && nft.token.webvalidate.length) {
        (window as any).MDS.cmd(`tokenvalidate tokenid:${nft.tokenid}`, function(resp) {
          if (resp.response && resp.response.valid) {
            setVerifiedTokens((prev) => [...prev, nft.tokenid]);
          }
        });
      }
    });
  }, [NFTs]);

  const filteredNFTs = useMemo(() => {
    let nfts = activeTab === 'all' ? NFTs : NFTs.filter(nft => _favoriteTokens.includes(nft.tokenid));
    if (searchTerm) {
      nfts = nfts.filter(nft => 
        nft.token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.token.owner.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return nfts;
  }, [NFTs, _favoriteTokens, activeTab, searchTerm]);

  const getExtraMetadata = (token: NFT['token']) => {
    const defaultKeys = ['name', 'url', 'description', 'owner', 'webvalidate'];
    return Object.entries(token).filter(([key]) => !defaultKeys.includes(key));
  };

  const formatValue = (value: any) => {
    if (typeof value === 'object') {
      return JSON.stringify(value);
    } else if (typeof value === 'string' && value.length > 0) {
      return value;
    } else {
      return '-';
    }
  };

  const content = (
    <div className="bg-white rounded-lg shadow-md mx-4 sm:mx-0 overflow-hidden my-4">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex flex-wrap gap-4">
            <div className="bg-gray-100 px-4 py-2 rounded">
              <p className="text-sm text-gray-500">Total Collected</p>
              <p className="font-bold text-black">{NFTs.length}</p>
            </div>
            <div className="bg-gray-100 px-4 py-2 rounded">
              <p className="text-sm text-gray-500">Total Favorited</p>
              <p className="font-bold text-black">{_favoriteTokens.length}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('createnft')}
            className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Create
          </button>
        </div>

        <div className="mb-6">
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'favorites'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Favorites
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search NFTs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-100 border-2 border-gray-300 rounded-full px-5 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {filteredNFTs.map((nft: NFT) => (
            <div key={nft.tokenid} onClick={() => setShowDetail(nft)} className="mb-4">
              <NFTCard
                nft={nft}
                onFavoriteToggle={() => toggleFavourite(nft.tokenid)}
                isFavorite={_favoriteTokens.includes(nft.tokenid)}
                isVerified={verifiedTokens.includes(nft.tokenid)}
              />
            </div>
          ))}
        </Masonry>

        {filteredNFTs.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">No favorites yet</p>
          </div>
        )}
      </div>

      {showDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto md:ml-[240px] transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-black">{showDetail.token.name}</h2>
              <button onClick={() => setShowDetail(null)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mb-4 rounded overflow-hidden">
              <div className="relative pt-[100%]">
                <img
                  src={showDetail.token.url || `https://robohash.org/${showDetail.tokenid}`}
                  alt={showDetail.token.name}
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="flex items-center mb-4">
              <p className="text-lg font-semibold text-black mr-2">{showDetail.token.name}</p>
              {verifiedTokens.includes(showDetail.tokenid) && (
                <div className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Verified
                </div>
              )}
            </div>
            <p className="mb-2 text-black">{showDetail.token.description}</p>
            <p className="text-sm text-gray-500 mb-4">Owner: @{showDetail.token.owner || 'anon'}</p>
            {showDetail.token.webvalidate && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Webvalidate URL</h3>
                <a 
                  href={showDetail.token.webvalidate} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-500 hover:underline flex items-center"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  {showDetail.token.webvalidate}
                </a>
              </div>
            )}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Extra Metadata</h3>
              <div className="bg-gray-100 rounded-lg p-4">
                {getExtraMetadata(showDetail.token).length > 0 ? (
                  getExtraMetadata(showDetail.token).map(([key, value]) => (
                    <div key={key} className="mb-2">
                      <span className="font-medium text-gray-700">{key}: </span>
                      <span className="text-gray-600">
                        {formatValue(value)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No extra metadata</p>
                )}
              </div>
            </div>
            <button
              onClick={() => navigate(`/send?tokenid=${showDetail.tokenid}`)}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Transfer
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Grid
      title={ <>
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
        Balance
    </>}
      variant="lg"
    >
      {content}
    </Grid>
  );
}