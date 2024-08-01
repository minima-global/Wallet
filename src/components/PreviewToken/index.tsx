import useFormatMinimaNumber from '../../__minima__/libs/utils/useMakeNumber';
import AnimatePageIn from '../UI/Animations/AnimatePageIn';

interface Props {
    url: string;
    name: string;
    amount: string;
}
const PreviewToken = ({ url, name, amount }: Props) => {
    const { makeMinimaNumber } = useFormatMinimaNumber();

    return (
        <AnimatePageIn display={true}>
            <div className="grid grid-cols-[auto_1fr] items-center gap-2 bg-white dark:bg-[#1B1B1B] rounded">
                <img src={url} alt="preview" className="avatar !bg-[#080A0B]" />
                <div className="overflow-hidden grid grid-cols-[1fr_auto]">
                    <div>
                        <h6 className="font-bold truncate dark:text-neutral-300">{(name.length && name) || "Untitled token"}</h6>
                        <input
                            readOnly
                            value={(amount.length && makeMinimaNumber(amount, 2000)) || '200000000'}
                            className="truncate w-full focus:outline-none bg-transparent text-sm tracking-wider dark:text-neutral-300"
                        />
                    </div>
                </div>
            </div>
        </AnimatePageIn>
    );
};

export default PreviewToken;

// className="bg-[#080A0B] w-[56px] min-w-[56px] h-[56px] min-h-[56px]"
