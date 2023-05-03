import styled from '@emotion/styled';
import { Stack, Typography } from '@mui/material';
import { ReactElement } from 'react';
import { MiRequiredAsterisk } from './forms/Required';

const FieldWrapper = styled('div')`
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    text-overflow: ellipsis;

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
    required?: boolean;
}

const FormFieldWrapper = ({ children, help, required = false }: IProps) => {
    return (
        <FieldWrapper>
            <Stack alignItems="flex-start" justifyContent="center">
                <Typography variant="caption">
                    {help} {required && <MiRequiredAsterisk>*</MiRequiredAsterisk>}
                </Typography>
            </Stack>
            {children}
        </FieldWrapper>
    );
};

export default FormFieldWrapper;
