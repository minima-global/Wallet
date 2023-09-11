import styled from '@emotion/styled';
import { Stack } from '@mui/material';
import { useFormikContext } from 'formik';
import { useAppSelector } from '../../../minima/redux/hooks';
import { selectBalance } from '../../../minima/redux/slices/balanceSlice';
import { useEffect } from 'react';

const MiFundsWrapper = styled('div')`
    background: #fff;
    border-radius: 12px;
    padding: 16px;
    padding-left: 0;
    padding-top: 0;
    padding-bottom: 0;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;

    > :first-of-type {
        margin-right: 8px;
    }
`;

const MiFunds = () => {
    const formik: any = useFormikContext();
    const wallet = useAppSelector(selectBalance);

    useEffect(() => {
        formik.setFieldValue('funds', wallet[0]);
    }, [wallet]);
    return (
        <Stack alignItems="flex-start" justifyContent="center">
            <MiFundsWrapper>
                <div className="relative">
                    <svg
                        className="absolute right-0 bottom-0"
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        viewBox="0 -960 960 960"
                        width="24"
                    >
                        <path
                            fill="#3DA2FF"
                            d="m344-60-76-128-144-32 14-148-98-112 98-112-14-148 144-32 76-128 136 58 136-58 76 128 144 32-14 148 98 112-98 112 14 148-144 32-76 128-136-58-136 58Zm94-278 226-226-56-58-170 170-86-84-56 56 142 142Z"
                        />
                    </svg>
                    <svg
                        className="rounded-l-lg min-h-[80px] min-w-[80px]"
                        width="80"
                        height="80"
                        viewBox="0 0 80 81"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <rect width="80" height="80" transform="translate(0 0.550781)" fill="#08090B" />
                        <path
                            d="M52.3627 30.187L50.5506 37.9909L48.2331 28.5753L40.1133 25.3689L37.9178 34.8015L35.9836 23.7402L27.8638 20.5508L19.5 56.5508H28.3691L30.9305 45.4895L32.8646 56.5508H41.7512L43.9292 47.1182L46.2467 56.5508H55.1158L60.5 33.3764L52.3627 30.187Z"
                            fill="white"
                        />
                    </svg>
                </div>
                <input
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    hidden
                    id="funds"
                    name="funds"
                    value={formik.values.funds ? formik.values.funds.sendable : '0'}
                />
                <div className="my-auto overflow-hidden">
                    <h6 className="text-base pb-0 font-semibold truncate">Minima</h6>

                    <p className="text-base truncate">{formik.values.funds ? formik.values.funds.sendable : '0'}</p>
                </div>
            </MiFundsWrapper>
        </Stack>
    );
};

export default MiFunds;
