import { createFileRoute, useNavigate } from '@tanstack/react-router'

import Tabs from '../../components/Tabs'
import { useContext } from 'react';
import { useState } from 'react';
import { appContext } from '../../AppContext';
import SearchBar from '../../components/SearchBar';
import TokenCard from '../../components/TokenCard';
import HeartButton from '../../components/HeartButton';
import useTranslation from '../../hooks/useTranslation';
export const Route = createFileRoute('/nfts/my-nfts')({
  component: Index,
})

function Index() {
  const { t } = useTranslation();
  const { balance, favourites } = useContext(appContext);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [showOnlyFavourites, setShowOnlyFavourites] = useState(false);

  const nfts = balance
    .filter((token) => typeof token.token === 'object' && (token as any).details.decimals === 0)
    .filter((token) => {
      if (!query) return true;
      const tokenName = typeof token.token === 'string' ? token.token : token.token.name;
      return tokenName.toLowerCase().includes(query.toLowerCase().trim()) || token.tokenid.toLowerCase().includes(query.toLowerCase().trim());
    });

  const TABS = [
    {
      key: '/nfts/create',
      title: t("create"),
    },
    {
      key: '/nfts/my-nfts',
      title: t("my_nfts"),
    }
  ]

  const goToPage = (page: string) => {
    navigate({ to: page });
  }

  const activeTab = '/nfts/my-nfts';

  const toggleShowOnlyFavourites = () => {
    setShowOnlyFavourites(!showOnlyFavourites);
  }

  return (
    <div className="grow flex flex-col mb-20">
      <div>
        <div className="grid grid-cols-2">
          <div className="col-span-2">
            <h1 className="text-white text-2xl mb-6">
              {t("my_nfts")}
            </h1>
          </div>
        </div>

        <div className="mt-2 mb-8">
          <Tabs
            tabs={TABS}
            activeKey={activeTab}
            onClick={goToPage}
          />
        </div>

        <div className="flex gap-4">
          <SearchBar placeholder={t("search_for_an_nft")} value={query} onChange={setQuery} />
          <HeartButton showOnlyFavourites={showOnlyFavourites} onClick={toggleShowOnlyFavourites} />
        </div>

        <div className="my-8 grid grid-cols-12 gap-6">
          {nfts.length === 0 && (
            <div className="col-span-12 w-full flex items-center bg-contrast1 opacity-80 p-4 px-5 text-sm rounded">
              {t("no_nfts_found")}
            </div>
          )}
          {nfts.length > 0 && nfts
            .filter((token) => {
              if (showOnlyFavourites) {
                return favourites.includes(token.tokenid);
              }
              return true;
            })
            .map((balance) => <TokenCard key={balance.tokenid} balance={balance} showFavourite={true} />)}
        </div>

      </div>
    </div>
  )
}
