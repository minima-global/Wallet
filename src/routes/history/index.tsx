import { createFileRoute } from '@tanstack/react-router'
import SearchBar from '../../components/SearchBar'
import RefreshButton from '../../components/RefreshButton'
import SortButton from '../../components/SortButton'
import { useContext, useEffect, useState, Fragment, useMemo } from 'react'
import { appContext } from '../../AppContext'
import { MDS } from '@minima-global/mds'
import { format } from "date-fns";
import useFormatAmount from '../../hooks/useFormatAmount'
import { escape, renderTokenName } from '../../utils'
import TokenAuthenticity from '../../components/TokenAuthenticity'
import TokenIcon from '../../components/TokenIcon'
import useTranslation from '../../hooks/useTranslation'
import Timeline from '../../components/Timeline'

export const Route = createFileRoute('/history/')({
  component: Index,
})

// type HistoryItem = {
//   TXPOWID: string;
//   TIME: number;
//   ISBLOCK: boolean;
//   ISTRANSACTION: boolean;
//   HASBODY: boolean;
//   BURN: number;
//   SUPERBLOCK: number;
//   SIZE: number;
//   HEADER: {
//     timemilli: number;
//   };
//   BODY: object;
//   DETAILS: object;
// }

const Dropdown = ({ options }: { options: { key: string, label: string }[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  }

  const handleOptionClick = (option: { key: string, label: string, onClick?: () => void }) => {
    setIsOpen(false);
    option.onClick?.();
  }

  return (
    <div className="relative flex items-center justify-end">
      <div onClick={toggleDropdown} className="relative z-[1000] cursor-pointer flex flex-col gap-0.5 px-4 -mr-4">
        <div className="w-[4px] h-[4px] bg-grey60 rounded-full" />
        <div className="w-[4px] h-[4px] bg-grey60 rounded-full" />
        <div className="w-[4px] h-[4px] bg-grey60 rounded-full" />
      </div>
      <div className={`absolute z-10 top-[100%] mt-2 text-sm right-0 flex flex-col gap-[2px] bg-contrast1 whitespace-nowrap ${isOpen ? 'block' : 'hidden'}`}>
        {options.map((option) => (
          <button key={option.key} onClick={() => handleOptionClick(option)} className="bg-contrast2 px-4 py-2 text-white hover:bg-white hover:text-black">{option.label}</button>
        ))}
      </div>
      <div className={`fixed z-0 bg-black opacity-50 inset-0 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none hidden'}`} onClick={toggleDropdown}></div>
    </div>
  )
}

function Index() {
  const { loaded, history, getHistory, balance } = useContext(appContext);
  const { f } = useFormatAmount();
  const { t } = useTranslation();
  const [inited, setInited] = useState(false);
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [activeMonth, setActiveMonth] = useState<string>('all');

  useEffect(() => {
    if (history && !activeMonth) {
      setActiveMonth(format(new Date(Number(history[0].HEADER.timemilli)), 'yyyy-MM'));
    }
  }, [history]);

  useEffect(() => {
    if (loaded && !inited) {
      MDS.sql('CREATE TABLE IF NOT EXISTS txpows (txpowid TEXT PRIMARY KEY, timemilli BIGINT, isblock BOOLEAN, istransaction BOOLEAN, hasbody BOOLEAN, burn INT, superblock INT, size INT, header TEXT, body TEXT, details TEXT)', () => {
        MDS.cmd.history(async (response) => {

          for (let index = 0; index < response.response.txpows.length; index++) {
            const txpow = response.response.txpows[index];
            const details = response.response.details[index];
            const result = await MDS.sql(`SELECT * FROM txpows WHERE txpowid = '${txpow.txpowid}'`);

            if (result.rows.length === 0) {
              await MDS.sql(`INSERT INTO txpows (txpowid, timemilli, isblock, istransaction, hasbody, burn, superblock, size, header, body, details) VALUES ('${txpow.txpowid}', ${txpow.header.timemilli}, ${txpow.isblock}, ${txpow.istransaction}, ${txpow.hasbody}, ${txpow.burn}, ${txpow.superblock}, ${txpow.size}, '${JSON.stringify(txpow.header)}', '${JSON.stringify(txpow.body)}','${JSON.stringify(details)}')`);
            }
          }

          getHistory();
        });
      });
      setInited(true);
    }
  }, [loaded, inited, getHistory]);

  const toggleOrder = () => {
    setOrder(prevState => prevState === 'desc' ? 'asc' : 'desc');
    getHistory(order === 'asc' ? 'desc' : 'asc');
  }

  const groupedByDay = history && history.reduce((groups: { [key: string]: any[] }, row: any) => {
    const date = format(new Date(Number(row.HEADER.timemilli)), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }

    if (row.BODY.txn.inputs[0].tokenid === '0x00') {
      row.BODY.txn.inputs[0].token = 'Minima';
    }

    if (query && typeof row.BODY.txn.inputs[0].token === 'string' && row.BODY.txn.inputs[0].token.toLowerCase().includes(query.toLowerCase().trim())) {
      groups[date].push(row);
    }

    if (query && typeof row.BODY.txn.inputs[0].token.name === 'object' && row.BODY.txn.inputs[0].token.name.name.toLowerCase().includes(query.toLowerCase().trim())) {
      groups[date].push(row);
    }

    if (!query) {
      groups[date].push(row);
    }

    return groups;
  }, {});

  const downloadTransactions = () => {
    if (!history) {
      return;
    }

    const now = new Date();
    const date = now.toISOString().split('T')[0].replace(/-/g, '_');
    const time = now.toISOString().split('T')[1].split('.')[0].replace(/:/g, '_');
    const filename = `minima_${date}_${time}.csv`;

    const headers = ['AMOUNT', 'TYPE', 'DATE', 'SENT_TO_MX_ADDRESS', 'SENT_TO_0X_ADDRESS', 'TXPOWID', 'TIMEMILLI', 'ISBLOCK', 'ISTRANSACTION', 'HASBODY', 'BURN', 'SUPERBLOCK', 'SIZE', 'HEADER', 'BODY', 'DETAILS'];
    const csv = [
      headers,
      ...history.map((h) => {
        const DIFFERENCE = h.DETAILS.difference[h.BODY.txn.inputs[0].tokenid];
        const AMOUNT = DIFFERENCE > 0 ? `"${'+' + DIFFERENCE}"` : `"${DIFFERENCE}"`;
        const TYPE = DIFFERENCE > 0 ? 'IN' : 'OUT';
        const DATE = format(new Date(Number(h.TIMEMILLI)), "dd-MM-yyyy HH:mm a");
        const SENT_TO_MX = h.BODY.txn.outputs[0].miniaddress || "N/A";
        const SENT_TO_0X = h.BODY.txn.outputs[0].address || "N/A";
        return [AMOUNT, TYPE, DATE, `"${SENT_TO_MX}"`, `"${SENT_TO_0X}"`, h.TXPOWID, h.HEADER.timemilli, h.ISBLOCK, h.ISTRANSACTION, h.HASBODY, h.BURN, h.SUPERBLOCK, h.SIZE, escape(h.HEADER), escape(h.BODY), escape(h.DETAILS)];
      })
    ];

    if (window.navigator.userAgent.includes('Minima Browser')) {
      // @ts-ignore
      return Android.blobDownload(filename, toHex(csv.join('\n')));
    }

    const blob = new Blob([csv.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  const dropdownOptions = [
    {
      key: 'download_transactions',
      label: 'Download transactions',
      onClick: downloadTransactions,
    },
  ]

  const uniqueMonths = useMemo(() => {
    return history?.reduce((acc, h) => {
      const date = format(new Date(Number(h.HEADER.timemilli)), 'yyyy-MM');
      if (!acc.includes(date)) {
        acc.push(date);
      }

      if (acc.length === 1) {
        const date = new Date(acc[0]);
        for (let i = 1; i < 6; i++) {
          date.setMonth(date.getMonth() - 1);
          acc.push(format(date, 'yyyy-MM'));
        }
      }

      // Fill in missing months between lowest and highest
      if (acc.length > 1) {
        const start = new Date(acc[acc.length - 1]); // Lowest month
        const end = new Date(acc[0]); // Highest month

        // Create array of all months between start and end
        const current = new Date(start);

        while (current <= end) {
          const monthStr = format(current, 'yyyy-MM');
          if (!acc.includes(monthStr)) {
            acc.push(monthStr);
          }
          current.setMonth(current.getMonth() + 1);
        }

        // Sort in descending order
        acc.sort((a, b) => a.localeCompare(b));
      }

      return acc;
    }, []);
  }, [history]);

  return (
    <div>
      <div className="flex mb-6">
        <div className="flex items-center">
          <h1 className="text-white text-2xl">
            {t("history")}
          </h1>
        </div>
        <div className="grow flex justify-end">
          <div className="flex items-center justify-end gap-3 h-full">
            <Dropdown options={dropdownOptions} />
          </div>
        </div>
      </div>

      <div className="mb-8 flex gap-2.5">
        <SearchBar value={query} onChange={setQuery} />
        <SortButton onClick={toggleOrder} />
        <RefreshButton onClick={() => getHistory(order)} />
      </div>

      <div className="flex gap-2.5">
        <Timeline months={uniqueMonths} activeMonth={activeMonth} setActiveMonth={setActiveMonth} />
      </div>

      <div className="mt-8 flex flex-col gap-2 mb-20">
        {history && (history.length === 0 || Object.values(groupedByDay || {}).every(group => group.length === 0)) && (
          <div className="w-full flex items-center bg-contrast1 opacity-80 p-4 px-5 text-sm rounded">
            No transactions found
          </div>
        )}
        {history && history.length >= 0 && (
          <>
            {groupedByDay && activeMonth !== 'all' && !Object.keys(groupedByDay).map((row) => format(row, 'yyyy-MM')).includes(activeMonth) && (
              <div className="w-full flex items-center bg-contrast1 opacity-80 p-4 px-5 text-sm rounded">
                No transactions found for {activeMonth}
              </div>
            )}

            {groupedByDay && Object.keys(groupedByDay).map((row) => {
              if (activeMonth !== 'all' && format(row, 'yyyy-MM') !== activeMonth) {
                return null;
              }

              const date = format(new Date(row), 'dd MMMM yyyy');
              const day = date.split(' ')[0];
              const month = date.split(' ')[1];
              const year = date.split(' ')[2];

              return (
                <Fragment key={day}>
                  <div className="bg-contrast2 w-full rounded px-5 py-3 text-white">
                    <h5>{t(day)} {t(month.toLowerCase())} {year}</h5>
                  </div>

                  {groupedByDay[row].map((h) => {
                    const input = h.BODY.txn.inputs[0].tokenid;
                    const difference = h.DETAILS.difference[input];

                    const hasCreatedToken = h.BODY?.txn.outputs[0].tokenid === '0xFF';
                    const createdToken = h.BODY?.txn.outputs[0];

                    if (query && h.BODY?.txn.inputs[0].tokenid === '0xFF') {
                      h.BODY.txn.inputs[0].token = 'Minima';
                    }

                    const showCreatedToken = query ? renderTokenName(createdToken).toLowerCase().includes(query.toLowerCase().trim()) : true;

                    // if (!difference || !change) {
                    //   return null;
                    // }

                    // if (difference === '0') {
                    //   return null;
                    // }

                    return (
                      <div key={h.TXPOWID}>

                        {hasCreatedToken && showCreatedToken && (
                          <div className="bg-contrast1 mb-2 w-full rounded px-4 py-3 text-white flex gap-4">
                            <div data-testid="token-icon">
                              <TokenIcon token={createdToken.token.name} tokenId={createdToken.tokenid} />
                            </div>
                            <div data-testid="token-name" className="grow w-full">
                              <div className="flex grow">
                                <h6 className="font-bold truncate text-black dark:text-neutral-400">
                                  {renderTokenName(createdToken)}
                                </h6>
                                <TokenAuthenticity token={createdToken.token} />
                              </div>
                              <p className="font-bold truncate text-grey dark:text-neutral-300">{t("created")} - {format(new Date(Number(h.HEADER.timemilli)), 'HH:mm aa')}</p>
                            </div>
                            <div className="text-right flex flex-col items-end justify-center gap-1">
                              <p className="font-bold text-green">+{createdToken.tokenamount}</p>
                            </div>
                          </div>
                        )}

                        <div className="bg-contrast1 w-full rounded px-4 py-3 text-white flex gap-4">
                          <div data-testid="token-icon">
                            {h.BODY.txn.inputs[0].tokenid !== '0x00' && (
                              <TokenIcon token={h.BODY.txn.inputs[0].token.name} tokenId={h.BODY.txn.inputs[0].tokenid} />
                            )}
                            {h.BODY.txn.inputs[0].tokenid === '0x00' && (
                              <div className="w-[48px] h-[48px] border border-contrast2 rounded overflow-hidden">
                                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" fill="white"></rect><path d="M32.4428 16.759L31.2053 22.2329L29.6226 15.6286L24.0773 13.3795L22.578 19.9957L21.2571 12.2371L15.7119 10L10 35.2512H16.0569L17.8062 27.4926L19.1271 35.2512H25.1959L26.6834 28.6349L28.266 35.2512H34.323L38 18.9962L32.4428 16.759Z" fill="black"></path></svg>
                              </div>
                            )}
                          </div>
                          <div data-testid="token-name" className="grow w-full">
                            <div className="flex grow">
                              <h6 className="font-bold truncate text-black dark:text-neutral-400">{renderTokenName(h.BODY.txn.inputs[0])}</h6>
                              {h.BODY.txn.inputs[0].tokenid === '0x00' && (
                                <div className="my-auto ml-1">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-white" width="16" height="16" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M5 7.2a2.2 2.2 0 0 1 2.2 -2.2h1a2.2 2.2 0 0 0 1.55 -.64l.7 -.7a2.2 2.2 0 0 1 3.12 0l.7 .7c.412 .41 .97 .64 1.55 .64h1a2.2 2.2 0 0 1 2.2 2.2v1c0 .58 .23 1.138 .64 1.55l.7 .7a2.2 2.2 0 0 1 0 3.12l-.7 .7a2.2 2.2 0 0 0 -.64 1.55v1a2.2 2.2 0 0 1 -2.2 2.2h-1a2.2 2.2 0 0 0 -1.55 .64l-.7 .7a2.2 2.2 0 0 1 -3.12 0l-.7 -.7a2.2 2.2 0 0 0 -1.55 -.64h-1a2.2 2.2 0 0 1 -2.2 -2.2v-1a2.2 2.2 0 0 0 -.64 -1.55l-.7 -.7a2.2 2.2 0 0 1 0 -3.12l.7 -.7a2.2 2.2 0 0 0 .64 -1.55v-1"></path>
                                    <path d="M9 12l2 2l4 -4"></path>
                                  </svg>
                                </div>
                              )}
                            </div>
                            <p className="font-bold truncate text-grey dark:text-neutral-300">
                              {difference > 0 ? t("received") : t("sent")} - {format(new Date(Number(h.HEADER.timemilli)), 'HH:mm aa')}
                            </p>
                          </div>
                          {difference && difference !== '0' && (
                            <div className="text-right flex flex-col items-end justify-center gap-1 font-bold">
                              <p className={`${difference > 0 ? 'text-green' : 'text-red'}`}>{!difference.includes('-') ? difference > 0 ? '+' : '-' : ''}{f(difference)}</p>
                              {/* {balanceDifference[h.TXPOWID] && <p className="text-grey60">{f(balanceDifference[h.TXPOWID].toString())}</p>} */}
                              {/* {change && <p className="text-grey60">{f(change)}</p>} */}
                            </div>
                          )}
                          {difference === '0' && (
                            <div className="text-right flex flex-col items-end justify-center gap-1 font-bold">
                              <p className={`text-grey-60`}>0</p>
                              {/* {balanceDifference[h.TXPOWID] && <p className="text-grey60">{f(balanceDifference[h.TXPOWID].toString())}</p>} */}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </Fragment>
              )
            })}
          </>
        )}
      </div>
    </div>
  )
}