import { useTransition, useSpring, animated } from "@react-spring/web";

interface IProps {
  children: any;
  delay: number;
  loop?: boolean;
  isOpen?: boolean;
}

const SlideIn = ({ isOpen = true, children, delay, loop = false }: IProps) => {
  const [springs, api] = useSpring(() => ({
    from: { x: 0 },
  }));

  return (
    <>
      <animated.div style={{ ...springs }}>{children}</animated.div>
    </>
  );
};

export default SlideIn;
