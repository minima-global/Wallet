import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import CreateNFTForm from './CreateNFTForm';

const CreateNFT = () => {
    return (
        <Card>
            <CardHeader
                disableTypography
                title={
                    <Typography variant="h6" color="inherit">
                        Create New Item
                    </Typography>
                }
            ></CardHeader>
            <CardContent>
                <CreateNFTForm />
            </CardContent>
        </Card>
    );
};

export default CreateNFT;
