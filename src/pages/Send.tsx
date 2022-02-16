import { callBalance, callSend } from '../minima/rpc-commands';
import { useSnackbar } from 'notistack';
import { Button, TextField, Card, CardContent, Grid, Select, MenuItem } from '@mui/material';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { FC, useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';

import { RpcResponse, MinimaToken } from '../types/minima';

const Send: FC = () => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const readerDiv = useRef(null);

    const [tokenSelection, setTokenSelection] = useState<MinimaToken[]>([]);

    useEffect(() => {
        callBalance().then((res: any) => {
            setTokenSelection(res.response);
        });
    }, []);

    const onSendClicked = () => {
        callSend({
            address: '',
            amount: '',
            tokenid: '',
        }).then(
            (res) => {
                console.log(res);
                enqueueSnackbar('success', { variant: 'success' });
            },
            () => {
                enqueueSnackbar('error', { variant: 'error' });
            }
        );
    };

    const formik = useFormik({
        initialValues: {
            tokenid: '0x00',
            amount: '',
            address: '',
        },
        // validationSchema: validationSchema,
        onSubmit: (values) => {
            alert(JSON.stringify(values, null, 2));
        },
    });

    return (
        <Grid container mt={2} spacing={2}>
            <Grid item xs={0} md={2}></Grid>
            <Grid item xs={8} md={8}>
                <Card>
                    <CardContent>
                        <form onSubmit={formik.handleSubmit}>
                            <Select
                                sx={{ marginBottom: 4 }}
                                id="tokenid"
                                name="tokenid"
                                value={formik.values.tokenid}
                                onChange={formik.handleChange}
                                error={formik.touched.tokenid && Boolean(formik.errors.tokenid)}
                                // onOpen={() => {
                                //     callBalance().then((res: any) => {
                                //         console.log(`Updating tokens..`);
                                //         setTokenSelection(res.response);
                                //     });
                                // }}
                                fullWidth
                            >
                                {tokenSelection && tokenSelection.length > 0
                                    ? tokenSelection.map((token: MinimaToken) => (
                                          <MenuItem key={token.tokenid} value={token.tokenid}>
                                              {token.token.name ? token.token.name : token.token}
                                          </MenuItem>
                                      ))
                                    : null}
                            </Select>

                            <TextField
                                fullWidth
                                id="address"
                                name="address"
                                placeholder="Address"
                                value={formik.values.address}
                                onChange={formik.handleChange}
                                error={formik.touched.address && Boolean(formik.errors.address)}
                                helperText={formik.touched.address && formik.errors.address}
                                sx={{ marginBottom: 4 }}
                            />
                            <TextField
                                fullWidth
                                id="amount"
                                name="amount"
                                placeholder="Amount"
                                value={formik.values.amount}
                                onChange={formik.handleChange}
                                error={formik.touched.amount && Boolean(formik.errors.amount)}
                                helperText={formik.touched.amount && formik.errors.amount}
                                sx={{ marginBottom: 4 }}
                            />
                            <Button color="primary" variant="contained" fullWidth type="submit">
                                Submit
                            </Button>
                        </form>
                    </CardContent>
                </Card>
                {/* <Formik
                    initialValues={initForm}
                    // validationSchema={}
                    onSubmit={(e) => {
                        console.log(`Submitting...`);

                        return;
                    }}
                >
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                        <Form>
                            <FormGroup>
                                <FormControl>
                                    <InputLabel htmlFor="my-tokenid">Token Id</InputLabel>
                                    <Input id="my-tokenid" aria-describedby="my-helper-text" value={values.tokenid} />
                                    <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText>
                                </FormControl>
                                <FormControl>
                                    <InputLabel htmlFor="my-address">Address</InputLabel>
                                    <Input id="my-address" aria-describedby="my-helper-text" value={values.address} />
                                    <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText>
                                </FormControl>
                                <FormControl>
                                    <InputLabel htmlFor="my-amount">Amount</InputLabel>
                                    <Input id="my-amount" aria-describedby="my-helper-text" value={values.amount} />
                                    <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText>
                                </FormControl>
                                <Button type="submit">Submit</Button>
                            </FormGroup>
                        </Form>
                    )}
                </Formik> */}
            </Grid>
            <Grid item xs={0} md={2}></Grid>
        </Grid>
    );

    // if (!('BarcodeDetector' in window)) {
    //     alert('Barcode Detector is not supported by this browser.');
    // } else {
    //     alert('Barcode Detector supported!');

    //     // create new detector
    //     // @ts-ignore
    //     var barcodeDetector = new BarcodeDetector({ formats: ['qr_code'] });
    // }

    // useEffect(() => {
    //     function onScanSuccess(decodedText: any, decodedResult: any) {
    //         // handle the scanned code as you like, for example:
    //         // console.log(`Code matched = ${decodedText}`, decodedResult);
    //         alert(`Code matched = ${decodedText}`);
    //     }

    //     function onScanFailure(error: any) {
    //         // handle scan failure, usually better to ignore and keep scanning.
    //         // for example:
    //         console.warn(`Code scan error = ${error}`);
    //     }

    //     let html5QrcodeScanner = new Html5QrcodeScanner(
    //         'reader',
    //         { fps: 10, qrbox: { width: 250, height: 250 } },
    //         /* verbose= */ false
    //     );
    //     html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    // }, []);
};

export default Send;

const MyCustomBadge = () => {
    return <div>My Custom Badge</div>;
};
