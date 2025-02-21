import { useState } from "react";
import { IS_MINIMA_BROWSER } from "../../env";

type InfoBoxProps = {
    title: string;
    value?: string | React.ReactNode;
    copy?: boolean;
    href?: string;
    linkValue?: boolean;
    className?: string;
    collapsable?: boolean;
    children?: React.ReactNode;
}

const InfoBox = ({ title, value, copy, collapsable, linkValue, className, children }: InfoBoxProps) => {
    const [copied, setCopied] = useState(false);
    const [open, setOpen] = useState(false);

    const copyToClipboard = () => {
        if (copy && value) {
            setCopied(true);

            if (typeof value === 'string') {
                navigator.clipboard.writeText(value);
            }

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        }
    }

    const toggleCollapsable = () => {
        setOpen(!open);
    }

    const openInExternalBrowser = () => {
        if ((window as any).Android) {
            (window as any).Android.openExternalBrowser(value, "_blank");
        }
    }

    return (
        <div className={`bg-contrast1 relative w-full py-4 px-5 rounded text-white ${className}`}>
            <div onClick={toggleCollapsable} className={`relative ${collapsable ? 'cursor-pointer' : ''}`}>
                <div className="text-grey80">{title}</div>
                {value && !linkValue && <div className={`mt-2 text-sm break-word ${copy ? 'pr-14' : ''}`}>{value}</div>}
                {value && linkValue && typeof value === 'string' && (
                    <>
                        {IS_MINIMA_BROWSER && (
                            <div onClick={openInExternalBrowser} className="mt-2 text-sm text-grey60 text-orange underline break-all pr-14">{value}</div>
                        )}
                        {!IS_MINIMA_BROWSER && (
                            <a href={value} target="_blank" rel="noopener noreferrer" className="mt-2 block text-sm text-grey60 text-orange underline break-all pr-14">{value}</a>
                        )}
                    </>
                )}
                {copy && (
                    <div onClick={copyToClipboard} className="text-sm text-grey60 absolute top-0 right-0 flex h-full px-3 items-center">
                        <div>
                            {!copied && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 cursor-pointer stroke-grey hover:stroke-white"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            )}
                            {copied && (
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.58075 14.2538L15.3038 7.53075L14.25 6.47693L8.58075 12.1462L5.73075 9.29615L4.67693 10.35L8.58075 14.2538ZM10.0016 19.5C8.68772 19.5 7.45268 19.2506 6.29655 18.752C5.1404 18.2533 4.13472 17.5765 3.2795 16.7217C2.42427 15.8669 1.74721 14.8616 1.24833 13.706C0.749442 12.5504 0.5 11.3156 0.5 10.0017C0.5 8.68772 0.749334 7.45268 1.248 6.29655C1.74667 5.1404 2.42342 4.13472 3.27825 3.2795C4.1331 2.42427 5.13834 1.74721 6.29398 1.24833C7.44959 0.749442 8.68437 0.5 9.9983 0.5C11.3122 0.5 12.5473 0.749333 13.7034 1.248C14.8596 1.74667 15.8652 2.42342 16.7205 3.27825C17.5757 4.1331 18.2527 5.13834 18.7516 6.29398C19.2505 7.44959 19.5 8.68437 19.5 9.9983C19.5 11.3122 19.2506 12.5473 18.752 13.7034C18.2533 14.8596 17.5765 15.8652 16.7217 16.7205C15.8669 17.5757 14.8616 18.2527 13.706 18.7516C12.5504 19.2505 11.3156 19.5 10.0016 19.5Z" fill="#4FE3C1"></path></svg>
                            )}
                        </div>
                    </div>
                )}
                {collapsable && (
                    <div className="cursor-pointer text-sm text-grey60 hover:text-white absolute top-0 right-0 flex h-full items-center">
                        <div>
                            <svg className={`transition-all duration-200 rotate-90 ${open ? 'rotate-[-90deg] !text-orange' : ''}`} width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.875 5L0.9375 1.0625L2 0L7 5L2 10L0.9375 8.9375L4.875 5Z" fill="currentColor" />
                            </svg>
                        </div>
                    </div>
                )}
            </div>
            {collapsable && open && (
                <div className="mt-4">
                    {children}
                </div>
            )}
        </div>
    )
}

export default InfoBox