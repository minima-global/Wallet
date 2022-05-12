import { Pagination, Stack } from '@mui/material';

interface iProps {
    currentPage: (page: number) => void;
    totalNFTs: number;
}
const AppPagination = ({ currentPage, totalNFTs }: iProps) => {
    const COUNT_PER_PAGE = 2;

    const handleChange = (event: any, value: number) => {
        currentPage(value);
    };
    return (
        <Stack justifyContent="center" direction="row">
            <Pagination
                onChange={handleChange}
                count={Math.round(totalNFTs / COUNT_PER_PAGE)}
                shape="rounded"
                color="primary"
            />
        </Stack>
    );
};
export default AppPagination;
