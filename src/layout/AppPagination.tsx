import { Pagination, Stack } from '@mui/material';

interface iProps {
    currentPage: (page: number) => void;
    totalNFTs: number;
    countPerPage: number;
}
const AppPagination = ({ currentPage, totalNFTs, countPerPage }: iProps) => {
    const handleChange = (event: any, value: number) => {
        currentPage(value);
    };
    return (
        <Stack justifyContent="center" direction="row">
            <Pagination onChange={handleChange} count={Math.ceil(totalNFTs / countPerPage)} shape="rounded" />
        </Stack>
    );
};
export default AppPagination;
