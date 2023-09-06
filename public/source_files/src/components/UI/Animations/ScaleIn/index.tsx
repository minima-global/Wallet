import { useTransition, animated, useSpring } from '@react-spring/web';

interface IProps {
    children: any;
    isOpen: boolean;
}

const ScaleIn = ({ children, isOpen }: IProps) => {
    const transition = useTransition(isOpen, {
        from: {
            scale: 0,
            opacity: 0,
        },
        enter: {
            scale: 1.5,
            opacity: 1,
        },
        leave: {
            scale: 0,
            opacity: 0,
        },
    });

    return (
        <>
            {transition(
                //@ts-ignore

                (style, isOpen) => !!isOpen && <animated.div style={style}>{children}</animated.div>
            )}
        </>
    );
};

export default ScaleIn;
