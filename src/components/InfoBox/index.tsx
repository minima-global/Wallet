const InfoBox = ({ title, value, copy, href }: { title: string, value?: string, copy?: boolean, href?: string }) => {
    return (
        <div className="bg-contrast1 relative w-full py-4 px-5 rounded text-white">
            <div className="mb-1">{title}</div>
            {value && <div className="mt-2 text-sm text-grey60">{value}</div>}
            {copy && (
                <div className="text-sm text-grey60 absolute top-0 right-0 flex h-full px-6 items-center">
                    <div>
                        <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.5 13C4.0875 13 3.73438 12.8531 3.44062 12.5594C3.14687 12.2656 3 11.9125 3 11.5V1.5C3 1.0875 3.14687 0.734376 3.44062 0.440626C3.73438 0.146876 4.0875 0 4.5 0H12.5C12.9125 0 13.2656 0.146876 13.5594 0.440626C13.8531 0.734376 14 1.0875 14 1.5V11.5C14 11.9125 13.8531 12.2656 13.5594 12.5594C13.2656 12.8531 12.9125 13 12.5 13H4.5ZM4.5 11.5H12.5V1.5H4.5V11.5ZM1.5 16C1.0875 16 0.734375 15.8531 0.440625 15.5594C0.146875 15.2656 0 14.9125 0 14.5V3H1.5V14.5H11V16H1.5Z" fill="#A7A7B0" />
                        </svg>
                    </div>
                </div>
            )}
            {href && (
                <div className="text-sm text-grey60 absolute top-0 right-0 flex h-full px-6 items-center">
                    <div>
                        <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.875 5L0.9375 1.0625L2 0L7 5L2 10L0.9375 8.9375L4.875 5Z" fill="#91919D" />
                        </svg>
                    </div>
                </div>
            )}
        </div>
    )
}

export default InfoBox