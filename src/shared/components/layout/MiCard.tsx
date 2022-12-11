import { Stack } from '@mui/material';
import { Box } from '@mui/system';
import styles from './styling/Card.module.css';

const MiCard = ({ children }: any) => {
    return (
        <Stack className={styles['card']}>
            <Box>{children}</Box>
        </Stack>
    );
};

export default MiCard;
