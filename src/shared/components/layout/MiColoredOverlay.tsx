import { Stack } from '@mui/material';
import styles from './styling/ColoredOverlay.module.css';

const MiColoredOverlay = ({ children, center, color }: any) => {
    return (
        <div className={styles[`${color}-overlay${center ? '-center' : ''}`]}>
            <Stack className={styles['content']} alignItems="center" justifyContent="center">
                {children}
            </Stack>
        </div>
    );
};

export default MiColoredOverlay;
