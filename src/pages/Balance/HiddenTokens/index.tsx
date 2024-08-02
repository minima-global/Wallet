import { useContext, useState } from 'react';
import { appContext } from '../../../AppContext';
import AnimatedDialog from '../../../components/UI/AnimatedDialog';
import CloseIcon from '../../../components/UI/Icons/CloseIcon';
import useFormatMinimaNumber from '../../../__minima__/libs/utils/useMakeNumber';
import TokenListItem from '../../../components/UI/TokenListItem';

import * as utils from '../../../utilities';
import Hide from '../Hide';
import RubbishIcon from '../../../components/UI/Icons/RubbishIcon';
import ShowIcon from '../../../components/UI/Icons/ShowIcon';

const HiddenTokens = () => {
    const [filterText, setFilterText] = useState('');
    const { makeMinimaNumber } = useFormatMinimaNumber();

    const [tokenToHide, setTokenToHide] = useState(null);
    const [_promptHide, setPromptHide] = useState(false);

    const { _promptHiddenTokens, setPromptHiddenTokens, hideToken } = useContext(appContext);
    const { _hiddenTokens, hiddenBalance } = useContext(appContext);

    const promptHide = () => {
        setPromptHide((prevState) => !prevState);
    };

    const handleFilterTextChange = (evt) => {
        setFilterText(evt.target.value);
    };

    return (
        <>
            {tokenToHide && (
                <Hide
                    token={tokenToHide}
                    display={_promptHide}
                    dismiss={promptHide}
                    fullDismiss={() => {
                        setPromptHide(false);
                    }}
                />
            )}

            <AnimatedDialog display={_promptHiddenTokens} dismiss={() => setPromptHiddenTokens(false)}>
                <div className="h-full grid md:items-center">
                    <div className="relative left-0 right-0 bottom-0 top-0 bg-transparent">
                        <div className="bg-neutral-100 h-full shadow-lg dark:shadow-none dark:bg-black w-full rounded-none md:w-[calc(100%_-_16px)]  mx-auto p-4 px-0 md:rounded md:max-w-[560px] overflow-hidden">
                            <div className="flex items-center justify-between mb-3 px-3">
                                <h3 className="font-bold tracking-wide">Hidden tokens</h3>
                                <span onClick={() => setPromptHiddenTokens(false)}>
                                    <CloseIcon fill="currentColor" />
                                </span>
                            </div>

                            <div className="my-3 px-3">
                                <input
                                    onChange={(e) => handleFilterTextChange('hidden', e)}
                                    placeholder="Search token"
                                    type="search"
                                    className="bg-white rounded-full p-3 px-4 w-full focus:outline-none focus:border focus:border-black focus:dark:border-neutral-600   dark:placeholder:text-neutral-600 dark:bg-[#1B1B1B]"
                                />
                            </div>
                            <div className="overflow-y-auto h-[760px] md:h-[240px]">
                                <ul className="overflow-y-auto px-4">
                                    {!hiddenBalance.filter(
                                        (t: any) =>
                                            utils.containsText(
                                                t.tokenid === '0x00' ? t.token : 'name' in t.token ? t.token.name : '',
                                                filterText
                                            ) || utils.containsText(t.tokenid, filterText)
                                    ).length && (
                                        <li className="truncate">
                                            <p className="text-[#1b1b1b] dark:text-neutral-300 text-sm text-center">
                                                No results found
                                            </p>
                                        </li>
                                    )}
                                    {hiddenBalance
                                        .filter(
                                            (t: any) =>
                                                utils.containsText(
                                                    t.tokenid === '0x00'
                                                        ? t.token
                                                        : 'name' in t.token
                                                        ? t.token.name
                                                        : '',
                                                    filterText
                                                ) || utils.containsText(t.tokenid, filterText)
                                        )
                                        .map((token) => (
                                            <div key={token.tokenid} className="grid grid-cols-[1fr_auto] mb-2">
                                                <TokenListItem key={token.tokenid} token={token} />

                                                <span
                                                    onClick={() => {
                                                        setTokenToHide(token);
                                                        promptHide();
                                                        setPromptHiddenTokens(false);
                                                    }}
                                                    className="flex justify-center bg-neutral-200 hover:bg-neutral-300 dark:bg-[#1B1B1B] p-4 rounded-lg rounded-l-none dark:hover:bg-opacity-50"
                                                >
                                                    <ShowIcon fill="currentColor" />
                                                </span>
                                            </div>
                                        ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </AnimatedDialog>
        </>
    );
};

export default HiddenTokens;
