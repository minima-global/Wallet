const RefreshButton = ({ action }: { action: () => void }) => {
    return (
        <button onClick={action} type="button" className="text-white h-[44px] w-[44px] p-0 border border-grey40 dark:border-mediumDarkContrast rounded-full flex justify-center items-center bg-grey10 dark:bg-darkContrast active:scale-90 transition-all ">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 19V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 9L7 4L12 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M17 5V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 15L17 20L12 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </button>
    )
}

export default RefreshButton;