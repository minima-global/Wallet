type BackButtonProps = {
    onClick?: () => void;
}

const BackButton = ({ onClick }: BackButtonProps) => {
    return (
        <div onClick={onClick} className="cursor-pointer text-xs flex bg-contrast1 border dark:border-contrast2 rounded-full flex items-center gap-3 w-fit px-3.5 py-1.5 text-white mb-5 cursor-pointer select-none origin-center active:scale-[0.95] transition-all duration-100">
            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.00052 9.711L0.289062 4.99955L5.00052 0.288086L5.77448 1.06204L1.83698 4.99955L5.77448 8.93705L5.00052 9.711Z" fill="#E9E9EB" />
            </svg>
            Back
        </div>
    )
}

export default BackButton