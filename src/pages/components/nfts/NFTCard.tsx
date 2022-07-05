import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import { ModalStackedCol, ModalStackedRow } from '../../../shared/components/modals/ModalWrappers';
import { hexToString } from '../../../shared/functions';
const NFTCard = ({ NFT }: any) => {
    console.log('NFT', NFT);
    return (
        <Card variant="outlined">
            <CardMedia src={hexToString(NFT.token.url)} component="img" />
            <CardContent>
                <ModalStackedRow
                    children={
                        <>
                            <Typography variant="body1">{NFT.token.name}</Typography>
                            <Typography variant="subtitle1">{NFT.total}</Typography>
                        </>
                    }
                />
            </CardContent>
        </Card>
    );
};

export default NFTCard;
