import { FC, useState, useContext } from 'react';
import { Grid, Card, CardContent, TextField, Button, Stack, CardMedia, Typography } from '@mui/material';
import MiniModal from '../shared/components/MiniModal';

import { callCreateNFT, callBalance } from '../minima/rpc-commands';

/** form imports */
import { useFormik } from 'formik';
import { BalanceUpdates } from '../App'; // balance context

import { MinimaToken } from '../types/minima';

const NFTs: FC = () => {
    const balances = useContext(BalanceUpdates);

    return (
        <>
            <Grid container mt={2} spacing={0}>
                <Grid item xs={0} md={2}></Grid>
                <Grid container item xs={12} md={8} spacing={2}>
                    <Grid container item xs={12} spacing={2}>
                        {balances.map((b: MinimaToken) => {
                            if (typeof b.token !== 'string' && b.token.nft) {
                                return (
                                    <NFTListItem
                                        name={b.token.name}
                                        url={b.token.url}
                                        description={b.token.description}
                                    />
                                );
                            }
                        })}
                        <NFTListItem name="Test" url="test" description="test" />
                        <NFTListItem name="Test" url="test" description="test" />
                        <NFTListItem name="Test" url="test" description="test" />
                    </Grid>

                    <Grid item xs={12}>
                        <CreateNFTForm />
                    </Grid>
                </Grid>
                <Grid item xs={0} md={2}></Grid>
            </Grid>
        </>
    );
};

export default NFTs;

interface NFT {
    url: string;
    name: string;
    description: string;
}
/** Each NFT */
const NFTListItem: FC<NFT> = ({ url, name, description }) => {
    return (
        <>
            <Grid item xs={6}>
                <Card variant="outlined">
                    <CardMedia component="img" src={url} />
                    <CardContent>
                        <Stack direction="row" justifyContent={'space-between'}>
                            <Stack>
                                <Typography
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: 12,
                                        display: '-webkit-box',
                                        overflow: 'hidden',
                                        WebkitBoxOrient: 'vertical',
                                        WebkitLineClamp: 3,
                                    }}
                                    variant="h6"
                                >
                                    {name}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontWeight: 100,
                                        fontSize: 10,
                                        display: '-webkit-box',
                                        overflow: 'hidden',
                                        WebkitBoxOrient: 'vertical',
                                        WebkitLineClamp: 3,
                                    }}
                                    variant="subtitle1"
                                >
                                    {description}
                                </Typography>
                            </Stack>
                            <Stack>
                                <Typography sx={{ fontWeight: 600, fontSize: 12 }} variant="h6">
                                    Total
                                </Typography>
                                <Typography sx={{ fontWeight: 100, fontSize: 10 }} variant="subtitle1">
                                    Subtitle
                                </Typography>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>
        </>
    );
};

/** NFT form creator */
const CreateNFTForm: FC = () => {
    const [open, setOpen] = useState(false);
    const [modalStatus, setModalStatus] = useState('Failed');

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setModalStatus('Failed');
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            amount: 1,
            url: '',
            description: '',
        },
        onSubmit: (data) => {
            console.log(`Minting NFT`);
            const customNFT = {
                name: data.name,
                url: data.url,
                description: data.description,
            };
            callCreateNFT(customNFT).then((res: any) => {
                console.log(res);
            });
        },
    });
    return (
        <Card variant="outlined">
            <CardContent>
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
                        id="name"
                        name="name"
                        placeholder="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                        sx={{ mb: 2 }}
                        FormHelperTextProps={{
                            style: styles.helperText,
                        }}
                        InputProps={{
                            style:
                                formik.touched.name && Boolean(formik.errors.name)
                                    ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
                                    : { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
                        }}
                    ></TextField>
                    <TextField
                        fullWidth
                        id="url"
                        name="url"
                        placeholder="url"
                        value={formik.values.url}
                        onChange={formik.handleChange}
                        error={formik.touched.url && Boolean(formik.errors.url)}
                        helperText={formik.touched.url && formik.errors.url}
                        sx={{ mb: 2 }}
                    ></TextField>
                    <TextField
                        fullWidth
                        id="description"
                        name="description"
                        placeholder="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        error={formik.touched.description && Boolean(formik.errors.description)}
                        helperText={formik.touched.description && formik.errors.description}
                        multiline
                        rows={4}
                        sx={{ mb: 2 }}
                    ></TextField>
                    <Button
                        disabled={formik.isSubmitting && !formik.isValid}
                        disableElevation
                        color="primary"
                        variant="contained"
                        fullWidth
                        type="submit"
                    >
                        {formik.isSubmitting ? 'Minting...' : 'Mint'}
                    </Button>
                    <MiniModal
                        open={open}
                        handleClose={handleClose}
                        handleOpen={handleOpen}
                        header={modalStatus === 'Success' ? 'Success!' : 'Failed!'}
                        status="Transaction Status"
                        subtitle={
                            modalStatus === 'Success' ? 'Your token will be minted shortly' : 'Please try again later.'
                        }
                    />
                </form>
            </CardContent>
        </Card>
    );
};

const styles = {
    helperText: {
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 8,
        color: '#363A3F',
        fontWeight: '400',
        paddingLeft: 8,
    },
};

/**
 * Abstracting Grid container + items
 * 
 * const Container = props => <Grid container {...props} />;
   const Item = props => <Grid item {...props} />;

 */
