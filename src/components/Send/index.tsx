const Send = ({ secondary, children }: { secondary?: boolean, children: React.ReactNode }) => {
    const className = secondary ? "w-full text-white bg-grey10 dark:bg-darkContrast text-black py-3 px-4 rounded text-sm" : "w-full bg-orange text-black py-3 px-4 rounded text-sm"
    return (
        <button className={className}>{children}</button>

    )
}   

export default Send;