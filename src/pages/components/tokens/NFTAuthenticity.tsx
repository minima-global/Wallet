import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import * as RPC from '../../../minima/commands';

interface NFTAuthenticityProps {
  tokenid: string;
  relative?: boolean;
}

const NFTAuthenticity: React.FC<NFTAuthenticityProps> = ({ tokenid, relative = false }) => {
  const [isTokenValidated, setIsTokenValidated] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    const validateToken = async () => {
      try {
        await RPC.tokenValidate(tokenid);
        if (isMounted) setIsTokenValidated(true);
      } catch (error) {
        if (isMounted) setIsTokenValidated(false);
      }
    };

    validateToken();

    return () => {
      isMounted = false;
    };
  }, [tokenid]);

  if (isTokenValidated === null) {
    return null; // Or a loading indicator
  }

  const iconClass = `w-4 h-4 text-white ${relative ? 'relative' : 'absolute right-1 bottom-1'}`;

  return isTokenValidated ? (
    <CheckCircle className={`${iconClass} fill-blue-500`} />
  ) : (
    <AlertCircle className={`${iconClass} fill-yellow-500`} />
  );
};

export default NFTAuthenticity;