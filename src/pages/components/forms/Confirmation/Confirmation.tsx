/**
 *
 * Confirmation screen for all transaction forms
 *
 */
import { Modal, Box, Typography, Stack, Button, Toolbar } from '@mui/material';
import { ModalButtonWrapper } from '../../../../shared/components/modals/ModalWrappers';
import styles from './Confirmation.module.css';

const Confirmation = ({ title, children, closeFn, open, formik, modalTitle }: any) => {
    return (
        <Modal open={open} onClose={closeFn} onBackdropClick={closeFn} className={styles['burn-modal-wrapper']}>
            <Box className={styles['burn-modal']}>
                <Toolbar variant="dense" className={styles['burn-modal-hdr']}>
                    <Typography aria-label="modal-title" className={styles['burn-modal-title']} variant="h6">
                        {modalTitle && modalTitle.length ? modalTitle : 'Confirmation'}
                    </Typography>
                </Toolbar>
                <Box component="div" sx={{ overflow: 'auto' }}>
                    <Stack direction="column" sx={{ padding: '8px 16px', overflow: 'auto', height: '100%' }}>
                        {children}
                        <ModalButtonWrapper
                            children={
                                <>
                                    <Button
                                        disabled={formik.isSubmitting}
                                        variant="outlined"
                                        color="inherit"
                                        onClick={closeFn}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        disabled={formik.isSubmitting}
                                        variant="contained"
                                        disableElevation
                                        color="primary"
                                        className={styles['burn-skip-btn']}
                                        onClick={() => formik.handleSubmit()}
                                    >
                                        {formik.isSubmitting ? 'Please wait...' : 'Accept'}
                                    </Button>
                                </>
                            }
                        />
                    </Stack>
                </Box>
            </Box>
        </Modal>
    );
};

export default Confirmation;
