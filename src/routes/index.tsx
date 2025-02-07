import { createFileRoute, Link } from "@tanstack/react-router";
import SearchBar from "../components/SearchBar";
import RefreshButton from "../components/RefreshButton";
import SortButton from "../components/SortButton";
import { appContext } from "../AppContext";
import { useContext, useState } from "react";
import useTranslation from "../hooks/useTranslation";
import useFormatAmount from "../hooks/useFormatAmount";
import { Balance } from "@minima-global/mds";
import { renderTokenName } from "../utils";
import TokenAuthenticity from "../components/TokenAuthenticity";
import TokenIcon from "../components/TokenIcon";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { balance, fetchBalance, hiddenTokens, hideHiddenTokens, setHideHiddenTokens } = useContext(appContext);
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

  return (
    <div>
      <h1 className="text-white text-2xl mb-6">{t("balance")}</h1>

      <div className="mb-6 flex gap-2.5">
        <SearchBar value={query} onChange={setQuery} />
        <SortButton action={() => setSort(sort === 'desc' ? 'asc' : 'desc')} />
        <RefreshButton action={fetchBalance} />
        {/* <GridButton /> */}
      </div>

      <div onClick={toggleTokensHidden} className="mb-4 flex justify-end cursor-pointer select-none">
        <div className="flex items-center gap-2.5 text-sm text-grey60 text-xs font-bold bg-contrast1 w-fit rounded-full px-3.5 py-1.5 border dark:border-contrast2 origin-center active:scale-[0.95] transition-all duration-100">
          {hideHiddenTokens ? <img src="./assets/icons/eye-open.svg" alt="Show hidden tokens" className="text-white w-4 h-4" /> : <img src="./assets/icons/eye-closed.svg" alt="Show hidden tokens" className="w-4 h-4" />}
          {hideHiddenTokens ? t('show_hidden_tokens') : t('hide_hidden_tokens')}
        </div>
      </div>

      <ul className="select-none flex flex-col gap-2 mb-20">
        {filteredBalance.length === 0 && (
          <div className="w-full flex items-center bg-contrast1 opacity-80 p-3 px-4 text-sm rounded">
            No tokens found
          </div>
        )}
        {filteredBalance.map((balance) => (
          <BalanceItem key={balance.tokenid} balance={balance} />
        ))}
        {hideHiddenTokens && (
          <div className="mt-2 text-right w-full text-[13px] font-bold text-grey60"><strong className="font-heavy">{numberHiddenTokens}</strong> {t('hidden_items')}</div>
        )}
      </ul>
    </div>
  );
}

const BalanceItem = ({ balance }: { balance: Balance }) => {
  const { f } = useFormatAmount();
  const { t } = useTranslation();
  const [opened, setOpened] = useState(false);

  const toggleOpened = (evt: React.MouseEvent<HTMLDivElement>) => {
    evt.preventDefault();
    setOpened(prevState => !prevState);
  }

  return (
    <li className="relative">
      <Link to="/balance/$id" params={{ id: balance.tokenid }}>
        <div className={`w-full flex items-center bg-contrast1 hover:bg-contrast2 transition-all duration-100 p-3 ${opened ? "!bg-contrast1.5" : ""}`}>
          <div className="grow flex">
            <TokenIcon token={balance.token} tokenId={balance.tokenid} />
            <div className="grow overflow-hidden px-4">
              <div className="grow w-full">
                <div className="flex grow gap-1">
                  <h6 className="font-bold truncate text-black dark:text-neutral-400">
                    {renderTokenName(balance)}
                  </h6>
                  <TokenAuthenticity token={balance} />
                </div>
                <p className="font-bold truncate text-grey dark:text-neutral-300">
                  {f(balance.sendable)}
                </p>
              </div>
            </div>
            <div onClick={toggleOpened} className="cursor-pointer flex items-center px-3">
              <svg className={`fill-[#91919D] hover:fill-white transition-all transition-100 ${opened ? "!fill-orange rotate-90" : ""}`} width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.875 5L0.9375 1.0625L2 0L7 5L2 10L0.9375 8.9375L4.875 5Z" fill="#currentColor" />
              </svg>
            </div>
          </div>
        </div>

        <div className={`${opened ? 'h-auto' : 'h-0'} pt-0.5 overflow-hidden transition-all duration-300 flex flex-col gap-[1px]`}>
          <div className="bg-contrast1.5 pt-3 pb-3.5 flex items-center">
            <div className="px-8">
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.10417 9.4375L0.0625 5.41667L1.125 4.33333L4.10417 7.3125L10.875 0.5625L11.9375 1.625L4.10417 9.4375Z" fill="#009479" />
              </svg>
            </div>
            <div className="grow text-white">
              <div className="text-sm text-grey60 mb-0.5">
                {t("available")}
              </div>
              <div className="text-sm font-bold">{f(balance.confirmed)}</div>
            </div>
            <div className="pr-5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.45964 11.7915H8.54297V6.99984H7.45964V11.7915ZM7.99693 5.74025C8.16276 5.74025 8.30325 5.68414 8.41839 5.57192C8.53352 5.4597 8.59109 5.32067 8.59109 5.15484C8.59109 4.989 8.53498 4.84852 8.42276 4.73338C8.31054 4.61838 8.17151 4.56088 8.00568 4.56088C7.83984 4.56088 7.69936 4.61692 7.58422 4.729C7.46908 4.84123 7.41151 4.98025 7.41151 5.14609C7.41151 5.31192 7.46762 5.45241 7.57984 5.56755C7.69207 5.68268 7.83109 5.74025 7.99693 5.74025ZM8.00839 15.5832C6.96519 15.5832 5.98269 15.3858 5.06089 14.9911C4.13908 14.5964 3.33227 14.0532 2.64047 13.3617C1.94866 12.6702 1.40526 11.864 1.01026 10.9432C0.615399 10.0225 0.417969 9.03866 0.417969 7.99171C0.417969 6.94477 0.61533 5.96386 1.01005 5.049C1.40477 4.13414 1.9479 3.33081 2.63943 2.639C3.33096 1.9472 4.13714 1.4038 5.05797 1.0088C5.97866 0.613934 6.96248 0.416504 8.00943 0.416504C9.05637 0.416504 10.0373 0.613865 10.9521 1.00859C11.867 1.40331 12.6703 1.94643 13.3621 2.63796C14.0539 3.32949 14.5973 4.134 14.9923 5.0515C15.3872 5.96914 15.5846 6.94956 15.5846 7.99275C15.5846 9.03595 15.3873 10.0184 14.9926 10.9403C14.5978 11.8621 14.0547 12.6689 13.3632 13.3607C12.6716 14.0525 11.8671 14.5959 10.9496 14.9909C10.032 15.3857 9.05158 15.5832 8.00839 15.5832ZM8.0013 14.4998C9.80686 14.4998 11.3416 13.8679 12.6055 12.604C13.8694 11.3401 14.5013 9.80539 14.5013 7.99984C14.5013 6.19428 13.8694 4.65956 12.6055 3.39567C11.3416 2.13178 9.80686 1.49984 8.0013 1.49984C6.19575 1.49984 4.66102 2.13178 3.39714 3.39567C2.13325 4.65956 1.5013 6.19428 1.5013 7.99984C1.5013 9.80539 2.13325 11.3401 3.39714 12.604C4.66102 13.8679 6.19575 14.4998 8.0013 14.4998Z" fill="#91919D" />
              </svg>
            </div>
          </div>

          <div className="bg-contrast1.5 pt-3 pb-3.5 flex items-center">
            <div className="px-8">
              <svg width="12" height="17" viewBox="0 0 12 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.49417 17C1.08139 17 0.729167 16.8531 0.4375 16.5594C0.145833 16.2656 0 15.9125 0 15.5V7.5C0 7.0875 0.146875 6.73438 0.440625 6.44063C0.734375 6.14688 1.0875 6 1.5 6H2V4C2 2.89333 2.39049 1.95 3.17146 1.17C3.95229 0.39 4.89674 0 6.00479 0C7.11271 0 8.05556 0.39 8.83333 1.17C9.61111 1.95 10 2.89333 10 4V6H10.5C10.9125 6 11.2656 6.14688 11.5594 6.44063C11.8531 6.73438 12 7.0875 12 7.5V15.5C12 15.9125 11.8531 16.2656 11.5592 16.5594C11.2653 16.8531 10.9119 17 10.4992 17H1.49417ZM1.5 15.5H10.5V7.5H1.5V15.5ZM6.00437 13C6.41813 13 6.77083 12.8527 7.0625 12.5581C7.35417 12.2635 7.5 11.9094 7.5 11.4956C7.5 11.0819 7.35271 10.7292 7.05812 10.4375C6.76354 10.1458 6.40938 10 5.99563 10C5.58188 10 5.22917 10.1473 4.9375 10.4419C4.64583 10.7365 4.5 11.0906 4.5 11.5044C4.5 11.9181 4.64729 12.2708 4.94187 12.5625C5.23646 12.8542 5.59062 13 6.00437 13ZM3.5 6H8.5V4C8.5 3.30556 8.25694 2.71528 7.77083 2.22917C7.28472 1.74306 6.69444 1.5 6 1.5C5.30556 1.5 4.71528 1.74306 4.22917 2.22917C3.74306 2.71528 3.5 3.30556 3.5 4V6Z" fill="#FF627E" />
              </svg>

            </div>
            <div className="grow text-white">
              <div className="text-sm text-grey60 mb-0.5">
                {t("locked")}
              </div>
              <div className="text-sm font-bold">{f(balance.unconfirmed)}</div>
            </div>
            <div className="pr-5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.45964 11.7915H8.54297V6.99984H7.45964V11.7915ZM7.99693 5.74025C8.16276 5.74025 8.30325 5.68414 8.41839 5.57192C8.53352 5.4597 8.59109 5.32067 8.59109 5.15484C8.59109 4.989 8.53498 4.84852 8.42276 4.73338C8.31054 4.61838 8.17151 4.56088 8.00568 4.56088C7.83984 4.56088 7.69936 4.61692 7.58422 4.729C7.46908 4.84123 7.41151 4.98025 7.41151 5.14609C7.41151 5.31192 7.46762 5.45241 7.57984 5.56755C7.69207 5.68268 7.83109 5.74025 7.99693 5.74025ZM8.00839 15.5832C6.96519 15.5832 5.98269 15.3858 5.06089 14.9911C4.13908 14.5964 3.33227 14.0532 2.64047 13.3617C1.94866 12.6702 1.40526 11.864 1.01026 10.9432C0.615399 10.0225 0.417969 9.03866 0.417969 7.99171C0.417969 6.94477 0.61533 5.96386 1.01005 5.049C1.40477 4.13414 1.9479 3.33081 2.63943 2.639C3.33096 1.9472 4.13714 1.4038 5.05797 1.0088C5.97866 0.613934 6.96248 0.416504 8.00943 0.416504C9.05637 0.416504 10.0373 0.613865 10.9521 1.00859C11.867 1.40331 12.6703 1.94643 13.3621 2.63796C14.0539 3.32949 14.5973 4.134 14.9923 5.0515C15.3872 5.96914 15.5846 6.94956 15.5846 7.99275C15.5846 9.03595 15.3873 10.0184 14.9926 10.9403C14.5978 11.8621 14.0547 12.6689 13.3632 13.3607C12.6716 14.0525 11.8671 14.5959 10.9496 14.9909C10.032 15.3857 9.05158 15.5832 8.00839 15.5832ZM8.0013 14.4998C9.80686 14.4998 11.3416 13.8679 12.6055 12.604C13.8694 11.3401 14.5013 9.80539 14.5013 7.99984C14.5013 6.19428 13.8694 4.65956 12.6055 3.39567C11.3416 2.13178 9.80686 1.49984 8.0013 1.49984C6.19575 1.49984 4.66102 2.13178 3.39714 3.39567C2.13325 4.65956 1.5013 6.19428 1.5013 7.99984C1.5013 9.80539 2.13325 11.3401 3.39714 12.604C4.66102 13.8679 6.19575 14.4998 8.0013 14.4998Z" fill="#91919D" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </li>
  )
}
