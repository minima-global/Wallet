import { useTokenImage } from "../../hooks/useTokenImage";

const TokenIcon = ({ token, tokenId }: { token: any, tokenId: string }) => {
    const { render } = useTokenImage();

    if (token === 'Minima') {
        return (
            <div className="w-[48px] h-[48px] border border-darkConstrast dark:border-grey80 rounded-sm overflow-hidden">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="48" height="48" fill="white"></rect>
                    <path d="M32.4428 16.759L31.2053 22.2329L29.6226 15.6286L24.0773 13.3795L22.578 19.9957L21.2571 12.2371L15.7119 10L10 35.2512H16.0569L17.8062 27.4926L19.1271 35.2512H25.1959L26.6834 28.6349L28.266 35.2512H34.323L38 18.9962L32.4428 16.759Z" fill="black"></path>
                </svg>
            </div>
        )
    }

    if (typeof token === 'object' && token.url && (token.url.startsWith('https://') || token.url.startsWith('http://'))) {
        return (
            <div className="w-[48px] h-[48px] border border-contrast2 rounded overflow-hidden">
                <img src={token.url} alt="Token" className="w-full h-full object-cover" />
            </div>
        )
    }

    if (typeof token === 'object' && token.url) {
        return (
            <div className="w-[48px] h-[48px] border border-contrast2 rounded overflow-hidden">
                <img src={render(token.url)} alt="Token" className="w-full h-full object-cover" />
            </div>
        )
    }

    return (
        <div className="w-[48px] h-[48px] border border-contrast2 rounded overflow-hidden">
            <img src={`https://robohash.org/${tokenId}`} alt="Token" className="w-full h-full object-cover" />
        </div>
    );
};

export default TokenIcon;
