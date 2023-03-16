import { Button, Modal, Stack } from '@mui/material';
import styles from './DisplayFullJson.module.css';

interface IProps {
    json: any;
    open: boolean;
    closeModal: () => void;
}
const DisplayFullJson = ({ json, open, closeModal }: IProps) => {
    return (
        <Modal open={open} className={styles['modal']}>
            <Stack className={styles['modal-wrapper']}>
                <h6>Advanced Transaction View</h6>
                <pre>
                    <code>{JSON.stringify(json, null, 3)}</code>
                </pre>
                <Button color="inherit" fullWidth disableElevation onClick={closeModal} variant="outlined">
                    Cancel
                </Button>
            </Stack>
        </Modal>
    );
};

export default DisplayFullJson;
