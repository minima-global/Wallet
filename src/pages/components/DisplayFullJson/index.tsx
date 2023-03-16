import { CloseOutlined } from '@mui/icons-material';
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
                <Stack
                    sx={{ width: '100%' }}
                    mb={2}
                    gap={0.5}
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <h6>Advanced Transaction View</h6>
                    <CloseOutlined onClick={closeModal} />
                </Stack>

                <pre>
                    <code>{JSON.stringify(json, null, 3)}</code>
                </pre>
            </Stack>
        </Modal>
    );
};

export default DisplayFullJson;
