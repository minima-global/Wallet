import MinimaIcon from '../../../assets/images/minimaLogoSquare.png';

import styled from '@emotion/styled';
import { MinimaToken } from '../../../minima/types/minima2';
import { Avatar, Stack } from '@mui/material';

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

interface IProps {
    funds: MinimaToken;
    formik: any;
}
const MiFunds = ({ funds, formik }: IProps) => {
    return (
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
                {formik.errors.funds && <div>{formik.errors.funds}</div>}
            </MiFundsWrapper>
        </Stack>
    );
};

export default MiFunds;
