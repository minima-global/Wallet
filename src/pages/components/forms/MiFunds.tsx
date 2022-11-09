import MinimaIcon from '../../../assets/images/minimaLogoSquare.png';

import styled from '@emotion/styled';
import { MinimaToken } from '../../../minima/types/minima2';
import { Avatar, CircularProgress, Stack } from '@mui/material';

const MiFundsWrapper = styled('div')`
    background: #fff;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    > :first-of-type {
        margin-right: 8px;
    }
    > div :first-of-type {
        padding: 0;
        margin: 0;
        font-size: 0.875rem;
        font-weight: 800;
    }
    > div :last-of-type {
        padding: 0;
        margin: 0;
        font-size: 0.8rem;
    }
`;

const MiInputError = styled('div')`
    padding-left: 8px;
    color: rgb(211, 47, 47);
    background-color: #fcbebd;
    font-size: 0.8rem;
    font-family: Manrope-semibold;
    margin-top: 8px;
`;

interface IProps {
    funds: MinimaToken;
    formik: any;
}
const MiFunds = ({ funds, formik }: IProps) => {
    console.log(formik.errors);
    return (
        (funds && (
            <Stack alignItems="flex-start" justifyContent="center">
                <MiFundsWrapper>
                    <Avatar variant="rounded" src={MinimaIcon} />
                    <input
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        hidden
                        id="funds"
                        name="funds"
                        value={funds.sendable}
                    />
                    <div>
                        <p>{funds.token}</p>
                        <p>{funds.sendable}</p>
                    </div>
                </MiFundsWrapper>
                {/* {formik.errors.funds && <MiInputError>{formik.errors.funds}</MiInputError>} */}
            </Stack>
        )) || <CircularProgress size={24} />
    );
};

export default MiFunds;
