import { Stack, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { FC, useState } from 'react';

import GridLayout from '../layout/GridLayout';

import { useAppDispatch } from '../minima/redux/hooks';

import MiCard from '../shared/components/layout/MiCard';
import ValueTransfer from './components/forms/ValueTransfer';
import CoinSplit from './components/forms/CoinSplit';

const dataTestIds = {
    method: 'Send__method',
    amount: 'Send__amount',
    address: 'Send__address',
    next: 'Send__next',
};

const Send: FC = () => {
    const [formUtility, setFormUtility] = useState('VALUETRANSFER');

    const handleUtilityChange = (event: SelectChangeEvent<string>) => {
        setFormUtility(event.target.value);
    };

    return (
        <>
            <GridLayout
                children={
                    <>
                        <MiCard>
                            <Stack spacing={2}>
                                <Select
                                    fullWidth
                                    id="formUtility"
                                    name="formUtility"
                                    value={formUtility}
                                    onChange={handleUtilityChange}
                                >
                                    <MenuItem value="VALUETRANSFER">Value transfer</MenuItem>
                                    <MenuItem value="COINSPLIT">Coin split</MenuItem>
                                </Select>
                                {formUtility === 'VALUETRANSFER' && <ValueTransfer />}
                                {formUtility === 'COINSPLIT' && <CoinSplit />}
                            </Stack>
                        </MiCard>
                    </>
                }
            />
        </>
    );
};

export default Send;
