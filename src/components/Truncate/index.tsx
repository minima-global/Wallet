const Truncate = ({ text, maxLength = 12 }: { text: string | undefined, maxLength?: number }) => {
    if (!text) return null;

    return (
        <>
            <span className="hidden sm:hidden lg:hidden xl:inline">{text}</span>
            <span className="hidden sm:hidden lg:inline xl:hidden">{text.length > maxLength ? text.slice(0, 32) + '...' : text}</span>
            <span className="hidden sm:inline lg:hidden xl:hidden">{text.length > maxLength ? text.slice(0, 32) + '...' : text}</span>
            <span className="inline sm:hidden lg:hidden xl:hidden">{text.length > maxLength ? text.slice(0, maxLength) + '...' : text}</span>
        </>
    )
}

export default Truncate;
