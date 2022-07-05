import { Stack } from '@mui/material';

const ModalStackedCol = ({ children }: any) => {
    return (
        <Stack
            direction="row"
            sx={{ maxWidth: 'inherit', mt: 2, mb: 2 }}
            justifyContent="space-between"
            alignItems="center"
        >
            {children}
        </Stack>
    );
};

const ModalStackedRow = ({ children }: any) => {
    return (
        <Stack
            direction="column"
            sx={{ maxWidth: 'inherit', mt: 2, mb: 2 }}
            justifyContent="flex-start"
            alignItems="flex-start"
        >
            {children}
        </Stack>
    );
};

const ModalButtonWrapper = ({ children }: any) => {
    return (
        <Stack direction="row" justifyContent="flex-end" mt={3} mb={0}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                {children}
            </Stack>
        </Stack>
    );
};

export { ModalStackedCol, ModalStackedRow, ModalButtonWrapper };
