import { Pagination, Stack } from '@mui/material';

interface iProps {
    currentPage: (page: number) => void;
    totalNFTs: number;
    countPerPage: number;
}
const AppPagination = ({ currentPage, totalNFTs, countPerPage }: iProps) => {
    // const COUNT_PER_PAGE = 4;

    const handleChange = (event: any, value: number) => {
        currentPage(value);
    };
    return (
        <Stack justifyContent="center" direction="row">
            <Pagination
                onChange={handleChange}
                count={Math.ceil(totalNFTs / countPerPage)}
                shape="rounded"
                color="primary"
            />
        </Stack>
    );
};
export default AppPagination;
