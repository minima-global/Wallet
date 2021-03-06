import { useState } from 'react';
import {
    Avatar,
    Box,
    Button,
    Chip,
    Modal,
    Typography,
    Stack,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    TextField,
} from '@mui/material';

import { ModalButtonWrapper, ModalStackedCol, ModalStackedRow } from '../../../shared/components/modals/ModalWrappers';

import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';

const styles = {
    helperText: {
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 8,
        color: '#D63110',
        fontWeight: '700',
        paddingLeft: 8,
    },
};

const ConfirmationModal = ({ open, mode, handleClose, handleSubmit, formik }: any) => {
    const [openFinal, setOpenFinal] = useState(false);

    const handleCloseFinalModal = () => setOpenFinal(false);

    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="confirmation-modal-title"
                aria-describedby="confirmation-modal-description"
                onBackdropClick={handleClose}
            >
                <Box
                    className="MiniModal"
                    sx={[style, { width: { xs: '90vw', sm: 400 }, minWidth: { xs: 270, sm: 370 } }]}
                >
                    <Box>
                        <Typography sx={status} id="modal-modal-title" variant="h6" component="h2">
                            Send
                        </Typography>
                    </Box>

                    <Stack direction="column" sx={{ maxWidth: 'inherit', mt: 2, mb: 2 }}>
                        <ModalStackedCol
                            children={
                                <>
                                    <Typography variant="subtitle1">Burn (optional): </Typography>
                                    <TextField
                                        id="burn"
                                        name="burn"
                                        value={formik.values.burn}
                                        onChange={formik.handleChange}
                                        placeholder="0.0"
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
                                    Prioritize your transaction by adding a burn.
                                </Typography>
                            }
                        />
                    </Stack>

                    <ModalButtonWrapper
                        children={
                            <>
                                <Chip
                                    sx={{ marginRight: 2 }}
                                    variant="outlined"
                                    label="Cancel"
                                    onClick={() => {
                                        handleClose();
                                        // Only reset burn if its invalid, so it doesn't mess with UX
                                        if (!formik.isValid) {
                                            formik.setValues({ ...formik.values, burn: 0 });
                                        }
                                    }}
                                />
                                <Chip
                                    color="primary"
                                    label={formik.values.burn === '' ? 'Skip' : 'Next'}
                                    onClick={() => setOpenFinal(true)}
                                />
                            </>
                        }
                    />
                </Box>
            </Modal>

            <FinalConfirmation
                mode={mode}
                formik={formik}
                open={openFinal}
                handleClose={handleCloseFinalModal}
                handleCloseBurn={handleClose}
            />
        </>
    );
};

export default ConfirmationModal;

const FinalConfirmation = ({ open, mode, handleClose, formik, handleCloseBurn }: any) => {
    // console.log('MODE', mode);
    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="final-modal-title"
                aria-describedby="final-modal-description"
                onBackdropClick={handleClose}
            >
                <Box
                    className="MiniModal"
                    sx={[style, { width: { xs: '70vw', sm: 370 }, minWidth: { xs: 270, sm: 370 } }]}
                >
                    <Box>
                        <Typography sx={status} id="modal-modal-title" variant="h6" component="h2">
                            Confirmation
                        </Typography>
                    </Box>

                    {mode === 1 ? (
                        <>
                            <Stack direction="column" mt={2}>
                                <ListItemButton>
                                    <ListItemIcon sx={{ minWidth: '20px', mr: 2 }}>
                                        <Avatar
                                            sx={{ width: '32px', height: '32px', background: '#EDEDED' }}
                                            variant="rounded"
                                        >
                                            <AlternateEmailIcon color="primary" />
                                        </Avatar>
                                    </ListItemIcon>
                                    <ListItemText
                                        sx={{
                                            whiteSpace: 'normal',
                                            wordBreak: 'break-all',
                                            ' .MuiListItemText-primary': {
                                                fontFamily: 'Manrope-light',
                                                color: '#317Aff',
                                            },
                                        }}
                                        primary={formik.values.address}
                                    ></ListItemText>
                                </ListItemButton>
                            </Stack>

                            <ModalStackedCol
                                children={
                                    <>
                                        <Typography variant="subtitle1">Amount:</Typography>
                                        <Typography variant="body2">{formik.values.amount}</Typography>
                                    </>
                                }
                            />
                        </>
                    ) : mode === 2 ? (
                        <ModalStackedRow
                            children={
                                <>
                                    <Typography variant="subtitle1">
                                        You are about to split a coin/UTXO in half.
                                    </Typography>
                                </>
                            }
                        />
                    ) : null}

                    <ModalStackedCol
                        children={
                            <>
                                <Typography variant="subtitle1">Burn:</Typography>
                                <Typography variant="body2">
                                    {formik.values.burn && formik.values.burn.length ? formik.values.burn : 0}
                                </Typography>
                            </>
                        }
                    />

                    <ModalButtonWrapper
                        children={
                            <>
                                <Chip
                                    disabled={formik.isSubmitting}
                                    sx={{ marginRight: 2 }}
                                    variant="outlined"
                                    label="Reject"
                                    onClick={handleClose}
                                />
                                <Chip
                                    disabled={formik.isSubmitting}
                                    color="primary"
                                    label="Accept"
                                    onClick={() => {
                                        formik.handleSubmit();

                                        handleClose();
                                        handleCloseBurn();
                                    }}
                                />
                            </>
                        }
                    />
                </Box>
            </Modal>
        </>
    );
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
const status = {
    borderBottom: 0.5,
    borderColor: '#D3D3D8',
    lineHeight: '40px',
    fontWeight: '400',
    fontSize: 14,
    letterSpacing: 1,
};
