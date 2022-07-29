import { FC } from 'react';
import Modal from '@mui/material/Modal';
import { Box, Typography, Chip, Button, Stack } from '@mui/material';
import { MiniModalProp } from '../../types/minima';

import { ModalButtonWrapper } from './modals/ModalWrappers';
import styles from '../../theme/cssmodule/Components.module.css';

const MiniModal: FC<MiniModalProp> = ({ open, handleClose, executeName, customFnc, status, header, subtitle }: any) => {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className={styles['success-error-modal-wrapper']}
        >
            <Stack spacing={2} className={styles['success-error-modal']} justifyContent="space-between">
                <Box component="div" className={styles['success-error-modal-hdr']}>
                    <Typography sx={statusCss} id="modal-modal-title" variant="h6" component="h2">
                        {status}
                    </Typography>
                    <Typography sx={heading} id="modal-modal-heading" variant="h6" component="h3">
                        {header}
                    </Typography>
                    <Box component="div" id="modal-modal-description" sx={{ mt: 1 }}>
                        {subtitle}
                    </Box>
                </Box>

                <ModalButtonWrapper
                    children={
                        <>
                            <Button variant="outlined" color="inherit" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                disableElevation
                                color="primary"
                                className={styles['success-error-ok-btn']}
                                onClick={customFnc ? customFnc : handleClose}
                            >
                                {executeName ? executeName : 'Ok'}
                            </Button>
                        </>
                    }
                />
            </Stack>
        </Modal>
    );
};

export default MiniModal;

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'rgba(255, 255, 255, 0.9)',
    boxShadow: '0px 4px 15px rgba(0,0,0,0.1)',
    p: 4,
    minWidth: 370,
    height: 303,
    borderRadius: 1,
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'column',
};
const statusCss = {
    borderBottom: 0.5,
    borderColor: '#D3D3D8',
    lineHeight: '40px',
    fontWeight: '400',
    fontSize: 14,
    letterSpacing: 1,
};

const heading = {
    fontWeight: '800',
    fontSize: 24,
    lineHeight: '32.78px',
    letter: 1,
    marginTop: 2,
};
