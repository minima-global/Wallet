import { Balance } from "@minima-global/mds";
import { Link } from "@tanstack/react-router";
import { renderTokenName } from "../../utils";
import FullTokenIcon from "../FullTokenIcon";
import Decimal from "decimal.js";
import { BalanceAmount } from "../TokenListItem";

const TokenCard = ({ balance }: { balance: Balance }) => {
    const confirmed = new Decimal(balance.confirmed).add(balance.unconfirmed).abs().toString();

    return (
        <Link to="/balance/$id" params={{ id: balance.tokenid }} className="group col-span-6 md:col-span-4 lg:col-span-3 flex flex-col h-full items-stretch">
            <div className="bg-[#0f0f0f] h-full min-h-[162px] max-h-[162px] md:min-h-[230px] md:max-h-[230px] lg:min-h-[180px] lg:max-h-[180px] flex items-center justify-center relative rounded-t w-full h-full overflow-hidden">
                <FullTokenIcon token={balance.token} tokenId={balance.tokenid} />
            </div>
            <div className="bg-contrast1 group-hover:bg-contrast2 transition-all duration-100 py-3 px-4 rounded-b">
                <div className="grid grid-cols-2">
                    <div className="col-span-2">
                        <h5 className="text-white capitalize">{renderTokenName(balance)}</h5>
                        <p className="text-grey60 text-sm truncate">
                            <BalanceAmount balance={balance} value={confirmed} />
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default TokenCard;