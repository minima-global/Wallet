import { createFileRoute, Link } from "@tanstack/react-router";
import SearchBar from "../components/SearchBar";
import RefreshButton from "../components/RefreshButton";
import SortButton from "../components/SortButton";
import { appContext } from "../AppContext";
import { useContext, useState } from "react";
import useTranslation from "../hooks/useTranslation";
import TokenListItem from "../components/TokenListItem";

import GridButton from "../components/GridButton";
import TokenCard from "../components/TokenCard";
export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { balance, fetchBalance, hiddenTokens, hideHiddenTokens, setHideHiddenTokens, gridMode, setGridMode } = useContext(appContext);
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'desc' | 'asc'>('desc');

  const numberHiddenTokens = balance
    .filter(balance => {
      return hiddenTokens.includes(balance.tokenid);
    }).length;

  const filteredBalance = balance
    .filter(balance => {
      if (!hideHiddenTokens) {
        return true;
      }

      return !hiddenTokens.includes(balance.tokenid);
    })
    .filter(balance => {
      if (!query) return true;
      const tokenName = typeof balance.token === 'string' ? balance.token : balance.token.name;
      return tokenName.toLowerCase().includes(query.toLowerCase().trim());
    }).sort((a, b) => {
      // Always put Minima (0x00) at the top
      if (a.tokenid === '0x00') return -1;
      if (b.tokenid === '0x00') return 1;

      const aAmount = Number(a.sendable);
      const bAmount = Number(b.sendable);

      if (sort === 'desc') {
        if (aAmount > bAmount) return -1;
        if (aAmount < bAmount) return 1;
      } else {
        if (aAmount < bAmount) return -1;
        if (aAmount > bAmount) return 1;
      }

      return 0;
    });

  const toggleTokensHidden = () => {
    setHideHiddenTokens(prevState => !prevState);
  }

  const toggleGridMode = () => {
    setGridMode(prevState => prevState === 'list' ? 'grid' : 'list');
  }

  return (
    <div>
      <h1 className="text-white text-2xl mb-6">{t("balance")}</h1>

      <div className="mb-6 flex gap-2.5">
        <SearchBar value={query} onChange={setQuery} />
        <SortButton onClick={() => setSort(sort === 'desc' ? 'asc' : 'desc')} />
        <RefreshButton onClick={fetchBalance} />
        <GridButton gridMode={gridMode} onClick={toggleGridMode} />
      </div>

      <div onClick={toggleTokensHidden} className="mb-4 flex justify-end cursor-pointer select-none">
        <div className="flex items-center gap-2.5 text-sm text-grey60 text-xs font-bold bg-contrast1 w-fit rounded-full px-3.5 py-1.5 border dark:border-contrast2 origin-center active:scale-[0.95] transition-all duration-100">
          {hideHiddenTokens ? <img src="./assets/icons/eye-open.svg" alt="Show hidden tokens" className="text-white w-4 h-4" /> : <img src="./assets/icons/eye-closed.svg" alt="Show hidden tokens" className="w-4 h-4" />}
          {hideHiddenTokens ? t('show_hidden_tokens') : t('hide_hidden_tokens')}
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
          {hideHiddenTokens && (
            <div className="mt-2 text-left w-full text-[13px] font-bold text-grey60"><strong className="font-heavy">{numberHiddenTokens}</strong> {t('hidden_items')}</div>
          )}
        </ul>
      )}

      {gridMode === 'grid' && (
        <div className="mb-10">
          <div className="grid grid-cols-12 gap-4">
            {filteredBalance.map((balance) => (
              <TokenCard key={balance.tokenid} balance={balance} favourted={false} />
            ))}
          </div>
          {hideHiddenTokens && (
            <div className="mt-6 text-left w-full text-[13px] font-bold text-grey60"><strong className="font-heavy">{numberHiddenTokens}</strong> {t('hidden_items')}</div>
          )}
        </div>
      )}
    </div>
  );
}