interface ButtonProps {
    type?: "button" | "submit" | "reset";
    variant?: 'primary' | 'secondary' | 'tertiary';
    onClick?: () => void;
    children: React.ReactNode;
    disabled?: boolean;
    className?: string;
    isLoading?: boolean;
}

const Button = ({ variant = 'primary', type = "button", onClick, children, disabled, className = '', isLoading = false }: ButtonProps) => {
    let buttonClassName;

    if (variant === 'primary') {
        buttonClassName = "text-black bg-orange enabled:hover:bg-lighterOrange enabled:hover:opacity-90"
    } else if (variant === 'secondary') {
        buttonClassName = "text-white bg-contrast1 hover:opacity-90"
    } else if (variant === 'tertiary') {
        buttonClassName = "text-grey80 bg-contrast2 hover:opacity-80"
    }

    if (isLoading) {
        buttonClassName = " bg-contrast2 cursor-not-allowed text-transparent disabled:!opacity-100 !transition-none";
    }

    return (
        <button type={type} disabled={disabled || isLoading} onClick={onClick} className={`${buttonClassName} ${className} relative w-full rounded text-sm transition-colors duration-200 py-3.5 px-4 disabled:opacity-50 disabled:cursor-not-allowed`}>
            {children}
            {isLoading && (
                <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center">
                    <div className="spinner-border w-5 h-5 text-black" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )}
        </button>
    )
}

export default Button;