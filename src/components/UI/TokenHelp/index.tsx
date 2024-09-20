import Decimal from 'decimal.js';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import Token from '../../../pages/components/Token';
import useFormatMinimaNumber from '../../../__minima__/libs/utils/useMakeNumber';
import Grid from '../Grid';
import MockToken from './MockToken';

const TokenHelp = ({ tokenInformation, display, dismiss }: any) => {
    const { makeMinimaNumber } = useFormatMinimaNumber();

    const [step, setStep] = useState(0);
    return (
        display &&
        createPortal(
            <div
                onClick={dismiss}
                className="ml-0 md:ml-[240px] absolute top-0 right-0 left-0 bottom-0 bg-black bg-opacity-50 animate-fadeIn"
            >
                <Grid
                    variant="lg"
                    title={
                        <>
                            <svg
                                onClick={() => dismiss}
                                className="fill-white hover:cursor-pointer"
                                xmlns="http://www.w3.org/2000/svg"
                                height="24"
                                viewBox="0 -960 960 960"
                                width="24"
                            >
                                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                            </svg>
                            Token State
                        </>
                    }
                >
                    <div
                        onClick={(e: any) => e.stopPropagation()}
                        className="flex flex-col gap-4 mx-4 rounded bg-white bg-opacity-90 p-4 mb-4 shadow-sm h-max"
                    >
                        <div className="my-2 mb-4">
                            <p className="font-semibold mb-6">
                                A Minima token balance can be in three different states
                            </p>

                            <MockToken t={tokenInformation} step={step} />

                            <div className="space-y-4">
                                <span className="underline-offset-4 underline">
                                    {step === 0 && 'Available'}
                                    {step === 1 && 'Locked'}
                                    {step === 2 && 'Pending'}
                                </span>
                                <p>
                                    {step === 0 &&
                                        'Funds are available to be spent immediately since they are not locked in a contract'}
                                    {step === 1 && 'Funds are locked in a smart contract'}
                                    {step === 2 &&
                                        'Pending funds are on the way to your available balance once they reach minimum block time confirmation in the mempool'}
                                </p>

                                <div className="grid grid-cols-2 gap-2 my-8">
                                    <button
                                        onClick={() => setStep((prevState) => prevState - 1)}
                                        type="button"
                                        className="bg-transparent border py-3 disabled:opacity-50"
                                        disabled={step === 0}
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setStep((prevState) => prevState + 1)}
                                        type="button"
                                        className="bg-black py-3 text-white disabled:opacity-50"
                                        disabled={step === 2}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Grid>
            </div>,

            document.body
        )
    );
};

export default TokenHelp;
