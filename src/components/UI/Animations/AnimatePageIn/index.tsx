import { useTransition, config, animated } from '@react-spring/web';
interface Props { display: boolean; children: React.ReactNode}
const AnimatePageIn = ({ display, children }: Props) => {
    const transitions = useTransition(display, {
        from: { opacity: 0, transform: 'translateY(-50%) scale(0.8)' },
        enter: { opacity: 1, transform: 'translateY(0%) scale(1)' },
        leave: { opacity: 0, transform: 'translateY(-50%) scale(0.8)' },
        config: config.default,
    });

    return transitions((styles, item) => (item && <animated.div style={styles}>{children}</animated.div>));
};

export default AnimatePageIn;
