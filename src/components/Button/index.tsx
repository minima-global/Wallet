interface SendProps {
    type?: "button" | "submit" | "reset";
    secondary?: boolean;
    outline?: boolean;
    onClick?: () => void;
    children: React.ReactNode;
    disabled?: boolean;
    className?: string;
}

const Button = ({ secondary, type = "button", onClick, children, disabled, className = '' }: SendProps) => {
    let buttonClassName = secondary ? "w-full text-white bg-darkContrast hover:opacity-90 text-black rounded text-sm" : "w-full bg-orange enabled:hover:bg-lighterOrange enabled:hover:opacity-90 text-black rounded text-sm"

    return (
        <button type={type} className={`${buttonClassName} ${className} transition-colors duration-200 py-3.5 px-4 disabled:opacity-50 disabled:cursor-not-allowed`} onClick={onClick} disabled={disabled}>{children}</button>
    )
}

export default Button;