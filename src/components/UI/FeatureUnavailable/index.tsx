import { Box, Modal } from '@mui/material';

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
                <div className="text-center">
                    <h6>This feature is unavailable on the internal browser.</h6>
                    <p>You can access this feature by choosing "Open in Browser" from the menu in the top right.</p>
                </div>

                {children && children}
            </Box>
        </Modal>
    );
};

export default FeatureUnavailable;
