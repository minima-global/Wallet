interface IProps {
    size: number;
    fill: string;
}
const WalletBrand = ({ size = 24, fill }: IProps) => (
    <svg width={size} height={size} viewBox="0 0 220 205" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M68.5074 65.4331L128.501 89.6635L165.238 74.8196L178.081 18.0364L128.501 38.0647L34.2537 0L0 151.449L53.9818 129.647L68.5074 65.4331Z"
            fill="#FFA010"
        />
        <path
            d="M165.239 74.8198L150.713 139.034L90.7195 114.804L53.9827 129.648L41.1399 186.431L90.7195 166.402L184.967 204.467L219.221 53.0179L165.239 74.8198Z"
            fill="#FFA010"
        />
    </svg>
);

export default WalletBrand;
