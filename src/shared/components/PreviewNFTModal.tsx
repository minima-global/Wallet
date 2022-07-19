import { Modal, Grid, Box, Button } from '@mui/material';
import { NFTListItem } from '../../pages/NFTs/NFTs';

interface iPreview {
    open: boolean;
    handleClose: () => void;
    name: string;
    url: string;
    description: string;
}
const PreviewNFTModal = ({ open, handleClose, name, url, description }: iPreview) => {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={[style, { width: { xs: '80vw', sm: 400 }, minWidth: { xs: 270, sm: 370 } }]}>
                <Grid container spacing={2}>
                    <NFTListItem name={name} url={url} description={description} size={12} />
                    <Grid item xs={12}>
                        <Button disableElevation color="primary" variant="outlined" fullWidth onClick={handleClose}>
                            Back
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
};

export default PreviewNFTModal;

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'rgba(255, 255, 255, 0.9)',
    boxShadow: '0px 4px 15px rgba(0,0,0,0.1)',
    p: 4,
    minWidth: 370,
    height: 'auto',
    borderRadius: 1,
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'column',
};
