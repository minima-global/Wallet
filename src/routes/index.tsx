import { createFileRoute } from "@tanstack/react-router";
import SearchBar from "../components/SearchBar";
import RefreshButton from "../components/RefreshButton";
import { appContext } from "../AppContext";
import { useContext, useState } from "react";
import useTranslation from "../hooks/useTranslation";
import TokenListItem from "../components/TokenListItem";

import GridButton from "../components/GridButton";
import TokenCard from "../components/TokenCard";
import OverlayModal from "../components/OverlayModal";
import Button from "../components/Button";

export const Route = createFileRoute("/")({
  component: Index,
});

const Sort = ({ title, selected, options, onClick }: { title: string, selected: string, options: { key: string, label: string }[], onClick: (option: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.key === selected);

  const toggleDropdown = () => {
    setIsOpen(prevState => !prevState);
  }

  const handleOptionClick = (option: { key: string, label: string }) => {
    setIsOpen(false);
    onClick(option.key);
  }

  return (
    <div className="relative text-[15px]">
      <div onClick={toggleDropdown} className="cursor-pointer flex items-center gap-3">
        <div className="text-grey80">
          {title}
        </div>
        <div className="font-bold capitalize">
          {selectedOption?.label}
        </div>
        <svg className="-mb-1" width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 6.0625L0 1.0625L1.0625 0L5 3.9375L8.9375 0L10 1.0625L5 6.0625Z" fill="#E9E9EB" />
        </svg>
      </div>
      <div className={`absolute z-20 top-[100%] mt-4 text-sm right-0 flex flex-col gap-[2px] bg-contrast1 whitespace-nowrap ${isOpen ? 'block' : 'hidden'}`}>
        {options.map((option) => (
          <button key={option.key} onClick={() => handleOptionClick(option)} className="bg-contrast2 px-4 py-2 text-white hover:bg-white hover:text-black">{option.label}</button>
        ))}
      </div>
      <div className={`fixed z-10 bg-black opacity-50 inset-0 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none hidden'}`} onClick={toggleDropdown}></div>
    </div>
  )
}

function Index() {
  const { balance, fetchBalance, hiddenTokens, activeTab, setActiveTab, gridMode, setGridMode } = useContext(appContext);
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'A-Z' | 'Z-A' | 'Lowest' | 'Highest'>('A-Z');
  const [filter, setFilter] = useState<'all' | 'simple' | 'nfts' | 'custom'>('all');
  const [proxySort, setProxySort] = useState<'A-Z' | 'Z-A' | 'Lowest' | 'Highest'>('A-Z');
  const [proxyFilter, setProxyFilter] = useState<'all' | 'simple' | 'nfts' | 'custom'>('all');
  const [showFilterAndSort, setShowFilterAndSort] = useState(false);

  const baseBalance = balance
    .filter(balance => {
      if (!query) return true;
      const tokenName = typeof balance.token === 'string' ? balance.token : balance.token.name;
      return tokenName.toLowerCase().includes(query.toLowerCase().trim()) || balance.tokenid.toLowerCase().includes(query.toLowerCase().trim());
    })
    .filter(balance => {
      if (filter === 'all') return true;
      if (filter === 'simple') return typeof balance.token === 'string';
      if (filter === 'nfts') return typeof balance.token === 'object' && (balance as any).details.decimals === 0;
      if (filter === 'custom') return typeof balance.token === 'object' && (balance as any).details.decimals !== 0;
    })

  const filteredBalance = baseBalance
    .filter(balance => {
      if (activeTab === 'main') {
        return !hiddenTokens.includes(balance.tokenid);
      }

      return hiddenTokens.includes(balance.tokenid);
    })
    .sort((a, b) => {
      // Always put Minima (0x00) at the top
      if (a.tokenid === '0x00') return -1;
      if (b.tokenid === '0x00') return 1;

      const aAmount = Number(a.sendable);
      const bAmount = Number(b.sendable);

      if (sort === 'A-Z') {
        const aName = typeof a.token === 'string' ? a.token : a.token.name;
        const bName = typeof b.token === 'string' ? b.token : b.token.name;
        return aName.localeCompare(bName);
      } else if (sort === 'Z-A') {
        const aName = typeof a.token === 'string' ? a.token : a.token.name;
        const bName = typeof b.token === 'string' ? b.token : b.token.name;
        return bName.localeCompare(aName);
      } else if (sort === 'Lowest') {
        if (aAmount > bAmount) return 1;
        if (aAmount < bAmount) return -1;
      } else if (sort === 'Highest') {
        if (aAmount < bAmount) return 1;
        if (aAmount > bAmount) return -1;
      }

      return 0;
    });

  const toggleGridMode = () => {
    setGridMode(prevState => prevState === 'list' ? 'grid' : 'list');
  }

  const sortOptions = [
    { key: 'A-Z', label: 'A-Z' },
    { key: 'Z-A', label: 'Z-A' },
    { key: 'Lowest', label: 'Lowest' },
    { key: 'Highest', label: 'Highest' },
  ];

  const filterOptions = [
    { key: 'all', label: 'All' },
    { key: 'simple', label: 'Simple' },
    { key: 'custom', label: 'Custom' },
    { key: 'nfts', label: 'NFTs' },
  ];

  const toggleFilterAndSort = () => {
    setShowFilterAndSort(prevState => !prevState);
  }

  const applyChanges = () => {
    setSort(proxySort);
    setFilter(proxyFilter);
    toggleFilterAndSort();
  };

  const resetChanges = () => {
    setSort('A-Z');
    setFilter('all');
    setProxySort('A-Z');
    setProxyFilter('all');
    toggleFilterAndSort();
  }

  return (
    <div>
      <OverlayModal display={showFilterAndSort}>
        <div className="text-left">
          <h5 className="mb-4 text-grey80">Sort by</h5>
          <div className="flex flex-col gap-3 mb-8">
            {sortOptions.map((option) => (
              <div className="flex items-center gap-2">
                <label className="w-full flex items-center gap-2 text-grey20">
                  {option.label}
                  <span className="grow flex justify-end relative">
                    <input type="radio" className="peer sr-only" name="sort" id={option.key} checked={proxySort === option.key} onChange={() => setProxySort(option.key as 'A-Z' | 'Z-A' | 'Lowest' | 'Highest')} />
                    <div className="relative peer-checked:[&>div]:opacity-100 w-4 h-4 border-2 border-grey60 peer-checked:border-orange rounded-full flex items-center justify-center">
                      <div className="absolute inset-0 opacity-0 top-0.5 left-0.5 w-2 h-2 rounded-full bg-orange"></div>
                    </div>
                  </span>
                </label>
              </div>
            ))}
          </div>
          <h5 className="mt-4 my-4 text-grey80">Filter by</h5>
          <div className="flex flex-col gap-3 mb-8">
            {filterOptions.map((option) => (
              <div className="flex items-center gap-2">
                <label className="w-full flex items-center gap-2 text-grey20">
                  {option.label}
                  <span className="grow flex justify-end relative">
                    <input type="radio" className="peer sr-only" name="filter" id={option.key} checked={proxyFilter === option.key} onChange={() => setProxyFilter(option.key as 'all' | 'simple' | 'nfts' | 'custom')} />
                    <div className="relative peer-checked:[&>div]:opacity-100 w-4 h-4 border-2 border-grey60 peer-checked:border-orange rounded-full flex items-center justify-center">
                      <div className="absolute inset-0 opacity-0 top-0.5 left-0.5 w-2 h-2 rounded-full bg-orange"></div>
                    </div>
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 mb-4">
          <Button onClick={applyChanges}>Apply</Button>
          <Button secondary onClick={resetChanges}>Reset</Button>
        </div>
      </OverlayModal>

      <h1 className="text-white text-2xl mb-6 flex items-center gap-2">
        <button disabled={activeTab === 'main'} className={`enabled:cursor-pointer ${activeTab === 'hidden' ? 'text-grey80' : 'text-white'}`} onClick={() => setActiveTab('main')}>
          {t("balance")}
        </button>
        {activeTab === 'hidden' && (
          <div className="flex gap-2">
            <div>/</div>
            <div>Hidden tokens</div>
          </div>
        )}
      </h1>

      <div className="mb-6 flex gap-2.5">
        <SearchBar value={query} onChange={setQuery} />
        <RefreshButton onClick={fetchBalance} />
        <GridButton gridMode={gridMode} onClick={toggleGridMode} />
      </div>

      <div className="flex gap-4 my-6">
        <div className="grow">
          <div className="flex lg:hidden items-center gap-6">
            <div onClick={toggleFilterAndSort} className="cursor-pointer text-grey80 font-bold text-[15px] active:text-white transition-all duration-100 mt-0.5">
              Filter & sort
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-6">
            <Sort title="Sort" selected={sort} options={sortOptions} onClick={(option) => setSort(option as 'A-Z' | 'Z-A' | 'Lowest' | 'Highest')} />
            <Sort title="Filter" selected={filter} options={filterOptions} onClick={(option) => setFilter(option as 'all' | 'simple' | 'nfts' | 'custom')} />
          </div>
        </div>
        <div className="col-span-6 flex items-center justify-end gap-5">
          {activeTab === 'hidden' && (
            <div className="underline cursor-pointer" onClick={() => setActiveTab('main')}>Go back</div>
          )}
          {activeTab !== 'hidden' && (
            <div className="underline cursor-pointer" onClick={() => setActiveTab('hidden')}>Hidden tokens</div>
          )}
        </div>
      </div>

      {gridMode === 'list' && (
        <ul className="select-none flex flex-col gap-2 mb-20">
          {filteredBalance.length === 0 && (
            <div className="w-full flex items-center bg-contrast1 opacity-80 p-3 px-4 text-sm rounded">
              No tokens found
            </div>
          )}
          {filteredBalance.map((balance) => (
            <TokenListItem key={balance.tokenid} balance={balance} />
          ))}
        </ul>
      )}

      {gridMode === 'grid' && (
        <div className="mb-10">
          <div className="grid grid-cols-12 gap-4">
            {filteredBalance.length === 0 && (
              <div className="col-span-12 w-full flex items-center bg-contrast1 opacity-80 p-3 px-4 text-sm rounded">
                No tokens found
              </div>
            )}
            {filteredBalance.map((balance) => (
              <TokenCard key={balance.tokenid} balance={balance} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}