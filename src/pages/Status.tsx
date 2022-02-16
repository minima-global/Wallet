import React, { useState, useEffect, FC } from 'react';
import {
    Chip,
    Grid,
    Card,
    CardContent,
    Typography,
    CardActions,
    Button,
    Box,
    List,
    ListItem,
    ListItemText,
    ListSubheader,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import { Status as StatusType } from '../types/minima';
import { callCommand } from '../minima/rpc-commands';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ExpandMoreOutlined from '@mui/icons-material/ExpandMoreOutlined';

const Status = () => {
    const [status, setStatus] = useState<StatusType>();

    useEffect(() => {
        callCommand('status').then((data: any) => {
            console.log(data);
            setStatus(data.response);
        });
    }, []);

    return (
        <Grid container mb={2}>
            <Grid item md={2}></Grid>
            <Grid item container md={8} spacing={2} mt={2}>
                <Grid item xs={12} md={12}>
                    <Card variant="outlined">
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography
                                    sx={{ fontSize: 14, display: 'inline' }}
                                    color="text.secondary"
                                    gutterBottom
                                >
                                    Overview
                                </Typography>
                                <Chip
                                    color="success"
                                    icon={status?.version ? <CheckCircleIcon /> : <CancelIcon />}
                                    label={status?.version ? 'online' : 'offline'}
                                />
                            </Box>
                            <List>
                                <ListSubheader>{status?.version ? 'Node v' + status.version : null}</ListSubheader>
                                <ListItem>
                                    <ListItemText
                                        primary="Height"
                                        secondary={status?.chain.block}
                                        primaryTypographyProps={{ fontWeight: 600 }}
                                    ></ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Timestamp"
                                        secondary={status?.chain.time}
                                        primaryTypographyProps={{ fontWeight: 600 }}
                                    ></ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Devices"
                                        secondary={status?.devices}
                                        primaryTypographyProps={{ fontWeight: 600 }}
                                    ></ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Ram Usage"
                                        secondary={status?.memory.ram}
                                        primaryTypographyProps={{ fontWeight: 600 }}
                                    ></ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Disk Usage"
                                        secondary={status?.memory.disk}
                                        primaryTypographyProps={{ fontWeight: 600 }}
                                    ></ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="User Data"
                                        secondary={status?.data}
                                        primaryTypographyProps={{ fontWeight: 600 }}
                                    ></ListItemText>
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card variant="outlined">{status && status.memory ? <Memory memory={status.memory} /> : null}</Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card variant="outlined">{status && status.chain ? <Chain chain={status.chain} /> : null}</Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card variant="outlined">{status && status.txpow ? <TxPoW txpow={status.txpow} /> : null}</Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                        {status && status.network ? <Network network={status.network} /> : null}
                    </Card>
                </Grid>
                {status && status.network.p2p && status.network.p2p.address ? (
                    <Grid item xs={12} md={12}>
                        <Card variant="outlined">
                            {status && status.network.p2p ? <P2P p2p={status.network.p2p} /> : null}
                        </Card>
                    </Grid>
                ) : null}
            </Grid>
            <Grid item md={2}></Grid>
        </Grid>
    );
};

export default Status;

const bull = (
    <Box component="span" sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}>
        •
    </Box>
);

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
    console.log(props.memory);
    return (
        <React.Fragment>
            <CardContent>
                <Box>
                    <Typography sx={{ fontSize: 14, display: 'inline' }} color="text.secondary" gutterBottom>
                        Files
                    </Typography>
                </Box>

                <List>
                    <ListItem>
                        <ListItemText
                            primary="TxPoW Database"
                            secondary={props.memory.files.txpowdb}
                            primaryTypographyProps={{ fontWeight: 600 }}
                        ></ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Archive Database"
                            secondary={props.memory.files.archivedb}
                            primaryTypographyProps={{ fontWeight: 600 }}
                        ></ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Chaintree"
                            secondary={props.memory.files.chaintree}
                            primaryTypographyProps={{ fontWeight: 600 }}
                        ></ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Wallet"
                            secondary={props.memory.files.wallet}
                            primaryTypographyProps={{ fontWeight: 600 }}
                        ></ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="User Database"
                            secondary={props.memory.files.userdb}
                            primaryTypographyProps={{ fontWeight: 600 }}
                        ></ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="P2P Database"
                            secondary={props.memory.ram}
                            primaryTypographyProps={{ fontWeight: 600 }}
                        ></ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Archive Database"
                            secondary={props.memory.files.p2pdb}
                            primaryTypographyProps={{ fontWeight: 600 }}
                        ></ListItemText>
                    </ListItem>
                </List>
            </CardContent>
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
            <CardContent>
                <Box>
                    <Typography sx={{ fontSize: 14, display: 'inline' }} color="text.secondary" gutterBottom>
                        Chain
                    </Typography>
                </Box>

                <List>
                    <ListItem>
                        <ListItemText
                            primary="Branches"
                            secondary={props.chain.branches}
                            primaryTypographyProps={{
                                fontWeight: 600,
                                textOverflow: 'hidden',
                            }}
                        ></ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            disableTypography
                            primary={<Typography variant="h2">Difficulty</Typography>}
                            secondary={
                                <Typography
                                    sx={{
                                        textOverflow: 'ellipsis',
                                        overFlowX: 'hidden',
                                        overflow: 'hidden',
                                    }}
                                    variant="body2"
                                >
                                    {props.chain.difficulty}
                                </Typography>
                            }
                        ></ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            disableTypography
                            primary={<Typography variant="h2">Hash</Typography>}
                            secondary={
                                <Typography
                                    sx={{
                                        textOverflow: 'ellipsis',
                                        overFlowX: 'hidden',
                                        overflow: 'hidden',
                                    }}
                                    variant="body2"
                                >
                                    {props.chain.hash}
                                </Typography>
                            }
                        ></ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            disableTypography
                            primary={<Typography variant="h2">Length</Typography>}
                            secondary={
                                <Typography
                                    sx={{
                                        textOverflow: 'ellipsis',
                                        overFlowX: 'hidden',
                                        overflow: 'hidden',
                                    }}
                                    variant="body2"
                                >
                                    {props.chain.length}
                                </Typography>
                            }
                        ></ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            disableTypography
                            primary={<Typography variant="h2">Size</Typography>}
                            secondary={
                                <Typography
                                    sx={{
                                        textOverflow: 'ellipsis',
                                        overFlowX: 'hidden',
                                        overflow: 'hidden',
                                    }}
                                    variant="body2"
                                >
                                    {props.chain.size}
                                </Typography>
                            }
                        ></ListItemText>
                    </ListItem>

                    <ListItem>
                        <ListItemText
                            primary="Speed"
                            secondary={props.chain.speed}
                            primaryTypographyProps={{ fontWeight: 600 }}
                        ></ListItemText>
                    </ListItem>

                    <ListItem>
                        <ListItemText
                            primary="Weight"
                            secondary={props.chain.weight}
                            primaryTypographyProps={{ fontWeight: 600 }}
                        ></ListItemText>
                    </ListItem>
                </List>
            </CardContent>
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
            <CardContent>
                <Box>
                    <Typography sx={{ fontSize: 14, display: 'inline' }} color="text.secondary" gutterBottom>
                        TxPoW
                    </Typography>
                </Box>

                <List>
                    <ListItem>
                        <ListItemText
                            primary="Mempool"
                            secondary={props.txpow.mempool}
                            primaryTypographyProps={{
                                fontWeight: 600,
                            }}
                        ></ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="RAM Database"
                            secondary={props.txpow.ramdb}
                            primaryTypographyProps={{
                                fontWeight: 600,
                            }}
                        ></ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="TxPoW Database"
                            secondary={props.txpow.txpowdb}
                            primaryTypographyProps={{
                                fontWeight: 600,
                            }}
                        ></ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Archive Database"
                            secondary={props.txpow.archivedb}
                            primaryTypographyProps={{
                                fontWeight: 600,
                            }}
                        ></ListItemText>
                    </ListItem>
                </List>
            </CardContent>
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
            <CardContent>
                <Box>
                    <Typography sx={{ fontSize: 14, display: 'inline' }} color="text.secondary" gutterBottom>
                        Network
                    </Typography>
                </Box>

                <List>
                    <ListItem>
                        <ListItemText
                            primary="Connected"
                            secondary={props.network.connected}
                            primaryTypographyProps={{
                                fontWeight: 600,
                            }}
                        ></ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Connecting"
                            secondary={props.network.connecting}
                            primaryTypographyProps={{
                                fontWeight: 600,
                            }}
                        ></ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Host"
                            secondary={props.network.host}
                            primaryTypographyProps={{
                                fontWeight: 600,
                            }}
                        ></ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Host Set"
                            secondary={props.network.hostset ? 'True' : 'False'}
                            primaryTypographyProps={{
                                fontWeight: 600,
                            }}
                        ></ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Port"
                            secondary={props.network.port}
                            primaryTypographyProps={{
                                fontWeight: 600,
                            }}
                        ></ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="P2P"
                            secondary={props.network.rpc ? 'True' : 'False'}
                            primaryTypographyProps={{
                                fontWeight: 600,
                            }}
                        ></ListItemText>
                    </ListItem>
                </List>
            </CardContent>
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
                    <Typography sx={{ fontSize: 14, display: 'inline' }} color="text.secondary" gutterBottom>
                        P2P
                    </Typography>
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
