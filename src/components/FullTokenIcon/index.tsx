import { Image } from "@minima-global/image";

const FullTokenIcon = ({ token, tokenId }: { token: any, tokenId: string }) => {

    if (token === 'Minima') {
        return (
            <svg className="absolute w-full h-full bg-white" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" fill="white"></rect>
                <path d="M32.4428 16.759L31.2053 22.2329L29.6226 15.6286L24.0773 13.3795L22.578 19.9957L21.2571 12.2371L15.7119 10L10 35.2512H16.0569L17.8062 27.4926L19.1271 35.2512H25.1959L26.6834 28.6349L28.266 35.2512H34.323L38 18.9962L32.4428 16.759Z" fill="black"></path>
            </svg>
        )
    }

    if (typeof token === 'object' && token.url && !token.url.includes('http')) {
        return (
            <>
                <Image src={token.url} alt="Token" className="relative z-10 max-w-[48px] max-h-[48px] l w-full h-full object-cover" loader={<div />} />
                <Image src={token.url} alt="Token" className="absolute blur opacity-50 w-[120%] h-[120%] object-cover" loader={<div />} />
            </>
        )
    }

    if (typeof token === 'object' && token.url) {
        return (
            <Image src={token.url} alt="Token" className="w-full h-full object-cover" loader={<div />} />
        )
    }

    return (
        <img src={`https://robohash.org/${tokenId}`} alt="Token" className="w-full h-full object-cover" />

    );
};

export default FullTokenIcon;
