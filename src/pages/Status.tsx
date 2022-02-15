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
        <Grid container>
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
                {/* <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                        <Memory />
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                        <Memory />
                    </Card>
                </Grid> */}
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
