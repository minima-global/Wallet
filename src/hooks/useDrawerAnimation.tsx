import { useEffect, useRef, useState } from "react";
import { config, useSpring, animated } from "react-spring";


const useDrawerAnimation = (onClose?: any) => {

    const [active, setActive] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDrawer = () => setActive(prevState => !prevState);


    const springProps = useSpring({
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0%)" : "translateY(-50%)",
        config: config.stiff,
      });

      useEffect(() => {
        const handleClickOutside = (event: any) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setActive(false);
            if (onClose) onClose();
          }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
    
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, []);

    return {
        active,
        animated,
        springProps,
        dropdownRef,
        setActive,
        toggleDrawer
    }
}

export default useDrawerAnimation;