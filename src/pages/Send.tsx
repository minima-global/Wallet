import { callBalance, callSend } from '../minima/rpc-commands';
import { Button, TextField, Card, CardContent, Grid, Select, MenuItem, Chip } from '@mui/material';
import { FC, useEffect, useRef, useState } from 'react';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { INSUFFICIENT } from '../minima/constants';

import { MinimaToken } from '../types/minima';
import MiniModal from '../shared/components/MiniModal';

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
    // Tokens Data
    const [tokenSelection, setTokenSelection] = useState<MinimaToken[]>([]);
    // Handle Modal
    const [open, setOpen] = useState(false);
    const [modalStatus, setModalStatus] = useState('Failed');
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setModalStatus('Failed');
    };

    // Get initial balance
    useEffect(() => {
        callBalance().then((res: any) => {
            setTokenSelection(res.response);
        });
    }, []);

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
                    // Set Modal
                    setModalStatus('Success');
                    // Open Modal
                    setOpen(true);
                })
                .catch((err) => {
                    console.error(err.message);
                    // FAILED
                    if (err.message.substring(0, 20) === INSUFFICIENT) {
                        formik.setFieldError('amount', err.message);
                    }
                })
                .finally(() => {
                    // NO MATTER WHAT
                    formik.setSubmitting(false);
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
                                        formik.touched.address && Boolean(formik.errors.address)
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

                <MiniModal
                    open={open}
                    handleClose={handleClose}
                    handleOpen={handleOpen}
                    header={modalStatus === 'Success' ? 'Success!' : 'Failed!'}
                    status="Transaction Status"
                    subtitle={
                        modalStatus === 'Success'
                            ? 'Your transaction will be received shortly'
                            : 'Please try again later.'
                    }
                />
            </Grid>
            <Grid item xs={0} md={2}></Grid>
        </Grid>
    );
};

export default Send;

const MyCustomBadge = () => {
    return <div>My Custom Badge</div>;
};
