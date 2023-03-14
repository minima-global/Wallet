import { Box, Modal, Stack } from '@mui/material';
import { NoResults } from '../../../shared/components/layout/MiToken';

import styles from './FeatureUnavailable.module.css';

interface IProps {
    children?: any;
    open: boolean;
    closeModal: () => void;
}
const FeatureUnavailable = ({ children, open, closeModal }: IProps) => {
    return (
        <Modal open={open} onClose={closeModal} className={styles['modal']}>
            <Box className={styles['modal-wrapper']}>
                <NoResults>
                    <h6>This feature is unavailable on the internal browser.</h6>
                    <p>You can access this feature by running Wallet with the external browser.</p>
                </NoResults>

                {children && children}
            </Box>
        </Modal>
    );
};

export default FeatureUnavailable;
