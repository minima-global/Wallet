import { Box, ListItem, Stack, Typography, ListItemText } from '@mui/material';

import styles from '../../theme/cssmodule/Components.module.css';

const dataTestIds = {
    node: 'CustomListItem__node',
    value: 'CustomListItem__value',
};

const CustomListItem = ({ title, value }: any) => {
    return (
        <Stack className={styles['custom-list-item']} data-testid={`${dataTestIds.node}__${title}`}>
            <Typography variant="body1" className={styles['custom-list-item-title']}>
                {title}
            </Typography>
            <Box className={styles['custom-list-item-value-wrapper']}>
                <Typography variant="subtitle1" className={styles['custom-list-item-value']} data-testid={`${dataTestIds.value}__${title}`}>
                    {value}
                </Typography>
            </Box>
        </Stack>
    );
};

export default CustomListItem;
