const Dropdown = () => {
    return (
        <div className="grid grid-cols-2 bg-contrast1 rounded px-6 py-4 text-grey60">
            <div className="col-span-1">Upload Image</div>
            <div className="col-span-1 flex items-center justify-end">
                <svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 6.0625L0 1.0625L1.0625 0L5 3.9375L8.9375 0L10 1.0625L5 6.0625Z" fill="#91919D" />
                </svg>
            </div>
        </div>
    )
}

export default Dropdown;