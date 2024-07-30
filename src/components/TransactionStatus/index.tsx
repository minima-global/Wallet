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
    const { _transactionSubmitting, _transactionSuccess, _transactionPending, setTransactionSubmitting } =
        useContext(appContext);

    return (
        <AnimatedDialog display={_transactionSubmitting} dismiss={() => null}>
            <div className="flex justify-center">
                {!_transactionPending && !_transactionSuccess && (
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
            </div>
        </AnimatedDialog>
    );
};

export default TransactionStatus;
