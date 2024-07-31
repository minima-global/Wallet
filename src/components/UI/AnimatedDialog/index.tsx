import { ReactElement, useEffect, useState } from 'react';
import { animated, useTransition, config } from 'react-spring';
import { createPortal } from 'react-dom';
import { useMediaQuery } from '@mui/material';

interface AnimatedDialogProps {
    children: ReactElement;
    display: boolean;
    dismiss: () => void;
    extraClass?: string;
}

const AnimatedDialog = ({ children, display, extraClass, dismiss }: AnimatedDialogProps) => {
    const [show, setShow] = useState(display);

    // Custom hook to detect screen size
    const isMdUp = useMediaQuery('(min-width: 768px)');
    useEffect(() => {
        if (display) setShow(true);
    }, [display]);

    // Determine the animation styles based on screen size
    const transitions = useTransition(display, {
        from: isMdUp
            ? { opacity: 0, transform: 'translateY(-50%) scale(0.8)' }
            : { opacity: 0, transform: 'translateY(100%) scale(1)' },
        enter: { opacity: 1, transform: 'translateY(0%) scale(1)' },
        leave: isMdUp
            ? { opacity: 0, transform: 'translateY(-50%) scale(0.8)' }
            : { opacity: 0, transform: 'translateY(+150%) scale(1)' },
        onRest: () => {
            if (!display) setShow(false);
        },
    });

    return (
      <>
        {show &&
          createPortal(
            transitions((styles, item) =>
              item ? (
                <animated.div
                  style={styles}
                  className="fixed left-0 right-0 bottom-0 top-0 md:grid md:grid-cols-[1fr_minmax(0,_560px)_1fr] md:ml-[240px] z-[22]"
                >
                  <div />
                  <div className={`z-[23] h-full ${extraClass && extraClass}`}>{children}</div>
                  <div />
                </animated.div>
              ) : null
            ),
            document.body
          )}
        {show && (
          <div
            onClick={dismiss}
            className="fixed backdrop-blur-sm left-0 right-0 top-0 bottom-0 z-[21] bg-white/30 dark:bg-black/30"
          />
        )}
      </>
    );
};

export default AnimatedDialog;
