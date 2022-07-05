import { FC } from 'react';
import Modal from '@mui/material/Modal';
import { Box, Typography, Chip } from '@mui/material';
import { MiniModalProp } from '../../types/minima';

import { ModalButtonWrapper } from './modals/ModalWrappers';

const MiniModal: FC<MiniModalProp> = ({ open, handleClose, executeName, customFnc, status, header, subtitle }: any) => {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className="MiniModal" sx={[style, { width: { xs: '90vw', sm: 400 }, minWidth: { xs: 270, sm: 370 } }]}>
                <Box>
                    <Typography sx={statusCss} id="modal-modal-title" variant="h6" component="h2">
                        {status}
                    </Typography>
                    <Typography sx={heading} id="modal-modal-heading" variant="h6" component="h3">
                        {header}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 1 }}>
                        {subtitle}
                    </Typography>
                </Box>
                <ModalButtonWrapper
                    children={
                        <>
                            <Chip sx={{ marginRight: 2 }} variant="outlined" label="Cancel" onClick={handleClose} />
                            <Chip
                                color="primary"
                                label={executeName ? executeName : 'Ok'}
                                onClick={customFnc ? customFnc : handleClose}
                            />
                        </>
                    }
                />
            </Box>
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
