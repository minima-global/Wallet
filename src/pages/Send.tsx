import {
    Button,
    TextField,
    Card,
    CardContent,
    Select,
    Typography,
    Portal,
    Snackbar,
    Alert,
    ListSubheader,
    MenuItem,
    Skeleton,
    Stack,
} from '@mui/material';
import { FC, useContext, useState, useMemo } from 'react';
import { callSend } from '../minima/rpc-commands';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { MinimaToken } from '../types/minima';
import MiniModal from '../shared/components/MiniModal';

// import { BalanceUpdates } from '../App';
import GridLayout from './components/GridLayout';

import { containsText, insufficientFundsError, isPropertyString } from '../shared/functions';

import TokenListItem from './components/tokens/TokenListItem';
import { splitCoin } from '../minima/utils';
import { useAppDispatch, useAppSelector } from '../minima/redux/hooks';
import { selectBalance, selectBalanceFilter } from '../minima/redux/slices/balanceSlice';
import { toggleNotification } from '../minima/redux/slices/notificationSlice';
import { useParams } from 'react-router-dom';
import ModalManager from './components/managers/ModalManager';

import ValueTransferConfirmation from './components/forms/common/ValueTransferConfirmation';
import CoinSplitConfirmation from './components/forms/common/CoinSplitConfirmation';

import styles from '../theme/cssmodule/Components.module.css';

const TransferTokenSchema = Yup.object().shape({
    tokenid: Yup.string().required('Field Required'),
    address: Yup.string()
        .matches(/0|M[xX][0-9a-zA-Z]+/, 'Invalid Address.')
        .min(59, 'Invalid Address, too short.')
        .max(66, 'Invalid Address, too long.')
        .required('Field Required'),
    amount: Yup.string()
        .required('Field Required')
        .matches(/^[^a-zA-Z\\;'"]+$/, 'Invalid characters.'),
    burn: Yup.string().matches(/^[^a-zA-Z\\;'"]+$/, 'Invalid characters.'),
});

const CoinSplitterSchema = Yup.object().shape({
    tokenid: Yup.string().required('Field Required'),
    burn: Yup.string().matches(/^[^a-zA-Z\\;'"]+$/, 'Invalid characters.'),
});

const validationSchema = [null, TransferTokenSchema, CoinSplitterSchema];

// const styles = {
//     helperText: {
//         borderBottomRightRadius: 8,
//         borderBottomLeftRadius: 8,
//         color: '#D63110',
//         fontWeight: '700',
//         paddingLeft: 8,
//     },
// };

const Send: FC = () => {
    const dispatch = useAppDispatch();
    const { tokenid } = useParams();

    const [mode, setMode] = useState(1);

    const [modalEmployee, setModalEmployee] = useState('');
    const handleCloseModalManager = () => {
        setModalEmployee('');
    };
    const handleProceed = () => {
        setModalEmployee('confirmation');
    };

    // Handle Modal
    const [open, setOpen] = useState(false);
    const [modalStatus, setModalStatus] = useState('Failed');
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setModalStatus('Failed');
    };

    function handleInputChange(event: any) {
        const value = event.target.value;
        setFilterText(value);
        // when the component re-renders the updated filter text will create a new filteredBalance variable
    }

    const [filterText, setFilterText] = useState('');
    const getFilteredBalanceList = useAppSelector(selectBalanceFilter(filterText));

    // const balances = useContext(BalanceUpdates);
    const balances = useAppSelector(selectBalance);

    // const displayedOptions = useMemo(() => getFilteredBalanceList(balances, filterText), [balances, filterText]);

    // change validation according to mode set
    const dynamicValidation = useMemo(() => {
        return validationSchema[mode];
    }, [mode]);

    // console.log('Dynamic Validation', dynamicValidation);

    const formik = useFormik({
        initialValues: {
            mode: 1,
            tokenid: tokenid && tokenid.length ? tokenid : '0x00',
            amount: '',
            address: '',
            burn: '',
        },
        validationSchema: dynamicValidation,
        onSubmit: (data) => {
            setModalEmployee(''); // close modals
            const modifyData = {
                ...data,
                burn: data.burn && data.burn.length ? data.burn : 0,
                amount: data.amount && data.amount.length ? data.amount : 0,
            };

            if (mode === 1) {
                // do normal value transfer
                callSend(modifyData)
                    .then((res: any) => {
                        // console.log(res);
                        if (!res.status) {
                            throw new Error(res.error ? res.error : res.message); // TODO.. consistent key value
                        }
                        // SENT
                        formik.resetForm();
                        // Close Modals
                        // setOpenConfirmationModal(false);

                        // Set Modal
                        setModalStatus('Success');
                        // Open Modal
                        setOpen(true);
                    })
                    .catch((err) => {
                        if (err === undefined || err.message === undefined) {
                            dispatch(
                                toggleNotification(
                                    'Something went wrong!  Open a Discord Support ticket for assistance.',
                                    'error',
                                    'error'
                                )
                            );
                        }

                        if (insufficientFundsError(err.message)) {
                            formik.setFieldError('amount', err.message);
                            console.error(err.message);
                            dispatch(toggleNotification(err.message, 'error', 'error'));
                        }

                        if (err.message !== undefined) {
                            console.error(err.message);
                            dispatch(toggleNotification(err.message, 'error', 'error'));
                        }

                        // setOpenConfirmationModal(false);
                    })
                    .finally(() => {
                        // handleCloseConfirmationModal();
                        // NO MATTER WHAT
                        formik.setSubmitting(false);
                    });
            } else if (mode === 2) {
                // console.log(`COINSPLIT`);
                // get token to split
                const tkn = balances.find((v) => v.tokenid === data.tokenid);

                if (tkn) {
                    // do coin split
                    splitCoin(tkn.tokenid, tkn.sendable, tkn.coins, modifyData.burn)
                        .then((res: any) => {
                            // console.log(res);
                            if (!res.status) {
                                throw new Error(res.error ? res.error : res.message); // TODO.. consistent key value
                            }
                            // SENT
                            formik.resetForm();
                            // Close Modals
                            // setOpenConfirmationModal(false);

                            // Set Modal
                            setModalStatus('Success');
                            // Open Modal
                            setOpen(true);
                        })
                        .catch((err) => {
                            if (err === undefined || err.message === undefined) {
                                const balanceNotification = {
                                    message: 'New balance update',
                                    severity: 'info',
                                    type: 'info',
                                };
                                dispatch(
                                    toggleNotification(
                                        balanceNotification.message,
                                        balanceNotification.severity,
                                        balanceNotification.type
                                    )
                                );
                            }

                            if (insufficientFundsError(err.message)) {
                                formik.setFieldError('amount', err.message);
                                console.error(err.message);
                                dispatch(toggleNotification(`${err.message}`, 'error', 'error'));
                            }

                            if (err.message !== undefined) {
                                console.error(err.message);
                                dispatch(toggleNotification(`${err.message}`, 'error', 'error'));
                            }
                            // setOpenConfirmationModal(false);
                        });
                } else {
                    dispatch(
                        toggleNotification('Token not found!  Please open a Discord support ticket', 'error', 'error')
                    );
                }
            }
        },
        validateOnChange: true,
    });

    // change mode
    useMemo(() => {
        // console.log(`CHANGEMODE`, formik.values.mode);
        // console.log(`LASTMODE`, mode);

        return setMode(formik.values.mode);
    }, [formik.values.mode]);

    return (
        <>
            <GridLayout
                // loading={loading}
                children={
                    <>
                        {/* TODO - FIX SEND WHEN NO TOKEN SELECTION WITH SEARCH */}
                        <Card variant="outlined">
                            <CardContent>
                                <form onSubmit={formik.handleSubmit}>
                                    {balances && balances.length > 0 ? (
                                        <Stack spacing={2}>
                                            <Select
                                                fullWidth
                                                disabled={formik.isSubmitting}
                                                id="send-select-mode"
                                                name="mode"
                                                value={formik.values.mode}
                                                onChange={formik.handleChange}
                                            >
                                                <MenuItem value={1}>Value Transfer</MenuItem>
                                                <MenuItem value={2}>Coin Split</MenuItem>
                                            </Select>
                                            <Select
                                                disabled={formik.isSubmitting}
                                                MenuProps={{
                                                    autoFocus: false,
                                                    sx: { maxWidth: '200px' },
                                                }}
                                                id="tokenid"
                                                name="tokenid"
                                                value={formik.values.tokenid ? formik.values.tokenid : ''}
                                                onChange={formik.handleChange}
                                                error={formik.touched.tokenid && Boolean(formik.errors.tokenid)}
                                                onClose={() => setFilterText('')}
                                                fullWidth
                                            >
                                                <ListSubheader>
                                                    <TextField
                                                        autoFocus
                                                        fullWidth
                                                        placeholder="Search by name or tokenid"
                                                        id="token-search"
                                                        sx={{
                                                            position: 'relative',
                                                            zIndex: 2,
                                                            padding: '0px 8px',
                                                            margin: '8px 0px',
                                                        }}
                                                        value={filterText}
                                                        onChange={handleInputChange}
                                                        onKeyDown={(e) => {
                                                            if (e.key !== 'Escape') {
                                                                // Prevents autoselecting item while typing (default Select behaviour)
                                                                e.stopPropagation();
                                                            }
                                                        }}
                                                    />
                                                </ListSubheader>
                                                {getFilteredBalanceList.length ? (
                                                    getFilteredBalanceList.map((token: MinimaToken) => (
                                                        <MenuItem
                                                            sx={{
                                                                '&:hover': {
                                                                    background: 'transparent',
                                                                },
                                                            }}
                                                            value={token.tokenid}
                                                            key={token.tokenid}
                                                            disabled={token.sendable === '0'}
                                                        >
                                                            <TokenListItem
                                                                value={token.tokenid}
                                                                key={token.tokenid}
                                                                item={token}
                                                                nav={false}
                                                                mode={formik.values.mode}
                                                            />
                                                        </MenuItem>
                                                    ))
                                                ) : (
                                                    <Typography p={3} variant="caption">
                                                        Token not found
                                                    </Typography>
                                                )}
                                            </Select>

                                            {formik.values.mode === 1 ? (
                                                <Stack spacing={2}>
                                                    <TextField
                                                        disabled={formik.isSubmitting}
                                                        fullWidth
                                                        id="address"
                                                        name="address"
                                                        placeholder="Address"
                                                        value={formik.values.address}
                                                        onChange={formik.handleChange}
                                                        error={formik.touched.address && Boolean(formik.errors.address)}
                                                        helperText={formik.touched.address && formik.errors.address}
                                                        FormHelperTextProps={{ className: styles['form-helper-text'] }}
                                                        InputProps={{
                                                            style:
                                                                formik.touched.address && Boolean(formik.errors.address)
                                                                    ? {
                                                                          borderBottomLeftRadius: 0,
                                                                          borderBottomRightRadius: 0,
                                                                      }
                                                                    : {
                                                                          borderBottomLeftRadius: 8,
                                                                          borderBottomRightRadius: 8,
                                                                      },
                                                        }}
                                                    />
                                                    <TextField
                                                        disabled={formik.isSubmitting}
                                                        fullWidth
                                                        id="amount"
                                                        name="amount"
                                                        placeholder="0.0"
                                                        value={formik.values.amount}
                                                        onChange={formik.handleChange}
                                                        error={formik.touched.amount && Boolean(formik.errors.amount)}
                                                        helperText={formik.touched.amount && formik.errors.amount}
                                                        FormHelperTextProps={{
                                                            className: styles['form-helper-text'],
                                                        }}
                                                        InputProps={{
                                                            style:
                                                                formik.touched.amount && Boolean(formik.errors.amount)
                                                                    ? {
                                                                          borderBottomLeftRadius: 0,
                                                                          borderBottomRightRadius: 0,
                                                                      }
                                                                    : {
                                                                          borderBottomLeftRadius: 8,
                                                                          borderBottomRightRadius: 8,
                                                                      },
                                                        }}
                                                    />
                                                </Stack>
                                            ) : null}
                                            <Button
                                                disabled={
                                                    formik.values.mode === 1
                                                        ? !(formik.isValid && formik.dirty && !formik.isSubmitting)
                                                        : formik.isSubmitting
                                                }
                                                disableElevation
                                                color="primary"
                                                variant="contained"
                                                fullWidth
                                                onClick={() => {
                                                    //console.log('next');
                                                    setModalEmployee('burn');
                                                }}
                                            >
                                                {formik.isSubmitting ? 'Please wait...' : 'Next'}
                                            </Button>
                                            {mode === 2 ? (
                                                <>
                                                    <Typography variant="caption">
                                                        Coin split will divide an unspent coin into two, providing you
                                                        with additional coins to use as inputs to new transactions
                                                    </Typography>
                                                </>
                                            ) : null}
                                        </Stack>
                                    ) : (
                                        <Stack spacing={2}>
                                            <Skeleton
                                                sx={{ borderRadius: '8px', mb: 2 }}
                                                variant="rectangular"
                                                width="100%"
                                                height={80}
                                            />
                                            <Skeleton
                                                sx={{ borderRadius: '8px', mb: 2 }}
                                                variant="rectangular"
                                                width="100%"
                                                height={60}
                                            />
                                            <Skeleton
                                                sx={{ borderRadius: '8px', mb: 2 }}
                                                variant="rectangular"
                                                width="100%"
                                                height={60}
                                            />
                                        </Stack>
                                    )}
                                </form>
                            </CardContent>
                        </Card>

                        <ModalManager
                            formik={formik}
                            modal={modalEmployee}
                            closeFn={handleCloseModalManager}
                            proceedFn={handleProceed}
                            children={
                                mode === 1 ? (
                                    <ValueTransferConfirmation formik={formik} />
                                ) : (
                                    <CoinSplitConfirmation formik={formik} />
                                )
                            }
                        />

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
                    </>
                }
            />
        </>
    );
};

export default Send;
