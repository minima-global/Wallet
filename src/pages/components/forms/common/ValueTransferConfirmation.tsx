import { Stack, ListItemButton, ListItemIcon, Avatar, ListItemText, Typography } from '@mui/material';

import { AlternateEmailOutlined } from '@mui/icons-material';
import CustomListItem from '../../../../shared/components/CustomListItem';

import styles from '../../../../theme/cssmodule/Components.module.css';
import { copy } from '../../../../shared/functions';
import { useAppDispatch } from '../../../../minima/redux/hooks';
import { toggleNotification } from '../../../../minima/redux/slices/notificationSlice';

const ValueTransferConfirmation = ({ formik }: any) => {
    const dispatch = useAppDispatch();
    console.log(formik.values);
    return (
        <>
            <Stack direction="column" mt={2} spacing={2}>
                <ListItemButton className={styles['value-transfer-address-wrapper']}>
                    <ListItemIcon sx={{ minWidth: '20px', mr: 2 }}>
                        <Avatar className={styles['value-transfer-icon']} variant="rounded">
                            <AlternateEmailOutlined color="primary" />
                        </Avatar>
                    </ListItemIcon>
                    <Typography className={styles['value-transfer-address']} variant="body2">
                        {formik.values.address}
                    </Typography>
                </ListItemButton>
                <CustomListItem title="Amount" value={formik.values.amount} />
                {formik.values.burn && formik.values.burn.length ? (
                    <CustomListItem title="Burn" value={formik.values.burn} />
                ) : null}
            </Stack>
        </>
    );
};

export default ValueTransferConfirmation;
