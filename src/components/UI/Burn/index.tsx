import { useFormikContext } from 'formik';
import { useState } from 'react';
import Input from '../Input';
import { createPortal } from 'react-dom';
import Grid from '../Grid';
import KeyValue from '../KeyValue';
const Burn = () => {
    const formik: any = useFormikContext();
    const [burnData, setBurnData] = useState<{
        '1block': {
            txns: 0;
            max: 0;
            med: 0;
            avg: 0;
            min: 0;
        };
        '10block': {
            txns: 0;
            max: 0;
            med: 0;
            avg: 0;
            min: 0;
        };
        '50block': {
            txns: 0;
            max: 0;
            med: 0;
            avg: 0;
            min: 0;
        };
    } | null>(null);
    const [viewInput, setViewInput] = useState(false);
    const [viewInfo, setViewInfo] = useState(false);

    const handleViewBurnInfo = () => {
        setViewInfo(true);

        (window as any).MDS.cmd('burn', (resp: any) => {
            if (resp.status) {
                setBurnData(resp.response);
            }
        });
    };

    return (
        <>
            {viewInfo &&
                createPortal(
                    <div className="ml-0 md:ml-[240px] absolute top-0 right-0 left-0 bottom-0 bg-black bg-opacity-50 animate-fadeIn">
                        <Grid
                            variant="lg"
                            title={
                                <>
                                    <svg
                                        className="fill-white hover:cursor-pointer"
                                        onClick={() => setViewInfo(false)}
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="24"
                                        viewBox="0 -960 960 960"
                                        width="24"
                                    >
                                        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                                    </svg>
                                    Burn Info
                                </>
                            }
                        >
                            <div className="flex flex-col gap-4 mx-4 rounded bg-white bg-opacity-90 p-4 mb-4 shadow-sm h-max">
                                <div className="overflow-scroll my-2 mb-4">
                                    <p className="font-semibold mb-6">
                                        Burning Minima increases the chance that your transaction will be put into the
                                        next block. It is optional and only required when the network is busy and blocks
                                        are full. The table below shows the burn currently being set by users.
                                    </p>
                                    <div className="grid grid-cols-[50px_1fr_1fr] grid-rows-1 divide-x mt-4">
                                        <div className="bg-black w-[50px]"></div>
                                        <div>
                                            <h3 className="bg-black text-white text-center truncate px-2">
                                                Last 10 blocks
                                            </h3>
                                        </div>
                                        <div>
                                            <h3 className="bg-black text-white text-center truncate px-2">
                                                Last 50 blocks
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-[50px_1fr_1fr] grid-rows-1 divide-x">
                                        <div>
                                            <div className="pl-2 h-[24px] text-slate-500 bg-gray-300 text-sm font-semibold">
                                                Txns
                                            </div>
                                            <div className="pl-2 h-[24px] text-slate-500 bg-gray-300 text-sm font-semibold">
                                                Avg
                                            </div>
                                            <div className="pl-2 h-[24px] text-slate-500 bg-gray-300 text-sm font-semibold">
                                                Min
                                            </div>
                                            <div className="pl-2 h-[24px] text-slate-500 bg-gray-300 text-sm font-semibold">
                                                Max
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="bg-white text-black text-center grid grid-cols-1 grid-rows-1">
                                                {burnData && burnData['10block'].txns}
                                            </h3>
                                            <h3 className="bg-white text-black text-center grid grid-cols-1 grid-rows-1">
                                                {burnData && burnData['10block'].avg}
                                            </h3>
                                            <h3 className="bg-white text-black text-center grid grid-cols-1 grid-rows-1">
                                                {burnData && burnData['10block'].min}
                                            </h3>
                                            <h3 className="bg-white text-black text-center grid grid-cols-1 grid-rows-1">
                                                {burnData && burnData['10block'].max}
                                            </h3>
                                        </div>

                                        <div>
                                            <h3 className="bg-white text-black text-center">
                                                {burnData && burnData['50block'].txns}
                                            </h3>
                                            <h3 className="bg-white text-black text-center">
                                                {burnData && burnData['50block'].avg}
                                            </h3>
                                            <h3 className="bg-white text-black text-center">
                                                {burnData && burnData['50block'].min}
                                            </h3>
                                            <h3 className="bg-white text-black text-center">
                                                {burnData && burnData['50block'].max}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Grid>
                    </div>,

                    document.body
                )}

            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-end gap-1 mr-1">
                    <label
                        htmlFor="checked-checkbox"
                        className="text-sm font-semibold text-gray-900 dark:text-gray-300 flex justify-end"
                    >
                        Add burn
                        <svg
                            className="fill-orange-600"
                            xmlns="http://www.w3.org/2000/svg"
                            height="16.5"
                            viewBox="0 -960 960 960"
                            width="16.5"
                        >
                            <path d="M240-400q0 52 21 98.5t60 81.5q-1-5-1-9v-9q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60v9q0 4-1 9 39-35 60-81.5t21-98.5q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62 0-107.5-41T401-690q-39 33-69 68.5t-50.5 72Q261-513 250.5-475T240-400Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm0-492v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-129 86.5-245T480-840Z" />
                        </svg>
                    </label>
                    <input
                        id="checked-checkbox"
                        type="checkbox"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setViewInput(e.currentTarget.checked);
                        }}
                        className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded"
                    />
                    <svg
                        onClick={handleViewBurnInfo}
                        xmlns="http://www.w3.org/2000/svg"
                        className="fill-black hover:cursor-pointer hover:scale-110"
                        height="20"
                        viewBox="0 -960 960 960"
                        width="20"
                    >
                        <path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                    </svg>
                </div>
                {viewInput && (
                    <Input
                        id="burn"
                        type="text"
                        disabled={formik.isSubmitting}
                        placeholder="Burn"
                        {...formik.getFieldProps('burn')}
                        error={formik.touched.burn && formik.errors.burn ? formik.errors.burn : false}
                    />
                )}
            </div>
        </>
    );
};

export default Burn;
