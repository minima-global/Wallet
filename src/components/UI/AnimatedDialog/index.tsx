import { ReactElement, useEffect, useRef, useState } from 'react';
import { animated, useTransition, config } from 'react-spring';
import { createPortal } from 'react-dom';

interface AnimatedDialogProps {
    children: ReactElement;
    display: boolean;
    dismiss: () => void;
    extraClass?: string;
}
let zIndexCounter = 1000;

const getNextZIndex = () => {
  return zIndexCounter++;
};
const AnimatedDialog = ({ children, display, extraClass, dismiss }: AnimatedDialogProps) => {
    const [show, setShow] = useState(display);

    const zIndex = useRef(getNextZIndex()).current; // Get a unique z-index for each dialog instance

    useEffect(() => {
        if (display) setShow(true);
    }, [display]);

    const transitions = useTransition(display, {
        from: { opacity: 0, transform: 'translateY(-50%) scale(0.8)' },
        enter: { opacity: 1, transform: 'translateY(0%) scale(1)' },
        leave: { opacity: 0, transform: 'translateY(-50%) scale(0.8)' },
        config: config.default,
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
                  <div className={`z-[23] h-full ${extraClass&&extraClass}`}>{children}</div>
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
