const RefreshButton = () => {
    return (
        <div>
            <button type="button" className="text-white h-[44px] w-[44px] p-0 border border-grey40 dark:border-mediumDarkContrast rounded-full flex justify-center items-center bg-grey10 dark:bg-darkContrast active:scale-90 transition-all ">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 7V0H7V7H0ZM0 16V9H7V16H0ZM9 7V0H16V7H9ZM9 16V9H16V16H9ZM1 6H6V1H1V6ZM10 6H15V1H10V6ZM10 15H15V10H10V15ZM1 15H6V10H1V15Z" fill="currentColor" />
                </svg>
            </button>
        </div>
    )
}

export default RefreshButton;