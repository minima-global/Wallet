import { useState, useEffect, useContext } from 'react';
import { callStatus } from '../minima/rpc-commands';

import Grid from '../components/UI/Grid';
import { Status as NodeStatus } from '../@types/minima';
import { appContext } from '../AppContext';
import KeyValue from '../components/UI/KeyValue';
import { createPortal } from 'react-dom';
import CardContent from '../components/UI/CardContent';
import useFormatMinimaNumber from '../__minima__/libs/utils/useMakeNumber';

const Status = () => {
    const { setOpenDrawer, loaded } = useContext(appContext);
    const { makeMinimaNumber } = useFormatMinimaNumber();
    const [status, setStatus] = useState<NodeStatus | undefined>(undefined);
    const [showFullStatus, setShowFullStatus] = useState(false);

    useEffect(() => {
        if (loaded.current === true) {
            callStatus().then((status) => {
                setStatus(status);
            });
        }
    }, [loaded.current]);

    return (
        <>
            {showFullStatus &&
                createPortal(
                    <div className="ml-0 md:ml-[240px] absolute top-0 right-0 left-0 bottom-0 bg-black bg-opacity-50 animate-fadeIn">
                        <Grid
                            variant="lg"
                            title={
                                <>
                                    <svg
                                        className="fill-white hover:cursor-pointer"
                                        onClick={(e: any) => {
                                            e.stopPropagation();
                                            setShowFullStatus(false);
                                        }}
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="24"
                                        viewBox="0 -960 960 960"
                                        width="24"
                                    >
                                        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                                    </svg>
                                    Full Status
                                </>
                            }
                        >
                            <div className="flex flex-col gap-4 mx-4 rounded bg-white bg-opacity-90 p-4 mb-4 shadow-sm">
                                <div className="overflow-scroll">
                                    <pre className="text-black text-sm break-all max-h-[calc(100vh_-_56px)]">
                                        {JSON.stringify(status, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </Grid>
                    </div>,

                    document.body
                )}
            <Grid
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
                        Status
                    </>
                }
                variant="lg"
            >
                <CardContent
                    header={
                        <div className="flex justify-between items-center">
                            <h1 className="text-black font-semibold">Overview</h1>
                            <button
                                disabled={!status}
                                className="flex text-sm text-black font-semibold hover:cursor-pointer hover:opacity-90 border-2 border-black rounded-lg py-2 px-4 hover:bg-black hover:text-white hover:fill-[#363AFF] group"
                                onClick={() => setShowFullStatus(true)}
                            >
                                View Full Status
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="14"
                                    viewBox="0 -960 960 960"
                                    width="14"
                                    className="group-hover:animate-pulse"
                                >
                                    <path d="m136-240-56-56 296-298 160 160 208-206H640v-80h240v240h-80v-104L536-320 376-480 136-240Z" />
                                </svg>
                            </button>
                        </div>
                    }
                    content={
                        <>
                            <div className="divide-y-2 mb-4">
                                {!status && (
                                    <div className="flex justify-center items-center">
                                        <svg
                                            className="animate-spin "
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="24"
                                            viewBox="0 -960 960 960"
                                            width="24"
                                        >
                                            <path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q17 0 28.5 11.5T520-840q0 17-11.5 28.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-17 11.5-28.5T840-520q17 0 28.5 11.5T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Z" />
                                        </svg>
                                    </div>
                                )}
                                {!!status && (
                                    <>
                                        <KeyValue title="Node Version" value={status?.version!} />
                                        <KeyValue title="Uptime" value={status?.uptime!} />
                                        <KeyValue title="Vault Locked" value={status?.locked! ? 'True' : 'False'} />
                                        <KeyValue
                                            title="Length"
                                            value={makeMinimaNumber(status?.length.toString()!, 2000)}
                                        />
                                        <KeyValue title="Chain Weight" value={status?.weight.toString()!} />
                                        <KeyValue
                                            title="Total Minima (global)"
                                            value={makeMinimaNumber(status?.minima.toString()!, 2000)}
                                        />
                                        <KeyValue
                                            title="Total Coins (global)"
                                            value={makeMinimaNumber(status?.coins.toString()!, 2000)}
                                        />
                                        <KeyValue title="Your Data Path" value={status?.data!} />
                                        <KeyValue title="RAM Usage" value={status?.memory.ram!} />
                                        <KeyValue title="Disk Usage" value={status?.memory.disk!} />
                                    </>
                                )}
                            </div>
                        </>
                    }
                />
            </Grid>
        </>
    );
};

export default Status;
