import { createFileRoute } from '@tanstack/react-router'
import Header from '../../components/Header'
import Navigation from '../../components/Navigation'
import SearchBar from '../../components/SearchBar'
import RefreshButton from '../../components/RefreshButton'
import SortButton from '../../components/SortButton'
import { useCallback, useContext, useEffect, useState } from 'react'
import { appContext } from '../../AppContext'
import { MDS } from '@minima-global/mds'
import { format } from "date-fns";
import useFormatAmount from '../../hooks/useFormatAmount'
import { renderTokenName } from '../../utils'
import TokenAuthenticity from '../../components/TokenAuthenticity'
import TokenIcon from '../../components/TokenIcon'

export const Route = createFileRoute('/history/')({
  component: Index,
})

type HistoryItem = {
  TXPOWID: string;
  TIME: number;
  ISBLOCK: boolean;
  ISTRANSACTION: boolean;
  HASBODY: boolean;
  BURN: number;
  SUPERBLOCK: number;
  SIZE: number;
  HEADER: {
    timemilli: number;
  };
  BODY: object;
  DETAILS: object;
}

function Index() {
  const { loaded } = useContext(appContext);
  const { f } = useFormatAmount();
  const [inited, setInited] = useState(false);
  const [history, setHistory] = useState<any[] | null>(null);
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const getData = useCallback(() => {
    MDS.sql(`SELECT * FROM txpows ORDER BY timemilli ${order}`).then((txpows) => {
      setHistory(txpows.rows.map((r) => ({ ...r, HEADER: JSON.parse(r.HEADER), BODY: JSON.parse(r.BODY), DETAILS: JSON.parse(r.DETAILS) })));
    });
  }, [order]);

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

          getData();
        });
      });
      setInited(true);
    }
  }, [loaded, inited, getData]);

  const toggleOrder = () => {
    setOrder(order === 'asc' ? 'desc' : 'asc');
    getData();
  }

  return (
    <>
      <Header />
      <div className="mt-10 container mx-auto flex">
        <div className="flex w-full gap-10">
          <div className="flex flex-col gap-5">
            <Navigation />
          </div>
          <div className="grow flex flex-col">
            <div>
              <div className="grid grid-cols-2">
                <div className="col-span-1">
                  <h1 className="text-white text-2xl mb-6">
                    History
                  </h1>
                </div>
                <div className="col-span-1">
                  <div className="flex items-end justify-end flex-col gap-3">
                    <div className="flex flex-col gap-0.5">
                      <div className="w-[4px] h-[4px] bg-grey60 rounded-full" />
                      <div className="w-[4px] h-[4px] bg-grey60 rounded-full" />
                      <div className="w-[4px] h-[4px] bg-grey60 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6 flex gap-2.5">
                <SearchBar value={query} onChange={setQuery} />
                <SortButton action={toggleOrder} />
                <RefreshButton action={getData} />
              </div>

              <div className="mt-8 flex flex-col gap-2 mb-10">
                {history && history.length === 0 && (
                  <div className="w-full flex items-center bg-contrast1 opacity-80 p-3 px-4 text-sm rounded">
                    No transactions found
                  </div>
                )}
                {history && history.map((h, index: number) => {
                  const day = format(new Date(Number(h.HEADER.timemilli)), 'dd');
                  const previousDay = history[index - 1] ? format(new Date(Number(history[index - 1].HEADER.timemilli)), 'dd') : null;
                  const isNewDay = day !== previousDay;

                  const input = h.BODY.txn.inputs[0].tokenid;
                  const difference = h.DETAILS.difference[input];
                  const change = h.DETAILS.outputs[input];

                  const hasCreatedToken = h.BODY?.txn.outputs[0].tokenid === '0xFF';
                  const createdToken = h.BODY?.txn.outputs[0];

                  if (query && h.BODY?.txn.inputs[0].tokenid === '0xFF') {
                    h.BODY.txn.inputs[0].token = 'Minima';
                  }

                  const showCreatedToken = query ? renderTokenName(createdToken).toLowerCase().includes(query.toLowerCase().trim()) : true;

                  return (
                    <div key={h.TXPOWID}>
                      <div>
                        {isNewDay && (
                          <div className="bg-contrast2 mb-2 w-full rounded px-5 py-3 text-white">
                            <h5>{format(new Date(Number(h.HEADER.timemilli)), 'dd MMMM yyyy')}</h5>
                          </div>
                        )}

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
                                <TokenAuthenticity token={createdToken.token} disabled={true} />
                              </div>
                              <p className="font-bold truncate text-grey dark:text-neutral-300">{difference > 0 ? 'Received' : 'Sent'} - {format(new Date(Number(h.HEADER.timemilli)), 'HH:mm aa')}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-green">+{createdToken.tokenamount}</p>
                              <p className="font-bold text-grey60">{createdToken.tokenamount}</p>
                            </div>
                          </div>
                        )}

                        <div className="bg-contrast1 w-full rounded px-4 py-3 text-white flex gap-4">
                          <div data-testid="token-icon">
                            <div className="w-[48px] h-[48px] border border-darkConstrast dark:border-grey80 rounded overflow-hidden">
                              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" fill="white"></rect><path d="M32.4428 16.759L31.2053 22.2329L29.6226 15.6286L24.0773 13.3795L22.578 19.9957L21.2571 12.2371L15.7119 10L10 35.2512H16.0569L17.8062 27.4926L19.1271 35.2512H25.1959L26.6834 28.6349L28.266 35.2512H34.323L38 18.9962L32.4428 16.759Z" fill="black"></path></svg>
                            </div>
                          </div>
                          <div data-testid="token-name" className="grow w-full">
                            <div className="flex grow">
                              <h6 className="font-bold truncate text-black dark:text-neutral-400">Minima</h6>
                              <div className="!text-blue-500 my-auto ml-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-white" width="16" height="16" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                  <path d="M5 7.2a2.2 2.2 0 0 1 2.2 -2.2h1a2.2 2.2 0 0 0 1.55 -.64l.7 -.7a2.2 2.2 0 0 1 3.12 0l.7 .7c.412 .41 .97 .64 1.55 .64h1a2.2 2.2 0 0 1 2.2 2.2v1c0 .58 .23 1.138 .64 1.55l.7 .7a2.2 2.2 0 0 1 0 3.12l-.7 .7a2.2 2.2 0 0 0 -.64 1.55v1a2.2 2.2 0 0 1 -2.2 2.2h-1a2.2 2.2 0 0 0 -1.55 .64l-.7 .7a2.2 2.2 0 0 1 -3.12 0l-.7 -.7a2.2 2.2 0 0 0 -1.55 -.64h-1a2.2 2.2 0 0 1 -2.2 -2.2v-1a2.2 2.2 0 0 0 -.64 -1.55l-.7 -.7a2.2 2.2 0 0 1 0 -3.12l.7 -.7a2.2 2.2 0 0 0 .64 -1.55v-1"></path>
                                  <path d="M9 12l2 2l4 -4"></path>
                                </svg>
                              </div>
                            </div>
                            <p className="font-bold truncate text-grey dark:text-neutral-300">
                              {difference > 0 ? 'Received' : 'Sent'} - {format(new Date(Number(h.HEADER.timemilli)), 'HH:mm aa')}
                            </p>
                          </div>
                          <div className="text-right font-bold">
                            <p className={`${difference > 0 ? 'text-green' : 'text-red'}`}>{difference > 0 ? '+' : '-'}{f(difference)}</p>
                            <p className="text-grey60">{f(change)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
