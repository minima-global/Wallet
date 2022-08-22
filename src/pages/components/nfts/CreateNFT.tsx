import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import GridLayout from '../../../layout/GridLayout';
import CreateNFTForm from './CreateNFTForm';

const CreateNFT = () => {
    return (
        <GridLayout
            children={
                <>
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
                </>
            }
        ></GridLayout>
    );
};

export default CreateNFT;
