import { createFileRoute, useNavigate } from '@tanstack/react-router'

import Tabs from '../../components/Tabs'
import { useContext } from 'react';
import { useState } from 'react';
import { appContext } from '../../AppContext';
import SearchBar from '../../components/SearchBar';
import TokenCard from '../../components/TokenCard';
export const Route = createFileRoute('/nfts/my-nfts')({
  component: Index,
})

function Index() {
  const { balance } = useContext(appContext);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

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
      title: 'Create',
    },
    {
      key: '/nfts/my-nfts',
      title: 'My NFTs',
    }
  ]

  const goToPage = (page: string) => {
    navigate({ to: page });
  }

  const activeTab = '/nfts/my-nfts';

  return (
    <div className="grow flex flex-col mb-20">
      <div>
        <div className="grid grid-cols-2">
          <div className="col-span-2">
            <h1 className="text-white text-2xl mb-6">My NFTs</h1>
          </div>
        </div>

        <div className="mt-2 mb-8">
          <Tabs
            tabs={TABS}
            activeKey={activeTab}
            onClick={goToPage}
          />
        </div>

        <SearchBar placeholder="Search for an NFT" value={query} onChange={setQuery} />

        <div className="my-8 grid grid-cols-12 gap-6">
          {nfts.length === 0 && (
            <div className="col-span-12 w-full flex items-center bg-contrast1 opacity-80 p-4 px-5 text-sm rounded">
              No NFTs found
            </div>
          )}
          {nfts.length > 0 && nfts.map((balance) => <TokenCard key={balance.tokenid} balance={balance} />)}
        </div>

      </div>
    </div>
  )
}
