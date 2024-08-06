import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';

const NFTScrollingSection = ({ nfts }) => {
    const [reverse, setReverse] = useState(false);

    const styles = useSpring({
        from: { transform: reverse ? 'translateX(-100%)' : 'translateX(100%)' },
        to: { transform: reverse ? 'translateX(100%)' : 'translateX(-100%)' },
        config: { duration: 10000 },
        onRest: () => setReverse(!reverse),
    });

    return (
        <div className="nft-scrolling-container bg-[#1B1B1B] rounded-lg hover:opacity-100 transition-all hover:h-[180px] group relative">
            <p className="text-sm p-2 text-neutral-200 dark:text-neutral-500 font-bold">Favorites</p>
            <animated.div style={styles} className="nft-scrolling-content">
                {nfts.map((nft, index) => (
                    <div key={index} className="nft-item">
                        <img src={nft.image} alt={nft.name} />
                        {/* <p>{nft.name}</p> */}
                    </div>
                ))}
            </animated.div>
            <button type="button" className="view-all-button text-sm font-bold absolute bottom-0 left-0 right-0 hidden group-hover:flex justify-center items-center text-neutral-100 dark:bg-[#1B1B1B] dark:bg-opacity-50 dark:text-neutral-500">
                Click to view all
            </button>
        </div>
    );
};

export default NFTScrollingSection;
