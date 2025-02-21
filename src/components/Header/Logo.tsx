import { useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import animationData from '../../hover_animation_v2.json';

const Logo = () => {
    const [isStopped, setIsStopped] = useState(false);

    useEffect(() => {
        if (isStopped) {
            const timeout = setTimeout(() => {
                setIsStopped(false);
            }, 60000);

            return () => clearTimeout(timeout);
        }
    }, [isStopped]);

    const defaultOptions = {
        loop: true,
        renderer: 'svg',
        animationData: animationData,
        rendererSettings: {
            // preserveAspectRatio: 'xMidYMid meet'
        },
    };

    const handleMouseOver = () => {
        setIsStopped(false);
    }

    return (
        <div onMouseOver={handleMouseOver} className="w-[48px] h-[48px] lg:w-[58px] lg:h-[58px]">
            <Lottie
                isStopped={isStopped}
                options={defaultOptions}
                width="100%"
                height="100%"
                eventListeners={[
                    {
                        eventName: 'loopComplete',
                        callback: () => {
                            setIsStopped(true);
                        }
                    }
                ]}
            />
        </div>
    )
};

export default Logo;
