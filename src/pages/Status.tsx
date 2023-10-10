import { useState, useEffect, useContext } from 'react';
import { callStatus } from '../minima/rpc-commands';

import Grid from '../components/UI/Grid';
import { Status as NodeStatus } from '../@types/minima';
import { appContext } from '../AppContext';
import KeyValue from '../components/UI/KeyValue';
import { createPortal } from 'react-dom';
import CardContent from '../components/UI/CardContent';

const Status = () => {
    const { setOpenDrawer } = useContext(appContext);
    const [status, setStatus] = useState<NodeStatus | undefined>(undefined);
    const [showFullStatus, setShowFullStatus] = useState(false);

    useEffect(() => {
        callStatus().then((status) => {
            setStatus(status);
        });
    }, []);

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
                                        onClick={() => setShowFullStatus(false)}
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
                                <KeyValue title="Node version" value={status?.version!} />
                                <KeyValue title="Uptime" value={status?.uptime!} />
                                <KeyValue title="Vault locked" value={status?.locked! ? 'True' : 'False'} />
                                <KeyValue title="Length" value={status?.length.toString()!} />
                                <KeyValue title="Chain weight" value={status?.weight.toString()!} />
                                <KeyValue title="Total Minima (global)" value={status?.minima.toString()!} />
                                <KeyValue title="Total Coins (global)" value={status?.coins.toString()!} />
                                <KeyValue title="Your data path" value={status?.data!} />
                                <KeyValue title="RAM usage" value={status?.memory.ram!} />
                                <KeyValue title="Disk usage" value={status?.memory.disk!} />
                            </div>
                        </>
                    }
                />
            </Grid>
        </>
    );
};

export default Status;
