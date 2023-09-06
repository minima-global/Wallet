import { useTransition, animated, useSpring } from "@react-spring/web";

interface IProps {
  children: any;
  isOpen: boolean;
}

const SlideUp = ({ children, isOpen }: IProps) => {
  const transition = useTransition(isOpen, {
    from: {
      y: 1000,
    },
    enter: {
      y: 0,
    },
    leave: {
      y: 1000,
    },
  });

  return (
    <>
      {transition(
        //@ts-ignore

        (style, isOpen) =>
          !!isOpen && <animated.div style={style}>{children}</animated.div>
      )}
    </>
  );
};

export default SlideUp;
