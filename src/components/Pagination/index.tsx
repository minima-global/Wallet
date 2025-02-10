const Pagination = ({ page, totalPages, onPageChange }: { page: number, totalPages: number | null, onPageChange: (page: number) => void }) => {
    if (!totalPages) {
        return null;
    }

    const handlePageChange = (page: number) => {
        onPageChange(page);
    }

    const goToLastPage = () => {
        onPageChange(totalPages);
    }

    const goToFirstPage = () => {
        onPageChange(1);
    }

    const goToPreviousPage = () => {
        onPageChange(page - 1);
    }

    const goToNextPage = () => {
        onPageChange(page + 1);
    }

    return (
        <div>
            <div className="mt-8 flex items-center justify-center gap-3 text-black lg:gap-4 dark:text-white">
                <button onClick={goToFirstPage} disabled={page === 1} className={`px-3 py-1 cursor-pointer disabled:cursor-not-allowed ${page !== 1 ? 'opacity-100' : 'opacity-30'}`}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-black dark:fill-grey20">
                        <mask id="mask0_2918_9449" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                            <rect width="20" height="20" fill="#D9D9D9"></rect>
                        </mask>
                        <g mask="url(#mask0_2918_9449)">
                            <path d="M9 15L4 10L9 5L10.0625 6.0625L6.125 10L10.0625 13.9375L9 15ZM14.9375 15L9.9375 10L14.9375 5L16 6.0625L12.0625 10L16 13.9375L14.9375 15Z"></path>
                        </g>
                    </svg>
                </button>
                <button onClick={goToPreviousPage} disabled={page === 1} className={`px-3 py-1 cursor-pointer disabled:cursor-not-allowed ${page !== 1 ? 'opacity-100' : 'opacity-30'}`}>
                    <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-black dark:fill-grey20">
                        <path d="M5 10L0 5L5 0L6.0625 1.0625L2.125 5L6.0625 8.9375L5 10Z"></path>
                    </svg>
                </button>
                <div className="select-none appearance-none rounded border border-grey80 bg-grey10 px-4 py-1.5 text-center text-sm text-black outline-none dark:border-mediumDarkContrast dark:bg-darkContrast dark:text-grey80">
                    {page} of {totalPages} total pages
                </div>
                <button onClick={goToNextPage} disabled={page >= totalPages} className={`px-3 py-1 cursor-pointer disabled:cursor-not-allowed ${page < totalPages ? 'opacity-100' : 'opacity-30'}`}>
                    <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-black dark:fill-grey20">
                        <path d="M4.875 5L0.9375 1.0625L2 0L7 5L2 10L0.9375 8.9375L4.875 5Z"></path>
                    </svg>
                </button>
                <button onClick={goToLastPage} disabled={page === totalPages} className={`-scale-x-[1] px-3 py-1 cursor-pointer ${page === totalPages ? 'opacity-30' : ''}`}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-black dark:fill-grey20">
                        <mask id="mask0_2918_9449" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                            <rect width="20" height="20" fill="#D9D9D9"></rect>
                        </mask>
                        <g mask="url(#mask0_2918_9449)">
                            <path d="M9 15L4 10L9 5L10.0625 6.0625L6.125 10L10.0625 13.9375L9 15ZM14.9375 15L9.9375 10L14.9375 5L16 6.0625L12.0625 10L16 13.9375L14.9375 15Z"></path>
                        </g>
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default Pagination;
