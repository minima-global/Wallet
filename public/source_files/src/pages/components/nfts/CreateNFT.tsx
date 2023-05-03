import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import useIsVaultLocked from '../../../hooks/useIsVaultLocked';
import GridLayout from '../../../layout/GridLayout';
import { NoResults } from '../../../shared/components/layout/MiToken';
import CreateNFTForm from './CreateNFTForm/CreateNFTForm';

const CreateNFT = () => {
    const userLockedVault = useIsVaultLocked();
    return (
        <GridLayout
            children={
                <>
                    {userLockedVault && (
                        <NoResults>
                            <h6>You have locked your vault with a password.</h6>
                            <p>Unlock it so you can access this form.</p>
                        </NoResults>
                    )}
                    {!userLockedVault && (
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
                    )}
                </>
            }
        ></GridLayout>
    );
};

export default CreateNFT;
