import { useLocation } from 'react-router-dom';
import AnimatePageIn from '../../components/UI/Animations/AnimatePageIn';
import { useContext, useState } from 'react';
import { appContext } from '../../AppContext';
import NFTCard from './NFTCard';
import AnimatedDialog from '../../components/UI/AnimatedDialog';
import NFTScrollingSection from './NFTScrollingSection';


const Collections = () => {
    const location = useLocation();
    const { balance } = useContext(appContext);
    const [selectedNFT, setSelectedNFT] = useState<any | null>(null);

    const handleNFTClick = (nft: any) => {
      setSelectedNFT(nft);
    };
  
    const handleCloseModal = () => {
      setSelectedNFT(null);
    };
    return (
        <>
        <AnimatePageIn display={location.pathname.includes('/dashboard/collections')}>
            <div className="mx-3 mt-8">
                <div className="grid grid-cols-[1fr_auto] items-center">
                    <h6 className="font-bold tracking-wide dark:text-neutral-300">Collections</h6>
                </div>
                <p>These are all your NFT collections</p>

                
                <div className='my-4'>
                    <NFTScrollingSection nfts={[{image: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzR2dGo3N2tlOTgxd3Qwcm1lcHU1Y2FncWM0eWZwd3hmM2tzNTVwdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Bn0JzrZxWfTKU/giphy.gif", name: "amazing"}, {image: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzR2dGo3N2tlOTgxd3Qwcm1lcHU1Y2FncWM0eWZwd3hmM2tzNTVwdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Bn0JzrZxWfTKU/giphy.gif", name: "amazing"}, {image: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGNqZzRwZ2ljc3NjZnZuY3g0YnBiZXVmNXAydGZxaTFyaTNva3lwZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1USKMDPjuH4ovL7J5h/giphy.gif", name: "amazing"}]} />
                </div>

                <div className="mt-4 mb-8">
                <div className="p-4 px-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-6">
                    <NFTCard  image="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzR2dGo3N2tlOTgxd3Qwcm1lcHU1Y2FncWM0eWZwd3hmM2tzNTVwdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Bn0JzrZxWfTKU/giphy.gif" owner="me" key="1" name="amazing" />
                    <NFTCard  image="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGNqZzRwZ2ljc3NjZnZuY3g0YnBiZXVmNXAydGZxaTFyaTNva3lwZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1USKMDPjuH4ovL7J5h/giphy.gif" owner="me" key="1" name="amazing" />
                    <NFTCard  image="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzR2dGo3N2tlOTgxd3Qwcm1lcHU1Y2FncWM0eWZwd3hmM2tzNTVwdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Bn0JzrZxWfTKU/giphy.gif" owner="me" key="1" name="amazing" />
                    <NFTCard  image="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzR2dGo3N2tlOTgxd3Qwcm1lcHU1Y2FncWM0eWZwd3hmM2tzNTVwdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Bn0JzrZxWfTKU/giphy.gif" owner="me" key="1" name="amazing" />
                    <NFTCard  image="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzR2dGo3N2tlOTgxd3Qwcm1lcHU1Y2FncWM0eWZwd3hmM2tzNTVwdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Bn0JzrZxWfTKU/giphy.gif" owner="me" key="1" name="amazing" />
                    
                    
                </div>
                </div>
            </div>
        </AnimatePageIn>
        
        <AnimatedDialog display={selectedNFT !== null} dismiss={() => setSelectedNFT(null)}>
            <div>
                the nft..
            </div>
        </AnimatedDialog>
        </>
    );
};

export default Collections;
