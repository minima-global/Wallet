import { useEffect } from "react";
import Button from "../Button";

export const Lightbox = ({ display, image, dismiss }: { display: boolean, image: string, dismiss: () => void }) => {
    useEffect(() => {
        if (display) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }, [display]);

    return (
        <div className={`fixed z-[10000] inset-0 bg-black ${display ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-100`}>
            <div className="w-full h-full p-10">
                <div className="w-full h-full flex flex-col items-center justify-center">
                    <div className="grow w-full h-full flex items-center justify-center pb-10">
                        <img src={image} alt="token" className="w-full h-full max-w-[75vw] max-h-[75vh] object-contain" />
                    </div>
                    <Button variant="tertiary" className="w-full" onClick={dismiss}>
                        Close
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Lightbox;