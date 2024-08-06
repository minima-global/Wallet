import React from 'react';
import { useSpring, animated } from '@react-spring/web';

interface NFTCardProps {
    image: string;
    name: string;
    owner: string;
    onClick: () => void;
  }
  
const NFTCard = ({ image, name, owner, onClick }: NFTCardProps) => {
  
    const [hovered, setHovered] = React.useState(false);

  const springProps = useSpring({
    transform: hovered ? 'scale(1.05)' : 'scale(1)',
    config: { tension: 300, friction: 10 },
  });
  
    return (
    <div
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
    onClick={onClick}
    
    className="bg-neutral-100 dark:bg-[#1B1B1B] border border-gray-200 dark:border-[#1B1B1B] rounded-lg shadow-md overflow-hidden transition-transform transform hover:-translate-y-1">
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-lg font-semibold dark:text-neutral-300">{name}</h2>
        <p className="text-sm dark:text-neutral-400">Owner: {owner}</p>
      </div>
    </div>
  );
};

export default NFTCard;