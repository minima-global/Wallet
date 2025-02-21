import useTranslation from "../../hooks/useTranslation";
import TokenAuthenticity from "../TokenAuthenticity";

import { Link } from "@tanstack/react-router";
import TokenIcon from "../TokenIcon";
import useFormatAmount from "../../hooks/useFormatAmount";
import { Balance } from "@minima-global/mds";
import { renderTicker, renderTokenName } from "../../utils";
import { useEffect, useState } from "react";
import Decimal from "decimal.js";
import Truncate from "../Truncate";
import Button from "../Button";
import useSlice from "../Truncate/useSlice";

const TokenListItem = ({ balance }: { balance: Balance }) => {
    const { t } = useTranslation();
    const { f } = useFormatAmount();
    const [showInfo, setShowInfo] = useState(false);

    const toggleInfo = () => {
        setShowInfo(!showInfo);
    }

    const handleClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const locked = new Decimal(balance.confirmed).minus(balance.sendable).toString();
    const confirmed = new Decimal(balance.confirmed).add(balance.unconfirmed).toString();
    const sendable = new Decimal(balance.sendable).add(balance.unconfirmed).toString();

    return (
        <li>
            <BalanceInfoModal display={showInfo} dismiss={() => setShowInfo(false)} />
            <Link to="/balance/$id" params={{ id: balance.tokenid }} onClick={handleClick}>
                <div className={`w-full flex items-center bg-contrast1.5 rounded-t hover:bg-contrast2 transition-all duration-100 p-3`}>
                    <div className="grow flex">
                        <TokenIcon token={balance.token} tokenId={balance.tokenid} />
                        <div className="grow overflow-hidden px-4">
                            <div className="grow w-full">
                                <div className="flex grow gap-1">
                                    <h6 className="font-bold truncate text-neutral-400 capitalize truncate">
                                        {renderTokenName(balance)} {renderTicker(balance)}
                                    </h6>
                                    <TokenAuthenticity token={balance} />
                                </div>
                                <div className="font-bold w-full overflow-ellipsis truncate text-neutral-300">
                                    <BalanceAmount balance={balance} value={confirmed} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>

            <div className={`overflow-hidden transition-all duration-300 flex flex-col rounded-b bg-contrast1 py-3 px-4`}>
                <div className="flex text-sm">
                    <div className="flex flex-col text-sm text-grey60 pr-3">
                        <div className="mb-1">
                            {t("available")}:
                        </div>
                        <div>
                            {t("locked")}:
                        </div>
                    </div>
                    <div className="grow flex flex-col">
                        <div className="mb-1">
                            <BalanceAmount balance={balance} value={sendable} />
                        </div>
                        <div>
                            <Truncate text={f(locked)} maxLength={24} />
                        </div>
                    </div>
                    <div onClick={toggleInfo} className="cursor-pointer flex items-center pr-2 text-grey60 hover:text-white transition-all duration-100">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.45964 11.7915H8.54297V6.99984H7.45964V11.7915ZM7.99693 5.74025C8.16276 5.74025 8.30325 5.68414 8.41839 5.57192C8.53352 5.4597 8.59109 5.32067 8.59109 5.15484C8.59109 4.989 8.53498 4.84852 8.42276 4.73338C8.31054 4.61838 8.17151 4.56088 8.00568 4.56088C7.83984 4.56088 7.69936 4.61692 7.58422 4.729C7.46908 4.84123 7.41151 4.98025 7.41151 5.14609C7.41151 5.31192 7.46762 5.45241 7.57984 5.56755C7.69207 5.68268 7.83109 5.74025 7.99693 5.74025ZM8.00839 15.5832C6.96519 15.5832 5.98269 15.3858 5.06089 14.9911C4.13908 14.5964 3.33227 14.0532 2.64047 13.3617C1.94866 12.6702 1.40526 11.864 1.01026 10.9432C0.615399 10.0225 0.417969 9.03866 0.417969 7.99171C0.417969 6.94477 0.61533 5.96386 1.01005 5.049C1.40477 4.13414 1.9479 3.33081 2.63943 2.639C3.33096 1.9472 4.13714 1.4038 5.05797 1.0088C5.97866 0.613934 6.96248 0.416504 8.00943 0.416504C9.05637 0.416504 10.0373 0.613865 10.9521 1.00859C11.867 1.40331 12.6703 1.94643 13.3621 2.63796C14.0539 3.32949 14.5973 4.134 14.9923 5.0515C15.3872 5.96914 15.5846 6.94956 15.5846 7.99275C15.5846 9.03595 15.3873 10.0184 14.9926 10.9403C14.5978 11.8621 14.0547 12.6689 13.3632 13.3607C12.6716 14.0525 11.8671 14.5959 10.9496 14.9909C10.032 15.3857 9.05158 15.5832 8.00839 15.5832ZM8.0013 14.4998C9.80686 14.4998 11.3416 13.8679 12.6055 12.604C13.8694 11.3401 14.5013 9.80539 14.5013 7.99984C14.5013 6.19428 13.8694 4.65956 12.6055 3.39567C11.3416 2.13178 9.80686 1.49984 8.0013 1.49984C6.19575 1.49984 4.66102 2.13178 3.39714 3.39567C2.13325 4.65956 1.5013 6.19428 1.5013 7.99984C1.5013 9.80539 2.13325 11.3401 3.39714 12.604C4.66102 13.8679 6.19575 14.4998 8.0013 14.4998Z" fill="currentColor" />
                        </svg>
                    </div>
                </div>
            </div>
        </li>
    )
}

export const BalanceAmount = ({ balance, value, grid = false }: { balance: Balance, value: string, grid?: boolean }) => {
    const { f } = useFormatAmount();
    const { m } = useSlice();
    const [hasUnconfirmed, setHasUnconfirmed] = useState(false);
    const [showing, setShowing] = useState<1 | 2 | false>(false);

    useEffect(() => {
        if (balance.unconfirmed !== '0') {
            setHasUnconfirmed(true);
        } else {
            setHasUnconfirmed(false);
        }
    }, [balance]);

    useEffect(() => {
        if (hasUnconfirmed) {
            const interval = setInterval(() => {
                setShowing(prevState => prevState === 2 ? 1 : 2);
            }, 1000);

            return () => {
                clearInterval(interval);
            }
        }

        setShowing(false);
    }, [showing, hasUnconfirmed]);

    return (
        <div className="relative">
            <div className={`w-full truncate overflow-ellipsis flex gap-2 items-center transition-all duration-100 ${showing === false ? '' : showing === 1 ? 'text-grey60' : 'text-white'}`}>
                {grid && (
                    <>
                        <div className="block sm:hidden md:hidden">
                            {m(f(value), 14)}
                        </div>
                        <div className="hidden sm:block md:hidden">
                            {m(f(value), 28)}
                        </div>
                        <div className="hidden sm:hidden md:block">
                            {m(f(value), 22)}
                        </div>
                    </>
                )}
                {!grid && (
                    <>
                        <div className="block sm:hidden">
                            {m(f(value), 18)}
                        </div>
                        <div className="hidden sm:block md:hidden">
                            {m(f(value), 38)}
                        </div>
                        <div className="hidden md:block">
                            {f(value)}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

const BalanceInfoModal = ({ display, dismiss }: { display: boolean, dismiss: () => void }) => {
    const { t } = useTranslation();

    return (
        <div className={`${display ? 'opacity-100' : 'pointer-events-none opacity-0'} delay-100 transition-opacity duration-100 flex absolute z-50 inset-0 top-0 left-0 justify-center items-center w-screen h-screen`}>
            <div className={`bg-contrast1 mb-4 fixed z-[60] rounded-lg w-full max-w-[90%] md:max-w-[440px] text-center text-white p-5 transform transition-all duration-200 ${display ? 'translate-y-[0%] opacity-100' : 'translate-y-[4px] opacity-0'}`}>
                <h1 className="text-white text-xl md:text-2xl mt-2 mb-6 font-bold">
                    {t('token_states')}
                </h1>
                <div className="flex flex-col gap-3 mb-1 text-left text-grey80 text-sm">
                    <div className="bg-contrast1.5/50 py-3 px-4 rounded-lg">
                        <h2 className="text-white text-base md:text-lg font-bold mb-1.5">
                            {t('available')}
                        </h2>
                        <p className="text-grey80 text-sm">
                            {t('token_states_available')}
                        </p>
                    </div>
                    <div className="bg-contrast1.5/50 py-3 px-4 rounded-lg">
                        <h2 className="text-white text-base md:text-lg font-bold mb-1.5">
                            {t('locked')}
                        </h2>
                        <p>
                            {t('token_states_locked')}
                        </p>
                    </div>
                </div>
                <div className="mt-6 space-y-2">
                    <Button variant="tertiary" onClick={dismiss}>
                        {t('close')}
                    </Button>
                </div>
            </div>
            <div className="z-50 fixed bg-black opacity-90 w-screen h-screen top-0 left-0"></div>
        </div>
    )
}

export default TokenListItem;