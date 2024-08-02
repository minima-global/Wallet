import { useTransition, config, animated } from '@react-spring/web';
import React from 'react';

interface Props {
    display: boolean;
    children: React.ReactNode;
}

const AnimateFadeIn = ({ display, children }: Props) => {
    const transitions = useTransition(display, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: config.default,
    });

    return transitions((styles, item) => item && <animated.div style={styles}>{children}</animated.div>);
};

export default AnimateFadeIn;