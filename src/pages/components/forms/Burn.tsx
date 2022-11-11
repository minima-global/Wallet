/**
 *
 * Transaction Burn Manager, will manage all burn for transactions throughout the app
 * Burn prioritises transactions when they enter the mempool, putting them first-time around
 * If they make it to second round in mempool they are prioritised anyway
 *
 */

import { Modal, Box, Typography, Stack, TextField, Button, Toolbar } from '@mui/material';
import { ModalStackedCol, ModalButtonWrapper } from '../../../shared/components/modals/ModalWrappers';
import styles from '../../../theme/cssmodule/Components.module.css';

const Burn = ({ open, closeFn, formik, proceedFn }: any) => {
    return (
        <Modal
            open={open}
            onClose={closeFn}
            aria-labelledby="burn-modal-title"
            aria-describedby="burn-modal-description"
            onBackdropClick={closeFn}
            className={styles['burn-modal-wrapper']}
        >
            <Box className={styles['burn-modal']}>
                <Box component="div">
                    <Toolbar sx={{ pl: '16px!important' }} variant="dense" className={styles['burn-modal-hdr']}>
                        <Typography aria-label="modal-title" className={styles['burn-modal-title']} variant="h6">
                            Add Burn
                        </Typography>
                    </Toolbar>
                    <Stack direction="column" sx={{ padding: '8px 16px' }}>
                        <ModalStackedCol
                            children={
                                <>
                                    <Typography variant="subtitle1">Burn (optional): </Typography>
                                    <TextField
                                        id="burn"
                                        name="burn"
                                        value={formik.values.burn}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder="burn amount"
                                        error={formik.touched.burn && Boolean(formik.errors.burn)}
                                        helperText={formik.touched.burn && formik.errors.burn}
                                        FormHelperTextProps={{
                                            style: styles.helperText,
                                        }}
                                        InputProps={{
                                            style:
                                                formik.touched.burn && Boolean(formik.errors.burn)
                                                    ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
                                                    : { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
                                        }}
                                    />
                                </>
                            }
                        />

                        <ModalStackedCol
                            children={
                                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                    Prioritize your transaction by adding a burn. Burn amounts are denominated in{' '}
                                    <b>Minima</b> only.
                                </Typography>
                            }
                        />
                    </Stack>
                </Box>

                <ModalButtonWrapper
                    children={
                        <>
                            <Button
                                variant="outlined"
                                color="inherit"
                                onClick={() => {
                                    closeFn();
                                    // Only reset burn if its invalid, so it doesn't mess with UX
                                    formik.setFieldValue('burn', '');
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                disabled={!formik.isValid}
                                variant="contained"
                                disableElevation
                                color={formik.values.burn.length === 0 ? 'success' : 'info'}
                                className={styles['burn-skip-btn']}
                                onClick={() => proceedFn()}
                            >
                                {formik.values.burn === '' ? 'Skip' : 'Next'}
                            </Button>
                        </>
                    }
                />
            </Box>
        </Modal>
    );
};

export default Burn;
