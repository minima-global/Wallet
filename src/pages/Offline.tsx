import { Grid, Typography, Box, Button, CardContent, Card, Stack, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Offline = () => {
    const navigate = useNavigate();
    return (
        <Grid container mt={2} spacing={0}>
            <Grid item xs={0} md={2}></Grid>
            <Grid item xs={12} md={8} sx={{ textAlign: 'left' }}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h6">
                            <Box component="div">
                                <Typography variant="h4">Oh no! 😥</Typography>
                            </Box>{' '}
                            Your node is offline.
                        </Typography>
                        <Typography variant="h6">
                            Type{' '}
                            <Box
                                component="span"
                                sx={{
                                    fontFamily: 'monospace',
                                    padding: '2.5px',
                                    backgroundColor: '#000',
                                    color: '#fff',
                                }}
                            >
                                status
                            </Box>{' '}
                            command in your node's terminal, does it return true?
                        </Typography>

                        <Typography variant="h6">
                            <Box component="span">Yes it returns true!</Box> Type{' '}
                            <Box
                                component="span"
                                sx={{
                                    fontFamily: 'monospace',
                                    padding: '2.5px',
                                    backgroundColor: '#000',
                                    color: '#fff',
                                }}
                            >
                                rpc enable:true
                            </Box>{' '}
                            in your node's terminal and then tap to{' '}
                            <Box
                                component="span"
                                sx={{
                                    color: '#317Aff',
                                    '&:hover': {
                                        backgroundColor: '#000',
                                        padding: 0.5,
                                        color: '#fff',
                                        cursor: 'pointer',
                                    },
                                }}
                                onClick={() => navigate('/balance')}
                            >
                                Retry
                            </Box>
                        </Typography>

                        <Stack mt={2}>
                            <Typography variant="h4">Still doesn't work?</Typography>
                            <Typography variant="body1">
                                Open a new support ticket on <Link href="https://discord.gg/CraZfThGCw">Discord</Link>{' '}
                                so Minima support can help.
                            </Typography>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Offline;
