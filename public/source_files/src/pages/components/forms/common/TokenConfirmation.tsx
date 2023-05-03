import { ListItemButton, ListItemIcon, Avatar, ListItemText, Typography, Stack } from '@mui/material';
import { ModalStackedCol, ModalStackedRow } from '../../../../shared/components/modals/ModalWrappers';
import { QuestionMarkOutlined } from '@mui/icons-material';

const TokenConfirmation = ({ formik }: any) => {
    return (
        <Stack spacing={2}>
            <ListItemButton sx={{ mt: 2 }}>
                <ListItemIcon sx={{ minWidth: '20px', mr: 2 }}>
                    <Avatar sx={{ width: '48px', height: '48px', background: '#EDEDED' }} variant="rounded">
                        {formik.values.url && formik.values.url.length ? (
                            <img
                                alt="token-confirmation-modal-image"
                                className="MiniTokenConfirmationModal-img"
                                src={formik.values.url}
                            />
                        ) : (
                            <QuestionMarkOutlined color="primary" />
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
        </Stack>
    );
};

export default TokenConfirmation;
