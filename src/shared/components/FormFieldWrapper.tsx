import styled from '@emotion/styled';
import { Tooltip, Stack } from '@mui/material';
import { ReactElement } from 'react';
import HelpIcon from '@mui/icons-material/Help';

const FieldWrapper = styled('div')`
    width: 100%;
    display: flex;
    flex-direction: column;

    > svg {
        float: right !important;
    }
    > div {
        margin-bottom: 8px;
    }
`;

interface IProps {
    children: ReactElement;
    help: string;
}

const FormFieldWrapper = ({ children, help }: IProps) => {
    return (
        <FieldWrapper>
            <Stack alignItems="flex-end" justifyContent="center">
                <Tooltip
                    enterTouchDelay={0}
                    title={help}
                    children={<HelpIcon color="inherit" sx={{ height: 24, width: 24 }} />}
                />
            </Stack>
            {children}
        </FieldWrapper>
    );
};

export default FormFieldWrapper;
