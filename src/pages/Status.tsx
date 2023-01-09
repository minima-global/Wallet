import React, { useState, useEffect, FC, useContext } from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Stack,
} from '@mui/material';
import { Status as StatusType } from '../types/minima';
import { callStatus } from '../minima/rpc-commands';
import { useAppSelector } from '../minima/redux/hooks';
import { selectBalance } from '../minima/redux/slices/balanceSlice';

import styled from '@emotion/styled';
import MiCard from '../shared/components/layout/MiCard/MiCard';

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
    const [status, setStatus] = useState<StatusType>();

    const balances = useAppSelector(selectBalance);

    useEffect(() => {
        callStatus()
            .then((data: any) => {
                setStatus(data.response);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [balances]);

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
                {balances.length === 0 ? (
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
                                        <label>Devices</label>
                                        <p>{status?.devices ? status.devices : 'N/A'}</p>
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
                            <MiCard>{status && status.memory ? <Memory memory={status.memory} /> : null}</MiCard>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <MiCard>{status && status.chain ? <Chain chain={status.chain} /> : null}</MiCard>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <MiCard>{status && status.txpow ? <TxPoW txpow={status.txpow} /> : null}</MiCard>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <MiCard>{status && status.network ? <Network network={status.network} /> : null}</MiCard>
                        </Grid>
                        {status && status.network.p2p && status.network.p2p.address ? (
                            <Grid item xs={12} md={12}>
                                <MiCard>
                                    {status && status.network.p2p ? <P2P p2p={status.network.p2p} /> : null}
                                </MiCard>
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

interface MemoryProps {
    memory: {
        ram: string;
        disk: string;
        files: {
            txpowdb: string;
            archivedb: string;
            cascade: string;
            chaintree: string;
            wallet: string;
            userdb: string;
            p2pdb: string;
        };
    };
}

const Memory: FC<MemoryProps> = (props: MemoryProps) => {
    return (
        <React.Fragment>
            <Stack>
                <MiStatusTitle>Database Sizes</MiStatusTitle>
                <MiBreak />
            </Stack>

            <MiStatusWrapper>
                <MiStatusItem>
                    <label>TxPOW</label>
                    <p>{props.memory.files.txpowdb}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>Archive</label>
                    <p>{props.memory.files.archivedb}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>Chaintree</label>
                    <p>{props.memory.files.chaintree}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>Wallet</label>
                    <p>{props.memory.files.wallet}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>User</label>
                    <p>{props.memory.files.userdb}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>P2P</label>
                    <p>{props.memory.ram}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>Archive</label>
                    <p>{props.memory.files.p2pdb}</p>
                </MiStatusItem>
            </MiStatusWrapper>
        </React.Fragment>
    );
};

interface ChainProps {
    chain: {
        block: number;

        branches: number;
        difficulty: string;
        hash: string;
        length: number;
        size: number;
        speed: string;
        time: string;
        weight: number;
        cascade: {
            start: number;
            length: number;
            weight: string;
        };
    };
}

const Chain: FC<ChainProps> = (props: ChainProps) => {
    return (
        <React.Fragment>
            <Stack>
                <MiStatusTitle>Chain</MiStatusTitle>
                <MiBreak />
            </Stack>

            <MiStatusWrapper>
                <MiStatusItem>
                    <label>Branches</label>
                    <p>{props.chain.branches}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>Difficulty</label>
                    <p>{props.chain.difficulty}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>Hash</label>
                    <p>{props.chain.hash}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>Length</label>
                    <p>{props.chain.length}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>Size</label>
                    <p>{props.chain.size}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>Speed</label>
                    <p>{props.chain.speed}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>Weight</label>
                    <p>{props.chain.weight}</p>
                </MiStatusItem>
            </MiStatusWrapper>
        </React.Fragment>
    );
};

interface TxPoWProps {
    txpow: {
        mempool: number;
        ramdb: number;
        txpowdb: number;
        archivedb: number;
    };
}

const TxPoW: FC<TxPoWProps> = (props: TxPoWProps) => {
    return (
        <React.Fragment>
            <Stack>
                <MiStatusTitle>TxPOW</MiStatusTitle>
                <MiBreak />
            </Stack>

            <MiStatusWrapper>
                <MiStatusItem>
                    <label>Mempool</label>
                    <p>{props.txpow.mempool}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>RAM Db</label>
                    <p>{props.txpow.ramdb}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>TxPOW Db</label>
                    <p>{props.txpow.txpowdb}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>Archive Db</label>
                    <p>{props.txpow.archivedb}</p>
                </MiStatusItem>
            </MiStatusWrapper>
        </React.Fragment>
    );
};

interface NetworkProps {
    network: {
        connected: number;
        connecting: number;
        host: string;
        hostset: boolean;
        port: number;
        rpc: boolean;
    };
}

const Network: FC<NetworkProps> = (props: NetworkProps) => {
    return (
        <React.Fragment>
            <Stack>
                <MiStatusTitle>Network</MiStatusTitle>
                <MiBreak />
            </Stack>

            <MiStatusWrapper>
                <MiStatusItem>
                    <label>Connected</label>
                    <p>{props.network.connected}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>Connecting</label>
                    <p>{props.network.connecting}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>Host</label>
                    <p>{props.network.host}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>Set Host</label>
                    <p>{props.network.hostset ? 'activated' : 'deactivated'}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>Port</label>
                    <p>{props.network.port}</p>
                </MiStatusItem>
                <MiStatusItem>
                    <label>RPC</label>
                    <p>{props.network.rpc ? 'activated' : 'deactivated'}</p>
                </MiStatusItem>
            </MiStatusWrapper>
        </React.Fragment>
    );
};

interface P2PProps {
    p2p?: {
        deviceHashRate: number;
        address: string;
        isAcceptingInLinks: boolean;
        numInLinks: number;
        numOutLinks: number;
        numNotAcceptingConnP2PLinks: number;
        numNoneP2PLinks: number;
        numKnownPeers: number;
        numAllLinks: number;
        nio_inbound: number;
        nio_outbound: number;
    };
}

const P2P: FC<P2PProps> = (props: P2PProps) => {
    return (
        <React.Fragment>
            <CardContent>
                <Box>
                    <Typography variant="h6">P2P</Typography>
                </Box>

                <List>
                    <Grid container sx={{ justifyContent: 'space-between' }}>
                        <Grid item>
                            <ListItem>
                                {props.p2p?.deviceHashRate !== undefined ? (
                                    <ListItemText
                                        primary="Device Hashrate"
                                        secondary={props.p2p.deviceHashRate}
                                        primaryTypographyProps={{
                                            fontWeight: 600,
                                        }}
                                    ></ListItemText>
                                ) : null}
                            </ListItem>
                            <ListItem>
                                {props.p2p?.address ? (
                                    <ListItemText
                                        primary="Address"
                                        secondary={props.p2p.address}
                                        primaryTypographyProps={{
                                            fontWeight: 600,
                                        }}
                                    ></ListItemText>
                                ) : null}
                            </ListItem>
                            <ListItem>
                                {props.p2p?.isAcceptingInLinks !== undefined ? (
                                    <ListItemText
                                        primary="Accepting inlinks"
                                        secondary={props.p2p.isAcceptingInLinks ? 'True' : 'False'}
                                        primaryTypographyProps={{
                                            fontWeight: 600,
                                        }}
                                    ></ListItemText>
                                ) : null}
                            </ListItem>
                            <ListItem>
                                {props.p2p?.numInLinks !== undefined ? (
                                    <ListItemText
                                        primary="Inlink Count"
                                        secondary={props.p2p.numInLinks}
                                        primaryTypographyProps={{
                                            fontWeight: 600,
                                        }}
                                    ></ListItemText>
                                ) : null}
                            </ListItem>
                            <ListItem>
                                {props.p2p?.numOutLinks !== undefined ? (
                                    <ListItemText
                                        primary="Outlink Count"
                                        secondary={props.p2p.numOutLinks}
                                        primaryTypographyProps={{
                                            fontWeight: 600,
                                        }}
                                    ></ListItemText>
                                ) : null}
                            </ListItem>
                            <ListItem>
                                {props.p2p?.numAllLinks !== undefined ? (
                                    <ListItemText
                                        primary="Count Of All Links"
                                        secondary={props.p2p.numAllLinks}
                                        primaryTypographyProps={{
                                            fontWeight: 600,
                                        }}
                                    ></ListItemText>
                                ) : null}
                            </ListItem>
                        </Grid>
                        <Grid item>
                            <ListItem>
                                {props.p2p?.numAllLinks !== undefined ? (
                                    <ListItemText
                                        primary="Count All Links"
                                        secondary={props.p2p.numAllLinks}
                                        primaryTypographyProps={{
                                            fontWeight: 600,
                                        }}
                                    ></ListItemText>
                                ) : null}
                            </ListItem>
                            <ListItem>
                                {props.p2p?.numNotAcceptingConnP2PLinks !== undefined ? (
                                    <ListItemText
                                        primary="Count Not Accepting P2P Links"
                                        secondary={props.p2p.numNotAcceptingConnP2PLinks}
                                        primaryTypographyProps={{
                                            fontWeight: 600,
                                        }}
                                    ></ListItemText>
                                ) : null}
                            </ListItem>
                            <ListItem>
                                {props.p2p?.numNoneP2PLinks !== undefined ? (
                                    <ListItemText
                                        primary="Count Not P2P Links"
                                        secondary={props.p2p.numNoneP2PLinks}
                                        primaryTypographyProps={{
                                            fontWeight: 600,
                                        }}
                                    ></ListItemText>
                                ) : null}
                            </ListItem>
                            <ListItem>
                                {props.p2p?.numKnownPeers !== undefined ? (
                                    <ListItemText
                                        primary="Count Known Peers"
                                        secondary={props.p2p.numKnownPeers}
                                        primaryTypographyProps={{
                                            fontWeight: 600,
                                        }}
                                    ></ListItemText>
                                ) : null}
                            </ListItem>
                            <ListItem>
                                {props.p2p?.nio_inbound !== undefined ? (
                                    <ListItemText
                                        primary="NIO Inbound"
                                        secondary={props.p2p.nio_inbound}
                                        primaryTypographyProps={{
                                            fontWeight: 600,
                                        }}
                                    ></ListItemText>
                                ) : null}
                            </ListItem>
                            <ListItem>
                                {props.p2p?.nio_outbound !== undefined ? (
                                    <ListItemText
                                        primary="NIO Outbound"
                                        secondary={props.p2p.nio_outbound}
                                        primaryTypographyProps={{
                                            fontWeight: 600,
                                        }}
                                    ></ListItemText>
                                ) : null}
                            </ListItem>
                        </Grid>
                    </Grid>
                </List>
            </CardContent>
        </React.Fragment>
    );
};
