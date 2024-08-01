import { useContext, useState } from 'react';
import AnimatedDialog from '../../../components/UI/AnimatedDialog';
import PrimaryButton from '../../../components/UI/PrimaryButton';
import SecondaryButton from '../../../components/UI/SecondaryButton';
import { MinimaToken } from '../../../@types/minima';
import { appContext } from '../../../AppContext';


interface IProps {
    display: boolean;
    dismiss: () => void;
    token: MinimaToken;
    fullDismiss: () => void;
}
const Hide = ({ display, token, dismiss, fullDismiss }: IProps) => {
    const { hideToken, _hiddenTokens } = useContext(appContext);
    
    const tokenHidden = _hiddenTokens && _hiddenTokens[token.tokenid];

    const handleHide = () => {
        hideToken(token.tokenid, tokenHidden ? false : true);
        fullDismiss();
    };


    return (
        <AnimatedDialog display={display} dismiss={dismiss}>
            <div className="h-full grid items-center">
                <div className="relative left-0 right-0 bottom-0 top-0 bg-transparent">
                    <div className="bg-white shadow-lg dark:shadow-none dark:bg-black w-[calc(100%_-_16px)] overflow-auto mx-auto md:w-full p-4 rounded">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold tracking-wide">{tokenHidden ? "Unhide": "Hide"} Token</h3>
                            {/* <span onClick={dismiss}>
                                <CloseIcon fill="currentColor" />
                            </span> */}
                        </div>
                        <div>
                            Do you want to {tokenHidden ? "unhide": "hide"} this token?

                            {!tokenHidden&&<p className='text-sm dark:text-neutral-400'>You can un-hide it by clicking on the hidden tokens section on the Balance page.</p>}

                            <div className='grid grid-cols-2'>
                                <div></div>
                                <div className='grid grid-cols-2 gap-1 mt-8'>
                                    <SecondaryButton onClick={dismiss} type="button">Dismiss</SecondaryButton>
                                    <PrimaryButton onClick={handleHide} type="button">{tokenHidden ? "Unhide": "Hide"}</PrimaryButton>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AnimatedDialog>
    );
};

export default Hide;
