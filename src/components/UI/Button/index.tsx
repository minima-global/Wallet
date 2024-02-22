import * as React from 'react';

type ButtonProps = {
    variant?: 'primary' | 'secondary';
    onClick?: any;
    onContextMenu?: any;
    disabled?: boolean;
    type?: 'submit' | 'button';
    extraClass?: string;
    onMouseDown?: (e: any) => void;
    onTouchStart?: (e: any) => void;
    onMouseUp?: (e: any) => void;
    onMouseLeave?: (e: any) => void;
    onTouchEnd?: (e: any) => void;
};

const Button: React.FC<React.PropsWithChildren<ButtonProps>> = ({
    variant = 'primary',
    onClick = null,
    onContextMenu = null,
    children,
    disabled,
    type = 'button',
    extraClass,
    onMouseDown,
    onTouchStart,
    onMouseUp,
    onMouseLeave,
    onTouchEnd,
}) => {
    let base =
        'w-full px-4 py-3.5 font-bold text-lg rounded';

    if (extraClass && extraClass.length) {
        base += ` ${extraClass ? extraClass + '' : ''}`;
    }

    if (variant === 'primary') {
        base += ' text-white bg-black hover:bg-opacity-90 font-semibold';
    } else if (variant === 'secondary') {
        base += ' text-white bg-gray-400';
    }

    if (disabled) {
        base += ' bg-opacity-20 text-slate-50 hover:bg-opacity-20';
    }

    return (
        <button
            onMouseUp={onMouseUp}
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            onMouseLeave={onMouseLeave}
            onTouchEnd={onTouchEnd}
            onContextMenu={onContextMenu}
            type={type}
            disabled={disabled}
            className={base}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;
