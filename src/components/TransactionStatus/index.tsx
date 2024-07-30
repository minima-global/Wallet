import { useContext, useState } from 'react';
import { appContext } from '../../AppContext';
import AnimatedDialog from '../UI/AnimatedDialog';

import Success from '../UI/Lottie/Success.json';
import Loading from '../UI/Lottie/Loading.json';
import Failed from '../UI/Lottie/Error.json';
import Pending from '../UI/Lottie/Pending.json';
import Lottie from 'lottie-react';
import SecondaryButton from '../UI/SecondaryButton';

const TransactionStatus = () => {
    const { _transactionError, _transactionSubmitting, _transactionSuccess, _transactionPending, setTransactionSubmitting, setTransactionError } =
        useContext(appContext);

    return (
        <AnimatedDialog display={_transactionSubmitting} dismiss={() => null}>
            <div className="flex justify-center">
                {!_transactionPending && !_transactionSuccess && !_transactionError && (
                    <Lottie
                        className="w-[240px] h-[240px] self-center place-self-center justify-self-center"
                        animationData={Loading}
                        loop={true}
                    />
                )}

                {_transactionSuccess && (
                    <div className="flex flex-col mt-8">
                        <Lottie
                            className="w-[128px] h-[128px] self-center place-self-center justify-self-center"
                            animationData={Success}
                            loop={false}
                        />
                        <p className="opacity-100 text-center font-bold">Transaction Successful</p>
                    </div>
                )}

                {_transactionPending && (
                    <div className="flex flex-col mt-8">
                        <Lottie
                            className="w-[128px] h-[128px] self-center place-self-center justify-self-center"
                            animationData={Pending}
                            loop={false}
                        />
                        <p className="opacity-70 text-center font-bold">Transaction Pending</p>
                        <p className="text-center font-bold">I can confirm this in the Pending MiniDapp.</p>
                        <div className="mt-8">
                            <SecondaryButton onClick={() => setTransactionSubmitting(false)} type="button">
                                Done
                            </SecondaryButton>
                        </div>
                    </div>
                )}
                
                {_transactionError && (
                    <div className="flex flex-col mt-8 mx-3">
                        <Lottie
                            className="w-[128px] h-[128px] self-center place-self-center justify-self-center"
                            animationData={Failed}
                            loop={false}
                        />
                        <p className="opacity-70 text-center font-bold">Transaction Failed</p>
                        <p className="text-center font-bold break-all text-sm">{_transactionError.includes("No Coins of") ? "Insufficient funds" : _transactionError}</p>
                        <div className="mt-8">
                            <SecondaryButton onClick={() => {
                                setTransactionSubmitting(false);
                                setTransactionError(false);
                            }} type="button">
                                Back
                            </SecondaryButton>
                        </div>
                    </div>
                )}
            </div>
        </AnimatedDialog>
    );
};

export default TransactionStatus;
