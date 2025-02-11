const Truncate = ({ text, maxLength = 16 }: { text: string | undefined, maxLength: number }) => {
    if (!text) return null;

    return (
        <>
            <span className="hidden lg:inline">{text}</span>
            <span className="inline lg:hidden">{text.length > maxLength ? text.slice(0, maxLength) + '...' : text}</span>
        </>
    )
}

export default Truncate;
