import { useTransition, animated } from '@react-spring/web';

interface IProps {
    children: any;
    isOpen: boolean;
}

const FadeIn = ({ isOpen, children }: IProps) => {
    const transition = useTransition(isOpen, {
        from: {
            opacity: 0,
        },
        enter: {
            opacity: 1,
        },
        leave: {
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

export default FadeIn;
