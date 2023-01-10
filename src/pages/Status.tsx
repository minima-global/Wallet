import React, { useState, useEffect } from 'react';
import {
    Grid,
    CardContent,
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Stack,
} from '@mui/material';
import { callStatus } from '../minima/rpc-commands';

import styled from '@emotion/styled';
import MiCard from '../shared/components/layout/MiCard/MiCard';
import { Status as NodeStatus } from '../@types/minima2';

const MiStatusWrapper = styled('div')`
    display: flex;
    flex-direction: row;
    gap: 8px;
    flex-flow: column;
`;
const MiStatusTitle = styled('h6')`
    font-family: Manrope-semibold;
    font-size: 1rem;
    margin: 0;
    padding: 0;
    color: #16181c;
`;

const MiBreak = styled('hr')`
    width: 100%;
    height: 3px;
    border-radius: 8px;
    background-color: #317aff;

    margin-bottom: 16px;
`;

const MiStatusItem = styled('div')`
    * {
        padding: 0;
        margin: 0;
    }
    > p {
        font-size: 0.875rem;
        font-family: Manrope-regular;
        color: #363a3f;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    > label {
        font-size: 1rem;
        font-family: Manrope-semibold;
        font-weight: 400;
        color: #16181c;
    }
`;
const MiStatusOnline = styled('div')`
    border-radius: 25%;
    padding: 8px;
    background-color: #4e8b7c;
    border: 2px solid rgba(255, 255, 255, 0.5);
`;

const Status = () => {
    const [status, setStatus] = useState<false | NodeStatus>(false);

    useEffect(() => {
        callStatus()
            .then((status) => {
                setStatus(status);
            })
            .catch((err: any) => {
                console.error(err);
            });
    }, []);

    return (
        <Grid container spacing={0} mb={2}>
            <Grid item md={2}></Grid>
            <Grid
                item
                container
                md={8}
                spacing={1}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                {!status ? (
                    <CircularProgress sx={{ mt: 2 }} size={32} />
                ) : (
                    <>
                        <Grid item xs={12} md={6}>
                            <MiCard>
                                <Stack justifyContent="space-between" alignItems="center" flexDirection="row">
                                    <MiStatusTitle>Overview</MiStatusTitle>
                                    {status?.version ? <MiStatusOnline /> : 'offline'}
                                </Stack>
                                <MiBreak />
                                <MiStatusWrapper>
                                    <MiStatusItem>
                                        <label>Node Version</label>
                                        <p>{status?.version ? status.version : 'N/A'}</p>
                                    </MiStatusItem>
                                    <MiStatusItem>
                                        <label>Block Height</label>
                                        <p>{status?.chain.block ? status.chain.block : 'N/A'}</p>
                                    </MiStatusItem>
                                    <MiStatusItem>
                                        <label>Current timestamp</label>
                                        <p>{status?.chain.time ? status.chain.time : 'N/A'}</p>
                                    </MiStatusItem>
                                    <MiStatusItem>
                                        <label>Coins</label>
                                        <p>{status?.coins ? status.coins : 'N/A'}</p>
                                    </MiStatusItem>
                                    <MiStatusItem>
                                        <label>Ram Usage</label>
                                        <p>{status?.memory.ram ? status.memory.ram : 'N/A'}</p>
                                    </MiStatusItem>
                                    <MiStatusItem>
                                        <label>Disk Usage</label>
                                        <p>{status?.memory.disk ? status.memory.disk : 'N/A'}</p>
                                    </MiStatusItem>
                                    <MiStatusItem>
                                        <label>User Data</label>
                                        <p>{status?.data ? status.data : 'N/A'}</p>
                                    </MiStatusItem>
                                    <MiStatusItem>
                                        <label>RPC</label>
                                        <p>{status?.network.rpc ? 'activated' : 'deactivated'}</p>
                                    </MiStatusItem>
                                </MiStatusWrapper>
                            </MiCard>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <MiCard>{status && status.memory ? <CardMemory {...status} /> : null}</MiCard>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <MiCard>{status && status.chain ? <CardChain {...status} /> : null}</MiCard>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <MiCard>{status && status.txpow ? <CardTxPoW {...status} /> : null}</MiCard>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <MiCard>{status && status.network ? <CardNetwork {...status} /> : null}</MiCard>
                        </Grid>
                        {status && status.network.p2p && status.network.p2p.address ? (
                            <Grid item xs={12} md={12}>
                                <MiCard>{status && status.network.p2p ? <CardP2P {...status} /> : null}</MiCard>
                            </Grid>
                        ) : null}
                    </>
                )}
            </Grid>

            <Grid item md={2}></Grid>
        </Grid>
    );
};

export default Status;

const CardMemory = (props: NodeStatus) => {
    const { memory } = props;

    return (
        <React.Fragment>
            <Stack>
                <MiStatusTitle>Database Sizes</MiStatusTitle>
                <MiBreak />
            </Stack>

            <MiStatusWrapper>
                <MiStatusItem>
                    <label>TxPOW</label>
                    <p>{memory.files.txpowdb}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>Archive</label>
                    <p>{memory.files.archivedb}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>Chaintree</label>
                    <p>{memory.files.chaintree}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>Wallet</label>
                    <p>{memory.files.wallet}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>User</label>
                    <p>{memory.files.userdb}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>P2P</label>
                    <p>{memory.ram}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>Archive</label>
                    <p>{memory.files.p2pdb}</p>
                </MiStatusItem>
            </MiStatusWrapper>
        </React.Fragment>
    );
};

const CardChain = (props: NodeStatus) => {
    const { chain } = props;
    return (
        <React.Fragment>
            <Stack>
                <MiStatusTitle>Chain</MiStatusTitle>
                <MiBreak />
            </Stack>

            <MiStatusWrapper>
                <MiStatusItem>
                    <label>Branches</label>
                    <p>{chain.branches}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>Difficulty</label>
                    <p>{chain.difficulty}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>Hash</label>
                    <p>{chain.hash}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>Length</label>
                    <p>{chain.length}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>Size</label>
                    <p>{chain.size}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>Speed</label>
                    <p>{chain.speed}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>Weight</label>
                    <p>{chain.weight}</p>
                </MiStatusItem>
            </MiStatusWrapper>
        </React.Fragment>
    );
};

const CardTxPoW = (props: NodeStatus) => {
    const { txpow } = props;

    return (
        <React.Fragment>
            <Stack>
                <MiStatusTitle>TxPOW</MiStatusTitle>
                <MiBreak />
            </Stack>

            <MiStatusWrapper>
                <MiStatusItem>
                    <label>Mempool</label>
                    <p>{txpow.mempool}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>RAM Db</label>
                    <p>{txpow.ramdb}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>TxPOW Db</label>
                    <p>{txpow.txpowdb}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>Archive Db Size</label>
                    <p>{txpow.archivedb.size}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>Archive Db Start</label>
                    <p>{txpow.archivedb.start}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>Archive Db Start Date</label>
                    <p>{txpow.archivedb.startdate}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>Archive Db End</label>
                    <p>{txpow.archivedb.end}</p>
                </MiStatusItem>
            </MiStatusWrapper>
        </React.Fragment>
    );
};

const CardNetwork = (props: NodeStatus) => {
    const { network } = props;
    return (
        <React.Fragment>
            <Stack>
                <MiStatusTitle>Network</MiStatusTitle>
                <MiBreak />
            </Stack>

            <MiStatusWrapper>
                <MiStatusItem>
                    <label>Connected</label>
                    <p>{network.connected}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>Connecting</label>
                    <p>{network.connecting}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>Host</label>
                    <p>{network.host}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>Set Host</label>
                    <p>{network.hostset ? 'activated' : 'deactivated'}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>Port</label>
                    <p>{network.port}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>RPC</label>
                    <p>{network.rpc && network.rpc.enabled ? 'activated' : 'deactivated'}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>RPC Port</label>
                    <p>{network.rpc && network.rpc.port ? network.rpc.port : 'N/A'}</p>
                </MiStatusItem>
            </MiStatusWrapper>
        </React.Fragment>
    );
};

const CardP2P = (props: NodeStatus) => {
    const { p2p } = props.network;
    return (
        <React.Fragment>
            <Stack>
                <MiStatusTitle>P2P</MiStatusTitle>
                <MiBreak />
            </Stack>

            <MiStatusWrapper>
                <MiStatusItem>
                    <label>P2P Address</label>
                    <p>{p2p?.address}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>Accepting inlinks</label>
                    <p>{p2p?.isAcceptingInLinks}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>Inlink Count</label>
                    <p>{p2p?.numInLinks}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>Outlink Count</label>
                    <p>{p2p?.numOutLinks}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>Count All Links</label>
                    <p>{p2p?.numAllLinks}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>Not Accepting P2P Links Count</label>
                    <p>{p2p?.numNotAcceptingConnP2PLinks}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>Not P2P Links Count</label>
                    <p>{p2p?.numNoneP2PLinks}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>Known Peers Count</label>
                    <p>{p2p?.numKnownPeers}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>Unvalidated Peers Count</label>
                    <p>{p2p?.numUnvalidatedPeers}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>NIO Inbound</label>
                    <p>{p2p?.nio_inbound}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>NIO Outbound</label>
                    <p>{p2p?.nio_outbound}</p>
                </MiStatusItem>
            </MiStatusWrapper>
        </React.Fragment>
    );
};
