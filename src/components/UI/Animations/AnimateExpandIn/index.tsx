import { useTransition, config, animated } from '@react-spring/web';
import React from 'react';

interface Props {
    display: boolean;
    children: React.ReactNode;
}

const AnimateExpandIn = ({ display, children }: Props) => {
    const transitions = useTransition(display, {
        from: { width: '0%', opacity: 0 },
        enter: { width: '100%', opacity: 1 },
        leave: { width: '0%', opacity: 0 },
        config: config.default,
    });

    return transitions((styles, item) =>
        item && (
            <animated.div style={styles} className="overflow-hidden">
                {children}
            </animated.div>
        )
    );
};

export default AnimateExpandIn;
