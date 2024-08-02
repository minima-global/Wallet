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
                    dismiss={() => {
                        setPromptHide(false);
                        setPromptHiddenTokens(true);
                    }}
                    fullDismiss={() => {
                        setPromptHide(false);
                    }}
                />
            )}

            <AnimatedDialog display={_promptHiddenTokens} dismiss={() => setPromptHiddenTokens(false)}>
                <div className="modal-content">
                    <div className="flex items-center justify-between p-4 border-b border-[#1B1B1B] dark:border-neutral-600">
                        <h3 className="font-bold text-lg">Hidden Tokens</h3>
                        <button onClick={() => setPromptHiddenTokens(false)} aria-label="Close">
                            <CloseIcon fill="currentColor" />
                        </button>
                    </div>

                    <div className="my-3 px-3">
                        <input
                            onChange={(e) => handleFilterTextChange('hidden', e)}
                            placeholder="Search token"
                            type="search"
                            className="bg-white rounded-full p-3 px-4 w-full focus:outline-none focus:border focus:border-black focus:dark:border-neutral-600   dark:placeholder:text-neutral-600 dark:bg-[#1B1B1B]"
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto px-3 md:px-0">
                        <ul className="overflow-y-auto">
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
                                            t.tokenid === '0x00' ? t.token : 'name' in t.token ? t.token.name : '',
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
                                            className="flex justify-center bg-white hover:bg-neutral-300 dark:bg-[#1B1B1B] p-4 rounded-lg rounded-l-none dark:hover:bg-opacity-50"
                                        >
                                            <ShowIcon fill="currentColor" />
                                        </span>
                                    </div>
                                ))}
                        </ul>
                    </div>
                </div>
            </AnimatedDialog>
        </>
    );
};

export default HiddenTokens;
