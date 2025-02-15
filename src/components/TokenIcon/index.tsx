import { Image } from "@minima-global/image";

const TokenIcon = ({ token, tokenId, shrinkOnMobile = false }: { token: any, tokenId: string, shrinkOnMobile?: boolean }) => {
    let baseClassName = 'min-w-[48px] w-[48px] h-[48px] border border-contrast3 rounded-sm overflow-hidden';

    if (shrinkOnMobile) {
        baseClassName = 'min-w-[36px] w-[36px] h-[36px] md:min-w-[48px] md:w-[48px] md:h-[48px] border border-contrast3 rounded overflow-hidden';
    }

    if (token === 'Minima') {
        return (
            <div className={baseClassName}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="48" height="48" fill="white"></rect>
                    <path d="M32.4428 16.759L31.2053 22.2329L29.6226 15.6286L24.0773 13.3795L22.578 19.9957L21.2571 12.2371L15.7119 10L10 35.2512H16.0569L17.8062 27.4926L19.1271 35.2512H25.1959L26.6834 28.6349L28.266 35.2512H34.323L38 18.9962L32.4428 16.759Z" fill="black"></path>
                </svg>
            </div>
        )
    }

    if (typeof token === 'object' && token.url) {
        return (
            <div className={baseClassName}>
                <Image src={token.url} alt="Token" className="w-full h-full object-cover" loader={<div />} />
            </div>
        )
    }

    return (
        <div className={baseClassName}>
            <img src={`https://robohash.org/${tokenId}`} alt="Token" className="w-full h-full object-cover" />
        </div>
    );
};

export default TokenIcon;
