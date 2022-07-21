import { Typography } from '@mui/material';
import CustomListItem from '../../../../shared/components/CustomListItem';
import { ModalStackedCol } from '../../../../shared/components/modals/ModalWrappers';

const CoinSplitConfirmation = ({ formik }: any) => {
    return (
        <>
            <Typography sx={{ mt: 2 }} variant="body2">
                You are about to split your coins, are you sure?
            </Typography>
            {formik.values.burn && formik.values.burn.length ? (
                <ModalStackedCol
                    children={
                        <>
                            <Typography variant="subtitle1">Burn:</Typography>
                            <Typography variant="body2">
                                {formik.values.burn && formik.values.burn.length ? formik.values.burn : 0}
                            </Typography>
                        </>
                    }
                />
            ) : null}
        </>
    );
};

export default CoinSplitConfirmation;
