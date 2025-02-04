interface SendProps {
    secondary?: boolean;
    onClick?: () => void;
    children: React.ReactNode;
}

const Button = ({ secondary, onClick, children }: SendProps) => {
    const className = secondary ? "w-full text-white bg-grey10 dark:bg-darkContrast text-black rounded text-sm" : "w-full bg-orange text-black rounded text-sm"
    return (
        <button className={`${className} py-3.5 px-4`} onClick={onClick}>{children}</button>
    )
}

export default Button;