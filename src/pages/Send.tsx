import { callBalance, callSend } from '../minima/rpc-commands';
import { useSnackbar } from 'notistack';
import { Button, TextField, Card, CardContent, Grid, Select, MenuItem, Chip } from '@mui/material';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { FC, useEffect, useRef, useState } from 'react';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { INSUFFICIENT } from '../minima/constants';

import { MinimaToken } from '../types/minima';

const TransferTokenSchema = Yup.object().shape({
    tokenid: Yup.string().required('Field Required'),
    address: Yup.string()
        .matches(/0[xX][0-9a-fA-F]+/, 'Invalid Address.')
        .min(66, 'Invalid Address, too short.')
        .max(66, 'Invalid Address, too long.')
        .required('Field Required'),
    amount: Yup.string().required('Field Required'),
});

const styles = {
    helperText: {
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 8,
        color: '#363A3F',
        fontWeight: '400',
        paddingLeft: 8,
    },
};

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
        validationSchema: TransferTokenSchema,
        onSubmit: (data) => {
            callSend(data)
                .then((res: any) => {
                    console.log('sent');
                    // SENT
                    formik.resetForm();
                })
                .catch((err) => {
                    console.error(err.message);
                    // FAILED
                    if (err.message.substring(0, 20) === INSUFFICIENT) {
                        formik.setFieldError('amount', err.message);
                    }
                })
                .finally(() => {
                    formik.setSubmitting(false);
                    // NO MATTER WHAT
                });
        },
    });

    return (
        <Grid container mt={2} spacing={2}>
            <Grid item xs={0} md={2}></Grid>
            <Grid item xs={12} md={8}>
                <Card>
                    <CardContent>
                        <form onSubmit={formik.handleSubmit}>
                            {tokenSelection && tokenSelection.length > 0 ? (
                                <Select
                                    sx={{ marginBottom: 4 }}
                                    id="tokenid"
                                    name="tokenid"
                                    value={formik.values.tokenid}
                                    onChange={formik.handleChange}
                                    error={formik.touched.tokenid && Boolean(formik.errors.tokenid)}
                                    fullWidth
                                >
                                    {tokenSelection && tokenSelection.length > 0
                                        ? tokenSelection.map((token: MinimaToken) => (
                                              <MenuItem
                                                  key={token.tokenid}
                                                  value={token.tokenid}
                                                  sx={{ justifyContent: 'space-between' }}
                                              >
                                                  {token.token.name ? token.token.name : token.token}
                                                  <Chip
                                                      sx={{ ml: 2 }}
                                                      color="primary"
                                                      label={
                                                          token.tokenid === '0x00'
                                                              ? '0x00'
                                                              : token.tokenid.substring(0, 8) +
                                                                '...' +
                                                                token.tokenid.substring(58, 66)
                                                      }
                                                  />
                                              </MenuItem>
                                          ))
                                        : null}
                                </Select>
                            ) : null}

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
                                FormHelperTextProps={{
                                    style: styles.helperText,
                                }}
                                InputProps={{
                                    style:
                                        formik.touched.amount && Boolean(formik.errors.amount)
                                            ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
                                            : { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
                                }}
                            />

                            <TextField
                                fullWidth
                                id="amount"
                                name="amount"
                                placeholder="0.0"
                                value={formik.values.amount}
                                onChange={formik.handleChange}
                                error={formik.touched.amount && Boolean(formik.errors.amount)}
                                helperText={formik.touched.amount && formik.errors.amount}
                                sx={{ marginBottom: 4 }}
                                FormHelperTextProps={{
                                    style: styles.helperText,
                                }}
                                InputProps={{
                                    style:
                                        formik.touched.amount && Boolean(formik.errors.amount)
                                            ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
                                            : { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
                                }}
                            />
                            <Button
                                disabled={formik.isSubmitting && !formik.isValid}
                                disableElevation
                                color="primary"
                                variant="contained"
                                fullWidth
                                type="submit"
                            >
                                {formik.isSubmitting ? 'Sending...' : 'Send'}
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
