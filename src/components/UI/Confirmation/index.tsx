import { useSpring, config, animated } from "react-spring";

const Confirmation = ({ isOpen, children }) => {
  const springProps = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen
      ? "translateY(0%) scale(1)"
      : "translateY(-50%) scale(0.8)",
    config: config.default,
  });

  return (
    <animated.div className={`${isOpen ? "z-[28]" : "z-[20]"} flex absolute left-0 right-0 top-0 bottom-0 justify-items-center items-center backdrop-blur-sm`} style={springProps}>
      {children}
    </animated.div>
  );
};

export default Confirmation;
