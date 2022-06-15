import { FC, useState } from 'react';
import Modal from '@mui/material/Modal';
import { Box, Typography, Button } from '@mui/material';
import { MiniModalProp } from '../../types/minima';

const MiniModal: FC<MiniModalProp> = (props) => {
    return (
        <Modal
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className="MiniModal" sx={[style, { width: { xs: '90vw', sm: 400 }, minWidth: { xs: 270, sm: 370 } }]}>
                <Box>
                    <Typography sx={status} id="modal-modal-title" variant="h6" component="h2">
                        {props.status}
                    </Typography>
                    <Typography sx={heading} id="modal-modal-heading" variant="h6" component="h3">
                        {props.header}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {props.subtitle}
                    </Typography>
                </Box>
                <Box sx={buttonWrap}>
                    <Button sx={[button, buttonCancel]} variant="text" onClick={props.handleClose}>
                        Cancel
                    </Button>
                    <Button sx={button} variant="text" onClick={props.customFnc ? props.customFnc : props.handleClose}>
                        {props.executeName ? props.executeName : 'Ok'}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default MiniModal;

const button = {
    '&:hover': {
        backgroundColor: 'transparent',
        opacity: 0.8,
    },
    letterSpacing: 3,
    paddingRight: 0,
};
const buttonCancel = {
    color: '#363A3F',
};

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
const buttonWrap = {
    display: 'flex',
    justifyContent: 'flex-end',
};
const status = {
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
    marginTop: '24px',
};
