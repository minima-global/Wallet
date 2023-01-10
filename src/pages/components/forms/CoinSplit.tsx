import { useFormik } from 'formik';
import Decimal from 'decimal.js';
import * as Yup from 'yup';

import { Button, Stack, TextField, Typography } from '@mui/material';
import { MinimaToken } from '../../../@types/minima2';
import { useAppSelector } from '../../../minima/redux/hooks';
import styles from '../../../theme/cssmodule/Components.module.css';
import MiSelect from '../../../shared/components/layout/MiSelect';
import { selectBalance } from '../../../minima/redux/slices/balanceSlice';
import { MINIMA__DECIMAL_PRECISION } from '../../../shared/constants';

import MiniModal from '../../../shared/components/MiniModal';
import Pending from './Pending';
import CoinSplitConfirmation from './common/CoinSplitConfirmation';

import ModalManager from '../managers/ModalManager';
import React from 'react';
import { splitCoin } from '../../../minima/utils';
import FormFieldWrapper from '../../../shared/components/FormFieldWrapper';

Decimal.set({ precision: MINIMA__DECIMAL_PRECISION });

interface ISendForm {
    token: MinimaToken;
    burn: string;
}
interface IProps {}
type IStatusModal = 'success' | 'error' | 'pending' | '';

const CoinSplit = ({}: IProps) => {
    const mySchema = useFormSchema();
    const wallet = useAppSelector(selectBalance);
    const [modalEmployee, setModalEmployee] = React.useState('');
    const [statusModal, setStatusModal] = React.useState<IStatusModal>('');

    const formik = useFormik({
        initialValues: {
            token: wallet[0],
            burn: '',
        },
        onSubmit: (formInputs: ISendForm) => {
            splitCoin(formInputs.token.tokenid, formInputs.token.sendable, formInputs.burn)
                .then((r: any) => {
                    // console.log(r);
                    handleSuccessState();
                })
                .catch((err) => {
                    if (err === 'pending') {
                        return handlePendingState();
                    }
                    console.error(err);
                    handleErrorState();
                });
        },
        validationSchema: mySchema,
    });

    const handleSuccessState = () => {
        setStatusModal('success');
        handleCloseModalManager();
        formik.resetForm();
    };
    const handleErrorState = () => {
        setStatusModal('error');
        handleCloseModalManager();
        formik.setSubmitting(false);
    };
    const handlePendingState = () => {
        setStatusModal('pending');
        handleCloseModalManager();
        formik.resetForm();
    };
    const handleCloseModalManager = () => {
        setModalEmployee('');
    };
    const handleProceedButton = () => {
        setModalEmployee('confirmation');
    };
    const handleCloseStatusModal = () => setStatusModal('');

    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                <Stack spacing={2}>
                    {/* Select a token */}
                    <MiSelect
                        value={formik.values.token}
                        tokens={wallet}
                        error={Boolean(formik.errors.token) ? formik.errors.token : undefined}
                        setFieldValue={formik.setFieldValue}
                        resetForm={formik.resetForm}
                        coinSplitMode={true}
                    />
                    {/* Choose a burn amount */}
                    <FormFieldWrapper
                        help="Prioritize your transaction by adding a burn. Burn amounts are denominated in Minima only."
                        children={
                            <TextField
                                disabled={formik.isSubmitting}
                                fullWidth
                                id="burn"
                                name="burn"
                                placeholder="burn fee"
                                value={formik.values.burn}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.burn && Boolean(formik.errors.burn)}
                                helperText={formik.touched.burn && formik.errors.burn}
                                FormHelperTextProps={{
                                    className: styles['form-helper-text'],
                                }}
                                InputProps={{
                                    style:
                                        formik.touched.burn && Boolean(formik.errors.burn)
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
                        }
                    />
                    <Button
                        onClick={handleProceedButton}
                        color="primary"
                        variant="contained"
                        fullWidth
                        disableElevation
                        disabled={formik.isSubmitting || !formik.isValid}
                    >
                        {formik.isSubmitting ? 'Please wait...' : 'Split Coin'}
                    </Button>
                    <Typography variant="caption">
                        Split your coins by two so you have more available UTXO to transact with
                    </Typography>
                </Stack>
            </form>
            <ModalManager
                formik={formik}
                modal={modalEmployee}
                closeFn={handleCloseModalManager}
                children={<CoinSplitConfirmation formik={formik} />}
            />
            <MiniModal
                open={statusModal.length > 0 ? true : false}
                handleClose={handleCloseStatusModal}
                header={statusModal === 'success' ? 'Success!' : statusModal === 'pending' ? 'Pending' : 'Failed!'}
                status="Transaction Status"
                subtitle={
                    statusModal === 'success' ? (
                        'Your transaction will be received shortly'
                    ) : statusModal === 'pending' ? (
                        <Pending />
                    ) : (
                        'Please try again later.'
                    )
                }
            />
        </>
    );
};

export default CoinSplit;

const useFormSchema = () => {
    const wallet = useAppSelector(selectBalance);
    return Yup.object().shape({
        token: Yup.object()
            .required('Field Required')
            .test('check-my-tokensendable', 'Invalid token sendable', function (val: any) {
                const { path, parent, createError } = this;
                // console.log(val);
                if (val === undefined) {
                    return false;
                }

                if (new Decimal(val.sendable).lessThanOrEqualTo(new Decimal(0))) {
                    return createError({
                        path,
                        message: `Oops, not enough funds available to perform a split`,
                    });
                }
                // if (val.token.type && val.token.type === 'NFT') {
                //     return createError({
                //         path,
                //         message: `You cannot split a non-fungible token`,
                //     });
                // }

                return true;
            }),
        burn: Yup.string()
            // .matches(/^[^a-zA-Z\\;'"]+$/, 'Invalid characters')
            .test('check-my-burnamount', 'Invalid burn amount', function (val) {
                const { path, createError } = this;
                if (val === undefined) {
                    return true;
                }
                try {
                    const burn = new Decimal(val);

                    if (burn.greaterThan(wallet[0].sendable)) {
                        return createError({
                            path,
                            message: `Oops, not enough funds available to burn.  You require another ${burn
                                .minus(wallet[0].sendable)
                                .toNumber()} Minima`,
                        });
                    }
                } catch (err) {
                    console.error(err);

                    return createError({
                        path,
                        message: `Invalid characters`,
                    });
                }

                return true;
            }),
    });
};
