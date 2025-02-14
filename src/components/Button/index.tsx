interface SendProps {
    type?: "button" | "submit" | "reset";
    variant?: 'primary' | 'secondary' | 'tertiary';
    onClick?: () => void;
    children: React.ReactNode;
    disabled?: boolean;
    className?: string;
}

const Button = ({ variant = 'primary', type = "button", onClick, children, disabled, className = '' }: SendProps) => {
    let buttonClassName;

    if (variant === 'primary') {
        buttonClassName = "text-black bg-orange enabled:hover:bg-lighterOrange enabled:hover:opacity-90"
    } else if (variant === 'secondary') {
        buttonClassName = "text-white bg-contrast hover:opacity-90"
    } else if (variant === 'tertiary') {
        buttonClassName = "text-grey80 bg-contrast2 hover:opacity-80"
    }

    return (
        <button type={type} className={`${buttonClassName} ${className} w-full rounded text-sm transition-colors duration-200 py-3.5 px-4 disabled:opacity-50 disabled:cursor-not-allowed`} onClick={onClick} disabled={disabled}>{children}</button>
    )
}

export default Button;