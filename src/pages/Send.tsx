import { FC, useContext, useEffect, useState } from 'react';
import ValueTransfer from './components/forms/ValueTransfer/ValueTransfer';
import CoinSplit from './components/forms/CoinSplit/CoinSplit';
import Grid from '../components/UI/Grid';
import { appContext } from '../AppContext';
import CardContent from '../components/UI/CardContent';
import Consolidate from './Consolidate';

const Send: FC = () => {
    const { setOpenDrawer, getBalance } = useContext(appContext);
    const [formUtility, setFormUtility] = useState('value');

    useEffect(() => {
        getBalance();
    }, []);

    const handleUtilityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFormUtility(event.target.value);
    };

    return (
        <Grid
            variant="lg"
            title={
                <>
                    <svg
                        onClick={() => setOpenDrawer(true)}
                        className="block md:hidden fill-white"
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        viewBox="0 -960 960 960"
                        width="24"
                    >
                        <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
                    </svg>
                    Send
                </>
            }
        >
            <CardContent
                header={
                    <>
                        <div className="relative">
                            <select
                                defaultValue={formUtility}
                                onChange={handleUtilityChange}
                                className="p-4 hover:opacity-80 hover:cursor-pointer rounded-lg w-full hover:bg-slate-200 text-black"
                            >
                                <option id="value" value="value">
                                    Value transfer
                                </option>
                                <option id="split" value="split">
                                    Split coins
                                </option>
                                <option id="consolidate" value="consolidate">
                                    Consolidate
                                </option>
                            </select>

                            <svg
                                className="my-auto absolute right-4 top-[10px] fill-gray-500"
                                width="32"
                                height="33"
                                viewBox="0 0 32 33"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <mask
                                    id="mask0_2226_53255"
                                    maskUnits="userSpaceOnUse"
                                    x="0"
                                    y="0"
                                    width="32"
                                    height="33"
                                >
                                    <rect y="0.550781" width="32" height="32" fill="#D9D9D9" />
                                </mask>
                                <g mask="url(#mask0_2226_53255)">
                                    <path
                                        d="M16.0004 20.6172L8.4668 13.0508L9.6668 11.8844L16.0004 18.2172L22.334 11.8844L23.534 13.0844L16.0004 20.6172Z"
                                        fill="#08090B"
                                    />
                                </g>
                            </svg>
                        </div>
                    </>
                }
                content={
                    <>
                        {formUtility === 'value' && <ValueTransfer />}
                        {formUtility === 'split' && <CoinSplit />}
                        {formUtility === 'consolidate' && <Consolidate />}
                    </>
                }
            />
        </Grid>
    );
};

export default Send;
