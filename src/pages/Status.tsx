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
} from '@mui/material';
import { Status as StatusType } from '../types/minima';
import { callCommand } from '../minima/rpc-commands';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

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

const Memory: FC<MemoryProps> = ({ memory }: MemoryProps) => {
    console.log(memory);
    return (
        <React.Fragment>
            <CardContent>
                <Box>
                    <Typography sx={{ fontSize: 14, display: 'inline' }} color="text.secondary" gutterBottom>
                        Memory
                    </Typography>
                    <Chip color="success" icon={<CheckCircleIcon />} label="online" />
                </Box>

                <Typography variant="h5" component="div">
                    be{bull}nev{bull}o{bull}lent
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    adjective
                </Typography>
                <Typography variant="body2">
                    well meaning and kindly.
                    <br />
                    {'"a benevolent smile"'}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">Learn More</Button>
            </CardActions>
        </React.Fragment>
    );
};
