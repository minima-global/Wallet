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

import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

import { ModalStackedCol, ModalButtonWrapper, ModalStackedRow } from '../../../shared/components/modals/ModalWrappers';

const TokenConfirmationModal = ({ open, handleClose, handleSubmit, formik }: any) => {
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
                            Add Burn
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
                                    disabled={!(formik.isValid && formik.dirty)}
                                    color="primary"
                                    label={formik.values.burn === '' ? 'Skip' : 'Next'}
                                    onClick={() => setOpenFinal(true)}
                                />
                            </>
                        }
                    />
                </Box>
            </Modal>

            <TokenFinalConfirmationModal
                formik={formik}
                open={openFinal}
                handleCloseBurn={handleClose}
                handleClose={handleCloseFinalModal}
            />
        </>
    );
};

const TokenFinalConfirmationModal = ({ open, handleClose, handleCloseBurn, formik }: any) => {
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

                    <ListItemButton sx={{ mt: 2 }}>
                        <ListItemIcon sx={{ minWidth: '20px', mr: 2 }}>
                            <Avatar sx={{ width: '48px', height: '48px', background: '#EDEDED' }} variant="rounded">
                                {formik.values.url && formik.values.url.length ? (
                                    <img className="MiniTokenConfirmationModal-img" src={formik.values.url} />
                                ) : (
                                    <QuestionMarkIcon color="primary" />
                                )}
                            </Avatar>
                        </ListItemIcon>
                        <ListItemText
                            sx={{
                                whiteSpace: 'normal',
                                wordBreak: 'break-all',
                                ' .MuiListItemText-primary': { fontFamily: 'Manrope-light', color: '#317Aff' },
                            }}
                            primary={formik.values.name}
                            secondary={formik.values.amount}
                        ></ListItemText>
                    </ListItemButton>

                    <ModalStackedRow
                        children={
                            <>
                                <Typography variant="subtitle1">Description:</Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        whiteSpace: 'prewrap',
                                        overflowY: 'scroll',
                                        maxHeight: '10vh',
                                        textOverflow: 'ellipsis',
                                        opacity: 0.9,
                                    }}
                                >
                                    {formik.values.description && formik.values.description.length ? (
                                        formik.values.description
                                    ) : (
                                        <i>Not set</i>
                                    )}
                                </Typography>
                            </>
                        }
                    />

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

                                        handleCloseBurn();
                                        handleClose();
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

export default TokenConfirmationModal;

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

const styles = {
    helperText: {
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 8,
        color: '#D63110',
        fontWeight: '700',
        paddingLeft: 8,
    },
};
