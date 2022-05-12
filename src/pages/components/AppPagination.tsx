import { Pagination } from '@mui/material';

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
        <Pagination
            onChange={handleChange}
            count={Math.round(totalNFTs / COUNT_PER_PAGE)}
            variant="outlined"
            color="primary"
        />
    );
};
export default AppPagination;
