import Lottie from 'react-lottie';
import animationData from './logo_reveal_v2.json';
import { useEffect } from 'react';
import { useContext } from 'react';
import { appContext } from './AppContext';
import { useState } from 'react';
import { MDS} from '@minima-global/mds';

const LogoReveal = ({ children }: { children: React.ReactNode }) => {
    const { loaded } = useContext(appContext);
    const [isReady, setIsReady] = useState(false);
    const [isHidden, setIsHidden] = useState(true);
    const isMobile = window.innerWidth < 768;

    useEffect(() => {
        if (!loaded) {
            MDS.keypair.get('splash', (keypair) => {
                if (!keypair.value) {
                    MDS.keypair.set('splash', '1');
                    setIsHidden(false);
                    setIsReady(true);
                }

                setIsReady(true);
            });
        }
    }, [loaded]);

    const defaultOptions = {
        loop: false,
        autoplay: false,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    if (!isReady) return null;

    return (
        <div>
            <div className={`fixed bg-[#000] w-screen h-screen z-[99999] flex items-center justify-center transition-all duration-200 ${isHidden ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
                <Lottie
                    options={defaultOptions}
                    width={isMobile ? 200 : 400}
                    height={isMobile ? 200 : 400}
                    isStopped={isHidden}
                    eventListeners={[
                        {
                            eventName: 'complete',
                            callback: () => {
                                setTimeout(() => {
                                    setIsHidden(true);
                                }, 250);
                            }
                        }
                    ]}
                />
            </div>
            {children}
        </div>
    );
};

export default LogoReveal;
