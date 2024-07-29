import { useContext, useState } from 'react';
import AnimatedDialog from '../../../components/UI/AnimatedDialog';
import CloseIcon from '../../../components/UI/Icons/CloseIcon';
import PrimaryButton from '../../../components/UI/PrimaryButton';
import SecondaryButton from '../../../components/UI/SecondaryButton';
import { appContext } from '../../../AppContext';
import { MinimaToken } from '../../../@types/minima';


interface IProps {
    display: boolean;
    dismiss: () => void;
    token: MinimaToken;
}
const Burn = ({ display, token, dismiss }: IProps) => {
    const [loading, setLoading] = useState(false);
    
    const handleBurn = () => {

        console.log('burnign token..', token);
        // (window as any).MDS.cmd(`send amount:${token.sendable} address:0xFF tokenid:${token.tokenid}`, (resp) => {
        //     console.log(resp);

        //     if (resp.status) {                
        //         dismiss();
        //     }
        // });
    };

    return (
        <AnimatedDialog display={display} dismiss={dismiss}>
            <div className="h-full grid items-center">
                <div className="relative left-0 right-0 bottom-0 top-0 bg-transparent">
                    <div className="bg-white shadow-lg dark:shadow-none dark:bg-black w-[calc(100%_-_16px)] overflow-auto mx-auto md:w-full p-4 rounded">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold tracking-wide">Burn Token</h3>
                            {/* <span onClick={dismiss}>
                                <CloseIcon fill="currentColor" />
                            </span> */}
                        </div>
                        <div>
                            Do you want to burn this token?

                            <div className='grid grid-cols-2'>
                                <div></div>
                                <div className='grid grid-cols-2 gap-1 mt-8'>
                                    <SecondaryButton onClick={dismiss} type="button">Dismiss</SecondaryButton>
                                    <PrimaryButton onClick={handleBurn} type="button">Burn</PrimaryButton>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AnimatedDialog>
    );
};

export default Burn;
