interface SendProps {
    secondary?: boolean;
    outline?: boolean;
    onClick?: () => void;
    children: React.ReactNode;
    disabled?: boolean;
}

const Button = ({ secondary, outline, onClick, children, disabled }: SendProps) => {
    let className = secondary ? "w-full text-white bg-darkContrast hover:opacity-90 text-black rounded text-sm" : "w-full bg-orange enabled:hover:bg-lighterOrange enabled:hover:opacity-90 text-black rounded text-sm"
    if (outline) {
        className = "w-full border-2 !border-white text-white bg-contrast2 hover:opacity-90 text-black rounded text-sm"
    }
    return (
        <button className={`${className} transition-colors duration-200 py-3.5 px-4 disabled:opacity-50 disabled:cursor-not-allowed`} onClick={onClick} disabled={disabled}>{children}</button>
    )
}

export default Button;